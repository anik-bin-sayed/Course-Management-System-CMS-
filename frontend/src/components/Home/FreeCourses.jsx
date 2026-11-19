import { lazy, Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlay } from "react-icons/fa";
import { FiClock, FiPlayCircle } from "react-icons/fi";
import { toast } from "sonner";

import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";

const VideoModal = lazy(() => import("./VideoModal"));

const FreeCourses = ({ data, loading }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { isAuthenticated } = useSelector((state) => state?.auth);

  const handleWatchFreeCourse = (course) => {
    if (!isAuthenticated) {
      toast.error("Please Login to watch!");
      return;
    }

    setSelectedCourse(course);
  };

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fff7d6] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#6e5900]">
              <FiPlayCircle className="text-sm" />
              Learn at your own pace
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#17251d] sm:text-4xl">
              Free video courses
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-gray-600">
              Explore practical lessons and start building new skills with free
              video courses.
            </p>
          </div>
          <Link
            href="/free-courses"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-[#17251d] transition duration-300 hover:border-[#1b704b] hover:bg-[#f1f8f4]"
          >
            Browse all courses
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="aspect-[1.55/1] animate-pulse bg-gray-100" />
                <div className="space-y-3 p-5">
                  <div className="h-5 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : !data?.length ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-[#f8faf8] px-6 py-14 text-center">
            <FiPlayCircle className="mx-auto mb-3 text-3xl text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-800">
              No free courses available right now
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Check back soon to find new lessons.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((course) => (
              <article
                key={course.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_30px_-22px_rgba(16,37,29,0.35)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_48px_-28px_rgba(16,37,29,0.38)]"
              >
                <button
                  type="button"
                  onClick={() => handleWatchFreeCourse(course)}
                  aria-label={`Play ${course.title}`}
                  className="relative block aspect-[1.55/1] w-full cursor-pointer overflow-hidden bg-[#17251d] text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#ffd84d]"
                >
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent transition-colors duration-300 group-hover:from-black/65" />
                  <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#ffd84d] text-[#17251d] shadow-lg transition duration-300 group-hover:scale-110">
                    <FaPlay className="ml-0.5 text-sm" />
                  </span>
                  <span className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    Free
                  </span>
                </button>

                <div className="flex grow flex-col p-5">
                  <h3 className="line-clamp-2 min-h-12 text-lg font-bold leading-6 text-[#17251d] transition-colors duration-200 group-hover:text-[#1b704b]">
                    {course.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
                    {course.short_description || course.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-medium text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <FiClock className="text-sm" />
                      {course.duration || "Self-paced"}
                    </span>
                    {course.language && (
                      <span className="rounded-full bg-[#eff6f1] px-2.5 py-1 capitalize text-[#276143]">
                        {course.language}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleWatchFreeCourse(course)}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#173c2d] px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#225c42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b704b]"
                  >
                    {isAuthenticated ? "Watch course" : "Login to watch"}
                    <FaPlay className="text-[10px]" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <Suspense
          fallback={<LoadingFallback label="Loading video..." variant="modal" />}
        >
          <VideoModal
            videoUrl={selectedCourse.video_url}
            title={selectedCourse.title}
            onClose={() => setSelectedCourse(null)}
          />
        </Suspense>
      )}
    </section>
  );
};

export default FreeCourses;
