import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuBus,
  LuMapPin,
  LuFileText,
  LuLogOut,
  LuChevronLeft,
  LuChevronRight,
  LuArrowLeft,
  LuImage,
} from 'react-icons/lu';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';

export const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/backstage/dashboard', Icon: LuLayoutDashboard },
    { label: 'Manage Vehicles', path: '/backstage/fleet', Icon: LuBus },
    { label: 'Manage Plans', path: '/backstage/plans', Icon: LuMapPin },
    { label: 'Manage Blogs', path: '/backstage/blogs', Icon: LuFileText },
    { label: 'Manage Gallery', path: '/backstage/gallery', Icon: LuImage },
  ];

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'A';

  return (
    <aside
      className={`relative flex h-screen flex-shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950 transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[240px]'} `}
    >
      {/* ── Logo ── */}
      <div
        className={`flex h-[72px] flex-shrink-0 items-center border-b border-zinc-800/80 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}
      >
        <img
          src="/favicon.png"
          alt="Khodel Travels Logo"
          className="h-9 w-9 flex-shrink-0 rounded-xl object-contain shadow-lg shadow-amber-400/20"
        />
        {!collapsed && (
          <span className="text-base font-bold tracking-tight text-white">
            Khodel <span className="text-amber-400">Travels</span> Admin
          </span>
        )}
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-[84px] -right-3.5 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-500 shadow-lg transition-all duration-200 hover:border-amber-400/40 hover:text-amber-400"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <LuChevronRight size={14} /> : <LuChevronLeft size={14} />}
      </button>

      {/* ── Role badge ── */}
      {!collapsed && (
        <div className="flex-shrink-0 px-4 pt-4 pb-1">
          <span className="inline-flex items-center rounded border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
            Administrator
          </span>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav className={`flex-1 space-y-1 overflow-y-auto py-4 ${collapsed ? 'px-2' : 'px-3'}`}>
        {navItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/backstage/dashboard'}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${collapsed ? 'justify-center' : ''} ${
                isActive
                  ? 'bg-amber-400/8 text-amber-400'
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-amber-400" />
                )}
                <span
                  className={`flex-shrink-0 transition-colors ${isActive ? 'text-amber-400' : 'group-hover:text-amber-400/70'}`}
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
      <div
        className={`flex-shrink-0 space-y-1 border-t border-zinc-800/80 py-2 ${collapsed ? 'px-2' : 'px-3'}`}
      >
        <Link
          to="/"
          title={collapsed ? 'Go to Public Site' : undefined}
          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:bg-zinc-900 hover:text-white ${collapsed ? 'justify-center' : ''}`}
        >
          <LuArrowLeft
            size={18}
            className="flex-shrink-0 transition-colors group-hover:text-amber-400"
          />
          {!collapsed && <span>Public Website</span>}
        </Link>

        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition-all duration-200 hover:bg-red-400/5 hover:text-red-400 ${collapsed ? 'justify-center' : ''} `}
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
        <div className="mx-3 mb-3 flex-shrink-0 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-zinc-950">
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
