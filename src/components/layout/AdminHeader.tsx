import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { LuLogOut, LuSun, LuMoon, LuMonitor } from 'react-icons/lu';
import { applyTheme, getTheme, type Theme } from '../../utils/theme';

export const AdminHeader = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 flex h-[72px] flex-shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-400">Khodel Travels Panel</span>
        <span className="text-zinc-600">/</span>
        <span className="text-sm font-semibold text-white">Management Console</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Public site link */}
        <Link
          to="/"
          className="text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300"
        >
          View Live Website
        </Link>
        <div className="h-4 w-[1px] bg-zinc-800" />

        {/* Theme Toggler */}
        <div className="flex items-center gap-0.5 rounded-full border border-zinc-800 bg-zinc-900 p-1">
          <button
            onClick={() => handleThemeChange('light')}
            className={`cursor-pointer rounded-full p-1.5 transition-all duration-200 ${
              currentTheme === 'light'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-405 hover:text-white'
            }`}
            title="Light Mode"
          >
            <LuSun size={12} />
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`cursor-pointer rounded-full p-1.5 transition-all duration-200 ${
              currentTheme === 'dark'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-405 hover:text-white'
            }`}
            title="Dark Mode"
          >
            <LuMoon size={12} />
          </button>
          <button
            onClick={() => handleThemeChange('system')}
            className={`cursor-pointer rounded-full p-1.5 transition-all duration-200 ${
              currentTheme === 'system'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-405 hover:text-white'
            }`}
            title="System Default"
          >
            <LuMonitor size={12} />
          </button>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800" />

        {/* User profile info */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-xs font-bold text-zinc-950">
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs leading-tight font-semibold text-white">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-[10px] leading-tight text-zinc-500">
              {user?.email || 'admin@khodeltravels.com'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-all hover:border-red-400/20 hover:text-red-400"
          title="Logout"
        >
          <LuLogOut size={16} />
        </button>
      </div>
    </header>
  );
};
export default AdminHeader;
