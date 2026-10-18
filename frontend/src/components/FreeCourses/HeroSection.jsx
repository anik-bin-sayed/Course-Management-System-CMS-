import Image from "@/components/common/AppImage";
import React from "react";

import { HiMagnifyingGlass, HiPlay } from "react-icons/hi2";

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(50vh-100px)] overflow-hidden bg-red-700">
      {/* Background decoration */}
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600 opacity-50 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-red-800 opacity-40 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(50vh-100px)] max-w-7xl items-center px-6 py-10 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-2 mt-15">
          {/* Left Content */}
          <div className="text-center md:text-left">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-white" />
              100% Free Learning
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
<<<<<<< Updated upstream
              Learn New Skills
              <span className="block text-red-100">For Free.</span>
=======
              {t("freeCourseHero.title")}
              <span className="block text-red-100"></span>
>>>>>>> Stashed changes
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-6 text-red-100 sm:text-base sm:leading-7">
<<<<<<< Updated upstream
              Explore high-quality video courses, learn from experienced
              instructors, and build the skills you need to grow your career.
=======
              {t("freeCourseHero.description")}
>>>>>>> Stashed changes
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <button
                type="button"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-red-700 shadow-lg transition hover:bg-red-50 hover:shadow-xl active:scale-95"
              >
                Explore Courses
              </button>

              <button
                type="button"
                className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
              >
                Start Learning
              </button>
            </div>

            {/* Stats */}
            <div className="mt-7 flex flex-wrap justify-center gap-6 md:justify-start">
              <div>
                <p className="text-xl font-bold text-white">100+</p>
                <p className="text-xs text-red-100">Free Courses</p>
              </div>

              <div className="h-10 w-px bg-white/20" />

              <div>
                <p className="text-xl font-bold text-white">500+</p>
                <p className="text-xs text-red-100">Video Lessons</p>
              </div>

              <div className="h-10 w-px bg-white/20" />

              <div>
                <p className="text-xl font-bold text-white">10K+</p>
                <p className="text-xs text-red-100">Learners</p>
              </div>
            </div>
          </div>
          {/* Right Image */}
          <div className="relative flex items-center justify-center mt-2">
            {/* Glow */}
            <div className="absolute h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            {/* Image Card */}
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
              <div className="overflow-hidden rounded-2xl bg-white">
                <Image
                  src="/images/freecoursehero.jpg"
                  alt="Free video courses"
                  width={800}
                  height={500}
                  className="h-[280px] w-full object-cover sm:h-[330px]"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute bottom-7 left-7 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <HiPlay className="h-5 w-5 text-red-700" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Start Learning
                  </p>
                  <p className="text-xs text-gray-500">Watch free videos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
