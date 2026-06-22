import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { LuLogOut, LuSun, LuMoon, LuMonitor } from "react-icons/lu";
import { applyTheme, getTheme, type Theme } from "../../utils/theme";

export const AdminHeader = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState<Theme>("system");

  useEffect(() => {
    setCurrentTheme(getTheme());
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 h-[72px] bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-zinc-400 text-sm font-medium">GoldenWay Panel</span>
        <span className="text-zinc-600">/</span>
        <span className="text-white text-sm font-semibold">Management Console</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Public site link */}
        <Link
          to="/"
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
        >
          View Live Website
        </Link>
        <div className="h-4 w-[1px] bg-zinc-800" />

        {/* Theme Toggler */}
        <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 p-1 rounded-full">
          <button
            onClick={() => handleThemeChange("light")}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              currentTheme === "light"
                ? "bg-amber-400 text-zinc-950 shadow-sm"
                : "text-zinc-405 hover:text-white"
            }`}
            title="Light Mode"
          >
            <LuSun size={12} />
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              currentTheme === "dark"
                ? "bg-amber-400 text-zinc-950 shadow-sm"
                : "text-zinc-405 hover:text-white"
            }`}
            title="Dark Mode"
          >
            <LuMoon size={12} />
          </button>
          <button
            onClick={() => handleThemeChange("system")}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              currentTheme === "system"
                ? "bg-amber-400 text-zinc-950 shadow-sm"
                : "text-zinc-405 hover:text-white"
            }`}
            title="System Default"
          >
            <LuMonitor size={12} />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800" />

        {/* User profile info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-zinc-950 font-bold text-xs">
            {user?.name ? user.name[0].toUpperCase() : "A"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">
              {user?.name || "Admin User"}
            </p>
            <p className="text-[10px] text-zinc-500 leading-tight">
              {user?.email || "admin@goldenway.com"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-400/20 transition-all cursor-pointer"
          title="Logout"
        >
          <LuLogOut size={16} />
        </button>
      </div>
    </header>
  );
};
export default AdminHeader;
