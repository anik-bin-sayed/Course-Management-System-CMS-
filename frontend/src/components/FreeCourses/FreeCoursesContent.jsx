import Loader from "../../utils/Loader";
import { useRouter } from "@/lib/navigation";
import FreeCourses from "./index";
import { useGetFreeCoursesQuery } from "../../lib/features/courses/free-course-api";

const FreeCoursesContent = ({ currentPage }) => {
  const router = useRouter();

  const { data, isLoading, isFetching } = useGetFreeCoursesQuery({
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
