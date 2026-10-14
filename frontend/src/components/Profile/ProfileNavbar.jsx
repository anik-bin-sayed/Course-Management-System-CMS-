"use client";

import {
  authApi,
  useLogoutUserMutation,
} from "../../lib/features/auth/authApi";
import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import { usePathname } from "@/lib/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/lib/navigation";

import { useDispatch } from "react-redux";

import { FaSignOutAlt, FaChevronDown } from "react-icons/fa";

const ProfileNavbar = ({ profile }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();

  //   redux
  const [logoutUser] = useLogoutUserMutation();

  const hour = new Date().getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? "Good Morning "
      : hour >= 12 && hour < 17
        ? "Good Afternoon "
        : hour >= 17 && hour < 21
          ? "Good Evening "
          : "Good Night";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const logout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(authApi.util.resetApiState());
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-100/80 bg-white/80 px-6 py-3 shadow-sm backdrop-blur-md transition-all duration-300 md:px-10 lg:px-16">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 text-lg font-bold text-black">
            L
          </div>

          <div className="">
            <h2 className="text-lg font-bold text-gray-800">Learn Hub</h2>
            <p className="text-xs text-gray-500">Learning Platform</p>
          </div>
        </Link>

        <div className="h-10 w-px bg-gray-200 hidden sm:block" />

        <div className=" flex-col hidden sm:block">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-800">{greeting}</h2>

            <p className="hidden md:block font-medium text-gray-700">
              {profile?.name}
            </p>
          </div>

          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className={`
              flex items-center gap-2.5 
              rounded-xl border-2  transition-all duration-300
              hover:shadow-lg hover:scale-[1.02] active:scale-95
              ${
                open
                  ? "border-yellow-400 shadow-lg shadow-indigo-500/25"
                  : " bg-white/80 hover:border-gray-200 border-gray-200"
              }
              backdrop-blur-sm
              px-2 py-1.5
            `}
          >
            <div className="relative">
              <div
                className={`
                  absolute -inset-0.5 rounded-full opacity-75 blur-sm transition-opacity duration-300
                  ${open ? "opacity-100" : "opacity-0"}
                `}
              />
              <Image
                src={profile?.avatar || "/images/default.jpg"}
                alt="Profile"
                width={40}
                height={40}
                className="h-12 w-12 rounded-full object-cover border border-gray-300 shrink-0"
              />
            </div>

            <div className="flex items-center gap-2">
              <FaChevronDown
                className={`text-xs transition-all duration-300 ${
                  open ? "rotate-180 text-yellow-400" : "text-gray-400"
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden border shadow-2xl shadow-black/10 bg-white/95 border-gray-100/80 backdrop-blur-xl z-50">
              {/* User Info Header */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="relative w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold  border-2">
                      <Image
                        src={profile?.avatar || "/images/default.jpg"}
                        alt="Profile"
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover border border-gray-300 shrink-0"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-gray-800">
                      {profile?.name}
                    </h4>
                    <p className="text-sm text-gray-500">{profile?.email}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-4 h-px bg-gray-100" />

              {/* Logout Button */}
              <div className="p-2">
                <button
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 cursor-pointer border"
                  onClick={logout}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center border  transition-all duration-200">
                    <FaSignOutAlt />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Logout</p>
                    <p className="text-xs text-gray-400">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
