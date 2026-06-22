import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { LuCompass, LuMenu, LuX, LuSun, LuMoon, LuMonitor } from "react-icons/lu";
import { applyTheme, getTheme, type Theme } from "../../utils/theme";

export const PublicHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>("system");

  useEffect(() => {
    setCurrentTheme(getTheme());
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Fleet", path: "/vehicles" },
    { name: "Destinations", path: "/plans" },
    { name: "Blogs", path: "/blogs" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/60 py-3 shadow-md dark:shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <LuCompass size={22} className="text-zinc-950 animate-spin-slow" />
            </div>
            <span className="text-zinc-900 dark:text-white font-bold text-xl tracking-tight transition-colors">
              Golden<span className="text-amber-400">Way</span> Travels
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors hover:text-amber-500 ${
                    isActive ? "text-amber-400 font-bold" : "text-zinc-600 dark:text-zinc-300"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Theme switcher */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-0.5 bg-zinc-200/60 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 p-1 rounded-full shadow-inner">
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  currentTheme === "light"
                    ? "bg-amber-400 text-zinc-950 shadow-md"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
                title="Light Mode"
              >
                <LuSun size={13} />
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  currentTheme === "dark"
                    ? "bg-amber-400 text-zinc-950 shadow-md"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
                title="Dark Mode"
              >
                <LuMoon size={13} />
              </button>
              <button
                onClick={() => handleThemeChange("system")}
                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  currentTheme === "system"
                    ? "bg-amber-400 text-zinc-950 shadow-md"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
                title="System Default"
              >
                <LuMonitor size={13} />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Theme selector for mobile */}
            <div className="flex items-center gap-0.5 bg-zinc-200/60 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-full">
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-1 rounded-full transition-all ${
                  currentTheme === "light" ? "bg-amber-400 text-zinc-950" : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <LuSun size={12} />
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-1 rounded-full transition-all ${
                  currentTheme === "dark" ? "bg-amber-400 text-zinc-950" : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <LuMoon size={12} />
              </button>
              <button
                onClick={() => handleThemeChange("system")}
                className={`p-1 rounded-full transition-all ${
                  currentTheme === "system" ? "bg-amber-400 text-zinc-950" : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                <LuMonitor size={12} />
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white focus:outline-none cursor-pointer p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <LuX size={22} /> : <LuMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-lg animate-in shadow-lg">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "text-amber-400 bg-amber-400/5"
                      : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
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
