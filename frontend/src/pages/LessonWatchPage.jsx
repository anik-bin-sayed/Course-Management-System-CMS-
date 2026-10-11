import { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiPlayCircle,
  FiVideo,
} from "react-icons/fi";
import { useParams } from "@/lib/navigation";
import { useRouter } from "@/lib/navigation";
import { useGetCourseByIdQuery } from "@/lib/features/courses/paid-course-api";
import { useGetCourseLessonsQuery, useGetLessonByIdQuery } from "@/lib/features/lesson/lessonApi";
import { useGetLessonVideosQuery } from "@/lib/features/lesson/lessonVideoApi";
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from "@/lib/youtube";
import AppLink from "@/components/common/AppLink";

function LessonRow({ lesson, index, active, onSelect, rowRef }) {
  const thumbnail = getYoutubeThumbnail(lesson.first_video_url);

  return (
    <button
      ref={rowRef}
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={`flex w-full gap-3 border-b border-slate-100 p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-amber-600 ${
        active ? "bg-amber-50" : "hover:bg-slate-50"
      }`}
    >
      <span className="flex h-12 w-19 shrink-0 items-center justify-center overflow-hidden bg-slate-100">
        {thumbnail ? (
          <img src={thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <FiBookOpen className="text-slate-400" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase text-slate-500">
          Lesson {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`mt-1 block line-clamp-2 text-sm font-semibold ${active ? "text-amber-900" : "text-slate-800"}`}>
          {lesson.title}
        </span>
        <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          {lesson.video_count > 0 ? <FiPlayCircle aria-hidden="true" /> : <FiClock aria-hidden="true" />}
          {lesson.video_count > 0
            ? `${lesson.video_count} ${lesson.video_count === 1 ? "video" : "videos"}`
            : "No videos yet"}
        </span>
      </span>
    </button>
  );
}

export default function LessonWatchPage() {
  const { lessonId } = useParams();
  const router = useRouter();
  const activeRowRef = useRef(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const {
    currentData: lesson,
    isLoading: isLessonLoading,
    isError: isLessonError,
  } = useGetLessonByIdQuery({ id: lessonId }, { skip: !lessonId });
  const courseId = lesson?.course_id;
  const {
    currentData: course,
    isLoading: isCourseLoading,
  } = useGetCourseByIdQuery(courseId, { skip: !courseId });
  const {
    currentData: lessons = [],
    isLoading: isPlaylistLoading,
    isError: isPlaylistError,
  } = useGetCourseLessonsQuery({ id: courseId }, { skip: !courseId });
  const {
    currentData: videos = [],
    isLoading: areVideosLoading,
    isError: areVideosError,
  } = useGetLessonVideosQuery({ id: lessonId }, { skip: !lessonId });

  useEffect(() => {
    setSelectedVideoId(videos[0]?.id ?? null);
  }, [lessonId, videos]);

  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: "nearest" });
  }, [lessonId, lessons]);

  const currentVideo = videos.find((video) => video.id === selectedVideoId) || videos[0];
  const embedUrl = currentVideo ? getYoutubeEmbedUrl(currentVideo.video_url) : null;
  const currentIndex = lessons.findIndex((item) => item.id === Number(lessonId));
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 ? lessons[currentIndex + 1] : null;

  const goToLesson = (nextLessonId) => {
    if (nextLessonId) router.push(`/watch/${nextLessonId}`);
  };

  if (isLessonLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="aspect-video animate-pulse bg-slate-200" />
          <div className="h-140 animate-pulse bg-white" />
        </div>
      </main>
    );
  }

  if (isLessonError || !lesson) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
        <section className="max-w-md border border-slate-200 bg-white p-8 text-center">
          <FiBookOpen className="mx-auto text-3xl text-slate-400" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Lesson unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">
            This lesson may not exist, or your enrollment may not include access.
          </p>
          <AppLink href="/dashboard" className="mt-5 inline-flex min-h-10 items-center gap-2 bg-slate-900 px-4 text-sm font-semibold text-white">
            <FiArrowLeft aria-hidden="true" /> Back to courses
          </AppLink>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
        <AppLink href="/dashboard" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-slate-700 hover:text-amber-800">
          <FiArrowLeft aria-hidden="true" /> My courses
        </AppLink>
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-semibold text-slate-900">{course?.title || "Course lesson"}</p>
          <p className="text-xs capitalize text-slate-500">{course?.category?.name || course?.level || "Learning"}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-5 sm:px-7 sm:py-7 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0">
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            {areVideosLoading ? (
              <div className="grid h-full place-items-center text-sm text-white/70">Loading video...</div>
            ) : areVideosError ? (
              <div className="grid h-full place-items-center px-5 text-center text-sm text-white">Video could not be loaded. Refresh to try again.</div>
            ) : !currentVideo ? (
              <div className="grid h-full place-items-center px-5 text-center text-white">
                <div><FiVideo className="mx-auto text-3xl text-white/60" aria-hidden="true" /><p className="mt-3 font-semibold">No video in this lesson</p><p className="mt-1 text-sm text-white/60">Choose another lesson from the playlist.</p></div>
              </div>
            ) : !embedUrl ? (
              <div className="grid h-full place-items-center px-5 text-center text-white">
                <div><FiVideo className="mx-auto text-3xl text-white/60" aria-hidden="true" /><p className="mt-3 font-semibold">This video URL is unavailable</p><p className="mt-1 text-sm text-white/60">Ask the course instructor to update the YouTube link.</p></div>
              </div>
            ) : (
              <iframe
                key={currentVideo.id}
                src={embedUrl}
                title={currentVideo.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>

          <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase text-amber-800">Lesson {currentIndex >= 0 ? currentIndex + 1 : ""}</p>
                <h1 className="mt-1 wrap-break-word text-xl font-bold text-slate-950 sm:text-2xl">{lesson.title}</h1>
                <p className="mt-2 text-sm text-slate-600">{course?.title}{course?.level ? ` · ${course.level}` : ""}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => goToLesson(previousLesson?.id)} disabled={!previousLesson} className="inline-flex min-h-10 items-center gap-1 border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="Previous lesson">
                  <FiChevronLeft aria-hidden="true" /> Previous
                </button>
                <button type="button" onClick={() => goToLesson(nextLesson?.id)} disabled={!nextLesson} className="inline-flex min-h-10 items-center gap-1 border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="Next lesson">
                  Next <FiChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-sm font-semibold text-slate-800">About this lesson</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">{lesson.description || "No description provided."}</p>
            </div>

            {videos.length > 1 && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="mb-2 text-sm font-semibold text-slate-800">Videos in this lesson</p>
                <div className="flex flex-wrap gap-2">
                  {videos.map((video, index) => (
                    <button key={video.id} type="button" onClick={() => setSelectedVideoId(video.id)} aria-pressed={currentVideo?.id === video.id} className={`inline-flex min-h-10 items-center gap-2 border px-3 text-sm ${currentVideo?.id === video.id ? "border-amber-500 bg-amber-50 text-amber-900" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
                      <FiPlayCircle aria-hidden="true" /> Video {index + 1}: {video.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="flex max-h-[calc(100vh-7rem)] min-h-90 flex-col border border-slate-200 bg-white" aria-label="Course lesson playlist">
          <header className="border-b border-slate-200 px-4 py-4">
            <p className="text-xs font-semibold uppercase text-amber-800">Course playlist</p>
            <h2 className="mt-1 line-clamp-2 font-bold text-slate-900">{course?.title || "Lessons"}</h2>
            <p className="mt-1 text-xs text-slate-500">{lessons.length} lessons</p>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {isPlaylistLoading || isCourseLoading ? (
              <div className="space-y-2 p-3" aria-label="Loading course playlist"><div className="h-16 animate-pulse bg-slate-100" /><div className="h-16 animate-pulse bg-slate-100" /><div className="h-16 animate-pulse bg-slate-100" /></div>
            ) : isPlaylistError ? (
              <p className="p-5 text-sm text-rose-700">The course playlist could not be loaded.</p>
            ) : lessons.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">There are no other lessons in this course yet.</p>
            ) : (
              lessons.map((item, index) => (
                <LessonRow
                  key={item.id}
                  lesson={item}
                  index={index}
                  active={item.id === Number(lessonId)}
                  rowRef={item.id === Number(lessonId) ? activeRowRef : undefined}
                  onSelect={() => goToLesson(item.id)}
                />
              ))
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}