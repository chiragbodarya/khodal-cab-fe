export type Theme = "light" | "dark" | "system";

export const getTheme = (): Theme => {
  return (localStorage.getItem("tc_theme") as Theme) || "system";
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  let isDark = false;
  if (theme === "system") {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } else {
    isDark = theme === "dark";
  }

  if (isDark) {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.add("light");
    root.style.colorScheme = "light";
  }

  localStorage.setItem("tc_theme", theme);
};

export const setupThemeListener = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => {
    const currentTheme = getTheme();
    if (currentTheme === "system") {
      applyTheme("system");
    }
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
};
