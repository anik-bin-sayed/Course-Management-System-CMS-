import React from "react";
import {
  FaBriefcase,
  FaFileAlt,
  FaHeadset,
  FaAward,
  FaLaptopCode,
  FaPuzzlePiece,
} from "react-icons/fa";

const CourseContents = () => {
  const contents = [
    {
      id: 1,
      icon: <FaBriefcase />,
      title: "Dedicated job placement team",
      iconColor: "text-[#d97706]",
      bgColor: "bg-orange-50",
    },
    {
      id: 2,
      icon: <FaFileAlt />,
      title: "CV Builder and Expert CV Review",
      iconColor: "text-[#059669]",
      bgColor: "bg-emerald-50",
    },
    {
      id: 3,
      icon: <FaHeadset />,
      title: "18 hours live support for specific courses",
      iconColor: "text-[#2563eb]",
      bgColor: "bg-blue-50",
    },
    {
      id: 4,
      icon: <FaAward />,
      title: "Pro Batch Special CV and Job Support",
      iconColor: "text-[#0284c7]",
      bgColor: "bg-sky-50",
    },
    {
      id: 5,
      icon: <FaLaptopCode />,
      title: "Opportunity to assess yourself in live tests",
      iconColor: "text-[#dc2626]",
      bgColor: "bg-red-50",
    },
    {
      id: 6,
      icon: <FaPuzzlePiece />,
      title: "Up to 3 support classes per day for specific courses",
      iconColor: "text-[#9333ea]",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className=" bg-gray-50 flex flex-col items-center pt-5 px-4 font-sans">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1e293b] mb-10 text-center tracking-tight">
        Live Course Contents
      </h2>

      <div className="w-full max-w-6xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {contents.map((item, index) => {
            const isLastRow = index >= 3;
            const isLastColDesktop = (index + 1) % 3 === 0;
            const isLastColTab = (index + 1) % 2 === 0;

            return (
              <div
                key={item.id}
                className={`
                  flex flex-col items-center justify-start text-center p-4 md:p-10 transition-colors hover:bg-gray-50/50
                  border-b border-gray-200
                  ${isLastRow ? "lg:border-b-0" : ""} 
                  ${!isLastColDesktop ? "lg:border-r" : "lg:border-r-0"}
                  ${!isLastColTab ? "md:border-r" : "md:border-r-0"}
                  ${index === contents.length - 1 ? "border-b-0" : ""}
                `}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-2xl mb-3 ${item.bgColor} ${item.iconColor} text-3xl shadow-sm border border-white`}
                >
                  {item.icon}
                </div>

                <h3 className="text-[17px] md:text-[18px] font-bold text-[#334155] leading-relaxed max-w-70">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseContents;
