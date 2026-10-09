import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import { HiArrowDown, HiCheck, HiPlay } from "react-icons/hi2";

const Hero = () => {
  return (
    <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Background"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          fill
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
        {/* Animated Blob */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm text-yellow-400 px-4 py-2 rounded-full text-sm font-medium border border-yellow-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
              </span>
              Learn from the best
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="text-white">Master New Skills &</span>
              <br />
              <span className="bg-linear-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Transform Your Future
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-lg">
              Unlock your potential with world-class courses taught by industry
              experts. Learn at your own pace and gain in-demand skills that
              will set you apart.
            </p>

            {/* Features List */}
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-2 text-gray-300">
                <HiCheck className="h-5 w-5 text-yellow-500" />
                100+ Courses
              </span>
              <span className="flex items-center gap-2 text-gray-300">
                <HiCheck className="h-5 w-5 text-yellow-500" />
                Expert Instructors
              </span>
              <span className="flex items-center gap-2 text-gray-300">
                <HiCheck className="h-5 w-5 text-yellow-500" />
                Lifetime Access
              </span>
              <span className="flex items-center gap-2 text-gray-300">
                <HiCheck className="h-5 w-5 text-yellow-500" />
                Certificate
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-1">
              <button className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-full hover:bg-yellow-600 transition-all duration-200 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 transform">
                Get Started Free
              </button>
              <Link
                href="/free-courses"
                className="px-8 py-3 text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/10 transition-all duration-200 hover:border-yellow-500 flex items-center gap-2"
              >
                <HiPlay className="h-5 w-5" />
                Watch Demo
              </Link>
            </div>

            {/* Trusted By */}
            <div className="pt-2">
              <p className="text-sm text-gray-400 mb-3">
                Trusted by 50,000+ learners worldwide
              </p>
              <div className="flex items-center gap-6 opacity-60">
                <span className="text-gray-400 font-semibold text-lg">
                  Microsoft
                </span>
                <span className="text-gray-400 font-semibold text-lg">
                  Google
                </span>
                <span className="text-gray-400 font-semibold text-lg">
                  Amazon
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration / Image */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Main Image Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/20 border border-white/10 aspect-4/3">
                <Image
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Students learning"
                  fill
                  className="object-cover"
                />
                {/* Floating Badge - Top */}
                <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/20">
                  <p className="text-white text-xs font-medium">200+ Courses</p>
                </div>
                {/* Floating Badge - Bottom */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md rounded-xl px-3 py-1.5 border border-white/10">
                  <p className="text-yellow-400 text-xs font-medium">
                    4.9/5 Rating
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-500/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-yellow-400/20 rounded-full blur-2xl" />
              {/* Dots Pattern */}
              <div className="absolute -right-8 -bottom-8 grid grid-cols-4 gap-2 opacity-20">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 animate-bounce">
        <span className="text-gray-400 text-xs font-medium">Scroll</span>
        <HiArrowDown className="h-4 w-4 text-gray-400" />
      </div>
    </section>
  );
};

export default Hero;
