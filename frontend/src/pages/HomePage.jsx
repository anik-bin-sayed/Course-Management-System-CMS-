import Home from "@/components/Home";
import { useGetSomeFreeCourseQuery } from "@/lib/features/courses/free-course-api";

export default function HomePage() {
  const { data: someFreeCourseData, isLoading: freeCourseLoading } =
    useGetSomeFreeCourseQuery();

  return (
    <Home
      freeCourseData={someFreeCourseData}
      freeCourseLoading={freeCourseLoading}
    />
  );
}
