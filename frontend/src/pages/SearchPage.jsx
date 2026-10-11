import { useEffect, useState } from "react";
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
import VideoModal from "@/components/Home/VideoModal";
import { useSearchParams, useRouter } from "@/lib/navigation";
import { useGetAllCourseQuery } from "@/lib/features/courses/paid-course-api";
import { useGetAllFreeCoursesQuery } from "@/lib/features/courses/free-course-api";

const PAGE_SIZE = 8;

function SectionPagination({ page, totalPages, onChange }) {
  if (totalPages < 2) return null;

  return (
    <nav
      className="mt-6 flex items-center justify-end gap-3"
      aria-label="Course result pages"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="rounded border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronLeft />
      </button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="rounded border border-gray-300 p-2 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronRight />
      </button>
    </nav>
  );
}

function CourseCard({ course, kind, onWatch }) {
  const isPaid = kind === "paid";
  const content = (
    <>
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {course.thumbnail ? (
          <AppImage
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Course image unavailable
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded px-2.5 py-1 text-xs font-semibold uppercase text-white ${
            isPaid ? "bg-amber-600" : "bg-emerald-700"
          }`}
        >
          {isPaid ? "Paid" : "Free"}
        </span>
      </div>
      <div className="flex grow flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-xs capitalize text-gray-500">
          {course.level && <span>{course.level}</span>}
          {course.language && <span>{course.language}</span>}
          {course.duration && (
            <span className="ml-auto inline-flex items-center gap-1">
              <FiClock aria-hidden="true" /> {course.duration}
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 text-base font-semibold text-gray-900">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-3 grow text-sm leading-5 text-gray-600">
          {course.short_description || course.description}
        </p>
        {isPaid ? (
          <div className="mt-4 flex items-baseline gap-2">
            {course.discount_price ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ৳{Number(course.discount_price).toLocaleString("en-BD")}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ৳{Number(course.price).toLocaleString("en-BD")}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
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
            className="mt-4 self-start text-sm font-semibold text-emerald-800 hover:text-emerald-950"
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
      className="group flex h-full flex-col overflow-hidden rounded border border-gray-200 bg-white transition hover:border-amber-300 hover:shadow-md"
    >
      {content}
    </AppLink>
  ) : (
    <article className="group flex h-full flex-col overflow-hidden rounded border border-gray-200 bg-white transition hover:border-emerald-300 hover:shadow-md">
      {content}
    </article>
  );
}

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
    <section className="border-t border-gray-200 py-8 first:border-t-0 first:pt-0">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-wide ${isPaid ? "text-amber-700" : "text-emerald-800"}`}
          >
            {isPaid ? "Premium learning" : "Learn for free"}
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {!isLoading && !isError && (
          <span className="shrink-0 text-sm text-gray-500">
            {total} {total === 1 ? "course" : "courses"}
          </span>
        )}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          aria-label={`Loading ${title}`}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      ) : isError ? (
        <p
          role="alert"
          className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          Could not load {title.toLowerCase()}. Please try again.
        </p>
      ) : courses.length === 0 ? (
        <p className="rounded border border-dashed border-gray-300 p-6 text-sm text-gray-500">
          No matching {isPaid ? "paid" : "free"} courses.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

  const paidResults = useGetAllCourseQuery(
    { search: query, status: "published", page: paidPage, limit: PAGE_SIZE },
    { skip: !query },
  );
  const freeResults = useGetAllFreeCoursesQuery(
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
    <main className="min-h-screen bg-white px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-gray-200 pb-7">
          <p className="text-sm font-semibold uppercase text-amber-700">
            Course library
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950">
            Search courses
          </h1>
          {query ? (
            <p className="mt-2 text-gray-600">
              Results for{" "}
              <span className="font-semibold text-gray-900">“{query}”</span>
            </p>
          ) : (
            <p className="mt-2 text-gray-600">
              Search by course title, description, or topic.
            </p>
          )}
          <form
            className="mt-5 flex max-w-2xl gap-2"
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
            <input
              id="course-search"
              name="q"
              defaultValue={query}
              placeholder="Try Python, design, or marketing"
              className="min-w-0 grow rounded border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
            <button
              type="submit"
              aria-label="Search courses"
              className="inline-flex items-center gap-2 rounded bg-gray-950 px-4 py-3 font-semibold text-white hover:bg-gray-800"
            >
              <FiSearch aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </header>

        {!query ? (
          <div className="rounded border border-dashed border-gray-300 p-10 text-center text-gray-500">
            Enter a topic above to search paid and free courses.
          </div>
        ) : (
          <>
            <ResultsSection
              title="Paid courses"
              description="Structured courses with one-time pricing."
              kind="paid"
              courses={paidResults.data?.data || []}
              total={paidResults.data?.total || 0}
              page={paidPage}
              totalPages={paidResults.data?.total_pages || 1}
              isLoading={paidResults.isLoading}
              isError={paidResults.isError}
              onPageChange={setPaidPage}
            />
            <ResultsSection
              title="Free courses"
              description="Start learning with free video courses."
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
          </>
        )}
      </div>
      {selectedCourse && (
        <VideoModal
          videoUrl={selectedCourse.video_url}
          title={selectedCourse.title}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </main>
  );
}
