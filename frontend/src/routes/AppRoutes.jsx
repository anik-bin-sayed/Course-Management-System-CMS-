// React
import { lazy, Suspense } from "react";
// Third Party
import { Route, Routes } from "react-router-dom";

import AdminGuard from "@/components/auth/AdminGuard";
import AdminInstructorGuard from "@/components/auth/AdminInstructorGuard";
import AdminLayout from "@/components/Admin/AdminLayout";
import LazyLoadBoundary, {
  LoadingFallback,
} from "@/components/common/LazyLoadBoundary";
import HomePage from "@/pages/HomePage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import StudentGuard from "../components/auth/StudentGuard";

const NotFound = lazy(() => import("@/components/NotFound/NotFound"));
const FreeCoursesPage = lazy(() => import("@/pages/FreeCoursesPage"));
const LessonWatchPage = lazy(() => import("@/pages/LessonWatchPage"));
const ProfileEditPage = lazy(() => import("@/pages/ProfileEditPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SearchPage = lazy(() => import("@/pages/SearchPage"));
const StudentCoursePage = lazy(() => import("@/pages/StudentCoursePage"));
const StudentDashboardPage = lazy(() => import("@/pages/StudentDashboardPage"));
const UpcomingCourseDetailsPage = lazy(
  () => import("@/pages/UpcomingCourseDetailsPage"),
);
const UpcomingCoursesPage = lazy(() => import("@/pages/UpcomingCoursesPage"));

const ManageCoursesPage = lazy(() => import("@/pages/admin/ManageCoursesPage"));
const UserDetailsPage = lazy(() => import("@/pages/admin/UserDetailsPage"));
const UsersPage = lazy(() => import("@/pages/admin/UsersPage"));

const AppRoutes = () => {
  return (
    <LazyLoadBoundary>
      <Suspense fallback={<></>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/dashboard/:courseSlug/:lessonId"
            element={
              <ProtectedRoute>
                <StudentCoursePage showLesson />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/:courseSlug/:lessonId/watch"
            element={
              <ProtectedRoute>
                <LessonWatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:courseSlug"
            element={
              <ProtectedRoute>
                <StudentCoursePage />
              </ProtectedRoute>
            }
          />

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
            path="/dashboard"
            element={
              <StudentGuard>
                <StudentDashboardPage />
              </StudentGuard>
            }
          />
          {/* <Route
            path="/watch/:lessonId"
            element={
              <ProtectedRoute>
                <LessonWatchPage />
              </ProtectedRoute>
            }
          /> */}
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
          <Route path="/admin/manage-course" element={<AdminLayout />}>
            <Route
              index
              element={
                <AdminInstructorGuard>
                  <ManageCoursesPage />
                </AdminInstructorGuard>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </LazyLoadBoundary>
  );
};

export default AppRoutes;
