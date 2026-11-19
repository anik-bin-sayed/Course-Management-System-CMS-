import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import { toast } from "sonner";
import AppImage from "@/components/common/AppImage";
import AppLink from "@/components/common/AppLink";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";
import { useSearchParams, useRouter } from "@/lib/navigation";
import {
  getCachedPaidCourses,
  useGetAllCourseQuery,
} from "@/lib/features/courses/paid-course-api";
import { useGetFreeCoursesQuery } from "@/lib/features/courses/free-course-api";

const PAGE_SIZE = 8;
const VideoModal = lazy(() => import("@/components/Home/VideoModal"));

// Updated Pagination: Cleaner button styles with subtle border and hover effects
function SectionPagination({ page, totalPages, onChange }) {
  const { t } = useTranslation();
  if (totalPages < 2) return null;

  return (
    <nav
      className="mt-7 flex items-center justify-center gap-3 sm:justify-end"
      aria-label="Course result pages"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-[#1b704b]/30 hover:bg-[#eff6f1] hover:text-[#1b704b] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronLeft size={18} />
      </button>
      <span className="min-w-28 text-center text-sm font-medium text-gray-500">
        {t("searchPage.pageOf", { page, total: totalPages })}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-[#1b704b]/30 hover:bg-[#eff6f1] hover:text-[#1b704b] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
}

// Updated CourseCard: Enhanced shadows, border radius, badge styling, and image handling
function CourseCard({ course, kind, onWatch }) {
  const { t } = useTranslation();
  const isPaid = kind === "paid";

  const content = (
    <>
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {course.thumbnail ? (
          <AppImage
            src={course.thumbnail}
            alt={course.title}
            width={600}
            height={338}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            {t("searchPage.missingImage")}
          </div>
        )}

        {/* Modern Badge with slight backdrop blur */}
        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm ${
            isPaid ? "bg-[#173c2d]/90" : "bg-[#547160]/90"
          }`}
        >
          {isPaid ? t("courses.paid") : t("courses.free")}
        </span>
      </div>

      <div className="flex grow flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium capitalize text-gray-500">
          {course.level && (
            <span className="rounded-md bg-[#eff6f1] px-2 py-1 text-gray-600">
              {course.level}
            </span>
          )}
          {course.language && <span>{course.language}</span>}
          {course.duration && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-gray-500">
              <FiClock aria-hidden="true" /> {course.duration}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-[17px] font-bold leading-snug text-[#17251d] transition-colors group-hover:text-[#1b704b]">
          {course.title}
        </h3>

        <p className="mt-2.5 line-clamp-3 grow text-sm leading-relaxed text-gray-500">
          {course.short_description || course.description}
        </p>

        {isPaid ? (
          <div className="mt-5 flex items-baseline gap-2.5">
            {course.discount_price ? (
              <>
                <span className="text-xl font-extrabold text-gray-900">
                  ৳{Number(course.discount_price).toLocaleString("en-BD")}
                </span>
                <span className="text-sm font-medium text-gray-400 line-through">
                  ৳{Number(course.price).toLocaleString("en-BD")}
                </span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-gray-900">
                ৳{Number(course.price).toLocaleString("en-BD")}
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onWatch(course);
            }}
            className="mt-5 self-start rounded-lg bg-[#eff6f1] px-4 py-2.5 text-sm font-semibold text-[#1b704b] transition hover:bg-[#e1f1e7]"
          >
            {t("searchPage.watchCourse")}
          </button>
        )}
      </div>
    </>
  );

  return isPaid ? (
    <AppLink
      href={`/upcoming-course/${course.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_-24px_rgba(16,37,29,0.35)]"
    >
      {content}
    </AppLink>
  ) : (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_-24px_rgba(16,37,29,0.35)]">
      {content}
    </article>
  );
}

// Updated ResultsSection: Better headings, cleaner skeletons, and improved spacing
function ResultsSection({
  title,
  description,
  kind,
  courses,
  total,
  page,
  totalPages,
  isLoading,
  isError,
  onPageChange,
  onWatch,
}) {
  const { t } = useTranslation();
  const isPaid = kind === "paid";

  return (
    <section className="py-8 first:pt-3">
      <div className="mb-5 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="inline-flex rounded-md bg-[#eff6f1] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#276143]">
            {isPaid ? t("searchPage.premiumLabel") : t("searchPage.freeLabel")}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#17251d]">
            {t(title)}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{t(description)}</p>
        </div>
        {!isLoading && !isError && (
          <span className="inline-flex w-fit shrink-0 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600">
            {t("searchPage.courseCount", { count: total })}
          </span>
        )}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label={`Loading ${t(title)}`}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="flex h-[340px] animate-pulse flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="aspect-video w-full bg-gray-100" />
              <div className="flex flex-col gap-3 p-5">
                <div className="h-4 w-1/3 rounded bg-gray-100" />
                <div className="h-5 w-full rounded bg-gray-100" />
                <div className="h-5 w-4/5 rounded bg-gray-100" />
                <div className="mt-auto h-6 w-1/2 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="flex items-center justify-center rounded-lg border border-red-100 bg-white p-8 text-center text-sm font-medium text-red-600"
        >
          {t("searchPage.loadError", { title: t(title).toLowerCase() })}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center sm:p-12">
          <p className="text-sm font-medium text-gray-500">
            {t(isPaid ? "searchPage.paidEmpty" : "searchPage.freeEmpty")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                kind={kind}
                onWatch={onWatch}
              />
            ))}
          </div>
          <SectionPagination
            page={page}
            totalPages={totalPages}
            onChange={onPageChange}
          />
        </>
      )}
    </section>
  );
}

export default function SearchPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = (searchParams.get("q") || "").trim();
  const [paidPage, setPaidPage] = useState(1);
  const [freePage, setFreePage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  useEffect(() => {
    setPaidPage(1);
    setFreePage(1);
  }, [query]);

  const paidQueryArgs = useMemo(
    () => ({
      search: query,
      status: "published",
      page: paidPage,
      limit: PAGE_SIZE,
    }),
    [query, paidPage],
  );

  const cachedPaidData = useMemo(
    () => getCachedPaidCourses(paidQueryArgs),
    [paidQueryArgs],
  );

  const paidResults = useGetAllCourseQuery(paidQueryArgs, { skip: !query });
  const freeResults = useGetFreeCoursesQuery(
    { search: query, page: freePage, limit: PAGE_SIZE },
    { skip: !query },
  );

  const handleWatch = (course) => {
    if (!isAuthenticated) {
      toast.error(t("searchPage.loginPrompt"));
      return;
    }
    setSelectedCourse(course);
  };

  const paidData = paidResults.data || cachedPaidData;
  const freeData = freeResults.data;
  const resultCount = (paidData?.total || 0) + (freeData?.total || 0);

  return (
    <main className="min-h-screen bg-[#f7faf8] px-5 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_-24px_rgba(16,37,29,0.4)] sm:mb-8 sm:p-7 lg:p-8">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eff6f1] text-[#1b704b] sm:h-12 sm:w-12">
              <FiSearch className="text-xl" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#17251d] sm:text-3xl">
                {t("searchPage.title")}
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-gray-500 sm:text-base">
                {t("searchPage.description")}
              </p>
            </div>
          </div>

          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              const value = new FormData(event.currentTarget)
                .get("q")
                ?.toString()
                .trim();
              router.push(
                value ? `/search?q=${encodeURIComponent(value)}` : "/search",
              );
            }}
          >
            <label className="sr-only" htmlFor="course-search">
              {t("common.searchCourses")}
            </label>
            <div className="relative grow">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
              <input
                key={query}
                id="course-search"
                name="q"
                defaultValue={query}
                placeholder={t("searchPage.placeholder")}
                className="w-full rounded-lg border border-gray-200 bg-[#f8faf8] py-3.5 pl-11 pr-4 text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-[#1b704b]/50 focus:bg-white focus:ring-4 focus:ring-[#1b704b]/10"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#173c2d] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#225c42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b704b] sm:min-w-32"
            >
              <FiSearch className="text-base" />
              {t("searchPage.search")}
            </button>
          </form>
        </header>

        {!query ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#eff6f1] text-[#547160]">
              <FiSearch className="text-xl" />
            </span>
            <h2 className="text-lg font-semibold text-[#17251d]">
              {t("searchPage.emptyTitle")}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              {t("searchPage.emptyDescription")}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <span className="text-gray-500">{t("searchPage.resultsFor")}</span>
              <span className="max-w-full truncate rounded-md bg-[#eff6f1] px-2.5 py-1 font-semibold text-[#276143]">
                {query}
              </span>
              {!paidResults.isLoading && !freeResults.isLoading && (
                <span className="ml-auto text-xs font-medium text-gray-500">
                  {t("searchPage.resultsCount", { count: resultCount })}
                </span>
              )}
            </div>

            <ResultsSection
              title="searchPage.paidTitle"
              description="searchPage.paidDescription"
              kind="paid"
              courses={paidData?.data || []}
              total={paidData?.total || 0}
              page={paidPage}
              totalPages={paidData?.total_pages || 1}
              isLoading={paidResults.isLoading && !cachedPaidData}
              isError={paidResults.isError && !cachedPaidData}
              onPageChange={setPaidPage}
            />
            <ResultsSection
              title="searchPage.freeTitle"
              description="searchPage.freeDescription"
              kind="free"
              courses={freeData?.data || []}
              total={freeData?.total || 0}
              page={freePage}
              totalPages={freeData?.total_pages || 1}
              isLoading={freeResults.isLoading}
              isError={freeResults.isError}
              onPageChange={setFreePage}
              onWatch={handleWatch}
            />
          </div>
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
    </main>
  );
}
