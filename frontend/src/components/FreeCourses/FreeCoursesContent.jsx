"use client";

import Loader from "../../utils/Loader";
import { useRouter } from "@/lib/navigation";
import FreeCourses from "./index";
import { useGetAllFreeCoursesQuery } from "../../lib/features/courses/free-course-api";

const FreeCoursesContent = ({ currentPage }) => {
  const router = useRouter();

  const { data, isLoading, isFetching } = useGetAllFreeCoursesQuery({
    page: currentPage,
  });

  const handlePageChange = (newPage) => {
    router.push(`/free-courses?page=${newPage}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FreeCourses
      allFreeCourse={data}
      isFetching={isFetching}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
};

export default FreeCoursesContent;
