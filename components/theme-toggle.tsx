"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The visible theme should still change when storage is unavailable.
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
    setTarget(document.querySelector<HTMLElement>(".header-actions"));
  }, []);

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";
  const label = nextTheme === "dark" ? "Switch to dark mode" : "Switch to light mode";

  const control = (
    <button
      type="button"
      className="icon-button theme-toggle"
      aria-label={label}
      title={label}
      onClick={() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
    >
      <span className="theme-toggle-icons" aria-hidden="true">
        <Sun className="theme-icon theme-icon-sun" size={17} />
        <Moon className="theme-icon theme-icon-moon" size={17} />
      </span>
    </button>
  );

  return target ? createPortal(control, target) : null;
}
