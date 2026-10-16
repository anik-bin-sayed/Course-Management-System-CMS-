import { getYoutubeThumbnail } from "@/lib/youtube";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiPlayCircle,
} from "react-icons/fi";

const LessonRow = ({ lesson, index, active, onSelect, rowRef }) => {
  const thumbnail = getYoutubeThumbnail(lesson.first_video_url);

  return (
    <button
      ref={rowRef}
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={`group relative flex w-full items-center gap-3 border-b border-slate-100/80 p-3.5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-500 ${
        active ? "bg-amber-50/80" : "hover:bg-slate-50"
      }`}
    >
      {active && (
        <span className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-amber-500" />
      )}

      <span
        className={`relative flex h-[62px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-black/5 ${
          active ? "ring-amber-300" : ""
        }`}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <FiBookOpen className="text-2xl text-slate-400" aria-hidden="true" />
        )}

        <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition-colors group-hover:bg-slate-950/20">
          {active && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-amber-600 shadow-sm">
              <FiPlayCircle className="text-lg" />
            </span>
          )}
        </span>

        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-slate-950/75 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-[10px] font-bold uppercase tracking-[0.14em] ${
            active ? "text-amber-700" : "text-slate-400"
          }`}
        >
          Lesson {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`mt-1.5 block line-clamp-2 text-[13px] font-semibold leading-5 ${
            active
              ? "text-amber-950"
              : "text-slate-700 group-hover:text-slate-950"
          }`}
        >
          {lesson.title}
        </span>

        <span className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          {lesson.video_count > 0 ? (
            <>
              <FiPlayCircle className="shrink-0" />
              {lesson.video_count}{" "}
              {lesson.video_count === 1 ? "video" : "videos"}
            </>
          ) : (
            <>
              <FiClock className="shrink-0" />
              No videos yet
            </>
          )}
        </span>
      </span>

      {active && (
        <FiCheckCircle
          className="mr-0.5 shrink-0 text-lg text-amber-600"
          aria-label="Current lesson"
        />
      )}
    </button>
  );
};

export default LessonRow;
