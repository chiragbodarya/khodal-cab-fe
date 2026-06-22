import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuCalendar,
  LuSettings,
  LuLogOut,
  LuShield,
  LuUser,
  LuClipboardList,
  LuChevronLeft,
  LuChevronRight,
  LuFileText,
  LuZap,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import type { UserRole } from "../../redux/slices/authSlice";

interface NavItem {
  label: string;
  path: string;
  Icon: IconType;
}

const navConfig: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", path: "/", Icon: LuLayoutDashboard },
    { label: "User Management", path: "/admin/users", Icon: LuUsers },
    { label: "Role Management", path: "/admin/roles", Icon: LuShield },
    { label: "Analytics", path: "/admin/analytics", Icon: LuShield },
    { label: "System Settings", path: "/admin/settings", Icon: LuSettings },
  ],
  manager: [
    { label: "Dashboard", path: "/", Icon: LuLayoutDashboard },
    { label: "Task Management", path: "/manager/tasks", Icon: LuClipboardList },
    { label: "Team", path: "/manager/team", Icon: LuUsers },
    { label: "Reports", path: "/manager/reports", Icon: LuFileText },
    { label: "Calendar", path: "/calendar", Icon: LuCalendar },
  ],
  user: [
    { label: "Dashboard", path: "/", Icon: LuLayoutDashboard },
    { label: "My Tasks", path: "/tasks", Icon: LuUser },
    { label: "Calendar", path: "/calendar", Icon: LuCalendar },
    { label: "Profile", path: "/profile", Icon: LuUser },
  ],
};

const roleMeta: Record<UserRole, { label: string; cls: string }> = {
  admin: {
    label: "Admin",
    cls: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  },
  manager: {
    label: "Manager",
    cls: "bg-white/8 text-zinc-300 border border-zinc-700",
  },
  user: {
    label: "User",
    cls: "bg-zinc-800 text-zinc-400 border border-zinc-700",
  },
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const role: UserRole = user?.role ?? "user";
  const navItems = navConfig[role];
  const badge = roleMeta[role];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-zinc-950 border-r border-zinc-800/80
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-[72px]" : "w-[240px]"}
      `}
    >
      {/* ── Logo ── */}
      <div
        className={`flex items-center h-[72px] border-b border-zinc-800/80 px-4 flex-shrink-0
          ${collapsed ? "justify-center" : "gap-3"}`}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <LuZap size={18} className="text-zinc-950" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">
            TaskFlow
          </span>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-[84px] z-10 w-7 h-7 rounded-full
          bg-zinc-900 border border-zinc-800 flex items-center justify-center
          text-zinc-500 hover:text-yellow-400 hover:border-yellow-400/40
          transition-all duration-200 cursor-pointer shadow-lg"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <LuChevronRight size={14} /> : <LuChevronLeft size={14} />}
      </button>

      {/* ── Role badge ── */}
      {!collapsed && user && (
        <div className="px-4 pt-4 pb-1 flex-shrink-0">
          <span
            className={`inline-flex items-center text-[10px] font-bold uppercase
              tracking-widest px-2 py-1 rounded-md ${badge.cls}`}
          >
            {badge.label}
          </span>
        </div>
      )}

      {/* ── Nav label ── */}
      {!collapsed && (
        <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest flex-shrink-0">
          Navigation
        </p>
      )}

      {/* ── Nav items ── */}
      <nav
        className={`flex-1 overflow-y-auto py-1.5 space-y-0.5
          ${collapsed ? "px-2" : "px-3"}`}
      >
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
               font-medium transition-all duration-200 group
               ${collapsed ? "justify-center" : ""}
               ${
                 isActive
                   ? "text-yellow-400 bg-yellow-400/8"
                   : "text-zinc-500 hover:text-white hover:bg-zinc-900"
               }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-yellow-400" />
                )}
                <span
                  className={`flex-shrink-0 transition-colors
                    ${isActive ? "text-yellow-400" : "group-hover:text-yellow-400/70"}`}
                >
                  <Icon size={18} />
                </span>
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-3 border-t border-zinc-800/80 flex-shrink-0" />

      {/* ── Bottom actions ── */}
      <div className={`py-2 space-y-0.5 flex-shrink-0 ${collapsed ? "px-2" : "px-3"}`}>
        <NavLink
          to="/settings"
          title={collapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
             transition-all duration-200 group
             ${collapsed ? "justify-center" : ""}
             ${
               isActive
                 ? "text-yellow-400 bg-yellow-400/8"
                 : "text-zinc-500 hover:text-white hover:bg-zinc-900"
             }`
          }
        >
          <LuSettings
            size={18}
            className="flex-shrink-0 group-hover:text-yellow-400/70 transition-colors"
          />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-zinc-500 hover:text-red-400 hover:bg-red-400/5
            transition-all duration-200 group cursor-pointer
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LuLogOut
            size={18}
            className="flex-shrink-0 group-hover:text-red-400 transition-colors"
          />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* ── User card ── */}
      {!collapsed && user && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-zinc-950 text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
