import React, { useEffect, useState } from "react";

import { useUpdateCategoryMutation } from "../../../../../lib/features/category/category-api";

const initialState = {
  name: "",
  description: "",
};
const UpdateCategoryModal = ({ onClose, setCategoryData, categoryData }) => {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");

  //   redux
  const [updateCategory, { isLoading, isError }] = useUpdateCategoryMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    onClose();
    setCategoryData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await updateCategory({
        id: categoryData?.id,
        data: formData,
      }).unwrap();
      //   console.log(res);
    } catch (error) {
      //   console.log(error?.data?.detail || "Something wrong");
      setError(error?.data?.detail || "Something wrong");
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    setFormData({
      name: categoryData?.name || "",
      description: categoryData?.description || "",
    });
  }, [categoryData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-white to-emerald-50/70 px-6 py-5">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-800">Course organization</p><h2 className="mt-1 text-lg font-bold text-slate-900">Edit category</h2></div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter category title"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              rows={4}
              placeholder="Enter category description"
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {error && <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-[#facc15] px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-[#e9b900] disabled:opacity-60"
            >
              {isLoading ? "Updating" : " update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategoryModal;
