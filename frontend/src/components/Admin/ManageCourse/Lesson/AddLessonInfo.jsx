"use client";

import React, { useState } from "react";
import {
  FiVideo,
  FiFileText,
  FiLink,
  FiClock,
  FiList,
  FiSave,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";
// import { useCreateLessonVideoMutation } from ".././../../lib/features/lesson/lessonVideoApi";
import { useSearchParams } from "@/lib/navigation";
import { useCreateLessonVideoMutation } from "../../../../lib/features/lesson/lessonVideoApi";
import { toast } from "sonner";



const AddLessonInfo = () => {
  const searchParams = useSearchParams();

  const lessonId = searchParams.get("lesson_id");


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    duration: "",
    position: 0,
    lesson_id: lessonId,
  });

  const [createLessonVideo, { isLoading: creating }] =
    useCreateLessonVideoMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createLessonVideo(formData).unwrap();
      setFormData({
        title: "",
        description: "",
        video_url: "",
        duration: "",
        position: 0,
        lesson_id: lessonId,
      });
    } catch (error) {
      toast.error(error?.data?.detail || "Something broke to add Data");
      console.log(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group mb-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-200 hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600 hover:shadow-md active:scale-95"
          >
            <FiArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
              <FiVideo size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Add Lesson Video
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Add a new video to this lesson
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <FiVideo className="text-yellow-500" />
                Video Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter video title"
                required
                disabled={creating}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <FiFileText className="text-yellow-500" />
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                disabled={creating}
                placeholder="Write a short description about this video..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Video URL */}
            <div>
              <label
                htmlFor="video_url"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <FiLink className="text-yellow-500" />
                Video URL
              </label>

              <input
                id="video_url"
                name="video_url"
                type="url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder="https://example.com/video.mp4"
                required
                disabled={creating}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed"
              />

              <p className="mt-2 text-xs text-gray-400">
                You can use a direct video URL or your Cloudinary video URL.
              </p>
            </div>

            {/* Duration + Position */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <FiClock className="text-yellow-500" />
                  Duration
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                    disabled={creating}
                  placeholder="Duration in seconds"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Example: 600 = 10 minutes
                </p>
              </div>

              {/* Position */}
              <div>
                <label
                  htmlFor="position"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <FiList className="text-yellow-500" />
                  Video Position
                </label>

                <input
                  id="position"
                  name="position"
                  type="number"
                  min="0"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={creating}
                  placeholder="Enter position"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Determines the video order inside the lesson.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black shadow-sm transition-all duration-200 hover:bg-yellow-500 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
            >
              {creating ? (
                <FiLoader className="animate-spin" size={18} />
              ) : (
                <FiSave size={18} />
              )}
              Save Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonInfo;
