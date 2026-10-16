import { lazy } from "react";
import { useSearchParams } from "@/lib/navigation";

const FreeVideoList = lazy(() => import("./FreeCourse/FreeVideoList"));
const CreateFreeVideos = lazy(() => import("./FreeCourse/CreateFreeVideos"));
const CreateCourse = lazy(() => import("./Course/CreateCourse"));
const EditCourse = lazy(() => import("./Course/EditCourse"));
const EditPaidCourse = lazy(() => import("./Course/EditPaidCourse"));
const CategoryList = lazy(() => import("./category/CategoryList"));
const CreateLesson = lazy(() => import("./Lesson/CreateLesson"));
const ListLesson = lazy(() => import("./Lesson/ListLesson"));
const EditLesson = lazy(() => import("./Lesson/EditLesson"));
const AddLessonInfo = lazy(() => import("./Lesson/AddLessonInfo"));
const LessonInformation = lazy(() => import("./Lesson/LessonInformation"));
const AllCourse = lazy(() => import("./ListPaidCourse"));

const ManageCourse = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "all-courses";

  const renderContent = () => {
    switch (activeTab) {
      case "all-courses":
        return <AllCourse />;

      case "all-free-videos":
        return <FreeVideoList />;

      case "create-free-video":
        return <CreateFreeVideos />;
      case "create-course":
        return <CreateCourse />;

      case "edit-course":
        return <EditCourse />;

      case "edit-paid-course":
        return <EditPaidCourse />;

      case "category-list":
        return <CategoryList />;

      case "create-lessons":
        return <CreateLesson />;

      case "list-lessons":
        return <ListLesson />;

      case "edit-lesson":
        return <EditLesson />;

      case "create-lesson-information":
        return <AddLessonInfo />;

      case "lesson-information":
        return <LessonInformation />;

      // case "lesson-information":
      //   return <LessonInformation />;

      default:
        return <div className="p-6">Select an option</div>;
    }
  };

  return renderContent();
};

export default ManageCourse;
