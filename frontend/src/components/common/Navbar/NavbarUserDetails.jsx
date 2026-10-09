"use client";

import React, { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import Link from "@/components/common/AppLink";
import Image from "@/components/common/AppImage";

import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";

import { useLogoutUserMutation } from "../../../lib/features/auth/authApi";

const NavbarUserDetails = ({ profileData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  //   redux
  const [logoutUser] = useLogoutUserMutation();

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

  const handleProfile = () => {
    setIsOpen(false);

    console.log("Profile clicked");
  };

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await logoutUser().unwrap();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div ref={dropdownRef} className="hidden md:block relative">
      {/* User Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex items-center gap-3
          px-3 py-2
          rounded-xl
          border border-gray-200
          bg-white
          hover:bg-gray-50
          transition-all duration-200
          cursor-pointer
          shadow-sm
        "
      >
        {/* Profile Image */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
          <Image
            src={profileData?.avatar || "/images/default.jpg"}
            alt={profileData?.name || "Profile"}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        {/* Arrow */}
        <IoIosArrowDown
          className={`
            w-4 h-4
            text-gray-500
            transition-transform duration-300
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="
              absolute
              right-0
              top-full
              mt-2
              w-52
              rounded-xl
              border border-gray-200
              bg-white
              shadow-xl
              shadow-gray-200/50
              overflow-hidden
              z-50
            "
          >
            {/* Dropdown Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">Signed in as</p>

              <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">
                {profileData?.email}
              </p>
            </div>

            {/* Profile */}
            <Link
              href="/profile"
              onClick={handleProfile}
              className="
                w-full
                flex items-center gap-3
                px-4 py-3
                text-sm
                text-gray-700
                hover:bg-gray-50
                transition-colors
                cursor-pointer
              "
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                <FiUser className="w-4 h-4 text-gray-600" />
              </span>

              <span className="font-medium">Profile</span>
            </Link>

            {/* All users */}

            {profileData?.role === "admin" && (
              <Link
                href="/admin/users"
                onClick={handleProfile}
                className="
                w-full
                flex items-center gap-3
                px-4 py-3
                text-sm
                text-gray-700
                hover:bg-gray-50
                transition-colors
                cursor-pointer 
              "
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100">
                  <FiUser className="w-4 h-4 text-gray-600" />
                </span>

                <span className="font-medium">All Users</span>
              </Link>
            )}

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex items-center gap-3
                px-4 py-3
                text-sm
                text-red-600
                hover:bg-red-50
                transition-colors
                cursor-pointer
              "
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
                <FiLogOut className="w-4 h-4 text-red-500" />
              </span>

              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarUserDetails;
