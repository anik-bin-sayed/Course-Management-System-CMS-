"use client";

import { useEffect, useState } from "react";
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
import { useRouter, useSearchParams } from "@/lib/navigation";
import {
  useCreateLessonVideoMutation,
  useGetLessonVideoByIdQuery,
  useUpdateLessonVideoMutation,
} from "../../../../lib/features/lesson/lessonVideoApi";
import { getYoutubeVideoId } from "@/lib/youtube";
import { toast } from "sonner";

const AddLessonInfo = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = searchParams.get("lesson_id");
  const videoId = searchParams.get("video_id");
  const isEditing = Boolean(videoId);
  const { data: existingVideo, isLoading: isLoadingVideo } =
    useGetLessonVideoByIdQuery({ id: videoId }, { skip: !videoId });
  const [videoUrlError, setVideoUrlError] = useState("");

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
  const [updateLessonVideo, { isLoading: updating }] =
    useUpdateLessonVideoMutation();
  const isSaving = creating || updating;

  useEffect(() => {
    if (!existingVideo) return;
    setFormData({
      title: existingVideo.title,
      description: existingVideo.description || "",
      video_url: existingVideo.video_url,
      duration: String(existingVideo.duration),
      position: existingVideo.position,
      lesson_id: existingVideo.lesson_id,
    });
  }, [existingVideo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "video_url") setVideoUrlError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!getYoutubeVideoId(formData.video_url)) {
      setVideoUrlError("Enter a valid YouTube video, Shorts, or share URL.");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        video_url: formData.video_url,
        duration: Number(formData.duration),
        position: Number(formData.position),
      };

      if (isEditing) {
        await updateLessonVideo({ id: videoId, ...payload }).unwrap();
        toast.success("Lesson video updated.");
      } else {
        await createLessonVideo({ ...payload, lesson_id: Number(lessonId) }).unwrap();
        toast.success("Lesson video added.");
        setFormData((previous) => ({
          ...previous,
          title: "",
          description: "",
          video_url: "",
          duration: "",
          position: Number(previous.position) + 1,
        }));
      }
      router.back();
    } catch (error) {
      toast.error(
        typeof error?.data?.detail === "string"
          ? error.data.detail
          : "Could not save this YouTube video.",
      );
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
                {isEditing ? "Edit Lesson Video" : "Add Lesson Video"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {isEditing ? "Update the video details" : "Add a YouTube video to this lesson"}
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
                disabled={isSaving}
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
                disabled={isSaving}
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
                YouTube Video URL
              </label>

              <input
                id="video_url"
                name="video_url"
                type="text"
                value={formData.video_url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                disabled={isSaving}
                aria-invalid={Boolean(videoUrlError)}
                aria-describedby="youtube-url-help youtube-url-error"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-4 focus:ring-yellow-100 disabled:cursor-not-allowed"
              />

              <p id="youtube-url-help" className="mt-2 text-xs text-gray-500">
                Supported: youtube.com/watch, youtu.be, /embed/, and /shorts/ URLs.
              </p>
              {videoUrlError && <p id="youtube-url-error" className="mt-1 text-sm text-red-600" role="alert">{videoUrlError}</p>}
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
                  required
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
              disabled={isSaving || isLoadingVideo}
              className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-semibold text-black shadow-sm transition-all duration-200 hover:bg-yellow-500 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
            >
              {creating ? (
                <FiLoader className="animate-spin" size={18} />
              ) : (
                <FiSave size={18} />
              )}
              {isLoadingVideo ? "Loading video..." : isSaving ? "Saving..." : isEditing ? "Update Video" : "Save Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonInfo;
