import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiPlayCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { useSearchParams } from "@/lib/navigation";
import { useOutletContext } from "react-router-dom";
import {
  useCreatePaymentMutation,
  useInitiatePaymentMutation,
} from "@/lib/features/enrollment/enrollmentApi";
import { toast } from "sonner";
import AppLink from "@/components/common/AppLink";
import EnrolledCourseCard from "@/components/StudentDashboard/EnrolledCourseCard";

function CourseCardSkeleton() {
  return (
    <div className="flex animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white" aria-hidden="true">
      <div className="hidden h-36 w-52 shrink-0 bg-slate-200 sm:block" />
      <div className="flex flex-1 flex-col justify-center gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-28 rounded-md bg-slate-200" />
          <div className="h-5 w-3/4 rounded-md bg-slate-200" />
          <div className="h-3 w-1/2 rounded-md bg-slate-100" />
        </div>
        <div className="h-10 w-full rounded-lg bg-slate-200 sm:w-40" />
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const searchParams = useSearchParams();
  const paymentResult = searchParams.get("payment");
  const {
    profile,
    enrollments = [],
    isLoading,
    isError,
    refetchEnrollments,
  } = useOutletContext();
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

  const firstName = profile?.name?.trim().split(/\s+/)[0];
  const activeEnrollment = enrollments.find(
    (item) => item.status === "active" && item.course?.slug,
  );
  const currentDate = new Date();
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(currentDate);
  const dateTime = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, "0"),
    String(currentDate.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-6 sm:px-7 sm:pt-8 lg:px-9">
      <section className="relative mb-7 overflow-hidden rounded-xl border border-emerald-900/10 bg-gradient-to-br from-white via-white to-emerald-50/80 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[36px] border-emerald-900/[0.035]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full bg-emerald-100/40 blur-2xl" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Your learning space
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Welcome{firstName ? `, ${firstName}` : " back"}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Every lesson moves you forward. Continue a course or find something new to learn today.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {activeEnrollment && (
                <AppLink
                  href={`/dashboard/${encodeURIComponent(activeEnrollment.course.slug)}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                >
                  <FiPlayCircle size={17} aria-hidden="true" /> Continue learning
                </AppLink>
              )}
              <AppLink
                href="/upcoming-course"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-white hover:text-emerald-900"
              >
                Explore courses <FiBookOpen size={16} aria-hidden="true" />
              </AppLink>
            </div>
          </div>
          <div className="relative flex min-w-[210px] items-center gap-4 rounded-lg border border-white bg-white/80 p-4 shadow-sm backdrop-blur-sm lg:mr-2">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <FiClock size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">Today</p>
              <time className="mt-1 block text-sm font-semibold text-slate-900" dateTime={dateTime}>{today}</time>
              <p className="mt-1 text-xs text-slate-500">A great day to learn</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="my-courses-heading">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Learning library
            </p>
            <h2 id="my-courses-heading" className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              My courses
            </h2>
          </div>
          {!isLoading && !isError && (
            <p className="text-sm text-slate-500">
              {enrollments.length} enrolled {enrollments.length === 1 ? "course" : "courses"}
            </p>
          )}
        </div>

        {paymentResult && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-4 text-sm ${
              paymentResult === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-amber-200 bg-amber-50 text-amber-950"
            }`}
            role="status"
          >
            <span className="mt-0.5">
              {paymentResult === "success" ? <FiCheckCircle /> : <FiClock />}
            </span>
            <span>
              <strong className="block font-semibold">
                {paymentResult === "success"
                  ? "Payment confirmed"
                  : paymentResult === "cancelled"
                    ? "Checkout cancelled"
                    : "Payment not completed"}
              </strong>
              <span className="mt-0.5 block opacity-90">
                {paymentResult === "success"
                  ? "Your course access is ready. Open your course to continue learning."
                  : paymentResult === "cancelled"
                    ? "You can continue checkout from the course card below."
                    : "You can retry checkout from the course card below."}
              </span>
            </span>
          </div>
        )}

        {isError ? (
          <section
            className="rounded-xl border border-rose-200 bg-white px-6 py-12 text-center shadow-sm"
            role="alert"
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <FiRefreshCw size={20} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              We couldn’t load your courses
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              Your session may have expired, or the service is temporarily unavailable.
            </p>
            <button
              type="button"
              onClick={() => refetchEnrollments()}
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              <FiRefreshCw aria-hidden="true" /> Try again
            </button>
          </section>
        ) : isLoading ? (
          <div
            className="grid grid-cols-1 gap-3"
            aria-label="Loading enrolled courses"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <section className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <FiBookOpen size={25} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              Your learning starts here
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Courses you enroll in will appear here with their lessons and learning details.
            </p>
            <AppLink
              href="/upcoming-course"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Explore courses
            </AppLink>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-3">
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
      </section>
    </main>
  );
}
