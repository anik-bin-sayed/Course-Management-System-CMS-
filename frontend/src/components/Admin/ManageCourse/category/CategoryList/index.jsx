import { lazy, Suspense, useState } from "react";

import { toast } from "sonner";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";

import { CiStickyNote } from "react-icons/ci";

import {
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} from "../../../../../lib/features/category/category-api";

const UpdateCategoryModal = lazy(() => import("../UpdateCategoryModal"));

const CategoryList = () => {
  const [deleteCatId, setDeleteCatId] = useState(null);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [categoryData, setCategoryData] = useState(null);

  // redux
  const { data: categories, isLoading } = useGetAllCategoryQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="h-12 rounded-lg bg-gray-100" />
          <div className="h-12 rounded-lg bg-gray-100" />
          <div className="h-12 rounded-lg bg-gray-100" />
        </div>
      </div>
    );
  }

  const handleDeleteCategory = async (id) => {
    setDeleteCatId(id);
    try {
      await deleteCategory(id).unwrap();
    } catch (error) {
      toast.error(error?.data?.detail || "Something went wrong");
    } finally {
      setDeleteCatId(null);
    }
  };

  const handleUpdateCategory = (category) => {
    setOpenUpdateModal(true);
    setCategoryData(category);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your course categories
            </p>
          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            {categories.length} Categories
          </span>
        </div>

        {/* List */}
        <div className="p-4">
          {categories.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl text-gray-400">
                  <CiStickyNote />
                </span>
              </div>

              <h3 className="font-medium text-gray-700">No categories found</h3>

              <p className="mt-1 text-sm text-gray-500">
                Create your first category to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      #
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Description
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      {/* Number */}
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* Title */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 font-semibold text-yellow-700">
                            {category.name?.charAt(0)?.toUpperCase()}
                          </div>

                          <div>
                            <p className=" text-gray-800">{category.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-md px-4 py-4">
                        <p className="truncate text-sm text-gray-500">
                          {category.description || "No description"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-yellow-300 hover:bg-yellow-50 hover:text-yellow-700 cursor-pointer"
                            onClick={() => handleUpdateCategory(category)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category?.id)}
                            className="rounded-lg border border-red-100 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                          >
                            {deleteCatId == category?.id
                              ? "Deleting"
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {openUpdateModal && (
        <Suspense
          fallback={
            <LoadingFallback label="Loading dialog..." variant="modal" />
          }
        >
          <UpdateCategoryModal
            isOpen={openUpdateModal}
            categoryData={categoryData}
            setCategoryData={setCategoryData}
            onClose={() => setOpenUpdateModal(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default CategoryList;
