"use client";

import * as React from "react";

export type ThemeMode = "light" | "dark";

export interface ThemeDef {
  id: string;
  name: string;
  group: string;
  /** [primary, gold] swatch preview colors */
  swatch: [string, string];
}

/** All available color themes — shown in the theme selector */
export const THEMES: ThemeDef[] = [
  { id: "maroon", name: "Maroon & Gold", group: "Signature", swatch: ["#7d1f2e", "#c9a227"] },
  { id: "wine", name: "Burgundy & Honey", group: "Signature", swatch: ["#7b2340", "#d8a25e"] },
  { id: "rose", name: "Rose Gold", group: "Signature", swatch: ["#a34464", "#b76e79"] },
  { id: "royal", name: "Royal Purple", group: "Signature", swatch: ["#5b2d86", "#c9a227"] },
  { id: "emerald", name: "Emerald & Brass", group: "Heritage", swatch: ["#166a48", "#b08d3e"] },
  { id: "forest", name: "Forest & Sage", group: "Heritage", swatch: ["#2f5d3a", "#a3b18a"] },
  { id: "teal", name: "Teal & Copper", group: "Heritage", swatch: ["#0f6a70", "#c17a4a"] },
  { id: "champagne", name: "Champagne Bronze", group: "Heritage", swatch: ["#a67c52", "#cfae6e"] },
  { id: "cocoa", name: "Cocoa & Caramel", group: "Heritage", swatch: ["#6b4226", "#d09a4e"] },
  { id: "coral", name: "Coral Terracotta", group: "Modern", swatch: ["#c2543b", "#d98e5f"] },
  { id: "plum", name: "Plum & Mauve", group: "Modern", swatch: ["#6d3087", "#c98bb9"] },
  { id: "noir", name: "Noir & Silver", group: "Modern", swatch: ["#2b2b2b", "#8a8578"] },
];

export const THEME_STORAGE_KEY = "markaui-theme";
export const MODE_STORAGE_KEY = "markaui-mode";
/** pre-rename keys — read once for migration, then removed */
const LEGACY_THEME_KEY = "saptapadi-theme";
const LEGACY_MODE_KEY = "saptapadi-mode";

interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  resolvedMode: ThemeMode;
  themes: ThemeDef[];
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultTheme = "maroon",
  defaultMode = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string>(defaultTheme);
  const [mode, setModeState] = React.useState<ThemeMode>(defaultMode);

  // hydrate from storage on mount (migrates pre-rename saptapadi-* keys)
  React.useEffect(() => {
    try {
      const storedTheme =
        localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem(LEGACY_THEME_KEY);
      const storedMode = (localStorage.getItem(MODE_STORAGE_KEY) ??
        localStorage.getItem(LEGACY_MODE_KEY)) as ThemeMode | null;
      if (storedTheme && THEMES.some((t) => t.id === storedTheme)) setThemeState(storedTheme);
      if (storedMode === "light" || storedMode === "dark") setModeState(storedMode);
      if (localStorage.getItem(LEGACY_THEME_KEY)) {
        localStorage.setItem(THEME_STORAGE_KEY, storedTheme ?? defaultTheme);
        localStorage.removeItem(LEGACY_THEME_KEY);
      }
      if (localStorage.getItem(LEGACY_MODE_KEY)) {
        localStorage.setItem(MODE_STORAGE_KEY, storedMode ?? defaultMode);
        localStorage.removeItem(LEGACY_MODE_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [defaultTheme, defaultMode]);

  // apply to <html>
  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
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

  const value = React.useMemo<ThemeContextValue>(
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

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
