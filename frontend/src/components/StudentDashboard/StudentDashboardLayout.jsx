import { Suspense, useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import StudentDashboardTopbar from "@/components/StudentDashboard/StudentDashboardTopbar";
import StudentSidebar from "@/components/StudentDashboard/StudentSidebar";

function DashboardRouteFallback() {
  return (
    <div
      className="mx-auto max-w-375 space-y-6 px-4 pb-12 pt-7 sm:px-7 lg:px-9"
      aria-label="Loading dashboard page"
    >
      <div className="h-10 w-48 animate-pulse bg-slate-200" />
      <div className="h-12 animate-pulse border-b border-slate-200 bg-white" />
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboardLayout() {
  const {
    profile,
    enrollments = [],
    isLoading,
    isError,
    refetchEnrollments,
  } = useOutletContext();
  const { courseSlug } = useParams();
  const { pathname } = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const currentEnrollment = courseSlug
    ? enrollments.find((enrollment) => enrollment.course?.slug === courseSlug)
    : enrollments.find((enrollment) => enrollment.status === "active");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <StudentSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div
        className={`min-h-screen transition-[padding] duration-200 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <StudentDashboardTopbar
          profile={profile}
          currentCourse={currentEnrollment?.course}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <Suspense fallback={<DashboardRouteFallback />}>
          <Outlet
            context={{
              profile,
              enrollments,
              isLoading,
              isError,
              refetchEnrollments,
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
