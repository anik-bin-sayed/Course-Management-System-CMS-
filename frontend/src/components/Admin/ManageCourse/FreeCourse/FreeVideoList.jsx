import React, { useState } from "react";

import Link from "@/components/common/AppLink";
import Image from "@/components/common/AppImage";
import { useRouter } from "@/lib/navigation";

import VideoModal from "../../../Home/VideoModal";

import {
  useDeleteFreeCourseMutation,
  useGetFreeCoursesQuery,
} from "../../../../lib/features/courses/free-course-api";
import FreeCourseListLoader from "./FreeCourseListLoader";

const FreeVideoList = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const router = useRouter();

  // redux
  const {
    data: freeCoursesData,
    isLoading: isFreeCoursesLoading,
    refetch,
  } = useGetFreeCoursesQuery();
  const [deleteFreeCourse] = useDeleteFreeCourseMutation();

  if (isFreeCoursesLoading) {
    return <FreeCourseListLoader />;
  }

  const handleEdit = (course) => {
    router.push(
      `/manage-course?tab=edit-course&slug=${encodeURIComponent(course.slug)}`,
    );
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteFreeCourse(id).unwrap();
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
    console.log(id);
  };

  return (
    <div className="px-4 py-12">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-gray-900">Free Video Courses</h1>

        <p className="mt-3 text-gray-600">
          Learn from industry experts – all content is completely free to watch.
        </p>
      </div>

      {/* Course Grid */}
      <div className="mx-auto max-w-7xl overflow-x-auto rounded-xl border border-yellow-100 bg-white shadow-sm">
        <table className="w-full min-w-[950px]">
          {/* Header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Course
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Duration
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Language
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {freeCoursesData?.data?.map((course) => (
              <tr
                key={course.id}
                className="transition-colors duration-200 hover:bg-yellow-50/50"
              >
                {/* Course */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="max-w-md">
                      <h2 className="line-clamp-1 font-semibold text-gray-900">
                        {course.title}
                      </h2>

                      <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                        {course.description ||
                          course.short_description ||
                          "No description available"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Duration */}
                <td className="px-4 py-4">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <span>⏱</span>
                    {course.duration || "N/A"}
                  </span>
                </td>

                {/* Language */}
                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {course.language}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Watch */}
                    <button
                      type="button"
                      onClick={() => setSelectedCourse(course)}
                      className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-yellow-500 active:scale-95"
                    >
                      Watch
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleEdit(course)}
                      className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 active:scale-95"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      disabled={deletingId === course.id}
                      onClick={() => handleDelete(course.id)}
                      className="min-w-21.25 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === course.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCourse && (
        <VideoModal
          videoUrl={selectedCourse.video_url}
          title={selectedCourse.title}
          onClose={() => setSelectedCourse(null)}
        />
      )}
      <div className="text-center text-lg text-gray-900 mt-8">
        {freeCoursesData && freeCoursesData.length > 7 && (
          <Link
            href="/free-courses"
            className="py-2 px-4 rounded bg-yellow-400 text-black text-sm font-medium hover:bg-yellow-500 transition-colors duration-200"
          >
            View All Free Courses
          </Link>
        )}
      </div>
    </div>
  );
};

export default FreeVideoList;
