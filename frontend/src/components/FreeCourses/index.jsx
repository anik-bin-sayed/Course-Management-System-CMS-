import { lazy, Suspense, useState } from "react";
import Image from "@/components/common/AppImage";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaPlay } from "react-icons/fa";
import { FiClock, FiPlayCircle } from "react-icons/fi";
import { toast } from "sonner";

const VideoModal = lazy(() => import("../Home/VideoModal"));

const FreeCoursesSkeleton = () => (
  <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
    {Array.from({ length: 8 }, (_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        <div className="aspect-[1.55/1] animate-pulse bg-gray-100" />
        <div className="space-y-3 p-5">
          <div className="h-5 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    ))}
  </div>
);

const FreeCourses = ({
  allFreeCourse,
  onPageChange,
  currentPage,
  isFetching,
  isLoading,
  isError,
  onRetry,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { isAuthenticated } = useSelector((state) => state?.auth);
  const { t } = useTranslation();

  const { data, total_pages, has_next, has_previous } = allFreeCourse || {};

  const goToPage = (newPage) => {
    if (onPageChange && newPage >= 1 && newPage <= total_pages) {
      onPageChange(newPage);
    }
  };

  const handleWatchFreeCourse = (course) => {
    if (!isAuthenticated) {
      toast.error(t("freeCourse.loginToWatchToast"));
      return;
    }
    setSelectedCourse(course);
  };

  if (isLoading) return <FreeCoursesSkeleton />;

  if (isError && !allFreeCourse) {
    return (
      <section className="bg-[#f7faf8] px-5 py-16 sm:px-8 lg:px-10">
        <div
          className="mx-auto flex min-h-64 max-w-7xl flex-col items-center justify-center rounded-xl border border-red-100 bg-white px-6 py-12 text-center"
          role="alert"
        >
          <p className="max-w-md text-base leading-7 text-gray-700">
            {t("freeCourse.error")}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-lg bg-[#173c2d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#225c42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b704b]"
          >
            {t("freeCourse.retry")}
          </button>
        </div>
      </section>
    );
  }

  if (!data?.length) {
    return (
      <section className="bg-[#f7faf8] px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-64 max-w-7xl flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <FiPlayCircle className="mb-3 text-3xl text-[#547160]" />
          <p className="text-base font-semibold text-gray-700">
            {t("freeCourse.empty")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="free-courses-grid"
      className="bg-[#f7faf8] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
      aria-busy={isFetching}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md bg-[#e8f2eb] px-2.5 py-1.5 text-xs font-semibold text-[#276143]">
              <FiPlayCircle />
              {t("freeCourse.badge")}
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#17251d] sm:text-3xl">
              {t("freeCourse.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              {t("freeCourse.descriptionStart")} {" "}
              <span className="font-semibold text-[#1b704b]">
                {t("freeCourse.completelyFree")}
              </span>{" "}
              {t("freeCourse.descriptionEnd")}
            </p>
          </div>
          {total_pages > 1 && (
            <p className="shrink-0 text-sm font-medium text-gray-500">
              {currentPage} / {total_pages}
            </p>
          )}
        </div>

        <div
          className={`grid grid-cols-1 gap-5 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
          {data.map((course) => (
            <article
              key={course.id}
              className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_8px_24px_-20px_rgba(16,37,29,0.38)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_40px_-25px_rgba(16,37,29,0.32)]"
            >
              <button
                type="button"
                onClick={() => handleWatchFreeCourse(course)}
                aria-label={`${t("freeCourse.watchNow")}: ${course.title}`}
                className="relative block aspect-[1.55/1] w-full cursor-pointer overflow-hidden bg-[#17251d] text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#ffd84d]"
              >
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#ffd84d] text-[#17251d] shadow-lg transition duration-300 group-hover:scale-105">
                  <FaPlay className="ml-0.5 text-sm" />
                </span>
                <span className="absolute right-3 top-3 rounded-md border border-white/20 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {t("courses.free")}
                </span>
              </button>

              <div className="flex grow flex-col p-5">
                <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-[#17251d] transition-colors group-hover:text-[#1b704b]">
                  {course.title}
                </h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
                  {course.short_description || course.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-medium text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <FiClock className="text-sm" />
                    {course.duration || t("freeCourseHero.selfPaced")}
                  </span>
                  {course.language && (
                    <span className="rounded-md bg-[#eff6f1] px-2 py-1 capitalize text-[#276143]">
                      {course.language}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleWatchFreeCourse(course)}
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#173c2d] px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#225c42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b704b]"
                >
                  {isAuthenticated
                    ? t("freeCourse.watchNow")
                    : t("freeCourse.loginToWatch")}
                  <FaPlay className="text-[9px]" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {total_pages > 1 && (
          <nav
            className="mt-9 flex flex-wrap items-center justify-center gap-2"
            aria-label="Course pagination"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={!has_previous || isFetching}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-[#1b704b]/30 hover:bg-[#eff6f1] hover:text-[#1b704b] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t("freeCourse.previous")}
            </button>

            <div className="flex flex-wrap justify-center gap-1.5">
              {Array.from({ length: total_pages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    disabled={isFetching}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`min-h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition disabled:cursor-wait ${
                      page === currentPage
                        ? "bg-[#173c2d] text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-[#1b704b]/30 hover:bg-[#eff6f1] hover:text-[#1b704b]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={!has_next || isFetching}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-[#1b704b]/30 hover:bg-[#eff6f1] hover:text-[#1b704b] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {t("freeCourse.next")}
            </button>
          </nav>
        )}
      </div>

      {selectedCourse && (
        <Suspense
          fallback={
            <LoadingFallback
              label={t("freeCourse.loadingVideo")}
              variant="modal"
            />
          }
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
