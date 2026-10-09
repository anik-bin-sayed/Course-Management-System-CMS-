"use client";

import React, { useState } from "react";
import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";

import { FaPlay } from "react-icons/fa";
import { useGetUpcomingCourseQuery } from "../../lib/features/upcomingCourse/upcomingCourseApi";
import UpcomingCourseSkeleton from "./UpcomingCourseSkeleton";
import { FiArrowRight, FiGlobe } from "react-icons/fi";

const UpcomingCourse = () => {
  const [page, setPage] = useState(1);

  const { data: upcomingCourseData, isLoading } = useGetUpcomingCourseQuery({
    page,
    page_size: 8,
  });

  const categories = upcomingCourseData?.data;
  const pagination = upcomingCourseData?.pagination;

  console.log(categories);

  if (isLoading) return <UpcomingCourseSkeleton />;

  return (
    <main className="bg-gray-50">
      <section className="mx-auto mt-20 max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        {categories &&
          categories?.map((category) => (
            <div
              key={category.id}
              className="mb-14 rounded-xl bg-white p-10 shadow ring-1 ring-gray-200"
            >
              {/* Category Header */}
              <div className="mb-6 flex items-center justify-center">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {category.name}
                </h2>
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {category.courses.map((course) => (
                  <Link
                    href={`/upcoming-course/${course.id}`}
                    key={course.id}
                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 ring-1 hover:ring-0"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Upcoming Badge */}
                      <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-900">
                        Upcoming
                      </span>
                    </div>

                    {/* Content */}

                    <div className="px-5 py-3 cursor-pointer">
                      {/* Level + Language */}
                      <div className=" flex items-center gap-2">
                        <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold capitalize text-yellow-900">
                          {course.level}
                        </span>

                        <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                          <FiGlobe size={12} />
                          {course.language}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-gray-900 transition group-hover:text-yellow-600">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                        {course.short_description}
                      </p>

                      <div className=" mt-5 flex items-center justify-center cursor-pointer">
                        <button className="border w-full py-2 px-4 bg-gray-700 text-white rounded-md cursor-pointer uppercase font-semibold hover:bg-gray-800">
                          view details
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile View All */}
              <button className="mt-5 block text-sm font-semibold text-gray-600 hover:text-yellow-500 sm:hidden">
                View All →
              </button>
            </div>
          ))}

        {pagination && pagination.total_pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {/* Previous */}
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={!pagination.has_previous}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            {Array.from(
              { length: pagination.total_pages },
              (_, index) => index + 1,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                  page === pageNumber
                    ? "bg-yellow-400 text-gray-900"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!pagination.has_next}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default UpcomingCourse;
