import { useState, useRef, useEffect } from "react";
import {
  LuBell,
  LuSearch,
  LuPlus,
  LuChevronDown,
  LuUser,
  LuSettings,
} from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "New task assigned",
    desc: "Design the homepage layout",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Comment on your task",
    desc: "Alex left a comment on API integration",
    time: "15m ago",
    unread: true,
  },
  {
    id: 3,
    title: "Task completed",
    desc: "Setup CI/CD pipeline is done",
    time: "1h ago",
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
  const user = useAppSelector((s) => s.auth.user);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between
        px-6 h-[72px] bg-zinc-950/90 backdrop-blur-xl
        border-b border-zinc-800/80 flex-shrink-0"
    >
      {/* ── Search ── */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border
          transition-all duration-200 w-72
          ${
            searchFocused
              ? "border-yellow-400/50 ring-2 ring-yellow-400/10"
              : "border-zinc-800"
          }`}
      >
        <LuSearch size={16} className="text-zinc-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search tasks..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none flex-1"
        />
        <kbd className="hidden sm:flex text-[10px] text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center gap-3">
        {/* New Task */}
        <button
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl
            text-sm font-semibold bg-yellow-400 text-zinc-950
            hover:bg-yellow-300 active:scale-95
            transition-all duration-200 cursor-pointer
            shadow-lg shadow-yellow-400/20"
        >
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
            className="relative w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800
              flex items-center justify-center text-zinc-400
              hover:text-white hover:border-zinc-700
              transition-all duration-200 cursor-pointer"
          >
            <LuBell size={18} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                  rounded-full bg-yellow-400 text-zinc-950 text-[9px] font-bold
                  flex items-center justify-center border-2 border-zinc-950"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/60 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <h3 className="text-sm font-semibold text-white">
                  Notifications
                </h3>
                <button className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-zinc-800/60 max-h-60 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 hover:bg-zinc-800/50 cursor-pointer transition-colors ${
                      n.unread ? "bg-yellow-400/[0.03]" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {n.unread && (
                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      )}
                      <div className={n.unread ? "" : "pl-4"}>
                        <p className="text-sm font-medium text-white">
                          {n.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">{n.desc}</p>
                        <p className="text-xs text-zinc-600 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-zinc-800 text-center">
                <button className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer">
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
            className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-xl
              bg-zinc-900 border border-zinc-800
              hover:border-zinc-700 transition-all duration-200 cursor-pointer"
          >
            <div
              className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center
                text-zinc-950 text-xs font-bold flex-shrink-0"
            >
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {user?.name ?? "Guest"}
              </p>
              <p className="text-[10px] text-zinc-500 leading-tight capitalize">
                {user?.role ?? "—"}
              </p>
            </div>
            <LuChevronDown size={14} className="text-zinc-500 ml-1" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-52 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/60 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-zinc-800">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                <LuUser size={15} />
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate("/settings");
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                <LuSettings size={15} />
                Settings
              </button>
              <div className="border-t border-zinc-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/5 hover:text-red-300 transition-colors cursor-pointer"
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
