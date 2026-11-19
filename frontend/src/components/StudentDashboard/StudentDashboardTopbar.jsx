import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import AppImage from "@/components/common/AppImage";
import AppLink from "@/components/common/AppLink";
import { useLogoutUserMutation } from "@/lib/features/auth/authApi";
import { toast } from "sonner";

export default function StudentDashboardTopbar({
  profile,
  currentCourse,
  onMenuClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      window.location.assign("/");
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open navigation menu"
        >
          <FiMenu size={21} />
        </button>
        {currentCourse?.thumbnail ? (
          <AppImage
            src={currentCourse.thumbnail}
            alt=""
            width={42}
            height={42}
            className="hidden h-10 w-10 shrink-0 rounded-lg object-cover sm:block"
          />
        ) : currentCourse ? (
          <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-900 sm:flex">
            <FiUser size={18} />
          </span>
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {currentCourse?.title || "Student dashboard"}
          </p>
          <p className="truncate text-xs text-slate-500">
            {currentCourse
              ? `${currentCourse.category?.name || "Course"} · ${currentCourse.level || ""}`
              : "Your learning overview"}
          </p>
        </div>
      </div>

      <div className="relative ml-3 shrink-0">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Open account menu"
          aria-haspopup="menu"
          className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 text-left transition hover:border-slate-200 hover:bg-slate-50 sm:gap-3 sm:px-2"
        >
          <AppImage
            src={profile?.avatar || "/images/default.jpg"}
            alt={profile?.name || "Student profile"}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full border border-slate-200 object-cover"
          />
          <span className="hidden max-w-36 sm:block">
            <span className="block truncate text-sm font-semibold text-slate-800">
              {profile?.name || "Student"}
            </span>
            <span className="block text-left text-xs capitalize text-slate-500">
              {profile?.role || "student"}
            </span>
          </span>
        </button>

        {menuOpen && (
          <div role="menu" className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
              <p className="truncate text-sm font-semibold text-slate-800">{profile?.name || "Student"}</p>
              <p className="truncate text-xs text-slate-500">Learning account</p>
            </div>
            <AppLink
              href="/profile"
              onClick={() => setMenuOpen(false)}
              role="menuitem"
              className="flex min-h-11 items-center gap-3 px-4 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <FiUser /> Profile
            </AppLink>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-3 border-t border-slate-100 px-4 text-left text-sm text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
            >
              <FiLogOut /> {isLoggingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
