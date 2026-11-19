"use client";

import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";

import {
  FaPlay,
  FaClock,
  FaGlobe,
  FaSignal,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaUserGraduate,
  FaArrowRight,
} from "react-icons/fa";

import { getDurationInMonths } from "./CalculateMonth";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "@/lib/navigation";
import {
  useCreateEnrollmentMutation,
  useCreatePaymentMutation,
  useGetMyEnrollmentsQuery,
  useInitiatePaymentMutation,
} from "@/lib/features/enrollment/enrollmentApi";

const CourseDetails = ({ course }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const { data: enrollments = [] } = useGetMyEnrollmentsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createEnrollment, { isLoading: isCreatingEnrollment }] =
    useCreateEnrollmentMutation();
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();
  const [initiatePayment, { isLoading: isInitiatingPayment }] =
    useInitiatePaymentMutation();
  const isEnrolling =
    isCreatingEnrollment || isCreatingPayment || isInitiatingPayment;
  const currentEnrollment = enrollments.find(
    (enrollment) => enrollment.course_id === course?.id,
  );

  const handleEnrollment = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in before enrolling.");
      return;
    }

    if (["active", "completed"].includes(currentEnrollment?.status)) {
      router.push("/dashboard");
      return;
    }

    try {
      const enrollment =
        currentEnrollment || (await createEnrollment(course.id).unwrap());

      if (course.course_type === "free") {
        router.push("/dashboard");
        return;
      }

      const payment = await createPayment(enrollment.id).unwrap();
      const checkout = await initiatePayment(payment.id).unwrap();
      window.location.assign(checkout.gateway_url);
    } catch (error) {
      toast.error(error?.data?.detail || "Could not start course enrollment.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "To be announced";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "To be announced";
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#f6f8f7] text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#10251d] pb-12 pt-24 sm:pb-16 sm:pt-28">
        <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border border-white/5" />
        <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/5" />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-7 lg:px-10">
          <div className="mb-6 flex items-center gap-2 text-xs text-white/55">
            <Link href="/upcoming-course" className="transition hover:text-white">Upcoming courses</Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-64 truncate text-white/80">{course?.title}</span>
          </div>
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            {/* Left Content */}
            <div className="text-white">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-[#ffd84d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#17251d]">
                  Upcoming Course
                </span>

                <span className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                  {course?.category?.name}
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">
                {course?.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                {course?.short_description}
              </p>

              {/* Course Meta */}
              <div className="mt-7 flex flex-wrap gap-2.5 text-sm text-slate-200">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <FaClock className="text-[#ffd84d]" />
                  <span>
                    {getDurationInMonths(course?.start_date, course?.end_date)}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <FaGlobe className="text-[#ffd84d]" />
                  <span className="capitalize">{course?.language}</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <FaSignal className="text-[#ffd84d]" />
                  <span className="capitalize">{course?.level}</span>
                </div>
              </div>

              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Instructors
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {course?.instructors?.length
                    ? course.instructors
                        .map((instructor) => instructor.name)
                        .join(", ")
                    : "To be announced"}
                </p>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-xl shadow-black/20">
              <div className="relative aspect-video w-full">
                <Image
                  src={course?.thumbnail || ""}
                  alt={course?.title || "Course thumbnail"}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/25 via-black/0 to-black/10">
                  <button type="button" aria-label="Course preview" className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/95 text-slate-900 shadow-lg transition duration-300 hover:scale-105 hover:bg-[#ffd84d] sm:h-16 sm:w-16">
                    <FaPlay className="ml-1 text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-7 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          {/* Left Content */}
          <div className="order-last min-w-0 space-y-5 sm:space-y-6 lg:order-first">
            {/* About Course */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Course overview</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                About This Course
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                {course?.description}
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Throughout the course, you will work on real-world projects
                using modern technologies and industry-standard development
                practices.
              </p>
            </div>

            {/* Course outcomes are authored by admins and instructors. */}
            {course?.learning_outcomes?.length > 0 && (
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                  Course outcomes
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  What You’ll Learn
                </h2>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {course.learning_outcomes.map((outcome, index) => (
                    <li
                      key={`${index}-${outcome}`}
                      className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4"
                    >
                      <FaCheckCircle
                        className="mt-1 shrink-0 text-emerald-700"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-6 text-slate-700">
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Course Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">At a glance</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Course Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                    <FaClock />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {getDurationInMonths(
                        course?.start_date,
                        course?.end_date,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
                    <FaBookOpen />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Lessons</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {course?.total_lessons > 60 ? (
                        <span>60+ Lessons</span>
                      ) : (
                        <span>{course?.total_lessons} Lessons</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-800">
                    <FaSignal />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Level</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                      {course?.level}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                    <FaGlobe />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Language</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                      {course?.language}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Schedule */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Important dates</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Course Schedule
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Starting date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(course?.start_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Ending date</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(course?.end_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="order-first min-w-0 lg:order-last">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
              {/* Price */}
              <div className="border-b border-slate-100 bg-slate-50/60 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Course price</p>

                <div className="mt-2 flex items-end gap-3">
                  <span className="text-3xl font-bold tracking-tight text-slate-950">
                    {course?.course_type === "free"
                      ? "Free"
                      : `৳${course?.discount_price ?? course?.price}`}
                  </span>

                  {course?.course_type !== "free" &&
                    course?.discount_price &&
                    course.discount_price < course.price && (
                      <span className="pb-1 text-sm text-slate-400 line-through">
                        ৳{course.price}
                      </span>
                    )}
                </div>

                {course?.course_type !== "free" &&
                  course?.discount_price &&
                  course.discount_price < course.price && (
                    <span className="mt-3 inline-block rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                      Save ৳ {course.price - course.discount_price}
                    </span>
                  )}
              </div>

              {/* Enrollment */}
              <div className="p-5 sm:p-6">
                <button
                  disabled={isEnrolling || !course?.id}
                  onClick={handleEnrollment}
                  aria-label={`${currentEnrollment?.status === "pending" ? "Continue payment for" : "Enroll in"} ${course?.title || "this course"}`}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#ffd84d] px-5 py-3.5 font-bold text-[#17251d] transition duration-200 hover:bg-[#ffce24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  {isEnrolling
                    ? "Starting checkout..."
                    : ["active", "completed"].includes(
                          currentEnrollment?.status,
                        )
                      ? "Go to my courses"
                      : currentEnrollment?.status === "pending"
                        ? "Continue payment"
                        : "Enroll Now"}
                  <FaArrowRight className="text-sm" />
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-slate-500">
                  {course?.course_type === "free"
                    ? "Enroll for free and start learning."
                    : "Secure checkout powered by SSLCommerz."}
                </p>

                {/* Includes */}
                <div className="mt-7">
                  <h3 className="font-bold text-gray-900">
                    This course includes:
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaPlay className="text-emerald-700" />
                      <p className="text-slate-800">
                        {course?.total_lessons > 60 ? (
                          <span>60+ Video Lessons</span>
                        ) : (
                          <span>{course?.total_lessons} Video Lessons</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaBookOpen className="text-emerald-700" />
                      <span>Practical Projects</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaUserGraduate className="text-emerald-700" />
                      <span>Certificate of Completion</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <FaCheckCircle className="text-emerald-700" />
                      <span>Lifetime Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CourseDetails;
