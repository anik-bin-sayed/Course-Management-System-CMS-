import AppLink from "../common/AppLink";
import {
  FiArrowLeft,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiExternalLink,
  FiPlayCircle,
  FiVideo,
} from "react-icons/fi";

const ShowLesson = ({
  lessons,
  lesson,
  course,
  videos,
  videosLoading,
  videosError,
  retry,
}) => {
  const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex >= 0 ? lessons[lessonIndex + 1] : null;
  const watchLink = `/dashboard/${encodeURIComponent(course.slug)}/${encodeURIComponent(lesson.id)}/watch?lesson_id=${encodeURIComponent(lesson.id)}&video_id=${encodeURIComponent(videos[0]?.id || "")}`;

  return (
    <>
      {/* Breadcrumb / Back link */}
      <AppLink
        href={`/dashboard/${encodeURIComponent(course.slug)}`}
        className="group mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-semibold text-slate-600 transition-all hover:border-slate-200 hover:bg-white hover:text-amber-800 hover:shadow-sm"
      >
        <FiArrowLeft
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        <span className="truncate">{course.title}</span>
      </AppLink>

      {/* Main card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        {/* Hero header with subtle gradient */}
        <div className="relative overflow-hidden border-b border-slate-100  to-white px-5 py-6 sm:px-8 sm:py-8">
          {/* Decorative glow */}

          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Lesson number chip */}
              <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black ring-1 ring-amber-200/70 backdrop-blur">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] text-black">
                  {lessonIndex >= 0 ? lessonIndex + 1 : "?"}
                </span>
                Lesson {lessonIndex >= 0 ? lessonIndex + 1 : ""}
              </p>

              {/* Title */}
              <h1 className="mt-4 wrap-break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-[32px]">
                {lesson.title}
              </h1>

              {/* Course name (small subtitle) */}
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <FiBookOpen
                  className="shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                <span className="truncate">{course.title}</span>
              </p>
            </div>

            {/* CTA button */}
            {lesson.video_count > 0 && (
              <a
                href={watchLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-amber-400 hover:text-slate-950 hover:shadow-amber-400/30 focus-visible:outline-2 focus-visible:outline-amber-600"
              >
                <FiPlayCircle
                  aria-hidden="true"
                  className="text-lg transition-transform duration-300 group-hover/btn:scale-110"
                />
                Watch video
              </a>
            )}
          </div>

          {/* Meta chips row */}
          <div className="relative mt-6 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
              <FiClock className="text-slate-400" aria-hidden="true" />
              {lesson.total_duration || "0s"}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm ring-1 backdrop-blur ${
                lesson.video_count > 0
                  ? "bg-emerald-50/90 text-emerald-700 ring-emerald-200/70"
                  : "bg-white/90 text-slate-500 ring-slate-200/70"
              }`}
            >
              <FiVideo aria-hidden="true" />
              {lesson.video_count || 0}{" "}
              {lesson.video_count === 1 ? "video" : "videos"}
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          {/* Description */}
          <article className="relative rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-5 sm:px-6 sm:py-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <FiBookOpen size={14} aria-hidden="true" />
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                About this lesson
              </h2>
            </div>

            <div className="prose prose-slate max-w-none whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {lesson.description || "No lesson content has been added yet."}
            </div>
          </article>

          {/* Lesson videos */}
          {lesson.video_count > 0 && (
            <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                    <FiPlayCircle size={18} aria-hidden="true" />
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Lesson videos
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {lesson.video_count}{" "}
                      {lesson.video_count === 1 ? "video" : "videos"} available
                    </p>
                  </div>
                </div>
              </div>

              {videosLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                    >
                      <div className="h-10 w-10 shrink-0 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 flex-1 animate-pulse rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              ) : videosError ? (
                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-center">
                  <p className="text-sm font-semibold text-rose-800">
                    Videos failed to load
                  </p>
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-2 text-sm font-bold text-rose-700 underline transition hover:text-rose-900"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {videos.map((video, index) => (
                    <AppLink
                      key={video.id}
                      href={watchLink}
                      rel="noopener noreferrer"
                      className="group/vid flex min-h-15 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-200 hover:border-amber-200 hover:bg-amber-50/50"
                    >
                      {/* Play icon bubble */}
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all duration-200 group-hover/vid:bg-amber-400 group-hover/vid:text-black group-hover/vid:shadow-md group-hover/vid:shadow-amber-400/30">
                        <FiPlayCircle size={18} aria-hidden="true" />
                      </span>

                      {/* Video info */}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Video {index + 1}
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-semibold text-slate-700 transition-colors group-hover/vid:text-amber-900">
                          {video.title || `Video ${index + 1}`}
                        </span>
                      </span>

                      {/* External link icon */}
                      <FiExternalLink
                        className="shrink-0 text-slate-300 transition-all duration-200 group-hover/vid:translate-x-0.5 group-hover/vid:text-amber-600"
                        aria-hidden="true"
                      />
                    </AppLink>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Navigation */}
          <nav
            className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-stretch sm:justify-between"
            aria-label="Lesson navigation"
          >
            {previousLesson ? (
              <AppLink
                href={`/dashboard/${encodeURIComponent(course.slug)}/${previousLesson.id}`}
                className="group/nav flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/60 hover:shadow-sm sm:max-w-[48%]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-all group-hover/nav:bg-amber-400 group-hover/nav:text-black">
                  <FiChevronLeft aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover/nav:text-amber-700">
                    Previous
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-slate-700 group-hover/nav:text-amber-900">
                    {previousLesson.title}
                  </span>
                </span>
              </AppLink>
            ) : (
              <span className="hidden sm:block sm:flex-1" />
            )}

            {nextLesson ? (
              <AppLink
                href={`/dashboard/${encodeURIComponent(course.slug)}/${nextLesson.id}`}
                className="group/nav flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/60 hover:shadow-sm sm:max-w-[48%] sm:flex-row-reverse"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-all group-hover/nav:bg-amber-400 group-hover/nav:text-black">
                  <FiChevronRight aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1 sm:text-right">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover/nav:text-amber-700">
                    Next
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-slate-700 group-hover/nav:text-amber-900">
                    {nextLesson.title}
                  </span>
                </span>
              </AppLink>
            ) : (
              <span className="hidden sm:block sm:flex-1" />
            )}
          </nav>
        </div>
      </section>
    </>
  );
};

export default ShowLesson;
