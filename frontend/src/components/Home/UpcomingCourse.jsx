import {
  FiClock,
  FiArrowRight,
  FiBookOpen,
  FiGlobe,
  FiUsers,
  FiStar,
} from "react-icons/fi";
import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import CourseCardLoader from "./CourseCardLoader";

const UpcomingCourse = ({ data, loading, isError }) => {
  const courses = data || [];

  const getDaysLeft = (date) => {
    if (!date) return "";

    const today = new Date();
    const startDate = new Date(date);

    const difference = startDate - today;
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Starting soon";

    return `${days} days left`;
  };

  if (loading) {
    return <CourseCardLoader />;
  }

  if (isError) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8">
            <p className="font-medium text-red-600">
              Failed to load upcoming courses.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border py-10 rounded-xl shadow-sm bg-white border-gray-100">
          {/* Section Header */}
          <div className="flex flex-col items-center px-4 pb-8 pt-2">
            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl font-semibold">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                <FiBookOpen size={24} />
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Upcoming <span className="text-yellow-600">Courses</span>
              </h2>
            </div>

            {/* Subtitle */}
            <p className="mt-3 text-sm sm:text-base text-gray-500 text-center">
              Learn Something{" "}
              <span className="font-semibold text-yellow-600">New</span> —{" "}
              <span className="text-gray-400">enroll before seats fill up</span>
            </p>

            {/* Divider */}
            <div className="mt-5 flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-yellow-400"></span>
              <span className="h-1 w-2 rounded-full bg-yellow-300"></span>
              <span className="h-1 w-2 rounded-full bg-yellow-200"></span>
            </div>
          </div>

          {/* Empty State */}
          {courses.length === 0 ? (
            <div className="mx-4 sm:mx-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 sm:p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <FiBookOpen className="text-gray-400" size={32} />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No upcoming courses
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                New courses will appear here when they are scheduled.
              </p>
            </div>
          ) : (
            /* Course Grid */
            <div className="grid grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:gap-6 sm:px-6 lg:grid-cols-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-yellow-200"
                >
                  <Link href={`/upcoming-course/${course.id}`}>
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                      {/* Upcoming Badge */}
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black shadow-md">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black/40 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-black"></span>
                        </span>
                        Upcoming
                      </div>

                      {/* Days Left */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                        <FiClock size={13} />
                        {getDaysLeft(course.start_date)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 cursor-pointer">
                      {/* Level + Language */}
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold capitalize text-yellow-900">
                          {course.level}
                        </span>

                        <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
                          <FiGlobe size={12} />
                          {course.language}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="line-clamp-2 min-h-14 text-lg font-semibold leading-7 text-gray-900 transition-colors group-hover:text-yellow-600">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                        {course.short_description}
                      </p>

                      {/* Meta row */}
                      <div className="mt-4 flex items-center gap-4 border-t border-dashed border-gray-100 pt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiUsers size={13} className="text-gray-400" />
                          {course.enrolled_count || 0} enrolled
                        </span>
                        <span className="flex items-center gap-1">
                          <FiStar size={13} className="text-yellow-500" />
                          {course.rating || "New"}
                        </span>
                      </div>

                      {/* Price + Button */}
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          {course.discount_price ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-gray-900">
                                ৳{course.discount_price}
                              </span>

                              <span className="text-sm text-gray-400 line-through">
                                ৳{course.price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-gray-900">
                              ৳{course.price}
                            </span>
                          )}

                          <p className="text-xs text-gray-400">Course price</p>
                        </div>

                        {/* View Button */}
                        <button
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-black transition-all duration-200 hover:bg-yellow-500 hover:shadow-md group-hover:scale-105"
                          title="View course"
                        >
                          <FiArrowRight
                            size={18}
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* See All Button */}
          {courses.length > 0 && (
            <div className="mt-10 flex items-center justify-center px-4">
              <Link
                href="/upcoming-course"
                className="group inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-10 py-3 text-sm font-bold uppercase tracking-wide text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-200 sm:px-16"
              >
                See All Courses
                <FiArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpcomingCourse;
