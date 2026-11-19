import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { authApi, useLogoutUserMutation } from "../../lib/features/auth/authApi";
import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import { useRouter } from "@/lib/navigation";
import { useDispatch } from "react-redux";

const ProfileNavbar = ({ profile }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();

  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
        ? "Good afternoon"
        : hour >= 17 && hour < 21
          ? "Good evening"
          : "Good night";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-lg font-bold text-slate-950">
              L
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight text-slate-900">Learn Hub</span>
              <span className="block text-[11px] text-slate-500">Learning platform</span>
            </span>
          </Link>

          <span className="hidden h-9 w-px bg-slate-200 sm:block" />
          <div className="hidden min-w-0 sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {greeting}{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}
            </p>
            <p className="max-w-64 truncate text-xs text-slate-500">{profile?.email}</p>
          </div>
        </div>

        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label="Open account menu"
            className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-colors duration-200 hover:shadow-sm ${
              open
                ? "border-emerald-700/40 bg-emerald-50/50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <Image
              src={profile?.avatar || "/images/default.jpg"}
              alt={profile?.name || "Profile"}
              width={40}
              height={40}
              className="h-9 w-9 rounded-full border border-slate-200 object-cover"
            />
            <span className="hidden max-w-32 text-left sm:block">
              <span className="block truncate text-sm font-semibold text-slate-800">
                {profile?.name || "Account"}
              </span>
              <span className="block text-xs capitalize text-slate-500">{profile?.role || "Member"}</span>
            </span>
            <FaChevronDown className={`mr-1 text-[11px] text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4">
                <Image
                  src={profile?.avatar || "/images/default.jpg"}
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{profile?.name || "Account"}</p>
                  <p className="truncate text-xs text-slate-500">{profile?.email}</p>
                </div>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-left text-rose-700 transition hover:border-rose-100 hover:bg-rose-50"
                  onClick={logout}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                    <FaSignOutAlt />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">Log out</span>
                    <span className="block text-xs text-slate-500">Sign out of your account</span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileNavbar;
