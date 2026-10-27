import React, { useState, useEffect, useRef } from "react";
import Image from "@/components/common/AppImage";
import { useRouter } from "@/lib/navigation";
import { IoMdClose } from "react-icons/io";
import { useUpdateFreeCourseMutation } from "../../../../../lib/features/courses/free-course-api";

const initialState = {
  title: "",
  short_description: "",
  description: "",
  language: "bangla",
  duration: "",
  video_url: "",
  tags: "",
  status: "draft",
  thumbnail: "",
};

const EditCourseForm = ({ editData }) => {
  const [formData, setFormData] = useState(initialState);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const fileInputRef = useRef(null);
  const router = useRouter();

  const [updateFreeCourse, { isLoading: isSubmitting }] =
    useUpdateFreeCourseMutation();

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        short_description: editData.short_description || "",
        description: editData.description || "",
        language: editData.language || "bangla",
        duration: editData.duration || "",
        video_url: editData.video_url || "",
        tags: editData.tags || "",
        status: editData.status || "draft",
        thumbnail: editData.thumbnail || "",
      });
      if (editData.thumbnail) {
        setThumbnailPreview(editData.thumbnail);
      }
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(editData.thumbnail || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "thumbnail" &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        data.append(key, value);
      }
    });

    if (thumbnailFile) {
      data.append("thumbnail", thumbnailFile);
    }

    // for (const [key, value] of data.entries()) {
    //   if (value instanceof File) {
    //     console.log(key, {
    //       name: value.name,
    //       type: value.type,
    //       size: value.size,
    //     });
    //   } else {
    //   }
    // }

    try {
      await updateFreeCourse({
        id: editData?.id,
        data,
      }).unwrap();
      router.back();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Free Video</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update your video course details.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter video title"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div>
          <label
            htmlFor="short_description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Short Description
          </label>
          <input
            id="short_description"
            name="short_description"
            type="text"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="Enter a brief description"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a detailed description..."
            rows={5}
            required
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            >
              <option value="bangla">Bangla</option>
              <option value="english">English</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Duration
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Example: 10m 30s"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="video_url"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            YouTube Video URL
          </label>
          <input
            id="video_url"
            name="video_url"
            type="url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            placeholder="JavaScript, Programming, Web Development"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          />
          <p className="mt-1 text-xs text-gray-400">
            Separate tags with commas.
          </p>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <p className="mt-1 text-xs text-gray-400">
            Draft courses won't be publicly visible.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Thumbnail
          </label>

          {!thumbnailPreview ? (
            <label
              htmlFor="thumbnail"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Click to upload thumbnail
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, JPEG or WEBP
                </p>
              </div>
              <input
                ref={fileInputRef}
                id="thumbnail"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="relative w-40 h-24">
                <Image
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover rounded-lg border border-gray-200"
                  sizes="160px"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  aria-label="Remove thumbnail"
                  className="absolute -top-2 -right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition cursor-pointer"
                >
                  <IoMdClose />
                </button>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-800 break-all">
                  {thumbnailFile ? thumbnailFile.name : "Existing thumbnail"}
                </p>
                {thumbnailFile && (
                  <p className="text-xs text-gray-400 mt-1">
                    {(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 text-left"
                >
                  Change thumbnail
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg px-6 py-3 font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {isSubmitting ? "Updating..." : "Update Free Video"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourseForm;
