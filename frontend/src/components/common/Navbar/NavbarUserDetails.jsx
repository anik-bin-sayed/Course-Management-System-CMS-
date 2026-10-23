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
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">Signed in as</p>

              <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">
                {profileData?.email}
              </p>
            </div>

<<<<<<< Updated upstream
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
=======
            <div className="grid grid-cols-2 gap-3 p-4 w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100">
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
              <span className="font-medium">Logout</span>
            </button>
=======
              {profileData?.role === "admin" ? (
                <Link
                  href="/admin/users"
                  onClick={handleProfile}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all duration-200 group"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-gray-600 group-hover:text-[#00A651] transition-colors">
                    <FiUsers className="w-5 h-5" />
                  </span>
                  <span className="font-semibold text-xs text-gray-700 text-center">
                    All Users
                  </span>
                </Link>
              ) : (
                <div className="hidden"></div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-red-50/50 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200 group"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-red-500 group-hover:text-red-600 transition-colors">
                  <FiLogOut className="w-5 h-5" />
                </span>
                <span className="font-semibold text-xs text-red-600 text-center">
                  Logout
                </span>
              </button>
            </div>
>>>>>>> Stashed changes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarUserDetails;
