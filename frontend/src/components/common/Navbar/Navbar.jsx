import { useEffect, useState, useRef } from "react";
import Link from "@/components/common/AppLink";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { setUser } from "../../../lib/features/auth/authSlice.js";
import { useGetProfileQuery } from "../../../lib/features/auth/authApi";
import {
  isEnrollmentEligible,
  useGetMyEnrollmentsQuery,
} from "../../../lib/features/enrollment/enrollmentApi";

import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

import Search from "./Search.jsx";
import SideLogin from "../../Sidebar/SideLogin.jsx";
import NavbarUserDetails from "./NavbarUserDetails.jsx";
import MobileNavUserDetails from "./MovileNavUserDetails.jsx";
import LanguageSwitchButton from "./LanguageSwitchButton.jsx";
import AppLink from "../AppLink.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navRef = useRef();
  const menuRef = useRef();
  const searchInputRef = useRef();
  const dropdownRef = useRef(null);

  const desktopLinksRef = useRef(null);
  const desktopLinkRefs = useRef({});
  const [highlightStyle, setHighlightStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

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
    if (location.state?.openLogin) {
      setSidebarOpen(true);
    }
  }, [location.state]);

  const desktopNavItems = [
    { id: "job-success", href: "/job-success", label: t("common.jobSuccess") },
    {
      id: "upcoming-course",
      href: "/upcoming-course",
      label: t("common.allCourses"),
    },
    {
      id: "free-courses",
      href: "/free-courses",
      label: t("common.freeCourses"),
    },
  ];

  const activeDesktopId =
    desktopNavItems.find((item) => location.pathname === item.href)?.id || null;

  useEffect(() => {
    const updateHighlight = () => {
      if (!desktopLinksRef.current) return;
      const activeEl = desktopLinkRefs.current[activeDesktopId];
      const navEl = desktopLinksRef.current;
      if (!activeEl || !navEl) {
        setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      const navRect = navEl.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setHighlightStyle({
        left: elRect.left - navRect.left + navEl.scrollLeft,
        width: elRect.width,
        opacity: 1,
      });
    };

    updateHighlight();

    const raf = requestAnimationFrame(updateHighlight);
    window.addEventListener("resize", updateHighlight);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateHighlight);
    };
  }, [activeDesktopId, location.pathname]);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setShowNavbar(false);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

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
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(setUser({ user: profileData }));
  }, [profileData, dispatch]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("navbar-visibility-change", {
        detail: {
          visible: showNavbar,
        },
      }),
    );
  }, [showNavbar]);

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <nav
        ref={navRef}
        className={`bg-white border-b border-gray-100 px-4 sm:px-6 py-3 fixed top-0 left-0 right-0 z-50 transition-transform duration-150 ease-out ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-350 mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-lg">
              Learn
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Hub
            </span>
          </Link>

          <div className="hidden lg:flex flex-1 max-w-md ml-6">
            <Search
              query={""}
              setQuery={() => {}}
              searchInputRef={searchInputRef}
            />
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div
              ref={desktopLinksRef}
              className="relative flex items-center gap-6"
            >
              <div
                className="pointer-events-none absolute bottom-0 rounded-full bg-black transition-all duration-300 ease-out"
                style={{
                  left: `${highlightStyle.left}px`,
                  width: `${highlightStyle.width}px`,
                  height: "2px",
                  opacity: highlightStyle.opacity,
                }}
              />

              {desktopNavItems.map((item) => {
                const isActive = activeDesktopId === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    ref={(el) => {
                      desktopLinkRefs.current[item.id] = el;
                    }}
                    className={`relative pb-2 text-sm transition-colors duration-200 ${
                      isActive
                        ? "font-semibold text-black"
                        : "font-medium text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="h-5 w-px bg-gray-300 mx-1"></div>

            <LanguageSwitchButton />

            {!isLoading && profileData && showDashboardLink && (
              <AppLink
                href={dashboardHref}
                className="px-4 py-2 text-gray-50 bg-gray-800 hover:text-white hover:bg-black rounded"
              >
                <span>{t("dashboard.title")}</span>
              </AppLink>
            )}

            {!isLoading && (
              <>
                {profileData ? (
                  <NavbarUserDetails profileData={profileData} />
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSidebar}
                      className="bg-[#FFD700] text-black text-sm font-bold px-5 py-2 rounded-md hover:bg-yellow-500 transition shadow-sm cursor-pointer"
                    >
                      {t("common.login")} / {t("common.register")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <LanguageSwitchButton />
            <AppLink
              href="/search"
              className="p-2 text-gray-600 bg-gray-100 rounded-full"
            >
              <FaSearch size={18} />
            </AppLink>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 bg-gray-100 rounded-full focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        ref={menuRef}
        className={`fixed top-15 right-0 h-full w-72 bg-white z-50 shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {!isLoading && profileData && (
          <MobileNavUserDetails
            profileData={profileData}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        )}

        <div className="p-5 space-y-2 flex flex-col">
          {!isLoading &&
            !isFetchingProfile &&
            profileData &&
            showDashboardLink && (
              <Link
                href={dashboardHref}
                className="px-4 py-2 text-gray-50 bg-gray-800 hover:text-white hover:bg-black rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("dashboard.title")}
              </Link>
            )}

          <Link
            href="/job-success"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("common.jobSuccess")}
          </Link>
          <Link
            href="/free-courses"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("common.freeCourses")}
          </Link>
          <Link
            href="/upcoming-course"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("common.allCourses")}
          </Link>

          {!isLoading && !profileData && (
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={handleSidebar}
                className="w-full py-2.5 text-center text-gray-700 font-semibold rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {t("common.login")}
              </button>
              <button
                onClick={handleSidebar}
                className="w-full py-2.5 text-center text-black font-bold rounded-md bg-[#FFD700] hover:bg-yellow-500 transition-colors"
              >
                {t("common.register")}
              </button>
            </div>
          )}
        </div>
      </div>

      <SideLogin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
