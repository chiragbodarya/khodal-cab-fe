import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuBus,
  LuMapPin,
  LuFileText,
  LuLogOut,
  LuChevronLeft,
  LuChevronRight,
  LuCompass,
  LuArrowLeft,
} from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";

export const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", path: "/backstage/dashboard", Icon: LuLayoutDashboard },
    { label: "Manage Fleet", path: "/backstage/fleet", Icon: LuBus },
    { label: "Manage Places", path: "/backstage/plans", Icon: LuMapPin },
    { label: "Manage Blogs", path: "/backstage/blogs", Icon: LuFileText },
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

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
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
          <LuCompass size={18} className="text-zinc-950 animate-spin-slow" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-base tracking-tight">
            Golden<span className="text-amber-400">Way</span> Admin
          </span>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-[84px] z-10 w-7 h-7 rounded-full
          bg-zinc-900 border border-zinc-800 flex items-center justify-center
          text-zinc-500 hover:text-amber-400 hover:border-amber-400/40
          transition-all duration-200 cursor-pointer shadow-lg"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <LuChevronRight size={14} /> : <LuChevronLeft size={14} />}
      </button>

      {/* ── Role badge ── */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1 flex-shrink-0">
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
            Administrator
          </span>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav
        className={`flex-1 overflow-y-auto py-4 space-y-1
          ${collapsed ? "px-2" : "px-3"}`}
      >
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/backstage/dashboard"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
               font-medium transition-all duration-200 group
               ${collapsed ? "justify-center" : ""}
               ${
                 isActive
                   ? "text-amber-400 bg-amber-400/8"
                   : "text-zinc-500 hover:text-white hover:bg-zinc-900"
               }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-amber-400" />
                )}
                <span
                  className={`flex-shrink-0 transition-colors
                    ${isActive ? "text-amber-400" : "group-hover:text-amber-400/70"}`}
                >
                  <Icon size={18} />
                </span>
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom actions ── */}
      <div className={`py-2 space-y-1 border-t border-zinc-800/80 flex-shrink-0 ${collapsed ? "px-2" : "px-3"}`}>
        <Link
          to="/"
          title={collapsed ? "Go to Public Site" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
             text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all duration-200 group
             ${collapsed ? "justify-center" : ""}`}
        >
          <LuArrowLeft
            size={18}
            className="flex-shrink-0 group-hover:text-amber-400 transition-colors"
          />
          {!collapsed && <span>Public Website</span>}
        </Link>

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
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-zinc-950 text-xs font-bold flex-shrink-0">
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
