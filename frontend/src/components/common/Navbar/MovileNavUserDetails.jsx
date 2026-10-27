"use client";

import { useLogoutUserMutation } from "../../../lib/features/auth/authApi";
import Image from "@/components/common/AppImage";

import Link from "@/components/common/AppLink";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const MobileNavUserDetails = ({ profileData, setMobileMenuOpen }) => {
  const [open, setOpen] = useState(false);

  //   redux
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="border-b border-gray-200 bg-gray-50">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Image
            src={profileData?.avatar || "/images/default.jpg"}
            alt="Profile"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover border border-gray-300 shrink-0"
          />

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-gray-800">
              {profileData?.name}
            </h3>

            <p className="truncate text-sm text-gray-500">
              {profileData?.email}
            </p>
          </div>
        </div>

        {open ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </button>

      {/* Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="px-3 pb-3 space-y-1">
          <Link
            href="/profile"
            className="flex border border-gray-200 items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaUser />
            <span>Profile</span>
          </Link>

          {profileData?.role === "admin" && (
            <Link
              href="/admin/users"
              className="flex border border-gray-200 items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaUser />
              <span>All Users</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex border border-gray-200  w-full items-center gap-3 rounded-lg px-3 py-3 text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavUserDetails;
