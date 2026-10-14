import React, { useState } from "react";
import { LuSearch, LuSlidersHorizontal, LuX } from "react-icons/lu";

const Filter = ({
  search,
  setSearch,
  status,
  setStatus,
  courseType,
  setCourseType,
  level,
  setLevel,
  language,
  setLanguage,
  filteredCourses,
  courses,
  hasFilter,
  resetFilters,
}) => {
  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        {/* Top row */}
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-900/5"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Course Type */}
          <select
            value={courseType}
            onChange={(e) => setCourseType(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
          >
            <option value="all">All Types</option>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>

          {/* Level */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Language */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
          >
            <option value="all">All Languages</option>
            <option value="bangla">Bangla</option>
            <option value="english">English</option>
          </select>
        </div>

        {/* Bottom filter info */}
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <LuSlidersHorizontal />

            <span>
              Showing{" "}
              <strong className="text-gray-900">
                {filteredCourses.length}
              </strong>{" "}
              of <strong className="text-gray-900">{courses.length}</strong>{" "}
              courses
            </span>
          </div>

          {hasFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <LuX />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filter;
