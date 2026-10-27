import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
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
  if (totalPages < 2) return null;

  return (
    <nav
      className="mt-8 flex items-center justify-end gap-4"
      aria-label="Course result pages"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronLeft size={18} />
      </button>
      <span className="text-sm font-medium text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
}

// Updated CourseCard: Enhanced shadows, border radius, badge styling, and image handling
function CourseCard({ course, kind, onWatch }) {
  const isPaid = kind === "paid";

  const content = (
    <>
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 rounded-t-xl">
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
            Course image unavailable
          </div>
        )}

        {/* Modern Badge with slight backdrop blur */}
        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm ${
            isPaid ? "bg-amber-500/90" : "bg-emerald-600/90"
          }`}
        >
          {isPaid ? "Paid" : "Free"}
        </span>
      </div>

      <div className="flex grow flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium capitalize text-gray-500">
          {course.level && (
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
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

        <h3 className="line-clamp-2 text-[17px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-gray-700">
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
            className="mt-5 self-start rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-800"
          >
            Watch course
          </button>
        )}
      </div>
    </>
  );

  return isPaid ? (
    <AppLink
      href={`/upcoming-course/${course.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl"
    >
      {content}
    </AppLink>
  ) : (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
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
  const isPaid = kind === "paid";

  return (
    <section className="py-10 first:pt-4">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-widest ${
              isPaid ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {isPaid ? "Premium Learning" : "Learn for Free"}
          </p>
          <h2 className="mt-1.5 text-2xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {!isLoading && !isError && (
          <span className="shrink-0 rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600 border border-gray-100">
            {total} {total === 1 ? "course" : "courses"}
          </span>
        )}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          aria-label={`Loading ${title}`}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="flex h-[340px] animate-pulse flex-col overflow-hidden rounded-xl border border-gray-100 bg-white"
            >
              <div className="h-48 w-full bg-gray-100" />
              <div className="p-5 flex flex-col gap-3">
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
          className="flex items-center justify-center rounded-xl border border-red-100 bg-red-50 p-8 text-center text-sm font-medium text-red-600"
        >
          Could not load {title.toLowerCase()}. Please try again.
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <p className="text-sm font-medium text-gray-500">
            No matching {isPaid ? "paid" : "free"} courses found.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      toast.error("Please log in to watch this course.");
      return;
    }
    setSelectedCourse(course);
  };

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 pb-20 pt-28 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10  p-8 sm:p-10">
          <div className="max-w-3xl">
            <form
              className="mt-8 flex flex-col sm:flex-row gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                const value = new FormData(event.currentTarget)
                  .get("q")
                  .toString()
                  .trim();
                router.push(
                  value ? `/search?q=${encodeURIComponent(value)}` : "/search",
                );
              }}
            >
              <label className="sr-only" htmlFor="course-search">
                Search courses
              </label>
              <div className="relative grow">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  id="course-search"
                  name="q"
                  defaultValue={query}
                  placeholder="Try Python, UI/UX design, or marketing..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3.5 text-gray-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 font-semibold text-white transition hover:bg-gray-800 focus:ring-4 focus:ring-gray-900/20"
              >
                <span className="hidden sm:inline">Search</span>
                <FiSearch className="sm:hidden text-lg" />
              </button>
            </form>
          </div>
        </header>

        {!query ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <FiSearch className="text-2xl text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">
              Ready to learn something new?
            </p>
            <p className="mt-2 text-gray-500 max-w-md">
              Enter a topic in the search bar above to explore both our premium
              and free courses.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <ResultsSection
              title="Paid courses"
              description="Structured courses with one-time pricing and expert guidance."
              kind="paid"
              courses={(paidResults.data || cachedPaidData)?.data || []}
              total={(paidResults.data || cachedPaidData)?.total || 0}
              page={paidPage}
              totalPages={
                (paidResults.data || cachedPaidData)?.total_pages || 1
              }
              isLoading={paidResults.isLoading && !cachedPaidData}
              isError={paidResults.isError && !cachedPaidData}
              onPageChange={setPaidPage}
            />
            <ResultsSection
              title="Free courses"
              description="Start learning today with our free high-quality video courses."
              kind="free"
              courses={freeResults.data?.data || []}
              total={freeResults.data?.total || 0}
              page={freePage}
              totalPages={freeResults.data?.total_pages || 1}
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
    </main>
  );
}
