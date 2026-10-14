import { lazy, Suspense } from "react";
import { useSearchParams } from "@/lib/navigation";
import HeroSection from "@/components/FreeCourses/HeroSection";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";

const FreeCoursesContent = lazy(() =>
  import("@/components/FreeCourses/FreeCoursesContent"),
);

export default function FreeCoursesPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <Suspense
      fallback={<LoadingFallback label="Loading courses..." variant="inline" />}
    >
      <HeroSection />
      <FreeCoursesContent currentPage={currentPage} />
    </Suspense>
  );
}
