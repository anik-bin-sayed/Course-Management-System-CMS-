import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiPlayCircle,
  FiVideo,
  FiX,
} from "react-icons/fi";
import AppLink from "@/components/common/AppLink";
import { useLocation } from "react-router-dom";

const primaryItems = [
  { label: "My Courses", href: "/dashboard", icon: FiBookOpen },
];

const toolItems = [
  { label: "Build My CV", href: "/dashboard/build-my-cv", icon: FiFileText },
  { label: "Rewards", href: "/dashboard/rewards", icon: FiAward },
  { label: "Resources", href: "/dashboard/resources", icon: FiBookOpen },
  { label: "Recordings", href: "/dashboard/recordings", icon: FiPlayCircle },
  { label: "Live Class", href: "/dashboard/live-classes", icon: FiVideo },
  { label: "Schedules", href: "/dashboard/schedules", icon: FiCalendar },
];

function NavigationItem({ item, active, collapsed, onNavigate }) {
  const Icon = item.icon;

  return (
    <AppLink
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
        active
          ? "bg-emerald-50 font-semibold text-emerald-900 before:absolute before:bottom-2 before:left-0 before:top-2 before:w-1 before:rounded-r before:bg-emerald-800"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span>{item.label}</span>}
    </AppLink>
  );
}

export default function StudentSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
}) {
  const { pathname } = useLocation();
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
        />
      )}
      <aside
        aria-label="Student navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-[width,transform] duration-200 lg:shadow-none lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-[72px] shrink-0 items-center border-b border-slate-100 ${
            collapsed ? "justify-center px-3" : "justify-between px-5"
          }`}
        >
          <AppLink
            href="/dashboard"
            onClick={onClose}
            className="flex min-w-0 items-center gap-2"
            aria-label="LearnHub dashboard"
          >
            {!collapsed && (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-300 text-slate-950">
                <FiBookOpen size={19} aria-hidden="true" />
              </span>
            )}
            {!collapsed && (
              <span className="truncate text-lg font-bold text-slate-950">
                Learn<span className="text-amber-700">Hub</span>
              </span>
            )}
          </AppLink>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Close navigation menu"
          >
            <FiX size={19} />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="hidden rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 lg:block"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <FiChevronRight size={18} />
            ) : (
              <FiChevronLeft size={18} />
            )}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p
            className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 ${
              collapsed ? "sr-only" : ""
            }`}
          >
            Learning
          </p>
          <div className="space-y-1">
            {primaryItems.map((item) => (
              <NavigationItem
                key={item.label}
                item={item}
                active={pathname === item.href}
                collapsed={collapsed}
                onNavigate={onClose}
              />
            ))}
          </div>

          <p
            className={`mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 ${
              collapsed ? "sr-only" : ""
            }`}
          >
            Career & resources
          </p>
          <div className="space-y-1">
            {toolItems.map((item) => (
              <NavigationItem
                key={item.label}
                item={item}
                active={pathname === item.href}
                collapsed={collapsed}
                onNavigate={onClose}
              />
            ))}
          </div>
        </nav>

        {!collapsed && (
          <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
            Course learning portal
          </div>
        )}
      </aside>
    </>
  );
}
