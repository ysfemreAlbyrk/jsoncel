import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark";

export function useTheme() {
  const { value: theme, setValue: setTheme } = useLocalStorage<Theme>(
    "theme",
    "light" // Default to light theme
  );

  // Debug: Check if we have an invalid theme value
  if (theme !== "light" && theme !== "dark") {
    console.log("🎨 Invalid theme detected, resetting to light");
    setTheme("light");
  }

  useEffect(() => {
    console.log("🎨 Applying theme:", theme);
    const root = document.documentElement;

    // Remove any existing theme classes
    root.classList.remove("light", "dark");
    // Add current theme class
    root.classList.add(theme);

    // Update meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#1f2937" : "#ffffff"
      );
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    console.log("🎨 Toggling theme:", theme, "→", newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
}
