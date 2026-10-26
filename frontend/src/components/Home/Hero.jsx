import React from "react";
import { FaArrowRight } from "react-icons/fa";
import Image from "@/components/common/AppImage";
import AppLink from "@/components/common/AppLink";

const HeroSection = () => {
  const DEMO_IMAGE_URL =
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="bg-gray-50 py-6 sm:py-10 w-full font-sans mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-4">
        {/* Main Card Container */}
        <div className="bg-[#F4F9F9] rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col lg:flex-row relative">
          {/* LEFT SIDE - CONTENT */}
          <div className="w-full lg:w-[50%] p-4 sm:p-6 md:p-8 lg:px-6 flex flex-col justify-between z-10">
            <div>
              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-[1.15] mb-3 flex items-center flex-wrap gap-2 sm:gap-3">
                <span>Bangladesh Learns</span>
                <span className="text-[#E53E3E]">Live</span>
                <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#E53E3E] rounded-full inline-block"></span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-[18px] md:text-[20px] text-[#1A1A1A] font-medium mb-6 sm:mb-8">
                Upgrade your future through Skill Development
              </p>

              {/* CTA Button */}
              <div className="mb-8 sm:mb-12 lg:mb-16">
                <AppLink
                  href="#"
                  className="inline-flex items-center justify-center gap-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1A1A1A] font-bold text-base sm:text-[18px] py-3 sm:py-3.5 px-6 sm:px-8 rounded-lg transition-colors duration-200"
                >
                  Start Learning Now
                  <FaArrowRight className="text-base sm:text-[18px]" />
                </AppLink>
              </div>
            </div>

            {/* Logos Section */}
            <div>
              <p className="text-sm sm:text-[16px] md:text-[18px] font-bold text-[#1A1A1A] mb-4 sm:mb-5">
                10000+ Graduates are working in various local and global
                companies:
              </p>

              {/* Logos Grid - Responsive flex wrap */}
              <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm sm:text-lg">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-400"></div>
                  <span className="tracking-tight">BRAIN STATION 23</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-sm"></div>
                  <span className="leading-none text-xs sm:text-sm">
                    TechnoSoft
                    <br />
                    <span className="text-[9px] sm:text-[10px] font-normal">
                      Integration
                    </span>
                  </span>
                </div>

                <div className="font-bold text-gray-800 text-base sm:text-xl italic">
                  excel
                </div>

                <div className="flex items-center gap-1 font-bold text-gray-800 text-base sm:text-xl italic relative">
                  gtr
                  <span className="text-[8px] sm:text-[10px] not-italic font-normal absolute -bottom-3 sm:-bottom-3.5 left-0 whitespace-nowrap">
                    genuine technology
                  </span>
                </div>

                <div className="font-black text-gray-800 text-base sm:text-xl tracking-tighter">
                  ASTHA <span className="font-normal">IT</span>
                </div>

                <div className="font-semibold text-gray-800 text-base sm:text-xl tracking-tight">
                  REVE <span className="font-light">Systems</span>
                </div>

                <div className="flex items-center gap-1 font-bold text-gray-800 text-base sm:text-xl">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-gray-800"></div>
                  ophol it
                </div>

                <div className="font-bold text-gray-800 text-sm sm:text-lg flex items-center gap-1">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-sm"></div>
                  CORE DEVS
                </div>

                <div className="font-bold text-gray-800 text-sm sm:text-lg italic flex items-center gap-1">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full"></div>
                  SAYBURGH
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[50%] relative min-h-62.5 sm:min-h-85 lg:min-h-full">
            {/* Image Container */}
            <div className="absolute inset-0 p-2 sm:p-3 lg:p-4 pb-2 sm:pb-3 lg:pb-4 pr-2 sm:pr-3 lg:pr-4">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={DEMO_IMAGE_URL}
                  alt="AI Driven Tech"
                  fill
                  className="object-cover object-center"
                  priority
                />
                {/* Optional Dark Overlay for better contrast if needed */}
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
