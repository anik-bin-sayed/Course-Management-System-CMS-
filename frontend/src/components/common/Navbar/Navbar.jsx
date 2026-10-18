import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "@/components/common/AppLink";
import { useDispatch } from "react-redux";
import { setUser } from "../../../lib/features/auth/authSlice.js";
import { useGetProfileQuery } from "../../../lib/features/auth/authApi";

// Icons
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

// additional
import Search from "./Search.jsx";
import SideLogin from "../../Sidebar/SideLogin.jsx";
import NavbarUserDetails from "./NavbarUserDetails.jsx";
import MobileNavUserDetails from "./MovileNavUserDetails.jsx";
import LanguageSelector from "./LanguageSelector.jsx";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage || i18n.language;

  const navRef = useRef();
  const menuRef = useRef();
  const searchInputRef = useRef();
  const dispatch = useDispatch();

  // redux
  const { data: profileData, isLoading } = useGetProfileQuery();
  const dashboardHref =
    profileData?.role === "student" ? "/dashboard" : "/admin/manage-course";

  // Handle scroll
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setShowNavbar(false);
      if (mobileMenuOpen) setMobileMenuOpen(false);
      if (searchOpen) setSearchOpen(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileMenuOpen, searchOpen]);

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
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 200);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(setUser({ user: profileData }));
  }, [profileData, dispatch]);

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav
        ref={navRef}
        className={`bg-white border-b border-gray-100 px-4 sm:px-6 py-3 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-350 mx-auto flex items-center justify-between gap-4">
          {/* 1. Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold text-lg">
              Learn
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Hub
            </span>
          </Link>

          {/* 2. Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md ml-6">
            <Search
              query={""}
              setQuery={() => {}}
              searchInputRef={searchInputRef}
            />
          </div>

          {/* 3. Right Side Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/job-success"
              className="text-sm font-semibold text-gray-800 hover:text-gray-600 transition"
            >
              {t("common.jobSuccess")}
            </Link>
            <Link
              href="/upcoming-course"
              className="text-sm font-semibold text-gray-800 hover:text-gray-600 transition"
            >
              {t("common.allCourses")}
            </Link>
            <Link
              href="/free-courses"
              className="text-sm font-semibold text-gray-800 hover:text-gray-600 transition"
            >
              {t("common.freeCourses")}
            </Link>

            <div className="h-5 w-px bg-gray-300 mx-1"></div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Auth Buttons */}
            {!isLoading && (
              <>
                {profileData ? (
                  <NavbarUserDetails profileData={profileData} />
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSidebar}
                      className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition"
                    >
                      {t("common.login")}
                    </button>
                    <button
                      onClick={handleSidebar}
                      className="bg-[#FFD700] text-black text-sm font-bold px-5 py-2 rounded-md hover:bg-yellow-500 transition shadow-sm"
                    >
                      {t("common.register")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 4. Mobile Icons & Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 bg-gray-100 rounded-full"
            >
              <FaSearch size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 bg-gray-100 rounded-full focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Toggle) */}
        {searchOpen && (
          <div className="lg:hidden mt-3 relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <Search />
          </div>
        )}
      </nav>

      {/* Mobile Menu (Slide from right) */}
      <div
        ref={menuRef}
        className={`fixed top-[60px] right-0 h-full w-72 bg-white z-50 shadow-2xl lg:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {!isLoading && profileData && (
          <MobileNavUserDetails profileData={profileData} />
        )}

        <div className="p-5 space-y-2 flex flex-col">
          {/* Mobile Language Selector */}
          <div className="mb-3 rounded-xl border border-gray-200 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("common.language")}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => changeLanguage("en")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  currentLanguage === "en"
                    ? "border-[#00A651] bg-green-50 text-[#00A651]"
                    : "border-gray-200 text-gray-700"
                }`}
              >
                🌐 {t("common.english")}
              </button>

              <button
                type="button"
                onClick={() => changeLanguage("bn")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  currentLanguage === "bn"
                    ? "border-[#00A651] bg-green-50 text-[#00A651]"
                    : "border-gray-200 text-gray-700"
                }`}
              >
                🇧🇩 {t("common.bengali")}
              </button>
            </div>
          </div>
          {profileData && (
            <Link
              href={dashboardHref}
              className="flex items-center justify-center bg-[#00A651] px-4 py-2.5 text-sm font-bold text-white rounded-md"
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
