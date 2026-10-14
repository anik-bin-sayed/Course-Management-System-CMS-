"use client";

import { lazy, Suspense, useState } from "react";
import Image from "@/components/common/AppImage";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";

import { TbCurrencyTaka } from "react-icons/tb";
import { LuGalleryThumbnails } from "react-icons/lu";

import { useGetAllCategoryQuery } from "../../../../../lib/features/category/category-api";
import {
  useCreateCourseMutation,
  useGetAssignableInstructorsQuery,
} from "../../../../../lib/features/courses/paid-course-api";
import InstructorMultiSelect from "../InstructorMultiSelect";

const CreateCategoryModal = lazy(
  () => import("../../category/CategoryModal/CreateCategory"),
);

const initialState = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  price: "",
  discount_price: "",
  discount_percentage: "",
  level: "beginner",
  language: "bangla",
  course_type: "paid",
  status: "published",
  category_id: "",
  start_date: "",
  end_date: "",
  thumbnail: null,
};

const CreateCourse = () => {
  const [formData, setFormData] = useState(initialState);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [instructorIds, setInstructorIds] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const { data: categories, isLoading } = useGetAllCategoryQuery();
  const {
    data: instructors = [],
    isLoading: loadingInstructors,
    isError: instructorsError,
  } = useGetAssignableInstructorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      if (name === "price" || name === "discount_percentage") {
        const price = Number(name === "price" ? value : prev.price);

        const discountPercentage = Number(
          name === "discount_percentage" ? value : prev.discount_percentage,
        );

        if (price > 0 && discountPercentage > 0) {
          const discountAmount = (price * discountPercentage) / 100;

          const discountPrice = price - discountAmount;

          updatedData.discount_price = discountPrice.toFixed(2);
        } else {
          updatedData.discount_price = "";
        }
      }

      return updatedData;
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      thumbnail: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        data.append(key, value);
      }
    });
    instructorIds.forEach((id) => data.append("instructor_ids", id));

    try {
      await createCourse(data).unwrap();
      setFormData(initialState);
      setInstructorIds([]);
      setSubmitSuccess("Course created successfully.");
    } catch (error) {
      setSubmitError(
        error?.data?.detail || "Unable to create the course. Please try again.",
      );
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Course
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create and configure your course information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* Header */}
              <div className="mb-7">
                <h2 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the basic information about your course.
                </p>
              </div>

              <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
                {/* Course Title */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="course-title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Course Title
                  </label>

                  <input
                    id="course-title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Complete Python Programming"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Choose a clear and descriptive title for your course.
                  </p>
                </div>

                {/* Category */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      + Create Category
                    </button>
                  </div>

                  <select
                    id="category"
                    name="category_id"
                    value={formData.category_id}
                    required
                    onChange={handleChange}
                    className="w-full cursor-pointer rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  >
                    <option value="">Select category</option>

                    {categories?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <p className="mt-1.5 text-xs text-gray-400">
                    Select the category that best matches your course.
                  </p>
                </div>

                {/* Short Description */}
                <div>
                  <label
                    htmlFor="short-description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Short Description
                  </label>

                  <textarea
                    id="short-description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write a short description of your course..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Keep it short and engaging.
                  </p>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="course-description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Course Description
                  </label>

                  <textarea
                    id="course-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={7}
                    placeholder="Write the full course description..."
                    className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    Provide detailed information about what students will learn.
                  </p>
                </div>
              </div>
            </div>

            {/* Course Settings */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Course Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure course level, language and type.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {/* Level */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Level
                  </label>

                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Language
                  </label>

                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  >
                    <option value="bangla">Bangla</option>
                    <option value="english">English</option>
                  </select>
                </div>

                {/* Course Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course Type
                  </label>

                  <select
                    name="course_type"
                    value={formData.course_type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Set the price for your course.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      <TbCurrencyTaka />
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="1500"
                      min="0"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount Percentage
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      %
                    </span>

                    <input
                      type="number"
                      name="discount_percentage"
                      value={formData.discount_percentage}
                      onChange={handleChange}
                      placeholder="20"
                      min="0"
                      max="100"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>
                </div>

                {/* Discount Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      <TbCurrencyTaka />
                    </span>

                    <input
                      type="number"
                      name="discount_price"
                      value={formData.discount_price}
                      placeholder="1200"
                      disabled
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-9 pr-4 text-sm outline-none disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Course Schedule
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Set when the course will start and end.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>

                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Date
                  </label>

                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <InstructorMultiSelect
                instructors={instructors}
                selectedIds={instructorIds}
                onChange={setInstructorIds}
                isLoading={loadingInstructors}
                isError={instructorsError}
              />
            </div>

            {/* Thumbnail */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Course Thumbnail
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload an attractive thumbnail for your course.
                </p>
              </div>

              <label
                htmlFor="thumbnail"
                className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 text-center transition hover:border-gray-500"
              >
                {formData.thumbnail ? (
                  <div className="relative w-full">
                    <Image
                      src={URL.createObjectURL(formData.thumbnail)}
                      alt="Course thumbnail preview"
                      className="h-64 w-full object-cover"
                      width={50}
                      height={50}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <div className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800">
                        Change Thumbnail
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-12 flex flex-col items-center justify-center ">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <LuGalleryThumbnails className="text-xl text-gray-500" />
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      Click to upload thumbnail
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG or WEBP
                    </p>
                  </div>
                )}

                <input
                  id="thumbnail"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-8">
              {(submitError || submitSuccess) && (
                <p
                  className={`mr-auto text-sm ${submitError ? "text-red-600" : "text-green-700"}`}
                  role={submitError ? "alert" : "status"}
                >
                  {submitError || submitSuccess}
                </p>
              )}
              <button
                type="submit"
                disabled={creating}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-yellow-200 disabled:opacity-70"
              >
                {creating ? (
                  <>
                    <span
                      className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black"
                      aria-hidden="true"
                    />

                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isCategoryModalOpen && (
        <Suspense
          fallback={
            <LoadingFallback label="Loading dialog..." variant="modal" />
          }
        >
          <CreateCategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default CreateCourse;
