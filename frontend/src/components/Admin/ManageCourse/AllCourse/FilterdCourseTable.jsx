import React from 'react'
import { MdLibraryAdd } from 'react-icons/md'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { TbCurrencyTaka } from 'react-icons/tb'
import Image from '@/components/common/AppImage'

const FilterdCourseTable = ({ filteredCourses, handleCreateLessons, handleEdit, handleDeleteCourse, deletingCourseId, role, handleViewLessons }) => {


    return (
        <table className="w-full min-w-[1100px] border-collapse">
            <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Course
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Type
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Level
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Language
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Price
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Start Date
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                    </th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
                {filteredCourses.map((course) => {
                    // console.log(course);
                    const price = Number(course.price || 0);
                    const discountPrice = Number(course.discount_price || 0);

                    const statusLabel =
                        course.status?.charAt(0).toUpperCase() +
                        course.status?.slice(1);

                    const typeLabel =
                        course.course_type?.charAt(0).toUpperCase() +
                        course.course_type?.slice(1);

                    const levelLabel =
                        course.level?.charAt(0).toUpperCase() +
                        course.level?.slice(1);

                    const languageLabel =
                        course.language?.charAt(0).toUpperCase() +
                        course.language?.slice(1);

                    return (
                        <tr key={course.id} className="transition hover:bg-gray-50">
                            {/* Course */}
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleViewLessons(course)}
                                        className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
                                    >
                                        {course.thumbnail ? (
                                            <Image
                                                src={course.thumbnail}
                                                alt={course.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <LuBookOpen className="text-xl text-gray-300" />
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleViewLessons(course)}
                                        className="max-w-62.5 flex cursor-pointer flex-col items-start justify-start "
                                    >
                                        <h2 className="line-clamp-1 font-semibold text-gray-900">
                                            {course.title}
                                        </h2>

                                        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                                            {course.short_description ||
                                                "No description available."}
                                        </p>
                                    </button>
                                </div>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-4">
                                <span className="text-sm text-gray-600">
                                    {course.category?.name || "N/A"}
                                </span>
                            </td>

                            {/* Type */}
                            <td className="px-4 py-4">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${course.course_type === "free"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {typeLabel}
                                </span>
                            </td>

                            {/* Level */}
                            <td className="px-4 py-4">
                                <span className="text-sm text-gray-600">
                                    {levelLabel}
                                </span>
                            </td>

                            {/* Language */}
                            <td className="px-4 py-4">
                                <span className="text-sm text-gray-600">
                                    {languageLabel}
                                </span>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-4">
                                {course.course_type === "free" ? (
                                    <span className="font-semibold text-green-600">
                                        Free
                                    </span>
                                ) : (
                                    <div className="flex flex-col">
                                        <span className="flex items-center font-bold text-gray-900">
                                            <TbCurrencyTaka />
                                            {discountPrice > 0 ? discountPrice : price}
                                        </span>

                                        {discountPrice > 0 && discountPrice < price && (
                                            <span className="flex items-center text-xs text-red-500 line-through">
                                                <TbCurrencyTaka />
                                                {price}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${course.status === "published"
                                        ? "bg-green-100 text-green-700"
                                        : course.status === "draft"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {statusLabel}
                                </span>
                            </td>

                            {/* Start Date */}
                            <td className="px-4 py-4">
                                <span className="whitespace-nowrap text-sm text-gray-500">
                                    {course.start_date
                                        ? new Date(course.start_date).toLocaleDateString()
                                        : "No date"}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCreateLessons(course)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 text-black transition hover:bg-gray-300 cursor-pointer"
                                        title="Add Lessons"
                                    >
                                        <MdLibraryAdd size={18} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(course)}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 text-black transition hover:bg-yellow-500 cursor-pointer"
                                        title="Edit Course"
                                    >
                                        <LuPencil size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        disabled={deletingCourseId === course.id || role != "admin"}
                                        onClick={() => handleDeleteCourse(course.id)}
                                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${role === "admin"
                                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                                            : "cursor-not-allowed bg-gray-100 text-gray-400 opacity-60"
                                            }`}
                                        title={role == "admin" ? "Delete Course" : "Only admin can delete courses"}
                                    >
                                        {deletingCourseId === course.id ? (
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
                                        ) : (
                                            <LuTrash2 size={17} />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

export default FilterdCourseTable