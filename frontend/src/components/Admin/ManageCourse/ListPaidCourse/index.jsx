import React, { useMemo, useState } from "react";

import {
  useDeleteCourseMutation,
  useGetAllCourseQuery,
} from "../../../../lib/features/courses/paid-course-api";
import { LuBookOpen, LuPlus, LuX } from "react-icons/lu";
import AllCourseLoader from "./AllCourseLoader";
import AllCourseError from "./AllCourseError";
import Filter from "./Filter";
import { useRouter } from "@/lib/navigation";

import { toast } from "sonner";
import { useGetProfileQuery } from "../../../../lib/features/auth/authApi";
import FilterdCourseTable from "./FilterdCourseTable";

const AllCourse = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [courseType, setCourseType] = useState("all");
  const [level, setLevel] = useState("all");
  const [language, setLanguage] = useState("all");

  const { data: profileData } = useGetProfileQuery();
  const role = profileData?.role;

  const [deletingCourseId, setDeletingCourseId] = useState(null);

  // redux
  const { data, isLoading, isFetching, isError, error } = useGetAllCourseQuery({
    page: 1,
    limit: 10,
  });
  const [deleteCourse] = useDeleteCourseMutation();

  const router = useRouter();

  const courses = data?.data ?? [];

  // STATS
  const totalCourses = courses.length;

  const publishedCourses = courses.filter(
    (course) => course.status === "published",
  ).length;

  const draftCourses = courses.filter(
    (course) => course.status === "draft",
  ).length;

  const freeCourses = courses.filter(
    (course) => course.course_type === "free",
  ).length;

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        !search ||
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        course.short_description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "all" ||
        course.status?.toLowerCase() === status.toLowerCase();

      // Course Type
      const matchesCourseType =
        courseType === "all" ||
        course.course_type?.toLowerCase() === courseType.toLowerCase();

      // Level
      const matchesLevel =
        level === "all" || course.level?.toLowerCase() === level.toLowerCase();

      // Language
      const matchesLanguage =
        language === "all" ||
        course.language?.toLowerCase() === language.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourseType &&
        matchesLevel &&
        matchesLanguage
      );
    });
  }, [courses, search, status, courseType, level, language]);

  // RESET FILTER
  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setCourseType("all");
    setLevel("all");
    setLanguage("all");
  };

  const hasFilter =
    search ||
    status !== "all" ||
    courseType !== "all" ||
    level !== "all" ||
    language !== "all";

  if (isLoading) return <AllCourseLoader />;

  if (isError) return <AllCourseError />;

  const handleDeleteCourse = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone.",
    );

    if (!confirmed) return;

    setDeletingCourseId(id);

    try {
      const res = await deleteCourse(id).unwrap();
      console.log(res);
    } catch (error) {
      toast.error(error?.data?.detail || "Something went wrong");
      console.log(error);
    } finally {
      setDeletingCourseId(null);
    }
  };

  const handleCreateRoute = () => {
    router.push("/admin/manage-course?tab=create-course");
  };

  const handleEdit = (course) => {
    router.push(
      `/admin/manage-course?tab=edit-paid-course&slug=${encodeURIComponent(course.slug)}`,
    );
  };

  const handleCreateLessons = (course) => {
    router.push(
      `/admin/manage-course?tab=create-lessons&course_id=${encodeURIComponent(course.id)}`,
    );
  };

  const handleViewLessons = (course) => {
    router.push(
      `/admin/manage-course?tab=list-lessons&course_id=${encodeURIComponent(course.id)}`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and organize all your courses.
            </p>
          </div>

          <button
            type="button"
            disabled={role !== "admin"}
            className="inline-flex items-center justify-center gap-2 rounded bg-yellow-400 px-5 py-3 text-sm font-semibold text-black cursor-pointer transition hover:bg-yellow-500 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border"
            onClick={handleCreateRoute}
          >
            <LuPlus className="text-lg" />
            Create Course
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-gray-50 bg-white p-5 shadow-sm ">
            <p className="text-sm text-gray-500">Total Courses</p>

            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {totalCourses}
              </h3>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <LuBookOpen className="text-gray-600" />
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Published</p>

            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {publishedCourses}
              </h3>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                Live
              </span>
            </div>
          </div>

          {/* Draft */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Drafts</p>

            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {draftCourses}
              </h3>

              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-600">
                Draft
              </span>
            </div>
          </div>

          {/* Free */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Free Courses</p>

            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                {freeCourses}
              </h3>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                Free
              </span>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <Filter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          courseType={courseType}
          setCourseType={setCourseType}
          level={level}
          setLevel={setLevel}
          language={language}
          setLanguage={setLanguage}
          filteredCourses={filteredCourses}
          courses={courses}
          hasFilter={hasFilter}
          resetFilters={resetFilters}
        />
        {/*  FETCHING  */}

        {isFetching && !isLoading && (
          <div className="mb-4 text-sm text-gray-500">Updating courses...</div>
        )}

        {filteredCourses.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <FilterdCourseTable
              filteredCourses={filteredCourses}
              handleCreateLessons={handleCreateLessons}
              handleEdit={handleEdit}
              handleDeleteCourse={handleDeleteCourse}
              deletingCourseId={deletingCourseId}
              role={role}
              handleViewLessons={handleViewLessons}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <LuBookOpen className="text-xl text-gray-500" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No courses found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              Try changing your search or filters.
            </p>

            {hasFilter && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                <LuX />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCourse;
