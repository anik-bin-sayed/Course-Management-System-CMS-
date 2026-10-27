import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AdminGuard from "@/components/auth/AdminGuard";
import AdminInstructorGuard from "@/components/auth/AdminInstructorGuard";
import AdminLayout from "@/components/Admin/AdminLayout";
import LazyLoadBoundary, {
  LoadingFallback,
} from "@/components/common/LazyLoadBoundary";

import FreeCoursesPage from "@/pages/FreeCoursesPage";
import HomePage from "@/pages/HomePage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import StudentGuard from "@/components/auth/StudentGuard";

import JobSuccess from "@/pages/JobSuccess";
import UpcomingCoursesPage from "@/pages/UpcomingCoursesPage";

const NotFound = lazy(() => import("@/components/NotFound/NotFound"));
const LessonWatchPage = lazy(() => import("@/pages/LessonWatchPage"));
const ProfileEditPage = lazy(() => import("@/pages/ProfileEditPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const StudentCoursePage = lazy(() => import("@/pages/StudentCoursePage"));
const StudentDashboardPage = lazy(() => import("@/pages/StudentDashboardPage"));
const UpcomingCourseDetailsPage = lazy(
  () => import("@/pages/UpcomingCourseDetailsPage"),
);

const ManageCoursesPage = lazy(() => import("@/pages/admin/ManageCoursesPage"));
const UserDetailsPage = lazy(() => import("@/pages/admin/UserDetailsPage"));
const UsersPage = lazy(() => import("@/pages/admin/UsersPage"));

/**
 * Language is determined by the URL:
 * /       -> English
 * /bn     -> Bangla
 * /about  -> English
 * /bn/about -> Bangla
 */
function LanguageLayout() {
  const location = useLocation();
  const { i18n } = useTranslation();

  const language =
    location.pathname === "/bn" || location.pathname.startsWith("/bn/")
      ? "bn"
      : "en";

  useEffect(() => {
    if (i18n.resolvedLanguage !== language) {
      i18n.changeLanguage(language);
    }

    document.documentElement.lang = language;
  }, [language, i18n]);

  return <Outlet />;
}

function AppPageRoutes() {
  const location = useLocation();
  const routeLocation = {
    ...location,
    pathname: location.pathname.replace(/^\/bn(?=\/|$)/, "") || "/",
  };

  return (
    <Routes location={routeLocation}>
      <Route path="/" element={<HomePage />} />
      <Route path="/job-success" element={<JobSuccess />} />
      <Route path="/search" element={<SearchPage />} />

      <Route element={<StudentGuard />}>
        <Route
          path="/dashboard/:courseSlug/:lessonId/watch"
          element={<LessonWatchPage />}
        />
        <Route
          path="/dashboard/:courseSlug/:lessonId"
          element={<StudentCoursePage showLesson />}
        />
        <Route
          path="/dashboard/:courseSlug"
          element={<StudentCoursePage />}
        />
        <Route path="/dashboard" element={<StudentDashboardPage />} />
      </Route>

      <Route path="/free-courses" element={<FreeCoursesPage />} />
      <Route path="/upcoming-course" element={<UpcomingCoursesPage />} />

      <Route
        path="/upcoming-course/:id"
        element={<UpcomingCourseDetailsPage />}
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminGuard>
            <UsersPage />
          </AdminGuard>
        }
      />

      <Route
        path="/admin/users/:userId"
        element={
          <AdminGuard>
            <UserDetailsPage />
          </AdminGuard>
        }
      />

      <Route
        path="/admin/manage-course"
        element={
          <AdminInstructorGuard>
            <AdminLayout />
          </AdminInstructorGuard>
        }
      >
        <Route index element={<ManageCoursesPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const AppRoutes = () => {
  return (
    <LazyLoadBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<LanguageLayout />}>
            <Route path="/*" element={<AppPageRoutes />} />
          </Route>
        </Routes>
      </Suspense>
    </LazyLoadBoundary>
  );
};

export default AppRoutes;
