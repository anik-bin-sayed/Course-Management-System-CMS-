"use client";

import Image from "@/components/common/AppImage";
import React, { useEffect, useRef, useState } from "react";
import { FiVideo } from "react-icons/fi";

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
    <div className="mx-auto w-full max-w-5xl space-y-5 px-0 py-1">
      {/* Header */}
      <div className="flex items-center gap-4 rounded-xl border border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/70 p-5 shadow-sm sm:p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#173c2d] text-xl text-[#facc15]"><FiVideo /></span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-800">Content studio</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Create Free Video</h1>
          <p className="mt-1 text-sm text-slate-600">Add a lesson video to the free learning library.</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
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
              className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/70 transition hover:border-emerald-400 hover:bg-emerald-50/40"
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-800">
                  Click to upload thumbnail
                </p>

                <p className="mt-1 text-xs text-slate-500">
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
                  className="rounded-lg border border-slate-200 object-cover"
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
                  className="mt-2 text-left text-sm font-semibold text-emerald-800 hover:text-emerald-950"
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
        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-[#facc15] px-6 py-3 font-semibold text-slate-950 shadow-sm transition hover:bg-[#e9b900] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            {creating ? "Saving..." : "Save Free Video"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFreeVideos;
