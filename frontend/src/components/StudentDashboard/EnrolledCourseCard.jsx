import { FiArrowRight, FiBookOpen, FiClock, FiLayers, FiUser } from "react-icons/fi";
import AppImage from "@/components/common/AppImage";
import AppLink from "@/components/common/AppLink";

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const map = {
    active: {
      label: "In progress",
      className: "bg-emerald-50 text-emerald-800 ring-emerald-200/70",
      dot: "bg-emerald-500",
    },
    completed: {
      label: "Completed",
      className: "bg-sky-50 text-sky-800 ring-sky-200/70",
      dot: "bg-sky-500",
    },
    pending: {
      label: "Payment pending",
      className: "bg-amber-50 text-amber-800 ring-amber-200/70",
      dot: "bg-amber-500",
    },
  };
  const config = map[status] || {
    label: status || "Enrolled",
    className: "bg-slate-100 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${config.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}

const EnrolledCourseCard = ({ enrollment, onPay, paymentLoading }) => {
  const { course } = enrollment;
  const schedule = formatDate(course.start_date);
  const courseHref = `/dashboard/${encodeURIComponent(course.slug)}`;
  const instructorNames = [
    course.instructor?.name,
    ...(course.instructors?.map((instructor) => instructor?.name) || []),
  ].filter(Boolean);
  const progressPercentage =
    typeof enrollment.progress_percentage === "number" && enrollment.total_lessons > 0
      ? Math.min(100, Math.max(0, enrollment.progress_percentage))
      : null;
  const needsPayment = enrollment.status === "pending";

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_3px_14px_rgba(15,23,42,0.035)] transition duration-200 hover:border-emerald-200 hover:shadow-md sm:flex-row">
      <AppLink href={courseHref} className="relative block h-36 shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:min-h-[190px] sm:w-52 lg:w-60" aria-label={`Open ${course.title}`}>
        {course.thumbnail ? (
          <AppImage
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">
            <FiBookOpen size={38} aria-hidden="true" />
          </div>
        )}
      </AppLink>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5 sm:py-4 lg:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={enrollment.status} />
            {course.level && (
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium capitalize text-slate-600">
                {course.level}
              </span>
            )}
          </div>

          <h3 className="mt-2 line-clamp-1 text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-emerald-900 sm:text-lg">
            <AppLink href={courseHref}>{course.title}</AppLink>
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
            {course.category?.name && (
              <span className="inline-flex items-center gap-1.5">
                <FiLayers className="text-slate-400" aria-hidden="true" />
                {course.category.name}
              </span>
            )}
            {instructorNames.length > 0 && (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <FiUser className="shrink-0 text-slate-400" aria-hidden="true" />
                <span className="truncate">{[...new Set(instructorNames)].join(", ")}</span>
              </span>
            )}
            {schedule && (
              <span className="inline-flex items-center gap-1.5">
                <FiClock className="text-slate-400" aria-hidden="true" />
                Started {schedule}
              </span>
            )}
          </div>

          {progressPercentage !== null && (
            <div className="mt-3 max-w-lg" aria-label={`${progressPercentage}% course progress`}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Course progress</span>
                <span className="font-semibold tabular-nums text-slate-700">{progressPercentage}%</span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Course progress"
              >
                <div
                  className="h-full rounded-full bg-emerald-700 transition-[width] duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {typeof enrollment.completed_lessons === "number" &&
                typeof enrollment.total_lessons === "number" && (
                  <p className="mt-1 text-[11px] text-slate-500">
                    {enrollment.completed_lessons} of {enrollment.total_lessons} lessons completed
                  </p>
                )}
            </div>
          )}
        </div>

        <div className="shrink-0 sm:w-44">
          {needsPayment ? (
            <button
              type="button"
              onClick={onPay}
              disabled={paymentLoading}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {paymentLoading ? "Starting checkout…" : "Complete payment"}
              {!paymentLoading && <FiArrowRight aria-hidden="true" />}
            </button>
          ) : (
            <AppLink
              href={courseHref}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              {enrollment.status === "completed" ? "Review course" : "Continue learning"}
              <FiArrowRight aria-hidden="true" />
            </AppLink>
          )}
        </div>
      </div>
    </article>
  );
};

export default EnrolledCourseCard;
