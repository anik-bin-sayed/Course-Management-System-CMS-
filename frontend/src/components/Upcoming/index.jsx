import { useState, useEffect, useRef } from "react";
import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";

import { useGetUpcomingCourseQuery } from "../../lib/features/upcomingCourse/upcomingCourseApi";
import UpcomingCourseSkeleton from "./UpcomingCourseSkeleton";
import {
  FiGlobe,
  FiCalendar,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useGetAllCategoryQuery } from "../../lib/features/category/category-api";
import CategoryNav from "./CategoryNav";

const getPageNumbers = (current, total) => {
  const pages = [];
  const delta = 2;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (current - delta > 2) pages.push("...");

  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current + delta < total - 1) pages.push("...");
  pages.push(total);

  return pages;
};

const UpcomingCourse = () => {
  const [page, setPage] = useState(1);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const { t } = useTranslation();

  const sectionRef = useRef(null);

  const categoryRefs = useRef({});

  const { data: upcomingCourseData, isLoading } = useGetUpcomingCourseQuery({
    page,
    page_size: 8,
  });

  const categories = upcomingCourseData?.data;
  const pagination = upcomingCourseData?.pagination;

  useEffect(() => {
    if (page > 1 && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [page]);

  useEffect(() => {
    const handleNavbarVisibility = (event) => {
      setIsNavbarVisible(event.detail.visible);
    };

    window.addEventListener("navbar-visibility-change", handleNavbarVisibility);

    return () => {
      window.removeEventListener(
        "navbar-visibility-change",
        handleNavbarVisibility,
      );
    };
  }, []);

  if (isLoading) return <UpcomingCourseSkeleton />;

  const pageNumbers = pagination
    ? getPageNumbers(page, pagination.total_pages)
    : [];

  return (
    <main className="bg-linear-to-b from-gray-50 to-white">
      {/* categories */}
      <CategoryNav
        categories={categories}
        isNavbarVisible={isNavbarVisible}
        onCategoryClick={(id) => console.log("clicked", id)}
      />
      <section
        ref={sectionRef}
        className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 mt-28"
      >
        {/* Empty state */}
        {(!categories || categories.length === 0) && (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm">
            <FiCalendar className="mx-auto mb-4 text-gray-300" size={48} />
            <h3 className="text-lg font-semibold text-gray-800">
              {t("upcomingCourse.noCourses")}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {t("upcomingCourse.noCoursesDescription")}
            </p>
          </div>
        )}

        {/* Category list */}
        {categories?.map((category) => (
          <div
            key={category.id}
            id={`category-${category.id}`}
            ref={(el) => (categoryRefs.current[category.id] = el)}
            className="mb-16 scroll-mt-28 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8 lg:p-10"
          >
            {/* Category header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
                  <FiCalendar size={18} />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    {category.name}
                  </h2>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    {t("upcomingCourse.coursesComing", {
                      count: category.courses.length,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Course grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.courses.map((course) => (
                <Link
                  href={`/upcoming-course/${course.id}`}
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-md bg-white ring-1 ring-gray-200 transition-all duration-300 group-hover:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 "
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover transition duration-500 "
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                    {/* Upcoming badge */}
                    <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-900 shadow-sm sm:text-xs">
                      {t("upcomingCourse.upcoming")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-5 py-4">
                    {/* Level + Language */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-purple-50 px-2.5 py-1 text-[10px] font-semibold capitalize text-purple-900 sm:text-xs">
                        {course.level}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-medium capitalize text-gray-600 sm:text-xs">
                        <FiGlobe size={12} />
                        {course.language}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 line-clamp-2 min-h-14 text-base font-semibold leading-7 text-gray-600 transition group-hover:text-black sm:text-lg">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500 sm:text-sm">
                      {course.short_description}
                    </p>

                    {/* CTA button */}
                    <div className="mt-5">
                      <span className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition group-hover:bg-black group-hover:text-white sm:text-sm">
                        {t("upcomingCourse.viewDetails")}
                        <FiArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile view-all */}
            <div className="mt-6 flex justify-center sm:hidden">
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-yellow-600">
                {t("upcomingCourse.viewDetails")} <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {/*  Pagination  */}
        {pagination && pagination.total_pages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.has_previous}
                aria-label="Previous page"
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
              >
                <FiChevronLeft size={16} />
                <span className="hidden sm:inline">
                  {" "}
                  {t("upcomingCourse.previous")}
                </span>
              </button>

              {/* Page numbers */}
              {pageNumbers.map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-sm text-gray-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    aria-current={page === item ? "page" : undefined}
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
                      page === item
                        ? "bg-yellow-400 text-gray-900 shadow-sm"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.total_pages, p + 1))
                }
                disabled={!pagination.has_next}
                aria-label="Next page"
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
              >
                <span className="hidden sm:inline">
                  {" "}
                  {t("upcomingCourse.next")}
                </span>
                <FiChevronRight size={16} />
              </button>
            </div>

            {/* Page indicator (mobile) */}
            <p className="text-xs text-gray-500 sm:hidden">
              {t("upcomingCourse.page")} {page} {t("upcomingCourse.of")}{" "}
              {pagination.total_pages}
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default UpcomingCourse;
