import React, { useState } from "react";

import Link from "@/components/common/AppLink";
import Image from "@/components/common/AppImage";
import { useRouter } from "@/lib/navigation";

import VideoModal from "../../../Home/VideoModal";
import { FiVideo, FiPlus } from "react-icons/fi";

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
  const freeVideos = freeCoursesData?.data ?? [];

  if (isFreeCoursesLoading) {
    return <FreeCourseListLoader />;
  }

  const handleEdit = (course) => {
    router.push(
      `/admin/manage-course?tab=edit-course&slug=${encodeURIComponent(course.slug)}`,
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
    <div className="w-full px-0 py-1">
      {/* Header */}
      <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-4 rounded-xl border border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/70 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#173c2d] text-xl text-[#facc15]"><FiVideo /></span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-800">Free learning library</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Free Video Courses</h1>
            <p className="mt-1 text-sm text-slate-600">Manage the free video content available to every learner.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <span className="rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm font-semibold text-emerald-900">{freeVideos.length} videos</span>
          <Link href="/admin/manage-course?tab=create-free-video" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#facc15] px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-[#e9b900]"><FiPlus size={16} /> Add video</Link>
        </div>
      </div>

      {/* Course Grid */}
      <div className="mx-auto max-w-7xl overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-237.5">
          {/* Header */}
          <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
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
              {freeVideos.length ? freeVideos.map((course) => (
              <tr
                key={course.id}
                className="transition-colors duration-200 hover:bg-emerald-50/40"
              >
                {/* Course */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
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
                  <span className="inline-flex rounded-md bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-900">
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
                      className="rounded-lg bg-[#facc15] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[#e9b900] active:scale-95"
                    >
                      Watch
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleEdit(course)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 active:scale-95"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      disabled={deletingId === course.id}
                      onClick={() => handleDelete(course.id)}
                      className="min-w-21.25 rounded-lg border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === course.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="4" className="px-6 py-16 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-800"><FiVideo /></span><p className="mt-4 font-semibold text-slate-800">No free videos yet</p><p className="mt-1 text-sm text-slate-500">Create a free video course to get started.</p></td></tr>}
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
      <div className="mt-6 text-center text-lg text-gray-900">
        {freeVideos.length > 7 && (
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
