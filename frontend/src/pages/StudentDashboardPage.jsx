import { useState } from "react";
import {
  FiBookOpen,
  FiChevronDown,
  FiChevronRight,
  FiPlayCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { useSearchParams } from "@/lib/navigation";
import {
  useCreatePaymentMutation,
  useGetMyEnrollmentsQuery,
  useInitiatePaymentMutation,
} from "@/lib/features/enrollment/enrollmentApi";
import { useGetCourseLessonsQuery } from "@/lib/features/lesson/lessonApi";
import { useGetLessonVideosQuery } from "@/lib/features/lesson/lessonVideoApi";
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

function ProgressBanner({ enrollment, onContinue }) {
  if (!enrollment) return null;
  const { course } = enrollment;
  const progress = enrollment.progress_percentage || 0;

  return (
    <section className="mb-7 flex flex-col gap-5 border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt=""
            className="h-16 w-24 shrink-0 object-cover sm:h-20 sm:w-32"
          />
        ) : (
          <span className="flex h-16 w-24 shrink-0 items-center justify-center bg-amber-100 text-amber-900 sm:h-20 sm:w-32">
            <FiBookOpen size={27} aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-amber-800">
            Pick up where you left off
          </p>
          <h2 className="mt-1 line-clamp-2 text-lg font-bold text-slate-900 sm:text-xl">
            {course.title}
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <div
              className="h-2 min-w-0 flex-1 bg-slate-100"
              role="progressbar"
              aria-label={`${course.title} progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full bg-emerald-600"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-600">
              {progress}%
            </span>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-700"
      >
        <FiPlayCircle aria-hidden="true" /> Continue learning
      </button>
    </section>
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
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openLessonId, setOpenLessonId] = useState(null);
  const selectedEnrollment = enrollments.find(
    (enrollment) => enrollment.id === selectedEnrollmentId,
  );
  const bannerEnrollment =
    selectedEnrollment ||
    enrollments.find((enrollment) => enrollment.status === "active");
  const {
    data: lessons = [],
    isLoading: lessonsLoading,
    isError: lessonsError,
    refetch: refetchLessons,
  } = useGetCourseLessonsQuery(
    { id: selectedEnrollment?.course_id },
    { skip: !selectedEnrollment },
  );
  const {
    data: videos = [],
    isLoading: videosLoading,
    isError: videosError,
    refetch: refetchVideos,
  } = useGetLessonVideosQuery({ id: openLessonId }, { skip: !openLessonId });
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

  const toggleCourse = (enrollmentId) => {
    setSelectedEnrollmentId((currentId) =>
      currentId === enrollmentId ? null : enrollmentId,
    );
    setOpenLessonId(null);
  };

  const toggleLesson = (lessonId) => {
    setOpenLessonId((currentId) => (currentId === lessonId ? null : lessonId));
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

          {!isLoading && !isError && (
            <ProgressBanner
              enrollment={bannerEnrollment}
              onContinue={() =>
                bannerEnrollment && toggleCourse(bannerEnrollment.id)
              }
            />
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
                  selected={selectedEnrollmentId === enrollment.id}
                  onContinue={() => toggleCourse(enrollment.id)}
                  onPay={() => continuePayment(enrollment.id)}
                  paymentLoading={isStartingPayment}
                />
              ))}
            </div>
          )}

          {selectedEnrollment && (
            <section
              className="mt-8 border border-slate-200 bg-white"
              aria-labelledby="study-plan-title"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-xs font-semibold uppercase text-amber-800">
                    Study plan
                  </p>
                  <h2
                    id="study-plan-title"
                    className="mt-1 text-lg font-bold text-slate-950"
                  >
                    {selectedEnrollment.course.title}
                  </h2>
                </div>
                <span className="text-xs text-slate-500">
                  {selectedEnrollment.course.category?.name ||
                    "Course curriculum"}
                </span>
              </div>

              {lessonsError ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-rose-700">
                    Lessons could not be loaded.
                  </p>
                  <button
                    type="button"
                    onClick={() => refetchLessons()}
                    className="mt-3 text-sm font-semibold text-slate-900 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : lessonsLoading ? (
                <div className="space-y-3 p-5" aria-label="Loading lessons">
                  <div className="h-12 animate-pulse bg-slate-100" />
                  <div className="h-12 animate-pulse bg-slate-100" />
                  <div className="h-12 animate-pulse bg-slate-100" />
                </div>
              ) : lessons.length === 0 ? (
                <p className="px-5 py-8 text-sm text-slate-500">
                  Lessons are not available yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 px-5 sm:px-6">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => toggleLesson(lesson.id)}
                        aria-expanded={openLessonId === lesson.id}
                        className="flex min-h-17 w-full items-center gap-3 text-left"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-slate-800">
                            {lesson.title}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {lesson.video_count} videos ·{" "}
                            {lesson.total_duration}
                          </span>
                        </span>
                        {openLessonId === lesson.id ? (
                          <FiChevronDown />
                        ) : (
                          <FiChevronRight />
                        )}
                      </button>

                      {openLessonId === lesson.id && (
                        <div className="mb-4 ml-12 border-l-2 border-amber-300 pl-4">
                          {videosError ? (
                            <div className="py-3 text-sm text-rose-700">
                              Videos could not be loaded.{" "}
                              <button
                                type="button"
                                onClick={() => refetchVideos()}
                                className="font-semibold underline"
                              >
                                Retry
                              </button>
                            </div>
                          ) : videosLoading ? (
                            <p className="py-3 text-sm text-slate-500">
                              Loading videos...
                            </p>
                          ) : videos.length === 0 ? (
                            <p className="py-3 text-sm text-slate-500">
                              No videos in this lesson yet.
                            </p>
                          ) : (
                            videos.map((video, videoIndex) => (
                              <a
                                key={video.id}
                                href={video.video_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex min-h-12 items-center gap-3 border-b border-slate-100 py-2 text-sm text-slate-700 hover:text-amber-800"
                              >
                                <FiPlayCircle
                                  className="shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="min-w-0 flex-1 truncate">
                                  {video.title}
                                </span>
                                <span className="shrink-0 text-xs text-slate-500">
                                  Video {videoIndex + 1} ·{" "}
                                  {Math.floor(video.duration / 60)} min
                                </span>
                              </a>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
