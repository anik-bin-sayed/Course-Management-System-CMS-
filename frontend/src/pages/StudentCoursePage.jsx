import { useState } from "react";

import {
  FiArrowLeft,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiExternalLink,
  FiPlayCircle,
  FiRefreshCw,
  FiVideo,
} from "react-icons/fi";

import { useParams } from "@/lib/navigation";

import AppLink from "@/components/common/AppLink";

import { useOutletContext } from "react-router-dom";

import { useGetCourseBySlugQuery } from "@/lib/features/courses/paid-course-api";

import {
  useGetCourseLessonsQuery,
  useGetLessonByIdQuery,
} from "@/lib/features/lesson/lessonApi";

import { useGetLessonVideosQuery } from "@/lib/features/lesson/lessonVideoApi";

import LessonCard from "../components/StudentCourse/LessonCard";
import ShowLesson from "../components/StudentCourse/ShowLesson";
import BackRoute from "../utils/BackRoute";

function RouteMessage({ title, message, action }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
      <FiBookOpen
        className="mx-auto text-4xl text-amber-500"
        aria-hidden="true"
      />

      <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
        {title}
      </h1>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
        {message}
      </p>

      {action}
    </section>
  );
}

function PageSkeleton({ detail }) {
  return (
    <div className="space-y-5" aria-label="Loading course">
      <div className="h-36 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70" />

      {detail && (
        <div className="aspect-video animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70" />
      )}

      <div className="h-20 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70" />

      <div className="h-20 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70" />
    </div>
  );
}

const StudentCoursePage = ({ showLesson = false }) => {
  const { courseSlug, lessonId } = useParams();

  const {
    enrollments = [],
    isLoading: enrollmentsLoading,
    isError: enrollmentsError,
    refetchEnrollments,
  } = useOutletContext();

  const {
    currentData: course,

    isLoading: courseLoading,

    isError: courseError,
  } = useGetCourseBySlugQuery(courseSlug, { skip: !courseSlug });

  const enrollment = enrollments.find(
    (item) => item.course?.slug === courseSlug,
  );

  const hasCourseAccess = ["active", "completed"].includes(enrollment?.status);

  const courseId = hasCourseAccess ? enrollment.course_id : null;

  const {
    currentData: lessons = [],

    isLoading: lessonsLoading,

    isError: lessonsError,

    refetch: refetchLessons,
  } = useGetCourseLessonsQuery(
    { id: courseId },

    { skip: !courseId || !course },
  );

  const {
    currentData: lesson,

    isLoading: lessonLoading,

    isError: lessonError,
  } = useGetLessonByIdQuery(
    { id: lessonId },

    { skip: !showLesson || !courseId || !course || !lessonId },
  );

  const lessonBelongsToCourse =
    Boolean(lesson && course) && lesson.course_id === course.id;

  const {
    currentData: videos = [],

    isLoading: videosLoading,

    isError: videosError,

    refetch: refetchVideos,
  } = useGetLessonVideosQuery(
    { id: lessonId },

    { skip: !showLesson || !lessonBelongsToCourse },
  );

  const [courseExpanded, setCourseExpanded] = useState(true);

  const retry = () => {
    if (enrollmentsError) refetchEnrollments();

    if (lessonsError) refetchLessons();

    if (videosError) refetchVideos();
  };

  const renderContent = () => {
    if (enrollmentsLoading || courseLoading || (showLesson && lessonLoading)) {
      return <PageSkeleton detail={showLesson} />;
    }

    if (enrollmentsError) {
      return (
        <RouteMessage
          title="Courses could not be loaded"
          message="Your session may have expired, or the service is temporarily unavailable."
          action={
            <button
              type="button"
              onClick={retry}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <FiRefreshCw aria-hidden="true" /> Try again
            </button>
          }
        />
      );
    }

    if (courseError || !course) {
      return (
        <RouteMessage
          title="Course not found"
          message="This course link is invalid or the course is no longer available."
          action={
            <AppLink
              href="/dashboard"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <FiArrowLeft aria-hidden="true" /> My courses
            </AppLink>
          }
        />
      );
    }

    if (!enrollment || !hasCourseAccess) {
      return (
        <RouteMessage
          title="Course access required"
          message={
            enrollment?.status === "pending"
              ? "Complete course payment before viewing its lessons."
              : "This course is not in your active enrollments."
          }
          action={
            <AppLink
              href="/dashboard"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <FiArrowLeft aria-hidden="true" /> My courses
            </AppLink>
          }
        />
      );
    }

    if (showLesson && (lessonError || !lesson)) {
      return (
        <RouteMessage
          title="Lesson not found"
          message="This lesson does not exist or is not available in this course."
          action={
            <AppLink
              href={`/dashboard/${encodeURIComponent(course.slug)}`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <FiArrowLeft aria-hidden="true" /> Course lessons
            </AppLink>
          }
        />
      );
    }

    if (showLesson && !lessonBelongsToCourse) {
      return (
        <RouteMessage
          title="Lesson does not belong to this course"
          message="Open the lesson from this course's lesson list instead."
          action={
            <AppLink
              href={`/dashboard/${encodeURIComponent(course.slug)}`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <FiArrowLeft aria-hidden="true" /> Course lessons
            </AppLink>
          }
        />
      );
    }

    if (lessonsError) {
      return (
        <RouteMessage
          title="Lessons could not be loaded"
          message="Please retry the course lesson list."
          action={
            <button
              type="button"
              onClick={retry}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <FiRefreshCw aria-hidden="true" /> Try again
            </button>
          }
        />
      );
    }

    if (showLesson) {
      return (
        <ShowLesson
          lessons={lessons}
          lesson={lesson}
          course={course}
          videos={videos}
          videosLoading={videosLoading}
          videosError={videosError}
          retry={retry}
        />
      );
    }

    return (
      <>
        <BackRoute Text={"My courses"} backUrl="/dashboard" />

        <section className="overflow-hidden rounded border border-slate-200/80 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setCourseExpanded((expanded) => !expanded)}
            aria-expanded={courseExpanded}
            className="flex min-h-19 w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
          >
            <span>
              <span className="block text-base font-bold tracking-tight text-slate-950">
                Course lessons
              </span>

              <span className="mt-1 block text-sm text-slate-500">
                {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
              </span>
            </span>
          </button>

          <div className="border-t border-slate-100 px-5 py-3 sm:px-6">
            <p className="text-xs font-semibold text-slate-500">Instructors</p>
            <p className="mt-1 text-sm text-slate-700">
              {course.instructors?.length
                ? course.instructors
                    .map((instructor) => instructor.name)
                    .join(", ")
                : "To be announced"}
            </p>
          </div>

          {lessonsLoading ? (
            <div className="grid grid-cols-1 gap-4 border-t border-slate-100 bg-slate-50/50 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3 lg:gap-5 lg:p-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded border border-slate-200 bg-white p-5"
                  aria-label="Loading lesson"
                >
                  <div className="mb-4 h-10 w-10 rounded bg-slate-100" />

                  <div className="mb-3 h-5 w-3/4 rounded bg-slate-100" />

                  <div className="mb-5 h-4 w-full rounded bg-slate-100" />

                  <div className="h-9 w-32 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : lessons.length === 0 ? (
            <div className="border-t border-slate-100 px-5 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded bg-amber-50 text-amber-600">
                <FiBookOpen size={26} aria-hidden="true" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                No lessons yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                No lessons have been added to this course yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 border-t border-slate-100  p-4 sm:grid-cols-2 sm:gap-5 sm:p-6 lg:grid-cols-3 lg:gap-5 xl:gap-6">
              {lessons.map((item, index) => (
                <LessonCard
                  key={item.id}
                  lesson={item}
                  index={index}
                  courseSlug={course.slug}
                />
              ))}
            </div>
          )}
        </section>
      </>
    );
  };

  return (
    <main className="mx-auto w-full max-w-375 px-4 pb-12 pt-6 sm:px-7 sm:pt-8 lg:px-9">
      {renderContent()}
    </main>
  );
};

export default StudentCoursePage;
