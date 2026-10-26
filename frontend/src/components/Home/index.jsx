import { useState } from "react";
import Hero from "./Hero";
import UpcomingCourse from "./UpcomingCourse";
import FreeCourses from "./FreeCourses";
import {
  getCachedHomepageFreeCourses,
  useGetFreeCoursesQuery,
} from "../../lib/features/courses/free-course-api";
import { useGetUpcomingCourseQuery } from "../../lib/features/courses/paid-course-api";
import BusinessAddSection from "./BussinessAddSection";
import CourseContents from "./CourseContents";
import LearnerReviews from "./LearnerReviews";

const Home = () => {
  const [cachedFreeCourseData] = useState(getCachedHomepageFreeCourses);
  const { data: freeCourseData, isLoading: freeCourseLoading } =
    useGetFreeCoursesQuery({
      page: 1,
      limit: 8,
    });

  const {
    data: upcomingCourseData,
    isLoading: upcomingCourseLoading,
    isError: upcomingCourseError,
  } = useGetUpcomingCourseQuery();

  const data = freeCourseData?.data || cachedFreeCourseData?.data || [];

  return (
    <>
      <Hero />

      <UpcomingCourse
        data={upcomingCourseData}
        loading={upcomingCourseLoading}
        isError={upcomingCourseError}
      />
      <FreeCourses
        data={data}
        loading={freeCourseLoading && !cachedFreeCourseData}
      />

      <BusinessAddSection />
      <CourseContents />
      <LearnerReviews />
    </>
  );
};

export default Home;
