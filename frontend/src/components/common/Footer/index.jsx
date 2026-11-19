import Link from "@/components/common/AppLink";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaYoutube, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiArrowRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const Footer = () => {
  const { t } = useTranslation();

  const linkClass =
    "group inline-flex items-center gap-2 text-sm text-white/65 transition duration-200 hover:translate-x-1 hover:text-[#ffd84d]";
  const headingClass =
    "text-xs font-bold uppercase tracking-[0.16em] text-white";

  return (
    <footer className="relative isolate overflow-hidden bg-[#10251d] text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-24 -z-10 h-96 w-96 rounded-full bg-yellow-300/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-white/10 py-9 sm:flex-row sm:items-center sm:justify-between sm:py-10">
          <div className="max-w-2xl">
            <p className="text-xl font-bold tracking-tight sm:text-2xl">
              Keep moving forward with a new skill.
            </p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {t("footer.description")}
            </p>
          </div>
          <Link
            href="/upcoming-course"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#ffd84d] px-5 py-3 text-sm font-bold text-[#17251d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffe47b]"
          >
            {t("common.allCourses")}
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-10 py-11 sm:grid-cols-2 sm:gap-12 lg:grid-cols-5 lg:gap-10 lg:py-14">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffd84d] text-base font-black tracking-tight text-[#17251d] shadow-lg shadow-black/10">
                LH
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Learn<span className="text-[#ffd84d]">Hub</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
              {t("footer.description")}
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {[
                ["Facebook", FaFacebookF],
                ["YouTube", FaYoutube],
                ["GitHub", FaGithub],
                ["LinkedIn", FaLinkedinIn],
              ].map(([label, Icon]) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition duration-300 hover:-translate-y-0.5 hover:border-[#ffd84d]/50 hover:bg-[#ffd84d] hover:text-[#17251d]"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className={headingClass}>{t("common.courses")}</h2>
            <ul className="mt-5 space-y-3.5">
              {[
                [t("common.freeCourses"), "/free-courses"],
                [t("footer.paidCourses"), "/upcoming-course"],
                [t("footer.programming"), "/upcoming-course"],
                [t("footer.webDevelopment"), "/upcoming-course"],
                [t("footer.dataStructures"), "/upcoming-course"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>{t("footer.quickLinks")}</h2>
            <ul className="mt-5 space-y-3.5">
              {[
                [t("common.home"), "/"],
                [t("common.about"), "#"],
                [t("common.allCourses"), "/upcoming-course"],
                [t("footer.instructors"), "#"],
                [t("common.contact"), "mailto:support@learnhub.com"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className={headingClass}>{t("footer.getInTouch")}</h2>
            <div className="mt-5 space-y-4">
              <a
                href="mailto:support@learnhub.com"
                className="group flex items-center gap-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/7 text-[#ffd84d] transition group-hover:bg-[#ffd84d] group-hover:text-[#17251d]">
                  <FiMail />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-white/45">
                    {t("footer.email")}
                  </span>
                  <span className="mt-1 block break-all text-sm text-white/75 transition group-hover:text-white">
                    support@learnhub.com
                  </span>
                </span>
              </a>

              <a href="tel:+8801234567890" className="group flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/7 text-[#ffd84d] transition group-hover:bg-[#ffd84d] group-hover:text-[#17251d]">
                  <FiPhone />
                </span>
                <span>
                  <span className="block text-xs text-white/45">
                    {t("footer.phone")}
                  </span>
                  <span className="mt-1 block text-sm text-white/75 transition group-hover:text-white">
                    +880 1234-567890
                  </span>
                </span>
              </a>

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/7 text-[#ffd84d]">
                  <FiMapPin />
                </span>
                <span>
                  <span className="block text-xs text-white/45">
                    {t("footer.location")}
                  </span>
                  <span className="mt-1 block text-sm text-white/75">
                    Dhaka, Bangladesh
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-5 text-white/45 sm:text-sm">
            © {new Date().getFullYear()} {" "}
            <span className="font-semibold text-white/75">LearnHub</span>. {" "}
            {t("footer.rightsReserved")}
          </p>
          <div className="flex items-center gap-5 text-xs sm:text-sm">
            <Link
              href="#"
              className="text-white/45 transition-colors hover:text-[#ffd84d]"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <span className="h-4 w-px bg-white/15" />
            <Link
              href="#"
              className="text-white/45 transition-colors hover:text-[#ffd84d]"
            >
              {t("footer.termsConditions")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
