import React from "react";

const BusinessAddSection = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="relative w-full max-w-6xl rounded-xl bg-linear-to-br from-[#e5f9d8] via-[#f0fce9] to-[#d1f5a3] shadow-lg overflow-hidden border border-[#d1f5a3]">
        <div className="absolute top-6 left-8 opacity-20">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8bc34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#0f292f] tracking-tight">
              Dhukkul for business
            </h1>

            <p className="text-lg text-gray-800 leading-relaxed font-medium">
              জয়েন করুন আমাদের কর্পোরেট রিসেল ট্রেনিং প্রোগ্রামে, ট্রেনিং নিন
              দেশ সেরা ইন্ডাস্ট্রি এক্সপার্টদের থেকে আর সাজিয়ে নিন আপনার টিমকে
              নতুনভাবে।
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="flex items-center gap-3 bg-[#0b2b26] text-white px-6 py-3 rounded-full hover:bg-[#123f38] transition-colors group">
                <span className="font-semibold text-[15px]">
                  ফ্রি কনসালটেশন বুক করুন
                </span>
                <div className="bg-[#8bc34a] rounded-full p-1.5 flex items-center justify-center group-hover:bg-[#9ccc65] transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0b2b26"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button className="flex items-center gap-3 bg-white text-[#0b2b26] px-6 py-3 rounded-full hover:bg-gray-50 transition-colors group shadow-sm">
                <span className="font-semibold text-[15px]">
                  বিস্তারিত দেখুন
                </span>
                <div className="bg-[#8bc34a] rounded-full p-1.5 flex items-center justify-center group-hover:bg-[#9ccc65] transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0b2b26"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <div className="relative h-[400px] w-full bg-[#f1f3f4] rounded-2xl p-4 overflow-hidden flex items-center justify-center border border-gray-200">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(#9ca3af 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            ></div>

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            >
              <path
                d="M 280 250 Q 320 280, 360 270 T 420 320"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <path
                d="M 280 250 Q 250 200, 250 170"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.5"
              />
            </svg>

            <div
              className="absolute top-8 left-6 sm:left-12 bg-white rounded-xl p-5 shadow-lg w-65"
              style={{ zIndex: 10 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#e8f5e9] p-1.5 rounded-md">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="18" y="3" width="4" height="18" />
                    <rect x="10" y="8" width="4" height="13" />
                    <rect x="2" y="13" width="4" height="8" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-800 text-sm">
                  Performance
                </span>
              </div>

              <div className="flex gap-4 mb-4 text-[10px] text-gray-500 font-medium">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#c8e6c9]"></span>{" "}
                  Weekly
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#81c784]"></span>{" "}
                  Monthly
                </div>
              </div>

              {/* বার চার্ট (CSS দিয়ে তৈরি) */}
              <div className="flex items-end justify-between h-20 gap-2 relative">
                <div className="w-1/4 bg-[#e8f5e9] rounded-t-sm h-[40%]"></div>
                <div className="w-1/4 bg-[#e8f5e9] rounded-t-sm h-[60%]"></div>
                <div className="w-1/4 bg-[#c8e6c9] rounded-t-sm h-[80%]"></div>
                <div className="w-1/4 bg-[#a5d6a7] rounded-t-sm h-full"></div>

                {/* লাইন ওভারলে */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 10 60 Q 40 60, 60 50 T 110 30 T 150 10"
                    fill="none"
                    stroke="#1b5e20"
                    strokeWidth="2"
                  />
                  <circle
                    cx="110"
                    cy="30"
                    r="4"
                    fill="#1b5e20"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle
                    cx="150"
                    cy="10"
                    r="4"
                    fill="#1b5e20"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* নিচের কার্ড: Performance Area Chart */}
            <div
              className="absolute bottom-8 left-6 sm:left-12 bg-white rounded-xl p-4 shadow-lg w-[260px]"
              style={{ zIndex: 10 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-800 text-sm">
                  Performance
                </span>
                <span className="text-sm font-bold text-gray-900">
                  $2,545.06{" "}
                  <span className="text-gray-400 text-xs align-top">⋮</span>
                </span>
              </div>

              {/* এরিয়া চার্ট (SVG) */}
              <div className="relative h-16 w-full">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 200 60"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#81c784" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#81c784" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 50 Q 20 40, 40 45 T 80 30 T 120 40 T 160 20 T 200 50 L 200 60 L 0 60 Z"
                    fill="url(#gradient)"
                  />
                  <path
                    d="M 0 50 Q 20 40, 40 45 T 80 30 T 120 40 T 160 20 T 200 50"
                    fill="none"
                    stroke="#2e7d32"
                    strokeWidth="2"
                  />
                </svg>
                {/* টুলটিপ */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-[#2e7d32] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                  $2,545.06
                </div>
              </div>
            </div>

            {/* ফ্লোটিং আইকন ১ (লোগো) */}
            <div
              className="absolute top-24 right-12 bg-white rounded-full p-3 shadow-md flex items-center justify-center w-12 h-12"
              style={{ zIndex: 20 }}
            >
              <span className="text-red-600 font-bold text-xl">★</span>
            </div>

            {/* ফ্লোটিং আইকন ২ (নীল পাখি) */}
            <div
              className="absolute top-1/2 right-24 bg-white rounded-full p-2 shadow-md flex items-center justify-center w-12 h-12"
              style={{ zIndex: 20 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0288d1">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </div>

            <div
              className="absolute bottom-12 right-16 bg-white rounded-full p-3 shadow-md flex items-center justify-center w-12 h-12 border border-gray-100"
              style={{ zIndex: 20 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessAddSection;
