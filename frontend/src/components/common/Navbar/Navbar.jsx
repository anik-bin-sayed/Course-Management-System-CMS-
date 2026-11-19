import { useEffect, useRef, useState } from "react";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import AppLink from "../AppLink.jsx";
import Search from "./Search.jsx";
import SideLogin from "../../Sidebar/SideLogin.jsx";
import NavbarUserDetails from "./NavbarUserDetails.jsx";
import MobileNavUserDetails from "./MovileNavUserDetails.jsx";
import LanguageSwitchButton from "./LanguageSwitchButton.jsx";
import { setUser } from "../../../lib/features/auth/authSlice.js";
import { useGetProfileQuery } from "../../../lib/features/auth/authApi";
import {
  isEnrollmentEligible,
  useGetMyEnrollmentsQuery,
} from "../../../lib/features/enrollment/enrollmentApi";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const lastScrollY = useRef(0);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const {
    data: profileData,
    isLoading,
    isFetching: isFetchingProfile,
  } = useGetProfileQuery();
  const {
    data: enrollments,
    isError: isEnrollmentError,
    isFetching: isFetchingEnrollments,
    isLoading: isLoadingEnrollments,
    isUninitialized: areEnrollmentsUninitialized,
  } = useGetMyEnrollmentsQuery(undefined, {
    skip: profileData?.role !== "student",
  });

  const dashboardHref =
    profileData?.role === "student" ? "/dashboard" : "/admin/manage-course";
  const hasEligibleEnrollment = enrollments?.some(isEnrollmentEligible);
  const showDashboardLink =
    profileData?.role === "student"
      ? !isLoadingEnrollments &&
        !isFetchingEnrollments &&
        !areEnrollmentsUninitialized &&
        !isEnrollmentError &&
        hasEligibleEnrollment
      : ["admin", "instructor"].includes(profileData?.role);

  useEffect(() => {
    if (location.state?.openLogin) setSidebarOpen(true);
  }, [location.state]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldShow = currentScrollY <= 100 || currentScrollY < lastScrollY.current;
      setShowNavbar((current) => (current === shouldShow ? current : shouldShow));
      if (!shouldShow) setMobileMenuOpen(false);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(setUser({ user: profileData }));
  }, [profileData, dispatch]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("navbar-visibility-change", {
        detail: { visible: showNavbar },
      }),
    );
  }, [showNavbar]);

  const normalizedPath = location.pathname.replace(/^\/bn(?=\/|$)/, "") || "/";
  const navItems = [
    { href: "/job-success", label: t("common.jobSuccess") },
    { href: "/upcoming-course", label: t("common.allCourses") },
    { href: "/free-courses", label: t("common.freeCourses") },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const openLogin = () => {
    setMobileMenuOpen(false);
    setSidebarOpen(true);
  };

  return (
    <>
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-[#07130d]/45 backdrop-blur-sm xl:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <nav
        ref={navRef}
        aria-label="Main navigation"
        className={`fixed inset-x-0 top-0 z-50 border-b border-gray-200/70 bg-white/95 px-4 py-3 shadow-[0_8px_30px_-24px_rgba(16,37,29,0.45)] backdrop-blur-xl transition-transform duration-300 ease-out sm:px-6 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <AppLink href="/" className="group inline-flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd84d] text-xs font-black tracking-tight text-[#17251d] shadow-sm transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
              LH
            </span>
            <span className="text-lg font-bold tracking-tight text-[#17251d] sm:text-xl">
              Learn<span className="text-[#1b704b]">Hub</span>
            </span>
          </AppLink>

      <div className="hidden min-w-0 flex-1 xl:block xl:max-w-[260px]">
            <Search />
          </div>

          <div className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => {
              const isActive =
                normalizedPath === item.href ||
                normalizedPath.startsWith(`${item.href}/`);
              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-xl px-3 py-2.5 text-[13px] font-semibold transition duration-200 xl:px-3.5 xl:text-sm ${
                    isActive
                      ? "bg-[#eff6f1] text-[#1b704b]"
                      : "text-gray-600 hover:bg-gray-100/80 hover:text-[#17251d]"
                  }`}
                >
                  {item.label}
                </AppLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <LanguageSwitchButton />
            {!isLoading && profileData && showDashboardLink && (
              <AppLink
                href={dashboardHref}
                className="rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition duration-200 hover:border-[#1b704b]/30 hover:bg-[#eff6f1] hover:text-[#1b704b]"
              >
                {t("dashboard.title")}
              </AppLink>
            )}
            {!isLoading &&
              (profileData ? (
                <NavbarUserDetails profileData={profileData} />
              ) : (
                <button
                  type="button"
                  onClick={openLogin}
                  className="rounded-xl bg-[#173c2d] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#225c42] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b704b]"
                >
                  {t("common.login")} / {t("common.register")}
                </button>
              ))}
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <LanguageSwitchButton />
            <AppLink
              href="/search"
              aria-label={t("common.search")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-[#1b704b]"
            >
              <FaSearch size={15} />
            </AppLink>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173c2d] text-white transition hover:bg-[#225c42] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b704b]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <FaTimes size={17} /> : <FaBars size={17} />}
            </button>
          </div>
        </div>
      </nav>

      <aside
        id="mobile-navigation"
        ref={menuRef}
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
        className={`fixed right-0 top-[65px] z-50 flex h-[calc(100dvh-65px)] w-[min(21rem,88vw)] flex-col overflow-y-auto border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out xl:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {!isLoading && profileData && (
          <MobileNavUserDetails
            profileData={profileData}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        )}

        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          {!isLoading &&
            !isFetchingProfile &&
            profileData &&
            showDashboardLink && (
              <AppLink
                href={dashboardHref}
                onClick={closeMobileMenu}
                className="mb-2 flex items-center justify-between rounded-xl bg-[#173c2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#225c42]"
              >
                {t("dashboard.title")}
                <span aria-hidden="true">→</span>
              </AppLink>
            )}

          {navItems.map((item) => {
            const isActive =
              normalizedPath === item.href ||
              normalizedPath.startsWith(`${item.href}/`);
            return (
              <AppLink
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#eff6f1] text-[#1b704b]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#1b704b]"
                }`}
              >
                {item.label}
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#1b704b]" />}
              </AppLink>
            );
          })}

          {!isLoading && !profileData && (
            <div className="mt-auto border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={openLogin}
                className="w-full rounded-xl bg-[#ffd84d] px-4 py-3.5 text-sm font-bold text-[#17251d] transition hover:bg-[#ffe47b]"
              >
                {t("common.login")} / {t("common.register")}
              </button>
            </div>
          )}
        </div>
      </aside>

      <SideLogin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
