"use client";

import * as React from "react";
import { Check, ChevronDown, Monitor, Moon, Palette, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme, THEMES } from "@/components/theme/theme-provider";

const RADIUS_KEY = "markaui-radius";
const RADIUS_LEGACY_KEY = "saptapadi-radius";

const RADIUS_OPTIONS = [
  { id: "subtle", label: "Subtle", value: "0.375rem" },
  { id: "default", label: "Default", value: "0.75rem" },
  { id: "round", label: "Round", value: "1.25rem" },
] as const;

type RadiusId = (typeof RADIUS_OPTIONS)[number]["id"];

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme, mode, setMode, themes } = useTheme();
  const [radius, setRadius] = React.useState<RadiusId>("default");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = (localStorage.getItem(RADIUS_KEY) ??
        localStorage.getItem(RADIUS_LEGACY_KEY)) as RadiusId | null;
      if (localStorage.getItem(RADIUS_LEGACY_KEY)) localStorage.removeItem(RADIUS_LEGACY_KEY);
      if (stored && RADIUS_OPTIONS.some((r) => r.id === stored)) setRadius(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const applyRadius = React.useCallback((id: RadiusId) => {
    setRadius(id);
    const option = RADIUS_OPTIONS.find((r) => r.id === id);
    if (option) {
      document.documentElement.style.setProperty("--radius", option.value);
    }
    try {
      localStorage.setItem(RADIUS_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    const option = RADIUS_OPTIONS.find((r) => r.id === radius);
    if (option) document.documentElement.style.setProperty("--radius", option.value);
  }, [radius]);

  const groups = React.useMemo(() => {
    const map = new Map<string, typeof THEMES>();
    for (const t of themes) {
      if (!map.has(t.group)) map.set(t.group, []);
      map.get(t.group)!.push(t);
    }
    return Array.from(map.entries());
  }, [themes]);

  const activeTheme = themes.find((t) => t.id === theme);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Light / Dark segmented control */}
      <div
        role="radiogroup"
        aria-label="Color mode"
        className="flex items-center gap-0.5 rounded-full border border-border bg-card p-1 shadow-xs"
      >
        {(
          [
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
          ] as const
        ).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            role="radio"
            aria-checked={mode === id}
            aria-label={`${label} mode`}
            onClick={() => setMode(id)}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
              mode === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="size-3.5" />
          </button>
        ))}
      </div>

      {/* Theme picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <Palette className="size-3.5" />
            <span className="hidden sm:inline text-xs">{activeTheme?.name ?? "Theme"}</span>
            <span className="sm:hidden text-xs">Theme</span>
            <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="font-serif text-sm font-semibold text-foreground">Color theme</p>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {themes.length} themes
            </span>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Every component adapts instantly across light and dark.
          </p>
          <div className="max-h-72 space-y-3 overflow-y-auto scrollbar-thin pr-1">
            {groups.map(([group, items]) => (
              <div key={group}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {items.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      aria-pressed={theme === t.id}
                      className={cn(
                        "group flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all duration-200 cursor-pointer",
                        theme === t.id
                          ? "border-gold/60 bg-gold/10 shadow-sm"
                          : "border-border hover:border-gold/40 hover:bg-accent"
                      )}
                    >
                      <span className="flex shrink-0 -space-x-1">
                        <span
                          className="size-4 rounded-full ring-1 ring-border"
                          style={{ backgroundColor: t.swatch[0] }}
                        />
                        <span
                          className="size-4 rounded-full ring-1 ring-background"
                          style={{ backgroundColor: t.swatch[1] }}
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                        {t.name}
                      </span>
                      {theme === t.id && <Check className="size-3.5 shrink-0 text-gold" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Corner radius
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {RADIUS_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => applyRadius(option.id)}
                  aria-pressed={radius === option.id}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all cursor-pointer",
                    radius === option.id
                      ? "border-gold/60 bg-gold/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-accent"
                  )}
                >
                  <span
                    className="size-3 border border-current opacity-70"
                    style={{ borderRadius: option.value }}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
