import { FiClock, FiArrowRight, FiBookOpen, FiGlobe } from "react-icons/fi";
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border py-10 rounded shadow bg-white border-gray-100">
        {/* Section Header */}
        <div className="flex flex-col items-center py-6">
          <div className="flex items-center justify-center gap-4 text-3xl font-semibold">
            <FiBookOpen size={25} className="mt-1" />
            <h2>Upcoming Courses</h2>
          </div>

          <span className="">
            Learn Something <span className="text-yellow-600">New</span>
          </span>
        </div>
        {/* Empty State */}
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <FiBookOpen className="mx-auto mb-4 text-gray-400" size={40} />

            <h3 className="text-lg font-semibold text-gray-800">
              No upcoming courses
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              New courses will appear here when they are scheduled.
            </p>
          </div>
        ) : (
          /* Course Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/upcoming-course/${course.id}`}>
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Upcoming Badge */}
                    <div className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black shadow">
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
                    <div className="mb-3 flex items-center gap-2">
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

                    {/* Price */}
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
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-black transition hover:bg-yellow-500"
                        title="View course"
                      >
                        <FiArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/upcoming-course"
            className="border py-2 px-30 bg-gray-200 hover:bg-gray-300/50 rounded border-gray-300 uppercase font-bold"
          >
            see all
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingCourse;
