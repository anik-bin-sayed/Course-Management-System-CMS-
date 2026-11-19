import { cloneElement, Suspense, useEffect, useRef, useState } from "react";

import { Outlet } from "react-router-dom";

import { RxCross2 } from "react-icons/rx";
import { TbCategory } from "react-icons/tb";
import { LiaBookSolid } from "react-icons/lia";
import { CiCirclePlus, CiVideoOn } from "react-icons/ci";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { IoCreateOutline, IoReorderThreeOutline } from "react-icons/io5";
import { FiLogOut, FiUser, FiUsers } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";
import { useRouter, useSearchParams } from "@/lib/navigation";
import { useGetProfileQuery, useLogoutUserMutation } from "@/lib/features/auth/authApi";

const navItems = [
  {
    id: "all-courses",
    activeIds: ["all-courses", "watch", "list-lessons", "lesson-information"],
    label: "All Courses",
    icon: <LiaBookSolid />,
  },
  {
    id: "all-free-videos",
    activeIds: ["all-free-videos", "edit-free-video"],
    label: "Free Videos",
    icon: <CiVideoOn />,
  },
  {
    id: "create-free-video",
    label: "Create Free Video",
    icon: <CiCirclePlus />,
  },
  {
    id: "create-course",
    label: "Create Course",
    icon: <IoCreateOutline />,
  },
  {
    id: "category-list",
    label: "Categories",
    icon: <TbCategory />,
  },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [highlightStyle, setHighlightStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
    width: 0,
    left: 0,
  });

  const navRef = useRef(null);
  const userMenuRef = useRef(null);
  const itemRefs = useRef([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profileData } = useGetProfileQuery();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const activeTab = searchParams.get("tab") || "all-courses";
  const activeItem = navItems.find((item) =>
    (item.activeIds || [item.id]).includes(activeTab),
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      window.location.assign("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const savedState = localStorage.getItem("manage-sidebar-collapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }
  }, []);

  useEffect(() => {
    const updateHighlight = () => {
      if (!navRef.current) return;
      const activeIndex = navItems.findIndex((item) =>
        (item.activeIds || [item.id]).includes(activeTab),
      );
      const activeEl = itemRefs.current[activeIndex];
      const navEl = navRef.current;
      if (!activeEl || !navEl) {
        setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      const navRect = navEl.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setHighlightStyle({
        top: elRect.top - navRect.top + navEl.scrollTop,
        height: elRect.height,
        width: elRect.width,
        left: elRect.left - navRect.left,
        opacity: 1,
      });
    };

    updateHighlight();

    const raf = requestAnimationFrame(updateHighlight);

    window.addEventListener("resize", updateHighlight);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateHighlight);
    };
  }, [activeTab, isSidebarCollapsed, isSidebarOpen, navItems.length]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((previousState) => {
      const nextState = !previousState;
      localStorage.setItem("manage-sidebar-collapsed", String(nextState));
      return nextState;
    });
  };

  const handleTabChange = (tabId) => {
    router.push(`?tab=${tabId}`, { scroll: false });
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-dashboard-root flex h-screen overflow-hidden bg-[#f5f8f6] text-slate-800">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 transition-all duration-300 ease-in-out lg:static ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className={`flex h-[4.5rem] items-center border-b border-slate-100 px-3 ${
            isSidebarCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isSidebarCollapsed && (
            <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="LearnHub home">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#173c2d] text-xl text-[#facc15] shadow-sm">
                <LiaBookSolid />
              </span>
              <span className="min-w-0">
              <span className="block text-base font-extrabold leading-5 tracking-tight text-slate-900">Learn<span className="text-emerald-800">Hub</span></span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Course studio</span>
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Open sidebar" : "Close sidebar"}
            className="rounded-lg border border-transparent p-2 text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          >
            {isSidebarCollapsed ? (
              <LuPanelLeftOpen className="cursor-pointer text-2xl text-gray-600 hover:text-black" />
            ) : (
              <LuPanelLeftClose className="cursor-pointer text-2xl text-gray-600 hover:text-black" />
            )}
          </button>

          <button
            type="button"
            className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <RxCross2 size={20} />
          </button>
        </div>

        <nav
          ref={navRef}
          className="relative flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden px-3 py-5"
        >
          <div
            className="pointer-events-none absolute rounded-lg bg-[#e7f4ec] transition-all duration-300 ease-out"
            style={{
              top: `${highlightStyle.top}px`,
              left: `${highlightStyle.left}px`,
              width: `${highlightStyle.width}px`,
              height: `${highlightStyle.height}px`,
              opacity: highlightStyle.opacity,
            }}
          />

          {!isSidebarCollapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Management
            </p>
          )}

          {navItems.map((item, index) => {
            const isActive = (item.activeIds || [item.id]).includes(activeTab);
            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onClick={() => handleTabChange(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`relative z-10 flex h-11 w-full cursor-pointer items-center rounded-lg text-sm transition-colors duration-200 ${
                  isSidebarCollapsed
                    ? "justify-center px-0"
                    : "justify-start px-3"
                } ${
                  isActive
                    ? "font-semibold text-[#173c2d]"
                    : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center text-2xl ${
                    isSidebarCollapsed ? "" : "mr-3"
                  }`}
                >
                  {cloneElement(item.icon, {
                    className: "text-2xl transition-all duration-200",
                  })}
                </span>
                {!isSidebarCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[4.5rem] shrink-0 items-center border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur lg:px-7">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-2xl text-slate-600 transition hover:bg-slate-50 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <IoReorderThreeOutline />
          </button>

          <div className="ml-3 mr-auto min-w-0 sm:ml-5">
            <p className="truncate text-sm font-semibold text-slate-900">{activeItem?.label || "Dashboard"}</p>
            <p className="hidden text-xs text-slate-500 sm:block">Manage your learning platform</p>
          </div>
          <div ref={userMenuRef} className="relative ml-auto">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              aria-label="Open account menu"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 shadow-sm transition hover:border-emerald-800/25 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/30 sm:gap-3 sm:pl-2 sm:pr-3"
            >
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
                <Image
                  src={profileData?.avatar || "/images/default.jpg"}
                  alt={profileData?.name || "User Avatar"}
                  width={36}
                  height={36}
                  className="h-full w-full rounded-full object-cover"
                />
              </span>
              <span className="hidden max-w-32 text-left sm:block">
                <span className="block truncate text-sm font-semibold text-slate-800">{profileData?.name || "Account"}</span>
                <span className="block text-left text-[11px] capitalize text-slate-500">{profileData?.role || "member"}</span>
              </span>
              <IoIosArrowDown className={`text-slate-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {isUserMenuOpen && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10">
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-800">{profileData?.name || "Account"}</p>
                  <p className="truncate text-xs text-slate-500">{profileData?.email || "Signed in"}</p>
                </div>
                <Link href="/profile" role="menuitem" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-emerald-800">
                  <FiUser className="text-base" /> My profile
                </Link>
                {profileData?.role === "admin" && (
                  <Link href="/admin/users" role="menuitem" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-emerald-800">
                    <FiUsers className="text-base" /> User management
                  </Link>
                )}
                <button type="button" role="menuitem" disabled={isLoggingOut} onClick={handleLogout} className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50 disabled:opacity-60">
                  <FiLogOut className="text-base" /> {isLoggingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f5f8f6] p-4 md:p-7">
          <Suspense
            fallback={
              <LoadingFallback
                label="Loading dashboard section..."
                variant="inline"
              />
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
