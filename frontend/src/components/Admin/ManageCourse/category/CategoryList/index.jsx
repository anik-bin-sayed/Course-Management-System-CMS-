import { lazy, Suspense, useState } from "react";

import { toast } from "sonner";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";

import { LuFolderTree, LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";

import {
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
} from "../../../../../lib/features/category/category-api";

const UpdateCategoryModal = lazy(() => import("../UpdateCategoryModal"));
const CreateCategoryModal = lazy(() => import("../../category/CategoryModal/CreateCategory"));

const CategoryList = () => {
  const [deleteCatId, setDeleteCatId] = useState(null);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [categoryData, setCategoryData] = useState(null);

  // redux
  const { data: categories = [], isLoading, isError, refetch } = useGetAllCategoryQuery();
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
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <header className="flex flex-col gap-4 rounded-xl border border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/70 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#173c2d] text-xl text-[#facc15]"><LuFolderTree /></span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800">Course organization</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Categories</h1>
              <p className="mt-1 text-sm text-slate-600">Organize courses into clear learning paths.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm font-semibold text-emerald-900">{categories.length} total</span>
            <button type="button" onClick={() => setOpenCreateModal(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#facc15] px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-[#e9b900]"><LuPlus size={17} /> Add category</button>
          </div>
        </header>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-slate-900">All categories</h2>
            <p className="text-xs text-slate-500">Update category names and descriptions or remove unused categories.</p>
          </div>

        {/* List */}
        <div className="p-3 sm:p-5">
          {isError ? (
            <div className="py-12 text-center"><p className="font-semibold text-slate-800">Could not load categories</p><button type="button" onClick={refetch} className="mt-3 rounded-lg bg-[#173c2d] px-4 py-2 text-sm font-semibold text-white">Try again</button></div>
          ) : categories.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-5 py-12 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-800"><LuFolderTree size={21} /></span>
              <h3 className="mt-4 font-semibold text-slate-800">No categories yet</h3>
              <p className="mt-1 text-sm text-slate-500">Create your first category to organize courses.</p>
              <button type="button" onClick={() => setOpenCreateModal(true)} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#facc15] px-4 text-sm font-semibold text-slate-950"><LuPlus /> Create category</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      #
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Category
                    </th>

                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Description
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/40"
                    >
                      {/* Number */}
                      <td className="px-4 py-4 text-xs font-semibold tabular-nums text-slate-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* Title */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 font-bold text-amber-900">
                            {category.name?.charAt(0)?.toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">{category.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-md px-4 py-4">
                        <p className="truncate text-sm text-slate-500">
                          {category.description || "No description"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
                            onClick={() => handleUpdateCategory(category)}
                          >
                            <LuPencil size={13} /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category?.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                          >
                            {deleteCatId == category?.id
                              ? "Deleting"
                              : <><LuTrash2 size={13} /> Delete</>}
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
      </div>
      {openCreateModal && (
        <Suspense fallback={<LoadingFallback label="Loading dialog..." variant="modal" />}>
          <CreateCategoryModal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} />
        </Suspense>
      )}
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
