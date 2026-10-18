import { FiClock, FiArrowRight, FiBookOpen, FiUsers } from "react-icons/fi";
import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import CourseCardLoader from "./CourseCardLoader";
import { useTranslation } from "react-i18next";

const UpcomingCourse = ({ data, loading, isError }) => {
  const { t } = useTranslation();

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

  const tabs = [
    "All Courses",
    "Artificial Intelligence",
    "Web & App Development",
    "Product Management & Design",
    "Business & Marketing",
    "Data Science",
  ];

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
    <section className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
            <FiBookOpen size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("upcoming.title")}
          </h2>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex overflow-x-auto hide-scrollbar gap-3 pb-2">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                idx === 0
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
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
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/upcoming-course/${course.id}`}>
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Live Badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm border border-white/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      Live
                    </div>

                    {/* Discount Badge */}
                    {course.discount_price && (
                      <div className="absolute right-3 top-3 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        {/* Calculate discount percentage dynamically if possible, else static */}
                        20% OFF
                      </div>
                    )}

                    {/* Bottom overlay content */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-xs font-medium z-10">
                      <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                        <FiClock size={12} /> {getDaysLeft(course.start_date)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 cursor-pointer">
                    {/* Title */}
                    <h3 className="line-clamp-2 min-h-14 text-base font-bold leading-snug text-gray-900 transition group-hover:text-gray-600">
                      {course.title}
                    </h3>

                    {/* Meta Info (Date & Time) */}
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <FiClock size={14} /> Starts: 25 Nov
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FiClock size={14} /> 10:00 PM
                      </span>
                    </div>

                    {/* Price & Enrolled */}
                    <div className="mt-2 flex items-end justify-between border-t border-gray-100 pt-4">
                      <div>
                        {course.discount_price ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-black">
                              ৳ {course.discount_price}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ৳ {course.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-black">
                            ৳ {course.price}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                        <FiUsers size={14} /> 500+ Enrolled
                      </div>
                    </div>

                    {/* See Details Button */}
                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-gray-300 py-2 text-sm font-semibold text-gray-700 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-black">
                      {t("upcoming.seeDetails")} <FiArrowRight size={14} />
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* See All Button */}
        <div className="mt-12 flex items-center justify-center">
          <Link
            href="/upcoming-course"
            className="rounded-full bg-gray-200 px-10 py-2.5 text-sm font-bold text-gray-700 uppercase transition hover:bg-gray-300"
          >
            {t("upcoming.seeAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingCourse;
