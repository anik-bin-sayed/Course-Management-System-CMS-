import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiPlay,
  FiLock,
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
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    completed: {
      label: "Completed",
      className: "bg-sky-50 text-sky-700 ring-sky-200",
    },
    pending: {
      label: "Payment pending",
      className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
  };

  const config = map[status] || {
    label: status || "Unknown",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
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

  return (
    <article className="group flex h-full flex-row overflow-hidden rounded border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
      {/* LEFT: Thumbnail */}
      <div className="relative w-40 shrink-0 overflow-hidden bg-slate-100 sm:w-52 md:w-60">
        <AppLink
          href={`/dashboard/${encodeURIComponent(course.slug)}`}
          className="absolute inset-0 block"
          aria-label={course.title}
        >
          {course.thumbnail ? (
            <AppImage
              src={course.thumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 208px, 240px"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
              <FiBookOpen size={34} aria-hidden="true" />
            </div>
          )}

          {/* Dark overlay on hover */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/0 to-slate-950/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </AppLink>

        {/* Completed check (top-right of image) */}
        {isCompleted && (
          <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded bg-white/95 text-sky-600 shadow-sm ring-1 ring-black/5">
            <FiCheckCircle className="text-base" aria-label="Completed" />
          </span>
        )}
      </div>

      {/* RIGHT: Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-4 sm:p-5">
        {/* Top row: badge + meta */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={enrollment.status} />

          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
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
        <h2 className="line-clamp-2 text-[15px] font-bold leading-6 text-slate-900 transition-colors group-hover:text-amber-700 sm:text-base">
          <AppLink href={`/dashboard/${encodeURIComponent(course.slug)}`}>
            {course.title}
          </AppLink>
        </h2>

        {/* Schedule */}
        {schedule && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <FiClock className="shrink-0 text-slate-400" aria-hidden="true" />
            Started {schedule}
          </p>
        )}

        {/* Progress bar (only when learning) */}
        {canLearn && (
          <div className="mt-0.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500">Progress</span>
              <span className={isCompleted ? "text-sky-600" : "text-amber-700"}>
                {progress}%
              </span>
            </div>

            <div
              className="h-1.5 w-full overflow-hidden rounded bg-slate-100"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded transition-all duration-500 ${
                  isCompleted
                    ? "bg-gradient-to-r from-sky-400 to-sky-500"
                    : "bg-gradient-to-r from-amber-400 to-amber-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {canLearn ? (
            <AppLink
              href={`/dashboard/${encodeURIComponent(course.slug)}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-500 hover:text-slate-950 sm:text-sm"
            >
              <FiPlay aria-hidden="true" />
              {isCompleted ? "Review course" : "Continue learning"}
            </AppLink>
          ) : (
            <button
              type="button"
              onClick={onPay}
              disabled={paymentLoading}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded bg-amber-400 px-4 text-xs font-bold text-slate-950 shadow-sm shadow-amber-400/30 transition-all hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            >
              <FiLock aria-hidden="true" />
              {paymentLoading ? "Opening..." : "Complete payment"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default EnrolledCourseCard;
