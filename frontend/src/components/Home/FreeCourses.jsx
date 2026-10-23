import { lazy, Suspense, useState } from "react";

import Image from "@/components/common/AppImage";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";
import { useSelector } from "react-redux";
import Link from "@/components/common/AppLink";

import { FaPlay } from "react-icons/fa";
import { SiGoogledisplayandvideo360 } from "react-icons/si";

import { toast } from "sonner";

const VideoModal = lazy(() => import("./VideoModal"));

const FreeCourses = ({ data, loading }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { isAuthenticated } = useSelector((state) => state?.auth);

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Heading Skeleton */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-3 h-8 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mx-auto h-4 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center text-gray-600">
        No free courses available at the moment.
      </div>
    );
  }

  const handleWatchFreeCourse = (course) => {
    if (!isAuthenticated) {
      toast.error("Please Login to watch!");
      return;
    }

    setSelectedCourse(course);
  };

  return (
    <div className="bg-[#F8F9FA] px-4 py-12 flex items-center justify-center">
      <div className="max-w-7xl border p-10 rounded-xl border-gray-100 shadow bg-gray-800">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          {" "}
          <div className="flex items-center justify-center gap-6">
            {/* Icon */}{" "}
            <div className=" flex h-14 w-20 items-center justify-center rounded-xl bg-yellow-50 shadow-sm ring-1 ring-yellow-400">
              {" "}
              <SiGoogledisplayandvideo360 className="h-7 w-7 text-yellow-500" />{" "}
            </div>
            <div className="flex flex-col items-start">
              {/* Heading */}
              <h1 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                {" "}
                Free Video Courses{" "}
              </h1>
              {/* Description */}
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-200 sm:text-base">
                {" "}
                Learn from industry experts and build your skills with{" "}
                <span className="font-medium text-yellow-500">
                  {" "}
                  completely free{" "}
                </span>{" "}
                video courses.{" "}
              </p>
            </div>
          </div>
          {/* Bottom line */}
          <div className="mt-5 h-1 w-16 rounded-full bg-yellow-400" />{" "}
        </div>

        {/* Course Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data?.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col overflow-hidden rounded ring-1 ring-yellow-100 bg-white shadow-lg transition-all duration-300 hover:ring-0 "
            >
              {/* Image */}
              <div
                onClick={() => handleWatchFreeCourse(course)}
                disabled={!isAuthenticated}
                className="group relative h-48 w-full overflow-hidden cursor-pointer"
              >
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20  transition duration-300 ">
                  <button
                    type="button"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-gray-100 shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer"
                  >
                    {/* Pause Icon */}
                    <FaPlay className="ml-1 text-xl text-gray-100" />
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="flex grow flex-col p-5">
                <h2 className="line-clamp-2 text-xl font-bold text-gray-900">
                  {course.title}
                </h2>

                <p className="mt-2 line-clamp-2 grow text-sm text-gray-600">
                  {course.description || course.short_description}
                </p>

                {/* Meta */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className="mr-1">⏱</span>
                    {course.duration}
                  </span>

                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {course.language}
                  </span>
                </div>

                {/* Watch button */}
                <div className="mt-5">
                  <button
                    onClick={() => handleWatchFreeCourse(course)}
                    disabled={!isAuthenticated}
                    className={`w-full rounded-lg px-4 py-2.5 text-center font-medium transition-colors duration-200 ${
                      isAuthenticated
                        ? "cursor-pointer bg-gray-700 text-white hover:bg-gray-800"
                        : "cursor-not-allowed bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isAuthenticated ? "Watch Now" : "Login to Watch"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="mt-12 flex items-center justify-center">
          <Link
            href="/free-courses"
            className="rounded-full bg-gray-200 px-10 py-2.5 text-sm font-bold text-gray-700 uppercase transition hover:bg-gray-300"
          >
            See All
          </Link>
        </div>
      </div>

      {selectedCourse && (
        <Suspense
          fallback={
            <LoadingFallback label="Loading video..." variant="modal" />
          }
        >
          <VideoModal
            videoUrl={selectedCourse.video_url}
            title={selectedCourse.title}
            onClose={() => setSelectedCourse(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default FreeCourses;
