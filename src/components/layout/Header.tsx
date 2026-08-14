import { useState, useRef, useEffect } from 'react';
import { LuBell, LuSearch, LuPlus, LuChevronDown, LuUser, LuSettings } from 'react-icons/lu';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'New task assigned',
    desc: 'Design the homepage layout',
    time: '2m ago',
    unread: true,
  },
  {
    id: 2,
    title: 'Comment on your task',
    desc: 'Alex left a comment on API integration',
    time: '15m ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Task completed',
    desc: 'Setup CI/CD pipeline is done',
    time: '1h ago',
    unread: false,
  },
];

export const Header = () => {
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(s => s.auth.user);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-theme-header border-theme-muted sticky top-0 z-20 flex h-[72px] flex-shrink-0 items-center justify-between border-b px-6 backdrop-blur-xl transition-colors duration-200">
      {/* ── Search ── */}
      <div
        className={`bg-theme-card flex w-72 items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-200 ${
          searchFocused ? 'border-yellow-400/50 ring-2 ring-yellow-400/10' : 'border-theme-muted'
        }`}
      >
        <LuSearch size={16} className="text-theme-muted flex-shrink-0" />
        <input
          type="text"
          placeholder="Search tasks..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="text-theme-primary placeholder-theme-muted flex-1 bg-transparent text-sm outline-none"
        />
        <kbd className="text-theme-muted border-theme-muted hidden rounded border px-1.5 py-0.5 font-mono text-[10px] sm:flex">
          ⌘K
        </kbd>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-3">
        {/* New Task */}
        <button className="hidden cursor-pointer items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-yellow-400/20 transition-all duration-200 hover:bg-yellow-300 active:scale-95 sm:flex">
          <LuPlus size={16} />
          New Task
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notif-btn"
            onClick={() => {
              setShowNotif(!showNotif);
              setShowUserMenu(false);
            }}
            className="bg-theme-card border-theme-muted text-theme-secondary hover:text-theme-primary hover:border-theme-primary relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200"
          >
            <LuBell size={18} />
            {unreadCount > 0 && (
              <span className="border-theme-card absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 bg-yellow-400 px-1 text-[9px] font-bold text-zinc-950">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="bg-theme-card border-theme-muted absolute top-12 right-0 z-50 w-80 overflow-hidden rounded-2xl border shadow-2xl shadow-black/10">
              <div className="border-theme-muted flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-theme-primary text-sm font-semibold">Notifications</h3>
                <button className="cursor-pointer text-xs text-yellow-400 transition-colors hover:text-yellow-300">
                  Mark all read
                </button>
              </div>
              <div className="divide-theme-muted max-h-60 divide-y overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <div
                    key={n.id}
                    className={`hover:bg-theme-input cursor-pointer px-4 py-3 transition-colors ${
                      n.unread ? 'bg-yellow-400/[0.03]' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {n.unread && (
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400" />
                      )}
                      <div className={n.unread ? '' : 'pl-4'}>
                        <p className="text-theme-primary text-sm font-medium">{n.title}</p>
                        <p className="text-theme-muted mt-0.5 text-xs">{n.desc}</p>
                        <p className="text-theme-muted mt-1 text-xs">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-theme-muted border-t px-4 py-2.5 text-center">
                <button className="cursor-pointer text-xs text-yellow-400 transition-colors hover:text-yellow-300">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            id="user-menu-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotif(false);
            }}
            className="bg-theme-card border-theme-muted hover:border-theme-primary flex cursor-pointer items-center gap-2.5 rounded-xl border py-1.5 pr-2 pl-2.5 transition-all duration-200"
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-400 text-xs font-bold text-zinc-950">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-theme-primary text-xs leading-tight font-semibold">
                {user?.name ?? 'Guest'}
              </p>
              <p className="text-theme-muted text-[10px] leading-tight capitalize">
                {user?.role ?? '—'}
              </p>
            </div>
            <LuChevronDown size={14} className="text-theme-muted ml-1" />
          </button>

          {showUserMenu && (
            <div className="bg-theme-card border-theme-muted absolute top-12 right-0 z-50 w-52 overflow-hidden rounded-2xl border shadow-2xl shadow-black/10">
              <div className="border-theme-muted border-b px-4 py-3">
                <p className="text-theme-primary text-sm font-semibold">{user?.name}</p>
                <p className="text-theme-muted mt-0.5 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowUserMenu(false);
                }}
                className="text-theme-secondary hover:bg-theme-input hover:text-theme-primary flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              >
                <LuUser size={15} />
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
                className="text-theme-secondary hover:bg-theme-input hover:text-theme-primary flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
              >
                <LuSettings size={15} />
                Settings
              </button>
              <div className="border-theme-muted border-t">
                <button
                  onClick={handleLogout}
                  className="hover:bg-red-450/5 w-full cursor-pointer px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:text-red-300"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
