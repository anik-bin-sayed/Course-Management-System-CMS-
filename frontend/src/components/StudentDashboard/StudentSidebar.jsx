import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiPlayCircle,
  FiVideo,
  FiX,
} from "react-icons/fi";
import AppLink from "@/components/common/AppLink";

const primaryItems = [
  { label: "My Courses", href: "/dashboard", icon: FiBookOpen },
  { label: "Explore Courses", href: "/upcoming-course", icon: FiCalendar },
];

const unavailableItems = [
  { label: "Live Classes", icon: FiVideo },
  { label: "Recordings", icon: FiPlayCircle },
  { label: "Resources", icon: FiFileText },
  { label: "Job Board", icon: FiBriefcase },
  { label: "Rewards", icon: FiAward },
  { label: "Build My CV", icon: FiFileText },
  { label: "AI Academy", icon: FiBookOpen },
];

function NavigationItem({ item, active, collapsed, onNavigate }) {
  const Icon = item.icon;

  return (
    <AppLink
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 px-3 text-sm font-medium transition-colors ${
        active
          ? "bg-amber-300 text-slate-950"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-[width,transform] duration-200 lg:translate-x-0 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-[72px] shrink-0 items-center border-b border-slate-200 ${
            collapsed ? "justify-center px-3" : "justify-between px-5"
          }`}
        >
          <AppLink
            href="/dashboard"
            onClick={onClose}
            className="flex min-w-0 items-center gap-2"
            aria-label="LearnHub dashboard"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-amber-300 text-slate-950">
              <FiBookOpen size={19} aria-hidden="true" />
            </span>
            {!collapsed && (
              <span className="truncate text-lg font-bold text-slate-950">
                Learn<span className="text-amber-700">Hub</span>
              </span>
            )}
          </AppLink>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close navigation menu"
          >
            <FiX size={19} />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="hidden p-2 text-slate-500 hover:bg-slate-100 lg:block"
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
            className={`mb-2 px-3 text-[11px] font-semibold uppercase text-slate-400 ${
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
                active={item.href === "/dashboard"}
                collapsed={collapsed}
                onNavigate={onClose}
              />
            ))}
          </div>

          <p
            className={`mb-2 mt-8 px-3 text-[11px] font-semibold uppercase text-slate-400 ${
              collapsed ? "sr-only" : ""
            }`}
          >
            More from LearnHub
          </p>
          <div className="space-y-1">
            {unavailableItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  disabled
                  title={`${item.label} is not available yet`}
                  aria-label={`${item.label}, not available yet`}
                  className={`flex min-h-11 w-full cursor-not-allowed items-center gap-3 px-3 text-left text-sm text-slate-400 ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {!collapsed && (
          <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
            Course learning portal
          </div>
        )}
      </aside>
    </>
  );
}
