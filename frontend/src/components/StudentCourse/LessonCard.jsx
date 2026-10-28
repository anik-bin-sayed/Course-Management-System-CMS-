import { FiBookOpen, FiClock, FiPlayCircle, FiVideo } from "react-icons/fi";

import AppLink from "../common/AppLink";

const LessonCard = ({ lesson, index, courseSlug }) => {
  const hasVideo = (lesson.video_count || 0) > 0;
  const lessonNumber = String(index + 1).padStart(2, "0");
  const href = `/dashboard/${encodeURIComponent(courseSlug)}/${lesson.id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded border border-slate-200/80 bg-white shadow-sm transition-all duration-300  hover:border-amber-300 ">
      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="relative">
            <span className="flex h-11 w-11 items-center justify-center rounded  font-semibold group-hover:text-gray-200  ring-1 ring-amber-200/60 transition-all duration-300 group-hover:bg-black group-hover:ring-gray-400 group-hover:shadow-lg group-hover:shadow-amber-500/30">
              {lessonNumber}
            </span>

            <span
              className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white transition-colors ${
                hasVideo ? "bg-emerald-500" : "bg-slate-300"
              }`}
              aria-hidden="true"
            />
          </div>

          <span className="flex h-9 w-9 items-center justify-center rounded bg-slate-50 text-slate-400 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-amber-50 group-hover:text-amber-600">
            <FiPlayCircle size={18} aria-hidden="true" />
          </span>
        </div>

        <AppLink
          href={href}
          className="mt-4 block rounded-sm focus-visible:outline-2 focus-visible:outline-amber-600"
        >
          <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-slate-900 transition-colors group-hover:text-gray-800">
            {lesson.title}
          </h3>

          {lesson.description && (
            <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-slate-500">
              {lesson.description}
            </p>
          )}
        </AppLink>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200/70 transition-colors group-hover:bg-white group-hover:ring-amber-200">
            <FiClock size={12} aria-hidden="true" className="text-slate-400" />
            {lesson.total_duration || "0s"}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ring-1 transition-colors ${
              hasVideo
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200/70 group-hover:bg-emerald-100"
                : "bg-slate-50 text-slate-500 ring-slate-200/70"
            }`}
          >
            <FiVideo size={12} aria-hidden="true" />
            {lesson.video_count || 0}{" "}
            {lesson.video_count === 1 ? "video" : "videos"}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-5">
          {hasVideo ? (
            <a
              href={href}
              rel="noopener noreferrer"
              className="group/btn relative inline-flex min-h-10 w-full items-center justify-center gap-2 overflow-hidden rounded bg-slate-900 px-3.5 py-2 text-[13px] font-bold text-white shadow-sm transition-all duration-300 hover:bg-amber-400 hover:text-slate-950 hover:shadow-lg hover:shadow-amber-400/30 focus-visible:outline-2 focus-visible:outline-amber-600"
            >
              <FiPlayCircle
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/btn:scale-110"
              />
              Watch lesson
            </a>
          ) : (
            <AppLink
              href={href}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition-all duration-300 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
            >
              <FiBookOpen size={14} aria-hidden="true" />
              View lesson
            </AppLink>
          )}
        </div>
      </div>
    </article>
  );
};

export default LessonCard;
