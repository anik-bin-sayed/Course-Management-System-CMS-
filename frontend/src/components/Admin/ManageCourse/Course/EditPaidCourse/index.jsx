import { useSearchParams } from "@/lib/navigation";
import { Suspense } from "react";
import UpdataPaidCourseForm from "./UpdataPaidCourseForm";
import { useGetCourseBySlugQuery } from "../../../../../lib/features/courses/paid-course-api";

const EditPaidCourse = () => {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const { data: courseData, isLoading } = useGetCourseBySlugQuery(slug);

  return (
    <Suspense fallback={<div>Loading</div>}>
      <UpdataPaidCourseForm courseData={courseData} />
    </Suspense>
  );
};

export default EditPaidCourse;
