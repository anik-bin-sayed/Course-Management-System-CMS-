import { FiClock, FiArrowRight, FiBookOpen } from "react-icons/fi";
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

  const formatStartDate = (date) => {
    if (!date) return "Date to be announced";
    return new Intl.DateTimeFormat("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const getDiscountPercent = (price, discountPrice) => {
    const original = Number(price);
    const discounted = Number(discountPrice);
    if (!original || !discounted || discounted >= original) return null;
    return Math.round(((original - discounted) / original) * 100);
  };

  if (loading) {
    return <CourseCardLoader />;
  }

  if (isError) {
    return (
      <section className="bg-[#f7faf8] py-16">
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
    <section className="bg-[#f7faf8] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#276143]">
              <FiBookOpen />
              Learn with a live instructor
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#17251d] sm:text-4xl">
              Upcoming live courses
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-gray-600">
              Join a guided course, learn alongside a cohort, and keep moving
              toward your goals.
            </p>
          </div>
          <Link
            href="/upcoming-course"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#17251d] transition duration-300 hover:border-[#1b704b] hover:bg-[#f1f8f4]"
          >
            Browse all courses
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
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
                className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_8px_30px_-22px_rgba(16,37,29,0.35)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_48px_-28px_rgba(16,37,29,0.38)]"
              >
                <Link href={`/upcoming-course/${course.id}`}>
                  {/* Thumbnail */}
                  <div className="relative aspect-[1.55/1] overflow-hidden bg-gray-900">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover opacity-85 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Live Badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm border border-white/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      Live
                    </div>

                    {/* Discount Badge */}
                    {course.discount_price && (
                      getDiscountPercent(course.price, course.discount_price) && (
                        <div className="absolute right-3 top-3 rounded-full bg-[#ffd84d] px-2.5 py-1 text-[10px] font-bold text-[#17251d] shadow-sm">
                          {getDiscountPercent(course.price, course.discount_price)}% OFF
                        </div>
                      )
                    )}

                    {/* Bottom overlay content */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-xs font-medium z-10">
                      <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                        <FiClock size={12} /> {getDaysLeft(course.start_date)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="cursor-pointer p-5">
                    {/* Title */}
                    <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-bold leading-snug text-gray-900 transition group-hover:text-green-600">
                      {course.title}
                    </h3>

                    {/* Meta Info (Date & Time) */}
                    <div className="mb-4 mt-3 flex items-center text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <FiClock size={14} /> {formatStartDate(course.start_date)}
                      </span>
                    </div>

                    {/* Price & Enrolled */}
                    <div className="mt-2 flex items-end justify-between border-t border-gray-100 pt-4">
                      <div>
                        {course.discount_price ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-[#1b704b]">
                              ৳{course.discount_price}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ৳{course.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-[#1b704b]">
                            ৳{course.price}
                          </span>
                        )}
                      </div>

                    </div>

                    <span className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#173c2d] py-2 text-sm font-semibold text-white transition duration-300 group-hover:bg-[#225c42]">
                      View course <FiArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default UpcomingCourse;
