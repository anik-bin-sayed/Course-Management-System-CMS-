import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiPlay,
  FiLock,
  FiLayers,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";
import AppImage from "@/components/common/AppImage";
import AppLink from "@/components/common/AppLink";

function formatDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const map = {
    active: {
      label: "Active",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
      dot: "bg-emerald-500",
    },
    completed: {
      label: "Completed",
      className: "bg-sky-50 text-sky-700 ring-sky-200/70",
      dot: "bg-sky-500",
    },
    pending: {
      label: "Payment pending",
      className: "bg-amber-50 text-amber-700 ring-amber-200/70",
      dot: "bg-amber-500",
    },
  };

  const config = map[status] || {
    label: status || "Unknown",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

const EnrolledCourseCard = ({ enrollment, index, onPay, paymentLoading }) => {
  const { course } = enrollment;
  const progress = Math.max(
    0,
    Math.min(100, enrollment.progress_percentage || 0),
  );
  const isCompleted = enrollment.status === "completed";
  const canLearn = ["active", "completed"].includes(enrollment.status);
  const schedule = formatDate(course.start_date);

  const courseHref = `/dashboard/${encodeURIComponent(course.slug)}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-slate-900/10 sm:flex-row">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-slate-100 sm:aspect-auto sm:w-48 md:w-56 lg:w-64">
        <AppLink
          href={courseHref}
          className="absolute inset-0 block"
          aria-label={course.title}
        >
          {course.thumbnail ? (
            <AppImage
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 224px, 256px"
              className="h-full w-full object-cover transition-transform duration-700 ease-out "
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-50 via-slate-50 to-slate-100 text-slate-400">
              <FiBookOpen size={42} aria-hidden="true" />
            </div>
          )}

          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/0 to-slate-950/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <span className="pointer-events-none absolute inset-0 flex items-end justify-start p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-900 shadow-sm backdrop-blur">
              <FiArrowRight className="text-xs" />
              View course
            </span>
          </span>
        </AppLink>

        {/* {isCompleted && (
          <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-sky-600 shadow-md ring-1 ring-black/5 backdrop-blur">
            <FiCheckCircle className="text-lg" aria-label="Completed" />
            asdf
          </span>
        )} */}

        {/* {canLearn && !isCompleted && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            <FiTrendingUp className="text-[10px]" />
            In progress
          </span>
        )} */}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:px-5 lg:px-6">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <StatusBadge status={enrollment.status} />

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <FiLayers
              className="text-[11px] text-slate-400"
              aria-hidden="true"
            />
            {course.category?.name || "Course"}
          </span>

          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {course.level || "All levels"}
          </span>
        </div>

        {/* Title */}
        <h2 className="line-clamp-2 text-base font-bold leading-snug text-gray-600 transition-colors group-hover:text-black sm:text-lg">
          <AppLink href={courseHref}>{course.title}</AppLink>
        </h2>

        {/* Schedule */}
        {schedule && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <FiClock className="shrink-0 text-slate-400" aria-hidden="true" />
            Started {schedule}
          </p>
        )}

        {/* Progress
        {canLearn && (
          <div className="mt-1 space-y-2 rounded-xl bg-slate-50/80 p-3 ring-1 ring-slate-100">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
              <span className="text-slate-500">Your progress</span>
              <span className={isCompleted ? "text-sky-600" : "text-amber-700"}>
                {progress}%
              </span>
            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full bg-white ring-1 ring-slate-200/70"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isCompleted
                    ? "bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500"
                    : "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )} */}

        {/* CTA
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {canLearn ? (
            <AppLink
              href={courseHref}
              className="group/btn inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-amber-500 hover:text-slate-950 hover:shadow-md sm:text-sm"
            >
              <FiPlay
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
              />
              {isCompleted ? "Review course" : "Continue learning"}
              <FiArrowRight className="text-xs opacity-0 transition-all duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100" />
            </AppLink>
          ) : (
            <button
              type="button"
              onClick={onPay}
              disabled={paymentLoading}
              className="group/btn inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-bold text-slate-950 shadow-sm shadow-amber-400/40 transition-all duration-300 hover:bg-amber-500 hover:shadow-md hover:shadow-amber-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            >
              <FiLock
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/btn:scale-110"
              />
              {paymentLoading ? "Opening..." : "Complete payment"}
            </button>
          )}
        </div> */}
      </div>
    </article>
  );
};

export default EnrolledCourseCard;
