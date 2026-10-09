import { Suspense } from "react";
import { useSearchParams } from "@/lib/navigation";
import FreeCoursesContent from "@/components/FreeCourses/FreeCoursesContent";
import HeroSection from "@/components/FreeCourses/HeroSection";
import Loader from "@/utils/Loader";

export default function FreeCoursesPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <Suspense fallback={<Loader />}>
      <HeroSection />
      <FreeCoursesContent currentPage={currentPage} />
    </Suspense>
  );
}
