import { lazy, Suspense } from "react";
import { useGetProfileQuery } from "@/lib/features/auth/authApi";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";
import Loader from "@/utils/Loader";

const ManageCourse = lazy(() => import("@/components/Admin/ManageCourse"));

export default function ManageCoursesPage() {
  const { data, isLoading } = useGetProfileQuery();

  if (isLoading) return <Loader />;

  return (
    <Suspense
      fallback={
        <LoadingFallback label="Loading course manager..." variant="inline" />
      }
    >
      <ManageCourse profileData={data} />
    </Suspense>
  );
}
