"use client";

// next
import { useRouter, useSearchParams } from "@/lib/navigation";
import { toast } from "sonner";

// icons
import {
  FiBookOpen,
  FiClock,
  FiPlayCircle,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiExternalLink,
} from "react-icons/fi";
import { GoArrowLeft } from "react-icons/go";
import { MdOndemandVideo } from "react-icons/md";

// additional import
import { useGetLessonByIdQuery } from "../../../../lib/features/lesson/lessonApi";
import {
  useDeleteLessonVideoMutation,
  useGetLessonVideosQuery,
} from "../../../../lib/features/lesson/lessonVideoApi";

const LessonInformation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const lessonId = searchParams.get("lesson_id");
  const { data: lesson } = useGetLessonByIdQuery({ id: lessonId });
  const { data: videos = [] } = useGetLessonVideosQuery({ id: lessonId });
  const [deleteLessonVideo, { isLoading: isDeleting }] =
    useDeleteLessonVideoMutation();

  const openVideoForm = (videoId) => {
    const query = new URLSearchParams({
      tab: "create-lesson-information",
      lesson_id: lessonId,
    });
    if (videoId) query.set("video_id", videoId);
    router.push(`/admin/manage-course?${query.toString()}`);
  };

  const handleDeleteVideo = async (video) => {
    if (!window.confirm(`Delete "${video.title}"?`)) return;
    try {
      await deleteLessonVideo({ id: video.id }).unwrap();
      toast.success("Lesson video deleted.");
    } catch (error) {
      toast.error(error?.data?.detail || "Could not delete this video.");
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }

    return `${secs}s`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md active:scale-95 mb-4"
          >
            <GoArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back</span>
          </button>

          {/*  Header  */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                <FiBookOpen size={24} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {lesson?.title}
                  </h1>

                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    Lesson #{lesson?.id}
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {lesson?.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openVideoForm()}
              className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 text-sm font-semibold text-black transition hover:bg-yellow-500"
            >
              <FiPlus size={17} />
              Add Video
            </button>
          </div>
          {/*  Lesson Stats  */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Videos */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <MdOndemandVideo size={22} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Total Videos
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {lesson?.video_count}
                  </p>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                  <FiClock size={21} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Total Duration
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {lesson?.total_duration}
                  </p>
                </div>
              </div>
            </div>

            {/* Created */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <FiCalendar size={20} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Created</p>
                  <p className="text-sm font-bold text-gray-900">
                    {lesson?.created_at && formatDate(lesson.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Section Header */}
            <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Lesson Videos
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  Manage all videos associated with this lesson.
                </p>
              </div>

              <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </span>
            </div>

            {/* Video List */}
            <div className="divide-y divide-gray-100">
              {videos &&
                videos.map((video) => (
                  <div
                    key={video.id}
                    className="group p-5 transition hover:bg-gray-50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Position */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                        {video.position}
                      </div>

                      {/* Video Icon */}
                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 sm:flex">
                        <FiPlayCircle size={25} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {video.title}
                          </h3>
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                          {video.description}
                        </p>

                        {/* Meta */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <FiClock size={13} />
                            {formatDuration(video.duration)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar size={13} />
                            {formatDate(video.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-2">
                        <a
                          href={`/watch/${lessonId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <FiExternalLink size={14} />
                          <span className="hidden sm:inline">Watch</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => openVideoForm(video.id)}
                          aria-label={`Edit ${video.title}`}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <FiEdit2 size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(video)}
                          disabled={isDeleting}
                          aria-label={`Delete ${video.title}`}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Empty State */}
            {videos?.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <MdOndemandVideo size={28} />
                </div>

                <h3 className="font-semibold text-gray-800">No videos yet</h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add your first video to this lesson.
                </p>

                <button
                  type="button"
                  onClick={() => openVideoForm()}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500"
                >
                  <FiPlus size={16} /> Add Video
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonInformation;
