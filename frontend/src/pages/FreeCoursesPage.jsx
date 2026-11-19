import { lazy, Suspense } from "react";
import { useSearchParams } from "@/lib/navigation";
import HeroSection from "@/components/FreeCourses/HeroSection";

const FreeCoursesContent = lazy(
  () => import("../components/FreeCourses/FreeCoursesContent"),
);

const PageSkeleton = () => (
  <div className="min-h-[70vh] bg-[#f7faf8] px-5 py-10 sm:px-8 lg:px-10">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
          >
            <div className="aspect-[1.55/1] w-full animate-pulse bg-gray-100" />
            <div className="flex flex-col gap-3 p-5">
              <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-10 w-full animate-pulse rounded-lg bg-gray-100" />
            </div>
          </div>
      ))}
    </div>
  </div>
);

const FreeCoursesPage = () => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <div className="flex min-h-screen flex-col bg-[#f7faf8]">
      {/* Static Header */}
      <HeroSection />

      {/* Lazy Loaded Content with proper min-height fallback */}
      <div className="grow">
        <Suspense fallback={<PageSkeleton />}>
          <FreeCoursesContent currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
};

export default FreeCoursesPage;
