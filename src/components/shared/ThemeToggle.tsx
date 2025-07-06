import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { Button } from "../ui/Button";

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  const handleToggle = () => {
    console.log("🎨 Theme toggle clicked! Current theme:", theme);
    toggleTheme();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="transition-all duration-200 hover:scale-105"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 text-blue-600" />
      )}
    </Button>
  );
}
