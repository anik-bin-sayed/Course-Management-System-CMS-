import {
  FiEdit2,
  FiTrash2,
  FiPlayCircle,
  FiPlus,
  FiClock,
} from "react-icons/fi";
import { useState } from "react";
import { MdInfo } from "react-icons/md";
import { GoArrowLeft } from "react-icons/go";

import {
  useDeleteLessonMutation,
  useGetCourseLessonsQuery,
} from "../../../../lib/features/lesson/lessonApi";

import { useSearchParams } from "@/lib/navigation";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ListLesson = () => {
  const [deleteLessonId, setDeleteLessonId] = useState(null);

  const searchParams = useSearchParams();
  const navigate = useNavigate();

  const courseId = searchParams.get("course_id");
  const { data: lessons = [] } = useGetCourseLessonsQuery({ id: courseId });

  const [deleteLesson] = useDeleteLessonMutation();

  const handleCreateLessons = (course) => {
    navigate(
      `/admin/manage-course?tab=create-lessons&course_id=${encodeURIComponent(course.id)}`,
    );
  };

  const handleDeleteLesson = async (lessonId) => {
    window.confirm("Are you sure you want to delete this lesson?");
    setDeleteLessonId(lessonId);
    try {
      await deleteLesson({ id: lessonId }).unwrap();
    } catch (error) {
      toast.error(error?.data?.detail || "Something went wrong!");
    } finally {
      setDeleteLessonId(null);
    }
  };

  const handleEditLesson = (lesson) => {
    navigate(
      `/manage-course?tab=edit-lesson&course_id=${encodeURIComponent(
        courseId,
      )}&lesson_id=${encodeURIComponent(lesson.id)}`,
    );
  };

  const handleInformation = (lesson) => {
    navigate(
      `/admin/manage-course?tab=create-lesson-information&lesson_id=${encodeURIComponent(lesson.id)}`,
    );
  };

  const handleGetInformation = (lesson) => {
    navigate(
      `/admin/manage-course?tab=lesson-information&lesson_id=${encodeURIComponent(lesson.id)}&course_id=${encodeURIComponent(
        courseId,
      )}`,
    );
  };

  return (
    <div>
      <button
        onClick={() => window.history.back()}
        className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md active:scale-95 mb-4"
      >
        <GoArrowLeft
          size={18}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span>Back</span>
      </button>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Course Lessons
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your course lessons
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleCreateLessons({ id: courseId })}
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <FiPlus size={18} />
            Add Lesson
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  #
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Lesson
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Videos
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Duration
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="transition hover:bg-gray-50">
                  {/* Position */}
                  <td className="px-5 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-600">
                      {lesson.position + 1}
                    </span>
                  </td>

                  {/* Lesson */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleGetInformation(lesson)}
                      className="cursor-pointer flex flex-col justify-start items-start"
                    >
                      <h3 className="font-medium text-gray-800">
                        {lesson.title}
                      </h3>

                      <p className="mt-1 max-w-md truncate text-sm text-gray-500">
                        {lesson.description}
                      </p>
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiPlayCircle size={17} />

                      <span>{lesson.video_count} videos</span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiClock size={16} />
                      <span>{lesson.total_duration} </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title="Add Information"
                        onClick={() => handleInformation(lesson)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                      >
                        <MdInfo size={20} />
                      </button>

                      <button
                        type="button"
                        title="Edit lesson"
                        onClick={() => handleEditLesson(lesson)}
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete lesson"
                        disabled={deleteLessonId === lesson.id}
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="rounded-lg border border-red-100 p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        {deleteLessonId === lesson.id ? (
                          <svg
                            className="h-4 w-4 animate-spin text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.046 1.138 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : (
                          <FiTrash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">{lessons.length}</span>{" "}
            lessons
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListLesson;
