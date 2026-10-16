import {
  FiBookOpen,
  FiList,
  FiChevronUp,
  FiChevronDown,
  FiPlayCircle,
  FiCheckCircle,
} from "react-icons/fi";

const Aside = ({
  lessons = [],
  course,
  currentIndex = -1,
  isPlaylistLoading = false,
  isCourseLoading = false,
  isPlaylistError = false,
  lesson_id,
  video_id,
  expandedLessons = {},
  lessonVideosMap = {},
  loadingLessonVideos = {},
  activeRowRef,
  goToLesson,
  toggleLessonVideos,
  selectPlaylistVideo,
  LessonRow,
  getYoutubeThumbnail,
}) => {
  // Ensure all incoming values are safe to use.
  const safeLessons = Array.isArray(lessons) ? lessons : [];

  const safeExpandedLessons =
    expandedLessons && typeof expandedLessons === "object"
      ? expandedLessons
      : {};

  const safeLessonVideosMap =
    lessonVideosMap && typeof lessonVideosMap === "object"
      ? lessonVideosMap
      : {};

  const safeLoadingLessonVideos =
    loadingLessonVideos && typeof loadingLessonVideos === "object"
      ? loadingLessonVideos
      : {};

  return (
    <aside
      className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm xl:sticky xl:top-[30px] xl:max-h-[calc(100vh-104px)] xl:rounded-3xl"
      aria-label="Course lesson playlist"
    >
      {/* Playlist Header */}
      <div className="border-b border-slate-100 bg-white px-5 py-2 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700">
              <FiList className="text-sm" />
              Course playlist
            </div>

            <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-slate-900">
              {course?.title || "Course lessons"}
            </h2>

            <p className="mt-2 text-xs text-slate-500">
              Follow the lessons in order to continue learning.
            </p>
          </div>
        </div>

        {/* Playlist Stats */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
            <FiList className="text-slate-400" />
            {safeLessons.length}{" "}
            {safeLessons.length === 1 ? "Lesson" : "Lessons"}
          </span>

          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {currentIndex >= 0
              ? `${currentIndex + 1} of ${safeLessons.length}`
              : "Course"}
          </span>
        </div>
      </div>

      {/* Playlist Content */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isPlaylistLoading || isCourseLoading ? (
          <div className="space-y-4 p-4" aria-label="Loading course playlist">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-[62px] w-[104px] shrink-0 animate-pulse rounded-xl bg-slate-100" />

                <div className="min-w-0 flex-1 space-y-2 py-1">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-14 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : isPlaylistError ? (
          <div className="p-7 text-center">
            <FiBookOpen className="mx-auto text-3xl text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-800">
              Playlist unavailable
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              The course playlist could not be loaded.
            </p>
          </div>
        ) : safeLessons.length === 0 ? (
          <div className="p-7 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FiBookOpen className="text-2xl" />
            </span>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              No lessons available
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              There are no lessons in this course yet.
            </p>
          </div>
        ) : (
          safeLessons.map((item, index) => {
            if (!item || item.id == null) {
              return null;
            }

            const itemKey = String(item.id);
            const isActiveLesson = itemKey === String(lesson_id);

            const isExpanded = Boolean(safeExpandedLessons[itemKey]);

            const rawVideos = safeLessonVideosMap[itemKey];
            const itemVideos = Array.isArray(rawVideos) ? rawVideos : [];

            const isLoadingItemVideos = Boolean(
              safeLoadingLessonVideos[itemKey],
            );

            return (
              <div
                key={item.id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-stretch">
                  <div className="min-w-0 flex-1">
                    {LessonRow ? (
                      <LessonRow
                        lesson={item}
                        index={index}
                        active={isActiveLesson}
                        rowRef={isActiveLesson ? activeRowRef : undefined}
                        onSelect={() => goToLesson?.(item.id)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => goToLesson?.(item.id)}
                        className={`w-full px-4 py-4 text-left transition hover:bg-amber-50 ${
                          isActiveLesson ? "bg-amber-50" : "bg-white"
                        }`}
                      >
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Lesson {index + 1}
                        </span>

                        <span className="mt-1 block text-sm font-semibold text-slate-800">
                          {item.title || `Lesson ${index + 1}`}
                        </span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleLessonVideos?.(item.id)}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? "Hide" : "Show"} videos for ${item.title || `Lesson ${index + 1}`}`}
                    className={`flex w-11 shrink-0 items-center justify-center border-b border-slate-100 transition hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-amber-500 ${
                      isExpanded ? "text-amber-700" : "text-slate-400"
                    }`}
                  >
                    {isExpanded ? (
                      <FiChevronUp className="text-lg" />
                    ) : (
                      <FiChevronDown className="text-lg" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-1.5 bg-slate-50/80 px-3 py-3 pl-5">
                    {isLoadingItemVideos ? (
                      <div className="flex items-center gap-2 px-2 py-3 text-xs font-medium text-slate-500">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-amber-500" />
                        Loading videos...
                      </div>
                    ) : itemVideos.length > 0 ? (
                      itemVideos.map((video, videoIndex) => {
                        if (!video || video.id == null) {
                          return null;
                        }

                        const isActiveVideo =
                          isActiveLesson &&
                          String(video.id) === String(video_id);

                        const videoThumbnail =
                          typeof getYoutubeThumbnail === "function"
                            ? getYoutubeThumbnail(video.video_url)
                            : null;

                        return (
                          <button
                            key={video.id}
                            type="button"
                            onClick={() =>
                              selectPlaylistVideo?.(item.id, video.id)
                            }
                            aria-current={isActiveVideo ? "true" : undefined}
                            className={`flex w-full items-center gap-2.5 rounded-xl border p-2 text-left transition ${
                              isActiveVideo
                                ? "border-amber-300 bg-amber-50 text-amber-950"
                                : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-white"
                            }`}
                          >
                            <span className="relative flex h-10 w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-200">
                              {videoThumbnail ? (
                                <img
                                  src={videoThumbnail}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FiPlayCircle className="text-lg text-slate-400" />
                              )}

                              <span className="absolute bottom-0.5 left-0.5 rounded bg-slate-950/75 px-1 text-[9px] font-bold text-white">
                                {String(videoIndex + 1).padStart(2, "0")}
                              </span>
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Video {videoIndex + 1}
                              </span>

                              <span className="mt-0.5 block line-clamp-2 break-words text-xs font-semibold leading-5">
                                {video.title || `Video ${videoIndex + 1}`}
                              </span>
                            </span>

                            {isActiveVideo && (
                              <FiCheckCircle className="shrink-0 text-base text-amber-600" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p className="rounded-lg px-2 py-3 text-xs text-slate-500">
                        No videos available for this lesson.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Playlist Footer */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm ring-1 ring-slate-200/70">
            <FiBookOpen className="text-lg" />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800">Keep learning</p>

            <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
              Continue at your own pace.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
