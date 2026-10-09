import { Suspense } from "react";
import { useGetProfileQuery } from "@/lib/features/auth/authApi";
import ManageCourse from "@/components/Admin/ManageCourse";
import Loader from "@/utils/Loader";

export default function ManageCoursesPage() {
  const { data, isLoading } = useGetProfileQuery();

  if (isLoading) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <ManageCourse profileData={data} />
    </Suspense>
  );
}
