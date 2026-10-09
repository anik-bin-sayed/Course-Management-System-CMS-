"use client";

import { cloneElement, useEffect, useState } from "react";

import Link from "@/components/common/AppLink";
import Image from "@/components/common/AppImage";
import { useRouter, useSearchParams } from "@/lib/navigation";

import { RxCross2 } from "react-icons/rx";
import { TbCategory } from "react-icons/tb";
import { LiaBookSolid } from "react-icons/lia";
import { CiCirclePlus, CiVideoOn } from "react-icons/ci";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { IoCreateOutline, IoReorderThreeOutline } from "react-icons/io5";

import AllCourse from "./AllCourse";
import FreeVideoList from "./FreeCourse/FreeVideoList";
import CreateFreeVideos from "./FreeCourse/CreateFreeVideos";
import CreateCourse from "./Course/CreateCourse";
import EditCourse from "./Course/EditCourse";
import EditPaidCourse from "./Course/EditPaidCourse";
import CategoryList from "./category/CategoryList";
import CreateLesson from "./Lesson/CreateLesson";
import ListLesson from "./Lesson/ListLesson";
import EditLesson from "./Lesson/EditLesson";
import AddLessonInfo from "./Lesson/AddLessonInfo";
import LessonInformation from "./Lesson/LessonInformation";

const ManageCourse = ({ profileData }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "all-free-videos";

  const renderContent = () => {
    switch (activeTab) {
      case "all-courses":
        return <AllCourse />;

      case "all-free-videos":
        return <FreeVideoList />;

      case "create-free-video":
        return <CreateFreeVideos />;
      case "create-course":
        return <CreateCourse />;

      case "edit-course":
        return <EditCourse />;

      case "edit-paid-course":
        return <EditPaidCourse />;

      case "category-list":
        return <CategoryList />;

      case "create-lessons":
        return <CreateLesson />;

      case "list-lessons":
        return <ListLesson />;

      case "edit-lesson":
        return <EditLesson />;

      case "create-lesson-information":
        return <AddLessonInfo />;

      case "lesson-information":
        return <LessonInformation />;

      // case "lesson-information":
      //   return <LessonInformation />;

      default:
        return <div className="p-6">Select an option</div>;
    }
  };

  const navItems = [
    { id: "all-courses", label: "All Courses", icon: <LiaBookSolid /> },
    { id: "all-free-videos", label: "Free Videos", icon: <CiVideoOn /> },
    {
      id: "create-free-video",
      label: "Create Free Video",
      icon: <CiCirclePlus />,
    },
    { id: "create-course", label: "Create Course", icon: <IoCreateOutline /> },
    { id: "category-list", label: "Categories", icon: <TbCategory /> },
  ];

  useEffect(() => {
    const savedState = localStorage.getItem("manage-sidebar-collapsed");

    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const newState = !prev;

      localStorage.setItem("manage-sidebar-collapsed", String(newState));

      return newState;
    });
  };

  const handleTabChange = (tabId) => {
    router.push(`?tab=${tabId}`, {
      scroll: false,
    });

    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static
          inset-y-0 left-0 z-30
          ${isSidebarCollapsed ? "w-20" : "w-64"}
          bg-white
          shadow-lg
          flex flex-col
          transition-all duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div
          className={`
    flex items-center
    h-16
    px-3
    border-b border-gray-200
    ${isSidebarCollapsed ? "justify-center" : "justify-between"}
  `}
        >
          {!isSidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">Learn</span>

              <span className="text-xl bg-yellow-500 rounded px-2 py-1 font-bold text-gray-900">
                Hub
              </span>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Open sidebar" : "Close sidebar"}
            className="rounded-md p-2 hover:bg-gray-100 transition-colors "
          >
            {isSidebarCollapsed ? (
              <LuPanelLeftOpen className="text-2xl cursor-pointer text-gray-600 hover:text-black" />
            ) : (
              <LuPanelLeftClose className="text-2xl cursor-pointer text-gray-600 hover:text-black" />
            )}
          </button>

          {/* Mobile close */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(false)}
          >
            <RxCross2 size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`
        flex items-center
        w-full
        h-11
        cursor-pointer
        rounded-lg
        text-sm font-medium
        transition-all duration-200
        ${isSidebarCollapsed ? "justify-center px-0" : "justify-start px-3"}
        ${
          activeTab === item.id
            ? "bg-yellow-400 text-black"
            : "text-gray-500 hover:bg-gray-100"
        }
      `}
            >
              <span
                className={`
          flex items-center justify-center
          shrink-0 
          ${isSidebarCollapsed ? "" : "mr-3"}
        `}
              >
                {cloneElement(item.icon, {
                  className: `
            transition-all duration-200
            ${isSidebarCollapsed ? "text-2xl" : "text-2xl"}
          `,
                })}
              </span>
              {!isSidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
        {/* Sidebar footer (optional) */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Admin Panel v1.0</p>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with hamburger */}
        <header className="bg-white h-16 flex items-center px-4 lg:px-6 border-b border-gray-200 shadow">
          <button
            className="lg:hidden px-2 py-1 rounded-md hover:bg-gray-100 border border-gray-300 text-2xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            <IoReorderThreeOutline />
          </button>
          <h1 className="text-lg font-semibold ml-3">
            {navItems.find((item) => item.id === activeTab)?.label ||
              "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center space-x-3 border border-gray-300 px-4 py-2 rounded-lg bg-gray-100">
            <span className="text-sm text-gray-600">Welcome, Admin</span>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border border-gray-400 overflow-hidden">
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

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ManageCourse;
