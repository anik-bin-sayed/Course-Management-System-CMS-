import Image from "@/components/common/AppImage";
import AppLink from "@/components/common/AppLink";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { HiPlay } from "react-icons/hi2";

const HeroSection = () => {
  const { t } = useTranslation();
  const learningHighlights = [
    t("freeCourseHero.freeCourses"),
    t("freeCourseHero.selfPaced"),
    t("freeCourseHero.videoLessons"),
  ];

  return (
    <section className="relative overflow-hidden bg-[#10251d] pt-[65px] text-white">
      <div className="pointer-events-none absolute -right-28 -top-20 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-[35%] h-96 w-96 rounded-full bg-[#ffd84d]/8 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/7 px-3 py-1.5 text-xs font-semibold text-emerald-100 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffd84d]" />
            {t("freeCourseHero.badge")}
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            {t("freeCourseHero.title")}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
            {t("freeCourseHero.description")}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#free-courses-grid"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#ffd84d] px-5 py-3 text-sm font-bold text-[#17251d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffe47b] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ffd84d]"
            >
              {t("freeCourseHero.exploreCourses")}
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <AppLink
              href="/upcoming-course"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/35 hover:bg-white/10"
            >
              {t("common.allCourses")}
            </AppLink>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-white/70 sm:text-sm">
            {learningHighlights.map((highlight) => (
              <li key={highlight} className="inline-flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-300/15 text-emerald-200">
                  <FaCheck className="text-[9px]" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
          <div className="absolute -inset-4 rounded-xl bg-emerald-300/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-xl border border-white/15 bg-white/5 p-2.5 shadow-2xl">
            <div className="relative aspect-[1.2/1] overflow-hidden rounded-lg bg-[#203a2e] sm:aspect-[1.35/1]">
              <Image
                src="/images/freecoursehero.jpg"
                alt="Free video course lesson"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10251d]/60 via-transparent to-[#10251d]/10" />
            </div>
            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3.5 py-3 text-[#17251d] shadow-xl sm:bottom-7 sm:left-7 sm:px-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#fff5c9] text-[#806500]">
                <HiPlay className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold">
                  {t("freeCourseHero.startLearning")}
                </span>
                <span className="mt-0.5 block text-xs text-gray-500">
                  {t("freeCourseHero.videoLessons")}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
