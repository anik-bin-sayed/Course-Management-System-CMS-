import Hero from "./Hero";
import FreeCourses from "./FreeCourses";
import UpcomingCourse from "./UpcomingCourse";
import { useGetFreeCoursesQuery } from "../../lib/features/courses/free-course-api";

const Home = () => {
  const { data: freeCourseData, isLoading: freeCourseLoading } =
    useGetFreeCoursesQuery({
      page: 1,
      limit: 8,
    });

  const data = freeCourseData?.data || [];
  return (
    <>
      <Hero />
      <UpcomingCourse />
      <FreeCourses data={data} loading={freeCourseLoading} />
    </>
  );
};

export default Home;
