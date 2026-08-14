import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
} from 'react-icons/lu';
import type { IconType } from 'react-icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import type { UserRole } from '../../redux/slices/authSlice';

interface NavItem {
  label: string;
  path: string;
  Icon: IconType;
}

const navConfig: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/', Icon: LuLayoutDashboard },
    { label: 'User Management', path: '/admin/users', Icon: LuUsers },
    { label: 'Role Management', path: '/admin/roles', Icon: LuShield },
    { label: 'Analytics', path: '/admin/analytics', Icon: LuShield },
    { label: 'System Settings', path: '/admin/settings', Icon: LuSettings },
  ],
  manager: [
    { label: 'Dashboard', path: '/', Icon: LuLayoutDashboard },
    { label: 'Task Management', path: '/manager/tasks', Icon: LuClipboardList },
    { label: 'Team', path: '/manager/team', Icon: LuUsers },
    { label: 'Reports', path: '/manager/reports', Icon: LuFileText },
    { label: 'Calendar', path: '/calendar', Icon: LuCalendar },
  ],
  user: [
    { label: 'Dashboard', path: '/', Icon: LuLayoutDashboard },
    { label: 'My Tasks', path: '/tasks', Icon: LuUser },
    { label: 'Calendar', path: '/calendar', Icon: LuCalendar },
    { label: 'Profile', path: '/profile', Icon: LuUser },
  ],
};

const roleMeta: Record<UserRole, { label: string; cls: string }> = {
  admin: {
    label: 'Admin',
    cls: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
  },
  manager: {
    label: 'Manager',
    cls: 'bg-white/8 text-zinc-300 border border-zinc-700',
  },
  user: {
    label: 'User',
    cls: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
  },
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);
  const role: UserRole = user?.role ?? 'user';
  const navItems = navConfig[role];
  const badge = roleMeta[role];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <aside
      className={`bg-theme-sidebar border-theme-muted relative flex h-screen flex-shrink-0 flex-col border-r transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[240px]'} `}
    >
      {/* ── Logo ── */}
      <div
        className={`border-theme-muted flex h-[72px] flex-shrink-0 items-center border-b px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}
      >
        <img
          src="/favicon.png"
          alt="Khodel Travels Logo"
          className="h-9 w-9 flex-shrink-0 rounded-xl object-contain shadow-lg shadow-yellow-400/20"
        />
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-white">Khodel Travels</span>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="bg-theme-card border-theme-muted absolute top-[84px] -right-3.5 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border text-zinc-500 shadow-lg transition-all duration-200 hover:border-yellow-400/40 hover:text-yellow-400"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <LuChevronRight size={14} /> : <LuChevronLeft size={14} />}
      </button>

      {/* ── Role badge ── */}
      {!collapsed && user && (
        <div className="flex-shrink-0 px-4 pt-4 pb-1">
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${badge.cls}`}
          >
            {badge.label}
          </span>
        </div>
      )}

      {/* ── Nav label ── */}
      {!collapsed && (
        <p className="text-zinc-650 flex-shrink-0 px-4 pt-3 pb-1.5 text-[10px] font-semibold tracking-widest uppercase">
          Navigation
        </p>
      )}

      {/* ── Nav items ── */}
      <nav className={`flex-1 space-y-0.5 overflow-y-auto py-1.5 ${collapsed ? 'px-2' : 'px-3'}`}>
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${
                isActive
                  ? 'bg-yellow-400/8 text-yellow-400'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-yellow-400" />
                )}
                <span
                  className={`flex-shrink-0 transition-colors ${isActive ? 'text-yellow-400' : 'group-hover:text-yellow-400/70'}`}
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
      <div className="border-theme-muted mx-3 flex-shrink-0 border-t" />

      {/* ── Bottom actions ── */}
      <div className={`flex-shrink-0 space-y-0.5 py-2 ${collapsed ? 'px-2' : 'px-3'}`}>
        <NavLink
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${
              isActive
                ? 'bg-yellow-400/8 text-yellow-400'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }`
          }
        >
          <LuSettings
            size={18}
            className="flex-shrink-0 transition-colors group-hover:text-yellow-400/70"
          />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-red-400/5 hover:text-red-400 ${collapsed ? 'justify-center' : ''} `}
        >
          <LuLogOut
            size={18}
            className="flex-shrink-0 transition-colors group-hover:text-red-400"
          />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* ── User card ── */}
      {!collapsed && user && (
        <div className="border-theme-muted mx-3 mb-3 flex-shrink-0 rounded-xl border bg-zinc-900 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-400 text-xs font-bold text-zinc-950">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">{user.name}</p>
              <p className="truncate text-[10px] text-zinc-500">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
