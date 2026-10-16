import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiPlayCircle,
  FiVideo,
  FiBook,
} from "react-icons/fi";

import { useSearchParams } from "react-router-dom";
import { useGetCourseByIdQuery } from "@/lib/features/courses/paid-course-api";
import {
  useGetCourseLessonsQuery,
  useGetLessonByIdQuery,
} from "@/lib/features/lesson/lessonApi";
import {
  useGetLessonVideosQuery,
  useLazyGetLessonVideosQuery,
} from "@/lib/features/lesson/lessonVideoApi";
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from "@/lib/youtube";
import AppLink from "@/components/common/AppLink";
import WatchPageSkeleton from "../components/LessonWatchPage/WatchPageSkeleton";
import LessonRow from "../components/LessonWatchPage/LessonRow";
import Aside from "../components/LessonWatchPage/Aside";

const LessonWatchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const lesson_id = searchParams.get("lesson_id");
  const video_id = searchParams.get("video_id");

  const activeRowRef = useRef(null);

  const [selectedVideoId, setSelectedVideoId] = useState(
    video_id ? String(video_id) : null,
  );

  // Playlist states
  const [expandedLessons, setExpandedLessons] = useState({});
  const [lessonVideosMap, setLessonVideosMap] = useState({});
  const [loadingLessonVideos, setLoadingLessonVideos] = useState({});
  const [triggerLessonVideos] = useLazyGetLessonVideosQuery();

  // Current lesson query
  const {
    currentData: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useGetLessonByIdQuery({ id: lesson_id }, { skip: !lesson_id });

  const courseId = lesson?.course_id;

  // Course query
  const { currentData: course, isLoading: isCourseLoading } =
    useGetCourseByIdQuery(courseId, {
      skip: !courseId,
    });

  // Course lessons query
  const {
    currentData: lessons = [],
    isLoading: isPlaylistLoading,
    isError: isPlaylistError,
  } = useGetCourseLessonsQuery({ id: courseId }, { skip: !courseId });

  // Current lesson videos query
  const {
    currentData: videos = [],
    isLoading: areVideosLoading,
    isError: areVideosError,
  } = useGetLessonVideosQuery({ id: lesson_id }, { skip: !lesson_id });

  // Cache videos for the currently selected lesson.
  useEffect(() => {
    if (lesson_id && Array.isArray(videos)) {
      setLessonVideosMap((previous) => ({
        ...previous,
        [String(lesson_id)]: videos,
      }));

      setExpandedLessons((previous) => ({
        ...previous,
        [String(lesson_id)]: true,
      }));
    }
  }, [lesson_id, videos]);

  // Expand/collapse a lesson and load its videos only when needed.
  const toggleLessonVideos = async (targetLessonId) => {
    const key = String(targetLessonId);
    const willExpand = !expandedLessons[key];

    setExpandedLessons((previous) => ({
      ...previous,
      [key]: willExpand,
    }));

    if (
      !willExpand ||
      Object.prototype.hasOwnProperty.call(lessonVideosMap, key)
    ) {
      return;
    }

    setLoadingLessonVideos((previous) => ({
      ...previous,
      [key]: true,
    }));

    try {
      const result = await triggerLessonVideos({
        id: targetLessonId,
      }).unwrap();

      setLessonVideosMap((previous) => ({
        ...previous,
        [key]: Array.isArray(result) ? result : [],
      }));
    } catch (error) {
      console.error("Could not load lesson videos:", error);

      setLessonVideosMap((previous) => ({
        ...previous,
        [key]: [],
      }));
    } finally {
      setLoadingLessonVideos((previous) => ({
        ...previous,
        [key]: false,
      }));
    }
  };

  // Select a video from the playlist.
  const selectPlaylistVideo = (targetLessonId, targetVideoId) => {
    setExpandedLessons((previous) => ({
      ...previous,
      [String(targetLessonId)]: true,
    }));

    setSearchParams((previousParams) => {
      const nextParams = new URLSearchParams(previousParams);

      nextParams.set("tab", "watch");
      nextParams.set("lesson_id", String(targetLessonId));
      nextParams.set("video_id", String(targetVideoId));

      return nextParams;
    });
  };

  // Select the requested video, or the first available video.
  useEffect(() => {
    if (!videos.length) {
      setSelectedVideoId(null);
      return;
    }

    const requestedVideo = videos.find(
      (video) => String(video.id) === String(video_id),
    );

    const nextVideo = requestedVideo || videos[0];

    setSelectedVideoId(String(nextVideo.id));

    if (String(video_id) !== String(nextVideo.id)) {
      setSearchParams(
        (previousParams) => {
          const nextParams = new URLSearchParams(previousParams);

          nextParams.set("tab", "watch");
          nextParams.set("lesson_id", String(lesson_id));
          nextParams.set("video_id", String(nextVideo.id));

          return nextParams;
        },
        { replace: true },
      );
    }
  }, [lesson_id, video_id, videos, setSearchParams]);

  // Keep the active lesson visible in the playlist.
  useEffect(() => {
    activeRowRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [lesson_id, lessons]);

  // Current video
  const currentVideo =
    videos.find((video) => String(video.id) === String(selectedVideoId)) ||
    videos[0];

  const embedUrl = currentVideo
    ? getYoutubeEmbedUrl(currentVideo.video_url)
    : null;

  // Lesson navigation
  const currentIndex = lessons.findIndex(
    (item) => String(item.id) === String(lesson_id),
  );

  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;

  const nextLesson =
    currentIndex >= 0 ? lessons[currentIndex + 1] || null : null;

  // Navigate between lessons without leaving the watch tab.
  const goToLesson = (nextLessonId) => {
    if (!nextLessonId) return;

    setSearchParams((previousParams) => {
      const nextParams = new URLSearchParams(previousParams);

      nextParams.set("tab", "watch");
      nextParams.set("lesson_id", String(nextLessonId));
      nextParams.delete("video_id");

      return nextParams;
    });
  };

  // Select a video in the current lesson.
  const selectVideo = (nextVideoId) => {
    setSearchParams((previousParams) => {
      const nextParams = new URLSearchParams(previousParams);

      nextParams.set("tab", "watch");
      nextParams.set("lesson_id", String(lesson_id));
      nextParams.set("video_id", String(nextVideoId));

      return nextParams;
    });
  };

  // Loading state
  if (isLessonLoading) {
    return <WatchPageSkeleton />;
  }

  // Error state
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
            href="/admin/manage-course"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            <FiArrowLeft />
            Back to courses
          </AppLink>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-6 px-4 py-5 sm:px-7 sm:py-7 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 space-y-5">
          {/* Video Player */}
          <div className="overflow-hidden  bg-slate-950 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 ">
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
                    <div className="mx-auto flex h-16 w-16 items-center justify-center  bg-white/10">
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
                  title={currentVideo.title || "Lesson video"}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* Lesson Details Card */}
          <div className=" border border-slate-200/80 bg-white px-5 py-6 shadow-sm  sm:px-7 sm:py-7">
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
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  <FiChevronLeft className="text-lg" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => goToLesson(nextLesson?.id)}
                  disabled={!nextLesson}
                  aria-label="Next lesson"
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded bg-amber-500 px-4 text-sm font-semibold text-black shadow-sm shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  Next
                  <FiChevronRight className="text-lg" />
                </button>
              </div>
            </div>

            {/* Lesson Description */}
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
          </div>
        </section>

        {/* Right: Course Playlist */}

        <Aside
          lessons={lessons}
          course={course}
          currentIndex={currentIndex}
          isPlaylistLoading={isPlaylistLoading}
          isCourseLoading={isCourseLoading}
          isPlaylistError={isPlaylistError}
          lesson_id={lesson_id}
          video_id={video_id}
          expandedLessons={expandedLessons}
          lessonVideosMap={lessonVideosMap}
          loadingLessonVideos={loadingLessonVideos}
          activeRowRef={activeRowRef}
          goToLesson={goToLesson}
          toggleLessonVideos={toggleLessonVideos}
          selectPlaylistVideo={selectPlaylistVideo}
          LessonRow={LessonRow}
          getYoutubeThumbnail={getYoutubeThumbnail}
        />
      </div>
    </main>
  );
};

export default LessonWatchPage;
