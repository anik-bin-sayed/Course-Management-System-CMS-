import { lazy } from "react";

const ManageCourse = lazy(() => import("../../components/Admin/ManageCourse"));

const ManageCoursesPage = () => {
  return <ManageCourse />;
};

export default ManageCoursesPage;
