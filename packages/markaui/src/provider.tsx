"use client";

/**
 * MarkaUIProvider — self-contained theme provider.
 *
 * Applies the selected theme via the `data-theme` attribute and the selected
 * color mode via the `dark` class on `<html>`, persists both to localStorage,
 * and exposes them through the `useMarkaUI()` hook.
 *
 * Pair with the token stylesheet: `import "markaui/theme.css";`
 */

import * as React from "react";
import { THEMES, THEME_STORAGE_KEY, MODE_STORAGE_KEY, type ThemeDef, type ThemeMode } from "./themes";

export type { ThemeDef, ThemeMode };

interface MarkaUIContextValue {
  /** Active theme id (one of `THEMES[].id`) */
  theme: string;
  setTheme: (theme: string) => void;
  /** Active color mode */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  /** Resolved color mode */
  resolvedMode: ThemeMode;
  /** All available themes */
  themes: ThemeDef[];
}

const MarkaUIContext = React.createContext<MarkaUIContextValue | null>(null);

export interface MarkaUIProviderProps {
  children: React.ReactNode;
  /** Theme applied on first render (before hydration). Default: "maroon" */
  defaultTheme?: string;
  /** Color mode applied on first render (before hydration). Default: "light" */
  defaultMode?: ThemeMode;
}

export function MarkaUIProvider({
  children,
  defaultTheme = "maroon",
  defaultMode = "light",
}: MarkaUIProviderProps) {
  const [theme, setThemeState] = React.useState<string>(defaultTheme);
  const [mode, setModeState] = React.useState<ThemeMode>(defaultMode);

  // hydrate from storage on mount
  React.useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const storedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
      if (storedTheme && THEMES.some((t) => t.id === storedTheme)) setThemeState(storedTheme);
      if (storedMode === "light" || storedMode === "dark") setModeState(storedMode);
    } catch {
      /* ignore (private mode, SSR, storage disabled) */
    }
  }, []);

  // apply to <html>
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
  }, [theme, mode]);

  const setTheme = React.useCallback((next: string) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = React.useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMode = React.useCallback(() => {
    setModeState((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(MODE_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = React.useMemo<MarkaUIContextValue>(
    () => ({
      theme,
      setTheme,
      mode,
      setMode,
      toggleMode,
      resolvedMode: mode,
      themes: THEMES,
    }),
    [theme, setTheme, mode, setMode, toggleMode]
  );

  return <MarkaUIContext.Provider value={value}>{children}</MarkaUIContext.Provider>;
}

/** Access the active theme, color mode and setters. Must be used inside `<MarkaUIProvider>`. */
export function useMarkaUI(): MarkaUIContextValue {
  const ctx = React.useContext(MarkaUIContext);
  if (!ctx) throw new Error("useMarkaUI must be used within <MarkaUIProvider>");
  return ctx;
}
