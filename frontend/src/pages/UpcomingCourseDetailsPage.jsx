import { Suspense } from "react";
import { useParams } from "@/lib/navigation";
import { useGetCourseByIdQuery } from "@/lib/features/courses/paid-course-api";
import CourseDetails from "@/components/Upcoming/CourseDetails";
import CourseDetailsSkeleton from "@/components/Upcoming/CourseDetailsSkeleton";

export default function UpcomingCourseDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetCourseByIdQuery(id, { skip: !id });

  if (isLoading) return <CourseDetailsSkeleton />;

  return (
    <Suspense fallback={<CourseDetailsSkeleton />}>
      <CourseDetails course={data} isLoading={isLoading} />
    </Suspense>
  );
}
