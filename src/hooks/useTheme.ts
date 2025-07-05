import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const { value: theme, setValue: setTheme } = useLocalStorage<Theme>(
    "theme",
    "system"
  );

  const getResolvedTheme = (): "light" | "dark" => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  };

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme = getResolvedTheme();

    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#1f2937" : "#ffffff"
      );
    }
  }, [theme]);

  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        const root = document.documentElement;
        const resolvedTheme = getResolvedTheme();

        root.classList.remove("light", "dark");
        root.classList.add(resolvedTheme);

        const metaThemeColor = document.querySelector(
          'meta[name="theme-color"]'
        );
        if (metaThemeColor) {
          metaThemeColor.setAttribute(
            "content",
            resolvedTheme === "dark" ? "#1f2937" : "#ffffff"
          );
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    const currentResolved = getResolvedTheme();
    setTheme(currentResolved === "light" ? "dark" : "light");
  };

  const setSystemTheme = () => {
    setTheme("system");
  };

  return {
    theme,
    resolvedTheme: getResolvedTheme(),
    setTheme,
    toggleTheme,
    setSystemTheme,
    isDark: getResolvedTheme() === "dark",
    isLight: getResolvedTheme() === "light",
    isSystem: theme === "system",
  };
}
