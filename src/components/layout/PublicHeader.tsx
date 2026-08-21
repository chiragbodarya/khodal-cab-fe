import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LuMenu, LuX, LuSun, LuMoon, LuMonitor } from 'react-icons/lu';
import { applyTheme, getTheme, type Theme } from '../../utils/theme';

export const PublicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(getTheme);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Fleet', path: '/vehicles' },
    { name: 'Destinations', path: '/plans' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-zinc-200/80 bg-white/80 py-3 shadow-md backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/85 dark:shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <img
              src="/favicon.png"
              alt="Khodal Cab Logo"
              className="shadow-amber-555/10 h-10 w-10 rounded-xl object-contain shadow-lg transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-tight text-zinc-900 transition-colors dark:text-white">
              Khodal <span className="text-amber-400">Cab</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors hover:text-amber-500 ${
                    isActive ? 'font-bold text-amber-400' : 'text-zinc-600 dark:text-zinc-300'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Theme switcher */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-200/60 p-1 shadow-inner dark:border-zinc-800 dark:bg-zinc-900/95">
              <button
                onClick={() => handleThemeChange('light')}
                className={`cursor-pointer rounded-full p-1.5 transition-all duration-200 ${
                  currentTheme === 'light'
                    ? 'bg-amber-400 text-zinc-950 shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
                title="Light Mode"
              >
                <LuSun size={13} />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`cursor-pointer rounded-full p-1.5 transition-all duration-200 ${
                  currentTheme === 'dark'
                    ? 'bg-amber-400 text-zinc-950 shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
                title="Dark Mode"
              >
                <LuMoon size={13} />
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`cursor-pointer rounded-full p-1.5 transition-all duration-200 ${
                  currentTheme === 'system'
                    ? 'bg-amber-400 text-zinc-950 shadow-md'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
                title="System Default"
              >
                <LuMonitor size={13} />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Theme selector for mobile */}
            <div className="flex items-center gap-0.5 rounded-full border border-zinc-200 bg-zinc-200/60 p-1 dark:border-zinc-800 dark:bg-zinc-900">
              <button
                onClick={() => handleThemeChange('light')}
                className={`rounded-full p-1 transition-all ${
                  currentTheme === 'light'
                    ? 'bg-amber-400 text-zinc-950'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <LuSun size={12} />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`rounded-full p-1 transition-all ${
                  currentTheme === 'dark'
                    ? 'bg-amber-400 text-zinc-950'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <LuMoon size={12} />
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`rounded-full p-1 transition-all ${
                  currentTheme === 'system'
                    ? 'bg-amber-400 text-zinc-950'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                <LuMonitor size={12} />
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-650 cursor-pointer p-1 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <LuX size={22} /> : <LuMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="animate-in absolute top-full right-0 left-0 border-b border-zinc-200 bg-white/95 shadow-lg backdrop-blur-lg md:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="space-y-1 px-2 pt-2 pb-4 sm:px-3">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-400/5 text-amber-400'
                      : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
export default PublicHeader;
