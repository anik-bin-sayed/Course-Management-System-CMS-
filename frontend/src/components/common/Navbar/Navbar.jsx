"use client";

import { useEffect, useState, useRef } from "react";

import Link from "@/components/common/AppLink";

// redux
import { useDispatch } from "react-redux";

// rtk
import { setUser } from "../../../lib/features/auth/authSlice.js";
import { useGetProfileQuery } from "../../../lib/features/auth/authApi";

// additional
import Search from "./Search.jsx";
import SideLogin from "../../Sidebar/SideLogin.jsx";
import NavbarUserDetails from "./NavbarUserDetails.jsx";
import MobileNavUserDetails from "./MovileNavUserDetails.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  //  show login sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navRef = useRef();
  const menuRef = useRef();
  const searchInputRef = useRef();
  const dropdownRef = useRef(null);
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

  // Close mobile menu when clicking outside
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

  // Close search on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  //    When search opens, focus the input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 200);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown when clicking outside
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

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navbar */}
      <nav
        ref={navRef}
        className={`bg-white backdrop-blur-md border-b border-gray-100/50 px-4 sm:px-6 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">Learn </span>
          <span className="text-xl bg-yellow-500 rounded px-2 py-1 font-bold text-gray-900">
            Hub
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 mx-10">
          <Search />
        </div>

        {/* Right side: Login/Register + Search Icon + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className=" gap-2 hidden md:flex">
            <Link
              href="/free-courses"
              className="flex items-center justify-center  bg-gray-200 hover:outline outline-black/40 text-black px-4 py-2 rounded-md text-md cursor-pointer"
            >
              Free Courses
            </Link>

            <Link
              href="/upcoming-course"
              className="flex items-center justify-center  bg-gray-200 hover:outline outline-black/40 text-black px-4 py-2 rounded-md text-md cursor-pointer"
            >
              All Courses
            </Link>

            {/* Dashboard */}
            {profileData && (
              <Link
                href={dashboardHref}
                className="flex items-center justify-center bg-black px-4 py-2 text-md text-white"
              >
                Dashboard
              </Link>
            )}
          </div>
          {!isLoading && (
            <div>
              {profileData ? (
                <NavbarUserDetails profileData={profileData} />
              ) : (
                <button
                  onClick={handleSidebar}
                  className="px-3 sm:px-5 py-1.5 sm:py-2 text-gray-700 font-medium rounded-md bg-yellow-500  hover:bg-yellow-600 transition-colors duration-200 cursor-pointer text-sm sm:text-base hidden md:flex items-center gap-6 lg:gap-8"
                >
                  Login/Register
                </button>
              )}
            </div>
          )}
          {/* Hamburger Menu Button (mobile only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 ml-1 text-black focus:outline-none gap-1 rounded bg-gray-200"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-19 right-0 h-full w-72 bg-white z-50 shadow-2xl md:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {!isLoading && profileData && (
          <MobileNavUserDetails profileData={profileData} />
        )}
        <div className="p-6 pt-8 space-y-4">
          <div className="space-y-2">
            {profileData && (
              <div>
                <Link
                  href={dashboardHref}
                  className="flex items-center justify-center bg-black px-4 py-2 text-md text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            )}

            <a
              href="#"
              className="flex items-center justify-center  bg-gray-200 hover:outline outline-black/40 text-black px-4 py-2 rounded-md text-md cursor-pointer "
              onClick={() => setMobileMenuOpen(false)}
            >
              All Courses
            </a>
            <Link
              href="/free-courses"
              className="flex items-center justify-center  bg-gray-200 hover:outline outline-black/40 text-black px-4 py-2 rounded-md text-md cursor-pointer "
              onClick={() => setMobileMenuOpen(false)}
            >
              Free Courses
            </Link>
          </div>
          {!isLoading && !profileData && (
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={handleSidebar}
                className="w-full py-2 text-center text-black font-medium rounded-lg hover:bg-gray-50 transition-colors bg-yellow-600"
              >
                Login/Register
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
