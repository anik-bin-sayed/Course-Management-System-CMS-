import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiPlayCircle,
  FiVideo,
  FiCheckCircle,
  FiList,
  FiBook,
} from "react-icons/fi";

import { useParams } from "@/lib/navigation";
import { useRouter } from "@/lib/navigation";
import { useGetCourseByIdQuery } from "@/lib/features/courses/paid-course-api";
import {
  useGetCourseLessonsQuery,
  useGetLessonByIdQuery,
} from "@/lib/features/lesson/lessonApi";
import { useGetLessonVideosQuery } from "@/lib/features/lesson/lessonVideoApi";
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from "@/lib/youtube";
import AppLink from "@/components/common/AppLink";

/* ------------------------------------------
   Reusable Lesson Playlist Item
------------------------------------------ */

function LessonRow({ lesson, index, active, onSelect, rowRef }) {
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
      {/* Active indicator */}
      {active && (
        <span className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-amber-500" />
      )}

      {/* Thumbnail */}
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

      {/* Lesson information */}
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
}

/* ------------------------------------------
   Loading Skeleton
------------------------------------------ */

function WatchPageSkeleton() {
  return (
    <main className="min-h-screen bg-[#f6f7fb] p-4 sm:p-7">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 h-12 max-w-xs animate-pulse rounded-xl bg-slate-200" />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <div className="aspect-video animate-pulse rounded-2xl bg-slate-200" />
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-5 h-6 w-2/3 animate-pulse rounded bg-slate-200" />

            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="mb-3 flex gap-3">
                <div className="h-[62px] w-[104px] shrink-0 animate-pulse rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------
   Main Lesson Watch Page
------------------------------------------ */

export default function LessonWatchPage() {
  const { lessonId } = useParams();
  const router = useRouter();

  const activeRowRef = useRef(null);

  const [selectedVideoId, setSelectedVideoId] = useState(null);

  /* Lesson query */
  const {
    currentData: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useGetLessonByIdQuery({ id: lessonId }, { skip: !lessonId });

  const courseId = lesson?.course_id;

  /* Course query */
  const { currentData: course, isLoading: isCourseLoading } =
    useGetCourseByIdQuery(courseId, {
      skip: !courseId,
    });

  /* Course lessons query */
  const {
    currentData: lessons = [],
    isLoading: isPlaylistLoading,
    isError: isPlaylistError,
  } = useGetCourseLessonsQuery({ id: courseId }, { skip: !courseId });

  /* Current lesson videos query */
  const {
    currentData: videos = [],
    isLoading: areVideosLoading,
    isError: areVideosError,
  } = useGetLessonVideosQuery({ id: lessonId }, { skip: !lessonId });

  /* Select first video whenever lesson changes */
  useEffect(() => {
    setSelectedVideoId(videos[0]?.id ?? null);
  }, [lessonId, videos]);

  /* Keep active lesson visible in playlist */
  useEffect(() => {
    activeRowRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [lessonId, lessons]);

  /* Current video */
  const currentVideo =
    videos.find((video) => video.id === selectedVideoId) || videos[0];

  const embedUrl = currentVideo
    ? getYoutubeEmbedUrl(currentVideo.video_url)
    : null;

  /* Lesson navigation */
  const currentIndex = lessons.findIndex(
    (item) => String(item.id) === String(lessonId),
  );

  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;

  const nextLesson =
    currentIndex >= 0 ? lessons[currentIndex + 1] || null : null;

  const goToLesson = (nextLessonId) => {
    if (nextLessonId) {
      router.push(`/watch/${nextLessonId}`);
    }
  };

  /* Loading state */
  if (isLessonLoading) {
    return <WatchPageSkeleton />;
  }

  /* Error state */
  if (isLessonError || !lesson) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] px-5 py-10">
        <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <FiBookOpen className="text-3xl" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Lesson unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            This lesson may not exist, or your enrollment may not include
            access.
          </p>

          <AppLink
            href="/dashboard"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            <FiArrowLeft />
            Back to courses
          </AppLink>
        </section>
      </main>
    );
  }

  /* ------------------------------------------
     Main UI
  ------------------------------------------ */

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-7">
          <AppLink
            href="/dashboard"
            className="group inline-flex min-h-10 shrink-0 items-center gap-2.5 rounded-xl px-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-amber-700"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 transition group-hover:border-amber-200 group-hover:bg-amber-50">
              <FiArrowLeft className="text-lg" />
            </span>

            <span className="hidden sm:inline">My courses</span>
          </AppLink>

          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-sm font-bold text-slate-900 sm:text-[15px]">
              {course?.title || "Course lesson"}
            </p>

            <p className="mt-0.5 truncate text-xs capitalize text-slate-500">
              {course?.category?.name || course?.level || "Learning"}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-6 px-4 py-5 sm:px-7 sm:py-7 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left: Video and Lesson Details */}
        <section className="min-w-0 space-y-5">
          {/* Video Player */}
          <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 sm:rounded-3xl">
            <div className="relative aspect-video w-full">
              {areVideosLoading ? (
                <div
                  className="absolute inset-0 grid place-items-center text-sm font-medium text-white/70"
                  aria-label="Loading video"
                >
                  <div className="text-center">
                    <FiPlayCircle className="mx-auto mb-3 animate-pulse text-4xl" />
                    Loading video...
                  </div>
                </div>
              ) : areVideosError ? (
                <div className="absolute inset-0 grid place-items-center px-5 text-center text-sm text-white/80">
                  <div>
                    <FiVideo className="mx-auto mb-3 text-3xl text-white/50" />
                    <p className="font-semibold text-white">
                      Video could not be loaded
                    </p>
                    <p className="mt-2 text-xs text-white/60">
                      Refresh the page to try again.
                    </p>
                  </div>
                </div>
              ) : !currentVideo ? (
                <div className="absolute inset-0 grid place-items-center px-5 text-center text-white">
                  <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                      <FiVideo className="text-3xl text-white/70" />
                    </div>

                    <p className="mt-4 font-semibold">
                      No video in this lesson
                    </p>

                    <p className="mt-2 text-sm text-white/55">
                      Choose another lesson from the playlist.
                    </p>
                  </div>
                </div>
              ) : !embedUrl ? (
                <div className="absolute inset-0 grid place-items-center px-5 text-center text-white">
                  <div>
                    <FiVideo className="mx-auto text-4xl text-white/50" />

                    <p className="mt-4 font-semibold">
                      This video URL is unavailable
                    </p>

                    <p className="mt-2 text-sm text-white/60">
                      Ask the instructor to update the video link.
                    </p>
                  </div>
                </div>
              ) : (
                <iframe
                  key={currentVideo.id}
                  src={embedUrl}
                  title={currentVideo.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Lesson Details Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-6 shadow-sm sm:rounded-3xl sm:px-7 sm:py-7">
            {/* Lesson heading and navigation */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    <FiBook />
                    Lesson{" "}
                    {currentIndex >= 0
                      ? String(currentIndex + 1).padStart(2, "0")
                      : ""}
                  </span>

                  {course?.level && (
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold capitalize text-slate-600">
                      {course.level}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                  {lesson.title}
                </h1>

                {course?.title && (
                  <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-500">
                    <FiBookOpen className="mt-1 shrink-0 text-amber-600" />
                    <span>{course.title}</span>
                  </p>
                )}
              </div>

              {/* Previous / Next */}
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToLesson(previousLesson?.id)}
                  disabled={!previousLesson}
                  aria-label="Previous lesson"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  <FiChevronLeft className="text-lg" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => goToLesson(nextLesson?.id)}
                  disabled={!nextLesson}
                  aria-label="Next lesson"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-white shadow-sm shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  Next
                  <FiChevronRight className="text-lg" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <FiBookOpen className="text-lg" />
                </span>

                <h2 className="text-sm font-bold text-slate-900">
                  About this lesson
                </h2>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {lesson.description ||
                  "No description provided for this lesson yet."}
              </p>
            </div>

            {/* Multiple Videos */}
            {videos.length > 1 && (
              <div className="mt-7 border-t border-slate-100 pt-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <FiPlayCircle className="text-lg" />
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Videos in this lesson
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Choose a video to continue learning
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {videos.map((video, index) => {
                    const isActive = currentVideo?.id === video.id;

                    return (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => setSelectedVideoId(video.id)}
                        aria-pressed={isActive}
                        className={`flex min-h-14 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                          isActive
                            ? "border-amber-300 bg-amber-50 text-amber-950"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            isActive
                              ? "bg-amber-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <FiPlayCircle className="text-lg" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60">
                            Video {index + 1}
                          </span>

                          <span className="mt-0.5 block break-words text-sm font-semibold">
                            {video.title}
                          </span>
                        </span>

                        {isActive && (
                          <FiCheckCircle className="shrink-0 text-lg text-amber-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right: Course Playlist */}
        <aside
          className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm xl:sticky xl:top-[84px] xl:max-h-[calc(100vh-104px)] xl:rounded-3xl"
          aria-label="Course lesson playlist"
        >
          {/* Playlist Header */}
          <div className="border-b border-slate-100 bg-white px-5 py-5 sm:px-6">
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

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <FiBookOpen className="text-xl" />
              </span>
            </div>

            {/* Playlist Stats */}
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                <FiList className="text-slate-400" />
                {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
              </span>

              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {currentIndex >= 0
                  ? `${currentIndex + 1} of ${lessons.length}`
                  : "Course"}
              </span>
            </div>
          </div>

          {/* Playlist Content */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {isPlaylistLoading || isCourseLoading ? (
              <div
                className="space-y-4 p-4"
                aria-label="Loading course playlist"
              >
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
            ) : lessons.length === 0 ? (
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
              lessons.map((item, index) => (
                <LessonRow
                  key={item.id}
                  lesson={item}
                  index={index}
                  active={String(item.id) === String(lessonId)}
                  rowRef={
                    String(item.id) === String(lessonId)
                      ? activeRowRef
                      : undefined
                  }
                  onSelect={() => goToLesson(item.id)}
                />
              ))
            )}
          </div>

          {/* Playlist Footer */}
          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-amber-600 shadow-sm ring-1 ring-slate-200/70">
                <FiBookOpen className="text-lg" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800">
                  Keep learning
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                  Continue at your own pace.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
