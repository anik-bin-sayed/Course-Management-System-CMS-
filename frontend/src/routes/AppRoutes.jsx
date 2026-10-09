import { Route, Routes } from "react-router-dom";
import AdminGuard from "@/components/auth/AdminGuard";
import AdminInstructorGuard from "@/components/auth/AdminInstructorGuard";
import NotFound from "@/components/NotFound/NotFound";
import FreeCoursesPage from "@/pages/FreeCoursesPage";
import HomePage from "@/pages/HomePage";
import ProfileEditPage from "@/pages/ProfileEditPage";
import ProfilePage from "@/pages/ProfilePage";
import UpcomingCourseDetailsPage from "@/pages/UpcomingCourseDetailsPage";
import UpcomingCoursesPage from "@/pages/UpcomingCoursesPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import ManageCoursesPage from "@/pages/admin/ManageCoursesPage";
import UserDetailsPage from "@/pages/admin/UserDetailsPage";
import UsersPage from "@/pages/admin/UsersPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<PublicRoute />}>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>
      <Route path="/free-courses" element={<FreeCoursesPage />} />
      <Route path="/upcoming-course" element={<UpcomingCoursesPage />} />
      <Route path="/upcoming-course/:id" element={<UpcomingCourseDetailsPage />} />
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
            <ManageCoursesPage />
          </AdminInstructorGuard>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
