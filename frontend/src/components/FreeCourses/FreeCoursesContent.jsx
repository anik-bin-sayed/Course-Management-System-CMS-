import { useRouter } from "@/lib/navigation";
import FreeCourses from "./index";
import { useGetFreeCoursesQuery } from "../../lib/features/courses/free-course-api";

const FreeCoursesContent = ({ currentPage }) => {
  const router = useRouter();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetFreeCoursesQuery({ page: currentPage });

  const handlePageChange = (newPage) => {
    router.push(`/free-courses?page=${newPage}`);
  };

  return (
    <div className="w-full min-h-150">
      <FreeCourses
        allFreeCourse={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default FreeCoursesContent;
