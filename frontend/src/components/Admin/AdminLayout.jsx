import { cloneElement, Suspense, useEffect, useRef, useState } from "react";

import { Outlet } from "react-router-dom";

import { RxCross2 } from "react-icons/rx";
import { TbCategory } from "react-icons/tb";
import { LiaBookSolid } from "react-icons/lia";
import { CiCirclePlus, CiVideoOn } from "react-icons/ci";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { IoCreateOutline, IoReorderThreeOutline } from "react-icons/io5";

import Image from "@/components/common/AppImage";
import Link from "@/components/common/AppLink";
import { LoadingFallback } from "@/components/common/LazyLoadBoundary";
import { useRouter, useSearchParams } from "@/lib/navigation";
import { useGetProfileQuery } from "@/lib/features/auth/authApi";

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
  const [highlightStyle, setHighlightStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
    width: 0,
    left: 0,
  });

  const navRef = useRef(null);
  const itemRefs = useRef([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profileData } = useGetProfileQuery();
  const activeTab = searchParams.get("tab") || "all-courses";

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
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out lg:static ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className={`flex h-16 items-center border-b border-gray-200 px-3 ${
            isSidebarCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isSidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">Learn</span>
              <span className="rounded bg-yellow-500 px-2 py-1 text-xl font-bold text-gray-900">
                Hub
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Open sidebar" : "Close sidebar"}
            className="rounded-md p-2 transition-colors hover:bg-gray-100"
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
          className="relative flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4"
        >
          <div
            className="pointer-events-none absolute rounded bg-yellow-400 transition-all duration-300 ease-out"
            style={{
              top: `${highlightStyle.top}px`,
              left: `${highlightStyle.left}px`,
              width: `${highlightStyle.width}px`,
              height: `${highlightStyle.height}px`,
              opacity: highlightStyle.opacity,
            }}
          />

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
                className={`relative z-10 flex h-11 w-full cursor-pointer items-center rounded text-sm transition-colors duration-200 ${
                  isSidebarCollapsed
                    ? "justify-center px-0"
                    : "justify-start px-3"
                } ${
                  isActive
                    ? "text-black font-bold"
                    : "text-gray-500 hover:bg-gray-100 font-medium"
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
        <header className="flex h-16 items-center border-b border-gray-200 bg-white px-4 shadow lg:px-6">
          <button
            type="button"
            className="rounded-md border border-gray-300 px-2 py-1 text-2xl hover:bg-gray-100 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <IoReorderThreeOutline />
          </button>

          <div className="ml-auto flex items-center space-x-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2">
            <span className="text-sm text-gray-600">
              Welcome, {profileData?.name || "Admin"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-400 bg-gray-300">
              <Image
                src={profileData?.avatar || "/images/default.jpg"}
                alt={profileData?.name || "User Avatar"}
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
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
