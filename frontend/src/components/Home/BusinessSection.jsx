import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const BusinessSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-gradient-to-br from-[#E8F8F0] to-[#E0F2FE] rounded-[2rem] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          {/* Left Content */}
          <div className="md:w-1/2 z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("business.title")}
            </h2>
            <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed max-w-lg">
              {t("business.description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#00A651] text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-[#008f45] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                {t("business.requestDemo")} <FaArrowRight size={14} />
              </button>
              <button className="bg-white text-gray-700 px-6 py-3 rounded-full font-semibold border border-gray-300 flex items-center gap-2 hover:bg-gray-50 transition-all duration-300">
                {t("business.knowMore")} <FaArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Graphic Area (Recreated with CSS & SVG) */}
          <div className="md:w-1/2 relative flex justify-center md:justify-end w-full">
            <div className="relative w-full max-w-[450px] h-[300px]">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl"></div>

              {/* Main Chart Card */}
              <div className="absolute top-4 left-0 w-64 bg-white rounded-xl shadow-xl p-4 border border-gray-100 z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-500">
                    {t("business.performance")}
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-[#00A651]">
                    <FiTrendingUp size={14} />
                  </span>
                </div>

                {/* SVG Line Chart */}
                <div className="h-20 w-full relative">
                  <svg
                    viewBox="0 0 100 40"
                    className="w-full h-full preserve-3d"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,30 Q20,35 40,15 T100,5"
                      fill="none"
                      stroke="#00A651"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="5" r="3" fill="#00A651" />
                  </svg>
                  {/* Y-axis lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    <div className="border-b border-gray-100 w-full h-0"></div>
                    <div className="border-b border-gray-100 w-full h-0"></div>
                    <div className="border-b border-gray-100 w-full h-0"></div>
                  </div>
                </div>
              </div>

              {/* Map / Location Pin Card (Overlapping) */}
              <div className="absolute bottom-4 right-0 w-56 bg-white rounded-xl shadow-2xl p-3 border border-gray-100 z-20">
                {/* Dummy Map Area */}
                <div className="relative h-24 bg-[#F0F4F8] rounded-lg overflow-hidden mb-2 flex items-center justify-center border border-gray-200">
                  {/* Grid lines for map */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:15px_15px]"></div>

                  {/* Red Pin */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 mt-[-2px]"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-gray-600">
                    {t("business.performance")}: 83.1/100
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                </div>
              </div>

              {/* Small Floating Elements */}
              <div className="absolute top-1/2 right-4 w-8 h-8 bg-[#00A651] rounded-full flex items-center justify-center shadow-lg z-0 opacity-20"></div>
              <div className="absolute bottom-1/4 left-10 w-4 h-4 bg-blue-400 rounded-full shadow-lg z-0 opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
