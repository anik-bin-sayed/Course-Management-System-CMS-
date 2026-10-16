import { lazy, Suspense } from "react";
import { useSearchParams } from "@/lib/navigation";
import HeroSection from "@/components/FreeCourses/HeroSection";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";

const FreeCoursesContent = lazy(
  () => import("@/components/FreeCourses/FreeCoursesContent"),
);

const FreeCoursesPage = () => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <>
      <HeroSection />
      <FreeCoursesContent currentPage={currentPage} />
    </>
  );
};

export default FreeCoursesPage;
