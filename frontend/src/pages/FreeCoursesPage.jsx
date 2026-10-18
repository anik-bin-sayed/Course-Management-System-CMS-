import { lazy, Suspense } from "react";
import { useSearchParams } from "@/lib/navigation";
import HeroSection from "@/components/FreeCourses/HeroSection";

const FreeCoursesContent = lazy(
  () => import("../components/FreeCourses/FreeCoursesContent"),
);

const PageSkeleton = () => (
  <div className="min-h-[70vh] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 flex items-start justify-center">
    <div className="border max-w-6xl w-full shadow p-10 rounded-md border-gray-200 bg-white animate-pulse">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-16 w-16 bg-gray-300 rounded-2xl"></div>
        <div className="flex flex-col gap-2 w-1/2">
          <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-64 bg-gray-300 rounded-md"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white"
          >
            <div className="h-48 w-full bg-gray-300"></div>
            <div className="p-5 flex flex-col gap-3">
              <div className="h-6 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FreeCoursesPage = () => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Static Header */}
      <HeroSection />

      <div className="grow">
        <Suspense fallback={<PageSkeleton />}>
          <FreeCoursesContent currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
};

export default FreeCoursesPage;
