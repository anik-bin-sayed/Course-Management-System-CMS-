"use client";

import Image from "@/components/common/AppImage";
import React, { useEffect, useRef, useState } from "react";

import { useCreateFreeVideoMutation } from "../../../../lib/features/courses/free-course-api";

const initialState = {
  title: "",
  short_description: "",
  description: "",
  language: "bangla",
  video_url: "",
  duration: "",
  tags: "",
  status: "draft",
};
const CreateFreeVideos = () => {
  const [formData, setFormData] = useState(initialState);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const fileInputRef = useRef(null);

  //   redux
  const [createFreeVideo, { isLoading: creating }] =
    useCreateFreeVideoMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    setThumbnail(file);

    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const removeThumbnail = () => {
    setThumbnail(null);

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      alert("Please select a thumbnail.");
      return;
    }

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("short_description", formData.short_description);
      data.append("description", formData.description);
      data.append("language", formData.language);
      data.append("video_url", formData.video_url);
      data.append("duration", formData.duration);
      data.append("status", formData.status);

      data.append("tags", formData.tags);

      data.append("thumbnail", thumbnail);

      console.log("Form Data:", data);

      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      await createFreeVideo(data).unwrap();

      setFormData(initialState);

      setThumbnail(null);

      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      setThumbnailPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Create course error:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Free Video</h1>

        <p className="mt-2 text-sm text-gray-500">
          Create and publish a free video course for your audience.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 space-y-6"
      >
        {/* Title */}
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

        {/* Short Description */}
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

        {/* Description */}
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

        {/* Language + Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Language */}
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

          {/* Duration */}
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

        {/* Video URL */}
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

        {/* Tags */}
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

        {/* Status */}
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

        {/* Thumbnail */}
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
                  ×
                </button>
              </div>

              {/* File information */}
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-800 break-all">
                  {thumbnail.name}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {(thumbnail.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 text-left"
                >
                  Change thumbnail
                </button>

                {/* Hidden file input for change */}
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

        {/* Submit */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {creating ? "Saving..." : "Save Free Video"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFreeVideos;
