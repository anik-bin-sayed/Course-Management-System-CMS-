import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Link from "@/components/common/AppLink";
import Image from "@/components/common/AppImage";

import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";

import { useLogoutUserMutation } from "../../../lib/features/auth/authApi";

const NavbarUserDetails = ({ profileData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div ref={dropdownRef} className="relative hidden md:block">
      {/* User Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Open user menu"
        className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white py-1.5 pl-2 pr-3 shadow-sm transition duration-200 hover:border-[#1b704b]/30 hover:bg-[#f8fbf9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b704b]"
      >
        {/* Profile Image */}
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-[#eff6f1]">
          <Image
            src={profileData?.avatar || "/images/default.jpg"}
            alt={profileData?.name || "Profile"}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>

        <span className="hidden max-w-24 truncate text-sm font-semibold text-gray-700 xl:block">
          {profileData?.name?.split(" ")[0] || "Account"}
        </span>

        {/* Arrow */}
        <IoIosArrowDown
          className={`
            h-4 w-4 text-gray-500
            transition-transform duration-300
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-[#10251d]/15"
          >
            {/* User Information */}
            <div className="border-b border-gray-100 bg-[#f7faf8] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Signed in as</p>

              <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                {profileData?.email || "User"}
              </p>
            </div>

            {/* Profile */}
            <Link
              href="/profile"
              onClick={handleProfile}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-[#f7faf8] hover:text-[#1b704b]"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6f1]">
                <FiUser className="h-4 w-4 text-[#1b704b]" />
              </span>

              <span className="font-medium">Profile</span>
            </Link>

            {/* All Users - Admin Only */}
            {profileData?.role === "admin" && (
              <Link
                href="/admin/users"
                onClick={handleProfile}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-[#f7faf8] hover:text-[#1b704b]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eff6f1]">
                  <FiUser className="h-4 w-4 text-[#1b704b]" />
                </span>

                <span className="font-medium">All Users</span>
              </Link>
            )}

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                <FiLogOut className="h-4 w-4 text-red-500" />
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
