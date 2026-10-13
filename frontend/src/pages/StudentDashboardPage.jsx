import { useState } from "react";
import { FiBookOpen, FiRefreshCw } from "react-icons/fi";
import { useSearchParams } from "@/lib/navigation";
import {
  useCreatePaymentMutation,
  useGetMyEnrollmentsQuery,
  useInitiatePaymentMutation,
} from "@/lib/features/enrollment/enrollmentApi";
import { useGetProfileQuery } from "@/lib/features/auth/authApi";
import { toast } from "sonner";
import AppLink from "@/components/common/AppLink";
import EnrolledCourseCard from "@/components/StudentDashboard/EnrolledCourseCard";
import StudentDashboardTopbar from "@/components/StudentDashboard/StudentDashboardTopbar";
import StudentSidebar from "@/components/StudentDashboard/StudentSidebar";

const dashboardTabs = [
  "Modules",
  "Tasks",
  "Recordings",
  "Resources",
  "Certificates",
];
function CourseCardSkeleton() {
  return (
    <div
      className="overflow-hidden border border-slate-200 bg-white"
      aria-hidden="true"
    >
      <div className="aspect-16/8 animate-pulse bg-slate-200" />
      <div className="space-y-4 p-5">
        <div className="h-3 w-1/3 animate-pulse bg-slate-200" />
        <div className="h-5 w-4/5 animate-pulse bg-slate-200" />
        <div className="h-2 w-full animate-pulse bg-slate-100" />
        <div className="h-10 w-36 animate-pulse bg-slate-200" />
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const searchParams = useSearchParams();
  const paymentResult = searchParams.get("payment");
  const {
    data: enrollments = [],
    isLoading,
    isError,
    refetch: refetchEnrollments,
  } = useGetMyEnrollmentsQuery();
  const { data: profile } = useGetProfileQuery();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const bannerEnrollment = enrollments.find(
    (enrollment) => enrollment.status === "active",
  );
  const [createPayment] = useCreatePaymentMutation();
  const [initiatePayment, { isLoading: isStartingPayment }] =
    useInitiatePaymentMutation();

  const continuePayment = async (enrollmentId) => {
    try {
      const payment = await createPayment(enrollmentId).unwrap();
      const checkout = await initiatePayment(payment.id).unwrap();
      window.location.assign(checkout.gateway_url);
    } catch (error) {
      toast.error(error?.data?.detail || "Could not start payment.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
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
          currentCourse={bannerEnrollment?.course}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <div className="mx-auto max-w-375 px-4 pb-12 pt-7 sm:px-7 lg:px-9">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase text-amber-800">
                Learning space
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                My courses
              </h1>
            </div>
            {!isLoading && !isError && (
              <p className="text-sm text-slate-500">
                {enrollments.length} enrolled{" "}
                {enrollments.length === 1 ? "course" : "courses"}
              </p>
            )}
          </div>

          <div
            className="mb-6 flex flex-wrap border-b border-slate-200"
            role="tablist"
            aria-label="Course dashboard sections"
          >
            {dashboardTabs.map((tab) => {
              const isModules = tab === "Modules";
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isModules}
                  disabled={!isModules}
                  title={isModules ? undefined : `${tab} are not available yet`}
                  className={`min-h-11 border-b-2 px-4 text-sm font-semibold ${isModules ? "border-amber-500 text-slate-950" : "cursor-not-allowed border-transparent text-slate-400"}`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          {paymentResult && (
            <div
              className={`mb-6 border-l-4 px-4 py-3 text-sm ${paymentResult === "success" ? "border-emerald-600 bg-emerald-50 text-emerald-900" : "border-amber-600 bg-amber-50 text-amber-950"}`}
              role="status"
            >
              {paymentResult === "success"
                ? "Payment verified. Your course access is ready."
                : paymentResult === "cancelled"
                  ? "Payment was cancelled. You can continue checkout below."
                  : "Payment was not completed. You can retry below."}
            </div>
          )}
          {isError ? (
            <section
              className="border border-rose-200 bg-white px-6 py-12 text-center"
              role="alert"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                We couldn’t load your courses
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Your session may have expired, or the service is temporarily
                unavailable.
              </p>
              <button
                type="button"
                onClick={() => refetchEnrollments()}
                className="mt-5 inline-flex min-h-10 items-center gap-2 bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700"
              >
                <FiRefreshCw aria-hidden="true" /> Try again
              </button>
            </section>
          ) : isLoading ? (
            <div
              className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
              aria-label="Loading enrolled courses"
            >
              {Array.from({ length: 3 }, (_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <section className="border border-slate-200 bg-white px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center bg-amber-100 text-amber-900">
                <FiBookOpen size={25} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                Your learning starts here
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Courses you enroll in will appear here with your lessons and
                learning progress.
              </p>
              <AppLink
                href="/upcoming-course"
                className="mt-6 inline-flex min-h-11 items-center justify-center bg-amber-300 px-5 text-sm font-semibold text-slate-950 hover:bg-amber-400"
              >
                Explore courses
              </AppLink>
            </section>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {enrollments.map((enrollment, index) => (
                <EnrolledCourseCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  index={index}
                  onPay={() => continuePayment(enrollment.id)}
                  paymentLoading={isStartingPayment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
