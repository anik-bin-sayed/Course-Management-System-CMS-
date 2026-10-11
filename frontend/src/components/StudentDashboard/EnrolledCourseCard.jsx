import { FiBookOpen, FiCheckCircle, FiClock, FiPlay } from "react-icons/fi";
import AppImage from "@/components/common/AppImage";

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function EnrolledCourseCard({
  enrollment,
  index,
  selected,
  onContinue,
  onPay,
  paymentLoading,
}) {
  const { course } = enrollment;
  const progress = Math.max(
    0,
    Math.min(100, enrollment.progress_percentage || 0),
  );
  const isCompleted = enrollment.status === "completed";
  const canLearn = ["active", "completed"].includes(enrollment.status);
  const schedule = formatDate(course.start_date);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden border bg-white transition-colors ${
        selected
          ? "border-amber-500 ring-1 ring-amber-500"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="relative aspect-16/8 overflow-hidden bg-slate-100">
        {course.thumbnail ? (
          <AppImage
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <FiBookOpen size={34} aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3 bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700">
          Course {String(index + 1).padStart(2, "0")}
        </span>
        {isCompleted && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white">
            <FiCheckCircle aria-hidden="true" /> Completed
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase text-slate-500">
          <span>{course.category?.name || "Course"}</span>
          <span aria-hidden="true">·</span>
          <span>{course.level || "All levels"}</span>
        </div>
        <h2 className="mt-2 min-h-12 text-base font-bold leading-6 text-slate-900">
          {course.title}
        </h2>
        <p className="mt-1 truncate text-xs text-slate-500">
          {course.instructor?.name
            ? `Instructor: ${course.instructor.name}`
            : "Learn at your own pace"}
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-slate-700">
              Learning progress
            </span>
            <span className="tabular-nums text-slate-600">{progress}%</span>
          </div>
          <div
            className="h-2 overflow-hidden bg-slate-100"
            role="progressbar"
            aria-label={`${course.title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full bg-emerald-600 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              {enrollment.completed_lessons || 0} of{" "}
              {enrollment.total_lessons || 0} lessons
            </span>
            {schedule && <span>Course starts {schedule}</span>}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            {isCompleted ? (
              <FiCheckCircle className="text-emerald-700" />
            ) : (
              <FiClock />
            )}
            {isCompleted
              ? "Course completed"
              : `Enrolled ${formatDate(enrollment.enrolled_at) || ""}`}
          </span>
          {canLearn ? (
            <button
              type="button"
              onClick={onContinue}
              aria-expanded={selected}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 bg-slate-900 px-3.5 text-xs font-semibold text-white hover:bg-slate-700 sm:px-4 sm:text-sm"
            >
              <FiPlay aria-hidden="true" />
              {selected ? "Close study plan" : "Continue learning"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onPay}
              disabled={paymentLoading}
              className="inline-flex min-h-10 shrink-0 items-center bg-amber-300 px-4 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-60"
            >
              {paymentLoading ? "Opening..." : "Complete payment"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
