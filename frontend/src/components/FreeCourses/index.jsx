import { lazy, Suspense, useState } from "react";
import Image from "@/components/common/AppImage";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";
import { useSelector } from "react-redux";

import { FaPlay } from "react-icons/fa";

import { toast } from "sonner";

import { SiGoogledisplayandvideo360 } from "react-icons/si";

const VideoModal = lazy(() => import("../Home/VideoModal"));

const FreeCourses = ({
  allFreeCourse,
  onPageChange,
  currentPage,
  isFetching,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { isAuthenticated } = useSelector((state) => state?.auth);

  const { data, page, total_pages, has_next, has_previous } =
    allFreeCourse || {};

  if (!data || data.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">No free courses available.</p>
      </div>
    );
  }

  const goToPage = (newPage) => {
    if (onPageChange && newPage >= 1 && newPage <= total_pages) {
      onPageChange(newPage);
    }
  };

  const handleWatchFreeCourse = (course) => {
    if (!isAuthenticated) {
      toast.error("Please Login to watch!");
      return;
    }

    setSelectedCourse(course);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className=" border max-w-6xl shadow p-10  rounded-md border-gray-200">
        {/* Header */}
        <div className="mb-10 w-full">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-4 px-4 sm:gap-6">
            {/* Icon */}
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-2xl bg-red-700 shadow-sm  sm:h-16 sm:w-16">
              <SiGoogledisplayandvideo360 className="h-7 w-7 text-white sm:h-8 sm:w-8" />
            </div>

            {/* Text */}
            <div className="min-w-0 text-left">
              <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-600 ring-1 ring-red-100 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                100% Free Learning
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Free Video Courses
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm sm:leading-6">
                Learn from industry experts and build your skills with{" "}
                <span className="font-semibold text-red-500">
                  completely free
                </span>{" "}
                video courses.
              </p>
            </div>
          </div>

          {/* Bottom line */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <span className="h-1 w-6 rounded-full bg-red-200" />
            <span className="h-1 w-12 rounded-full bg-red-400" />
            <span className="h-1 w-6 rounded-full bg-red-200" />
          </div>
        </div>

        {/* Course Grid */}
        {/* Course Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col overflow-hidden rounded-md ring-1 ring-gray-300 bg-white transition-all duration-300 hover:ring-0 "
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
      </div>

      {/* Pagination */}
      {total_pages > 1 && (
        <div className="flex justify-center items-center mt-12 space-x-2">
          {/* Previous */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!has_previous || isFetching}
            className={`px-4 py-2 rounded-lg font-medium ${
              has_previous
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: total_pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                disabled={isFetching}
                className={`px-4 py-2 rounded-lg font-medium ${
                  p === currentPage
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!has_next || isFetching}
            className={`px-4 py-2 rounded-lg font-medium ${
              has_next
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}
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
