"use client";

import Image from "@/components/common/AppImage";

import {
  FaPlay,
  FaClock,
  FaGlobe,
  FaSignal,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaUserGraduate,
  FaArrowRight,
} from "react-icons/fa";

import { getDurationInMonths } from "./CalculateMonth";
import { useSelector } from "react-redux";

const CourseDetails = ({ course }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log(isAuthenticated);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 pt-28 pb-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left Content */}
            <div className="text-white">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-yellow-400 px-4 py-1.5 text-sm font-semibold text-gray-900">
                  Upcoming Course
                </span>

                <span className="rounded-full border border-gray-600 px-4 py-1.5 text-sm text-gray-300">
                  {course?.category?.name}
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {course?.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
                {course?.short_description}
              </p>

              {/* Course Meta */}
              <div className="mt-7 flex flex-wrap gap-5 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <FaClock className="text-yellow-400" />
                  <span>
                    {getDurationInMonths(course?.start_date, course?.end_date)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaGlobe className="text-yellow-400 " />
                  <span className="capitalize">{course?.language}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaSignal className="text-yellow-400" />
                  <span className="capitalize">{course?.level}</span>
                </div>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="relative aspect-video w-full">
                <Image
                  src={course?.thumbnail || ""}
                  alt="Full Stack Web Development"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-900 shadow-xl transition duration-300 hover:scale-110 hover:bg-yellow-400">
                    <FaPlay className="ml-1 text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* About Course */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                About This Course
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                {course?.description}
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                Throughout the course, you will work on real-world projects
                using modern technologies and industry-standard development
                practices.
              </p>
            </div>

            {/* What You'll Learn */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                What You'll Learn
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  "Modern HTML, CSS & JavaScript",
                  "React & Next.js",
                  "Python & Django",
                  "REST API Development",
                  "PostgreSQL Database",
                  "Authentication & Authorization",
                  "Real-world Full Stack Projects",
                  "Deployment & Production",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg bg-gray-50 p-4"
                  >
                    <FaCheckCircle className="mt-1 shrink-0 text-green-500" />

                    <span className="text-sm leading-6 text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Information */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Course Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                    <FaClock />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {getDurationInMonths(
                        course?.start_date,
                        course?.end_date,
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <FaBookOpen />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Lessons</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {course?.total_lessons > 60 ? (
                        <span>60+ Lessons</span>
                      ) : (
                        <span>{course?.total_lessons} Lessons</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <FaSignal />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Level</p>
                    <p className="mt-1 font-semibold capitalize text-gray-800">
                      {course?.level}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-gray-100 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <FaGlobe />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Language</p>
                    <p className="mt-1 font-semibold text-gray-800 capitalize">
                      {course?.language}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Schedule */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Course Schedule
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Starting Date</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {formatDate(course?.start_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Ending Date</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {formatDate(course?.end_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside>
            <div className="sticky top-24 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
              {/* Price */}
              <div className="border-b border-gray-100 p-6">
                <p className="text-sm text-gray-400">Course Price</p>

                <div className="mt-2 flex items-end gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ৳{course?.discount_price}
                  </span>

                  <span className="pb-1 text-sm text-gray-400 line-through">
                    ৳{course?.price}
                  </span>
                </div>

                <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Save ৳ {course?.price - course?.discount_price}
                </span>
              </div>

              {/* Enrollment */}
              <div className="p-6">
                <button
                  disabled={!isAuthenticated}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 font-bold text-gray-900 transition duration-300 hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
                >
                  Enroll Now
                  <FaArrowRight className="text-sm" />
                </button>

                <p className="mt-4 text-center text-xs text-gray-400">
                  Course enrollment will be available soon.
                </p>

                {/* Includes */}
                <div className="mt-7">
                  <h3 className="font-bold text-gray-900">
                    This course includes:
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaPlay className="text-yellow-500" />
                      <p className="mt-1  text-gray-800">
                        {course?.total_lessons > 60 ? (
                          <span>60+ Video Lessons</span>
                        ) : (
                          <span>{course?.total_lessons} Video Lessons</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaBookOpen className="text-yellow-500" />
                      <span>Practical Projects</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaUserGraduate className="text-yellow-500" />
                      <span>Certificate of Completion</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FaCheckCircle className="text-yellow-500" />
                      <span>Lifetime Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CourseDetails;
