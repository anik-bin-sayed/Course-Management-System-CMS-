import { lazy, Suspense } from "react";
import { useParams } from "@/lib/navigation";
import Link from "@/components/common/AppLink";
import { useGetCourseByIdQuery } from "@/lib/features/courses/paid-course-api";
import CourseDetailsSkeleton from "@/components/Upcoming/CourseDetailsSkeleton";

const CourseDetails = lazy(() => import("@/components/Upcoming/CourseDetails"));

export default function UpcomingCourseDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetCourseByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) return <CourseDetailsSkeleton />;

  if (isError || !data) {
    return (
      <main className="min-h-[70vh] bg-[#f6f8f7] px-4 py-20">
        <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
            Course details
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            This course isn’t available right now
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The course may have been removed, or there was a problem loading its details.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Try again
            </button>
            <Link
              href="/upcoming-course"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#173c2d] px-5 text-sm font-semibold text-white transition hover:bg-[#24563e]"
            >
              Browse upcoming courses
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <Suspense fallback={<CourseDetailsSkeleton />}>
      <CourseDetails course={data} isLoading={isLoading} />
    </Suspense>
  );
}
