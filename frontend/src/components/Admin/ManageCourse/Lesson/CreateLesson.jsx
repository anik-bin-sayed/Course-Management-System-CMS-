"use client";

import { useSearchParams } from "@/lib/navigation";
import { MdLibraryAdd, MdSave, MdClose } from "react-icons/md";
import { FiType, FiFileText, FiHash } from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { useState } from "react";
import { useCreateLessonMutation } from "../../../../lib/features/lesson/lessonApi";

const CreateLesson = () => {
  const searchParams = useSearchParams();

  const courseId = searchParams.get("course_id");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    position: 0,
    course_id: courseId,
  });

  const [createLesson, { isLoading }] = useCreateLessonMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLesson(formData).unwrap();
      // Reset form after successful creation
      setFormData({
        title: "",
        description: "",
        position: 0,
        course_id: courseId,
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => window.history.back()}
        className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md active:scale-95"
      >
        <GoArrowLeft
          size={18}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span>Back</span>
      </button>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
              <MdLibraryAdd size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Lesson
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Add a new lesson to your course
              </p>
            </div>
          </div>
        </div>
        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Course Information */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Course
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-800">
                  Course #{courseId}
                </p>
              </div>

              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Course ID: {courseId}
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6 p-6" onSubmit={handleSubmit}>
            {/* Lesson Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <FiType size={16} className="text-gray-500" />
                Lesson Title
                <span className="text-red-500">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Python"
                maxLength={255}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Give your lesson a clear and meaningful title.
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <FiFileText size={16} className="text-gray-500" />
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description about this lesson..."
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Briefly describe what students will learn in this lesson.
              </p>
            </div>

            {/* Position */}
            <div>
              <label
                htmlFor="position"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <FiHash size={16} className="text-gray-500" />
                Lesson Position
              </label>

              <input
                id="position"
                name="position"
                type="number"
                min="0"
                value={formData.position}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-50 sm:w-40"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Determines the order of this lesson in the course.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-5">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {/* Create */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 text-sm font-semibold text-black shadow-sm transition hover:bg-yellow-500 active:scale-[0.98] *:disabled:cursor-not-allowed *:disabled:bg-gray-200 *:disabled:text-gray-400"
                >
                  <MdSave size={19} />
                  {isLoading ? "Creating..." : "Create Lesson"}
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Bottom Note */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3">
          <MdLibraryAdd className="mt-0.5 shrink-0 text-yellow-500" size={18} />

          <p className="text-xs leading-5 text-yellow-700">
            After creating the lesson, you can add videos to it from the lesson
            management section.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
