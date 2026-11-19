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
    <div className="border-b border-gray-100 bg-[#f7faf8] p-4">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl p-2 text-left transition hover:bg-white"
      >
        <div className="flex items-center gap-3">
          <Image
            src={profileData?.avatar || "/images/default.jpg"}
            alt="Profile"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full border border-white object-cover shadow-sm ring-2 ring-[#dcece1]"
          />

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-[#17251d]">
              {profileData?.name}
            </h3>

            <p className="truncate text-xs text-gray-500">
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
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="space-y-1 px-2 pb-2 pt-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 transition hover:border-[#1b704b]/25 hover:bg-[#eff6f1] hover:text-[#1b704b]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FaUser />
            <span>Profile</span>
          </Link>

          {profileData?.role === "admin" && (
            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 transition hover:border-[#1b704b]/25 hover:bg-[#eff6f1] hover:text-[#1b704b]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaUser />
              <span>All Users</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-red-600 transition hover:border-red-100 hover:bg-red-50"
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
