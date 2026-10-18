import React from "react";
import {
  FaBriefcase,
  FaFileAlt,
  FaHeadset,
  FaUsers,
  FaLaptopCode,
  FaClock,
} from "react-icons/fa";

const FeatureItem = ({ icon, title, iconColor }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-200 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div
      className={`text-4xl mb-5 flex items-center justify-center ${iconColor}`}
    >
      {icon}
    </div>
    <p className="text-[15px] font-semibold text-gray-700 leading-snug max-w-[220px]">
      {title}
    </p>
  </div>
);

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-12">
          Live Course Contents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureItem
            icon={<FaBriefcase />}
            iconColor="text-[#8B5A2B]"
            title="Dedicated job placement team"
          />

          <FeatureItem
            icon={<FaFileAlt />}
            iconColor="text-[#E53E3E]"
            title="CV Builder and Expert CV Review"
          />

          <FeatureItem
            icon={<FaHeadset />}
            iconColor="text-[#3182CE]"
            title="18 hours live support for specific courses"
          />

          <FeatureItem
            icon={<FaUsers />}
            iconColor="text-[#38A169]"
            title="Pro Batch Special CV and Job Support"
          />

          <FeatureItem
            icon={<FaLaptopCode />}
            iconColor="text-[#805AD5]"
            title="Opportunity to assess yourself in live tests"
          />

          <FeatureItem
            icon={<FaClock />}
            iconColor="text-[#D69E2E]"
            title="Up to 3 support classes per day for specific courses"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
