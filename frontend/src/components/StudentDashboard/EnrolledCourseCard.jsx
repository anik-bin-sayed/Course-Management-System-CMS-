import { FiBookOpen, FiClock, FiLayers, FiArrowRight } from "react-icons/fi";
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

  const schedule = formatDate(course.start_date);

  const courseHref = `/dashboard/${encodeURIComponent(course.slug)}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-md border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-slate-900/10 sm:flex-row">
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
      </div>
    </article>
  );
};

export default EnrolledCourseCard;
