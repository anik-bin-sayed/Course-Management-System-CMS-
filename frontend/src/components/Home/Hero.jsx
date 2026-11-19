import { useTranslation } from "react-i18next";
import { FaArrowRight, FaCheck, FaPlay } from "react-icons/fa";
import AppLink from "../common/AppLink";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative mt-14 overflow-hidden bg-[#f7faf8] px-4 pb-12 pt-6 sm:px-6 lg:mt-16 lg:pb-16 lg:pt-8">
      <div className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-[2rem] bg-[#10251d] px-6 py-10 text-white shadow-[0_28px_80px_-38px_rgba(16,37,29,0.65)] sm:px-10 md:px-14 lg:min-h-[530px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-16 lg:py-14">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-16 h-72 w-72 rounded-full border border-white/10" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-xs font-semibold tracking-wide text-emerald-100 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#ffd84d] shadow-[0_0_12px_rgba(255,216,77,0.8)]" />
            Learn practical skills. Move forward.
          </div>

          <h1 className="max-w-xl text-[2.55rem] font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">
            {t("homePage.heroTitle")} {" "}
            <span className="text-[#ffd84d]">{t("homePage.heroLive")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            {t("homePage.heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AppLink
              href="/upcoming-course"
              className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-[#ffd84d] px-6 py-3.5 font-bold text-[#17251d] shadow-lg shadow-black/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffe47b] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd84d]"
            >
              {t("homePage.heroCTA")}
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </AppLink>
            <AppLink
              href="/free-courses"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white transition duration-300 hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <FaPlay className="text-xs" />
              {t("common.freeCourses")}
            </AppLink>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75">
            {["Live classes", "Free video courses", "Career support"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-200">
                    <FaCheck className="text-[9px]" />
                  </span>
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
          <div className="absolute -inset-5 rounded-[2rem] bg-emerald-300/10 blur-2xl" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#1e362c] shadow-2xl sm:aspect-[1.12/1]">
            <img
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop"
              alt="Digital learning and technology"
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-700 ease-out hover:scale-[1.03]"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1812]/90 via-[#10251d]/10 to-[#10251d]/20" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur-md">
                Learn by doing
              </span>
              <p className="mt-3 max-w-sm text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                Learn something new today. Build what comes next.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-white/70 bg-white p-3.5 text-[#17251d] shadow-xl sm:-left-8 sm:bottom-8 sm:p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff5c9] text-[#806500]">
              <FaPlay className="ml-0.5 text-sm" />
            </div>
            <div>
              <p className="text-sm font-bold">Start learning</p>
              <p className="mt-0.5 text-xs text-gray-500">At your own pace</p>
            </div>
          </div>
          <div className="absolute -right-3 -top-3 h-16 w-16 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm sm:-right-5 sm:-top-5" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
