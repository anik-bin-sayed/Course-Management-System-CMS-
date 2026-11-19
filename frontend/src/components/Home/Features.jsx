import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaBriefcase,
  FaFileAlt,
  FaHeadset,
  FaUsers,
  FaLaptopCode,
  FaClock,
} from "react-icons/fa";

const FeatureItem = ({ icon, title }) => (
  <div className="group flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white p-7 text-center shadow-[0_8px_30px_-24px_rgba(16,37,29,0.45)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_48px_-30px_rgba(16,37,29,0.4)] sm:p-8">
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff6f1] text-2xl text-[#1b704b] transition duration-300 group-hover:scale-105 group-hover:bg-[#e1f1e7]">
      {icon}
    </div>
    <p className="max-w-[220px] text-[15px] font-semibold leading-snug text-gray-700">
      {title}
    </p>
  </div>
);

const Features = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-[#f7faf8] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-[#1b704b]">
          Learn with confidence
        </p>
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-[#17251d] sm:mb-12 sm:text-4xl">
          {t("features.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureItem
            icon={<FaBriefcase />}
            title={t("features.jobPlacement")}
          />

          <FeatureItem
            icon={<FaFileAlt />}
            title={t("features.cvReview")}
          />

          <FeatureItem
            icon={<FaHeadset />}
            title={t("features.liveSupport")}
          />

          <FeatureItem
            icon={<FaUsers />}
            title={t("features.batchSupport")}
          />

          <FeatureItem
            icon={<FaLaptopCode />}
            title={t("features.liveTests")}
          />

          <FeatureItem
            icon={<FaClock />}
            title={t("features.dailySupport")}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
