import React from "react";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import AppLink from "../common/AppLink";

const Hero = () => {
  return (
    <section className="bg-[#F4F7F6] pt-10 lg:pt-20 pb-2 mt-12">
      {" "}
      {/* Adjusted background and padding */}
      <div className="container mx-auto px-0 md:px-4 max-w-7xl ">
        <div className="bg-linear-to-r from-[#E6F4F1] to-[#E8F0FE] rounded p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm border border-black/50 ">
          {/* Left Content */}
          <div className="md:w-[55%] z-10 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-[3.2rem] leading-tight font-bold text-gray-900 mb-4">
              Bangladesh Learns <span className="text-red-500">Live</span>
            </h1>
            <p className="text-gray-600 mb-6 text-lg md:text-xl font-medium">
              Upgrade your future through Skill Development
            </p>

            <div className="mb-10">
              <AppLink className="inline-flex w-fit bg-[#FFD700] text-black font-bold py-3.5 px-8 rounded-xl shadow-[0_4px_14px_0_rgba(255,215,0,0.39)] hover:bg-yellow-400 hover:-translate-y-0.5 transition-all duration-200 items-center gap-2 text-lg">
                Start Learning <FaArrowRight />
              </AppLink>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-gray-800">
                10000+ Graduates are working in various local and global
                companies:
              </p>
              {/* Logo Strip */}
              <div className="flex flex-wrap gap-x-8 gap-y-6 items-center mt-3 select-none">
                {/* BRAIN STATION 23 */}
                <div className="flex items-center gap-2 text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300 group">
                  <div className="w-6 h-6 bg-gray-400 group-hover:bg-[#00A651] rounded-full flex items-center justify-center transition-colors duration-300">
                    <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
                  </div>
                  <span className="font-bold text-sm tracking-wider">
                    BRAIN STATION 23
                  </span>
                </div>

                {/* TechnoSoft */}
                <div className="flex flex-col text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <span className="font-bold text-sm leading-none flex items-center gap-1">
                    <span className="text-lg leading-none">⌂</span> TechnoSoft
                  </span>
                  <span className="text-[9px] tracking-widest uppercase mt-0.5">
                    Integration
                  </span>
                </div>

                {/* Excel */}
                <div className="flex flex-col text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <span className="font-serif italic font-bold text-lg leading-none">
                    Excel
                  </span>
                  <span className="text-[9px] tracking-wide mt-0.5">
                    technologies ltd.
                  </span>
                </div>

                {/* gtr */}
                <div className="flex items-end gap-1 text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <span className="font-black italic text-2xl leading-none tracking-tighter">
                    gtr
                  </span>
                  <span className="text-[8px] leading-tight mb-0.5">
                    genuine technology
                    <br />& research limited
                  </span>
                </div>

                {/* ASTHA IT */}
                <div className="flex items-center text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <span className="font-black text-lg tracking-widest">
                    ASTHA
                  </span>
                  <span className="font-light text-lg tracking-widest">IT</span>
                </div>

                {/* REVE Systems */}
                <div className="flex items-center gap-1 text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <span className="font-light text-xl tracking-[0.2em]">
                    REVE
                  </span>
                  <span className="font-normal text-xl">Systems</span>
                </div>

                {/* ofol it */}
                <div className="flex flex-col text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <span className="font-serif italic font-bold text-lg leading-none flex items-center gap-1">
                    <span className="text-xl">⚡</span> ofol it
                  </span>
                  <span className="text-[8px] tracking-widest text-center mt-0.5">
                    success begins here
                  </span>
                </div>

                {/* CORE DEVS */}
                <div className="flex items-center gap-1.5 text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <div className="w-4 h-4 border-2 border-gray-400 group-hover:border-[#00A651] transform rotate-45 flex items-center justify-center transition-colors duration-300"></div>
                  <span className="font-bold text-sm tracking-wider">
                    CORE DEVS
                  </span>
                </div>

                {/* SAYBURGH */}
                <div className="flex items-center gap-1 text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <div className="w-3 h-3 bg-gray-400 group-hover:bg-[#00A651] transform rotate-45 transition-colors duration-300"></div>
                  <span className="font-extrabold text-sm tracking-tighter">
                    SAYBURGH
                  </span>
                </div>

                {/* ANCHOR BLOCK */}
                <div className="flex items-center gap-1 text-gray-400 hover:text-[#00A651] cursor-pointer transition-colors duration-300">
                  <span className="text-lg leading-none">⚓</span>
                  <div className="flex flex-col leading-none">
                    <span className="font-bold text-[10px] tracking-wide">
                      ANCHOR
                    </span>
                    <span className="font-bold text-[10px] tracking-wide">
                      BLOCK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="md:w-[45%] relative flex justify-center md:justify-end">
            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30"></div>

            {/* Main Image Container */}
            <div className="w-full max-w-105 aspect-video md:aspect-square bg-[#1A1A1A] rounded-2xl overflow-hidden relative shadow-2xl border-[6px] border-white/50 z-10 transform hover:scale-[1.02] transition-transform duration-500">
              {/* Demo Image Background */}
              <img
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
                alt="AI Technology"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              {/* Text Overlay inside Image */}
              <div className="absolute inset-0 flex flex-col justify-end items-center text-white p-6 text-center pb-12">
                <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1 rounded-sm mb-3 uppercase tracking-wider shadow-lg">
                  AI Driven
                </span>
                <h3 className="text-xl md:text-2xl font-semibold mb-1 text-gray-100 drop-shadow-md">
                  Learn Something New Today
                </h3>
                <h3 className="text-3xl md:text-4xl font-bold text-[#FFD700] drop-shadow-lg">
                  Build Your Career
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
