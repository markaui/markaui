"use client";

import * as React from "react";
import { Check, Heart, Moon, Sparkles, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { THEMES, useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const THEME_GROUPS = Array.from(new Set(THEMES.map((t) => t.group)));

export function ThemeLab() {
  const { theme: siteTheme, setTheme: setSiteTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = React.useState("maroon");
  const [dark, setDark] = React.useState(false);

  // keep the site theme in sync with the lab selection — the whole page demos it
  const applyTheme = (id: string) => {
    setPreviewTheme(id);
    setSiteTheme(id);
  };

  return (
    <section id="themes" aria-labelledby="themes-heading" className="relative scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <Badge variant="gold" className="mb-4 gap-1.5">
            <Sparkles className="size-3" aria-hidden />
            Theme laboratory
          </Badge>
          <h2
            id="themes-heading"
            className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            12 luxury themes. 24 moods.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every theme is a complete token set — primary, gold accent, surfaces, charts —
            hand-tuned for WCAG-AA contrast in light and dark. Pick one; this entire page
            retints instantly.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Live preview */}
          <div
            data-theme={previewTheme}
            className={cn(
              "overflow-hidden rounded-2xl border border-border shadow-xl transition-colors duration-500",
              dark && "dark"
            )}
            style={dark ? { colorScheme: "dark" } : { colorScheme: "light" }}
          >
            <div className="bg-background text-foreground">
              {/* mini app bar */}
              <div className="flex items-center justify-between border-b border-border bg-card/60 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground">
                    <Heart className="size-3.5" aria-hidden />
                  </span>
                  <span className="font-serif text-sm font-bold">MarkaUI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[10px] text-muted-foreground">
                    {previewTheme} · {dark ? "dark" : "light"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDark((v) => !v)}
                    aria-label={dark ? "Preview in light mode" : "Preview in dark mode"}
                    className="flex size-7 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-gold/40 cursor-pointer"
                  >
                    {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {/* profile mini */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11 border border-gold/40">
                        <AvatarImage src="" alt="Portrait of Ananya Sharma" />
                        <AvatarFallback className="bg-gold/15 text-sm text-gold-foreground dark:text-gold">
                          AS
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          Ananya Sharma
                        </p>
                        <p className="text-xs text-muted-foreground">Jaipur · 26</p>
                      </div>
                      <Badge variant="gold" className="ml-auto shrink-0">
                        91%
                      </Badge>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="gold" size="sm" className="flex-1 rounded-full">
                        Connect
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-full">
                        Skip
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* controls mini */}
                <Card>
                  <CardContent className="space-y-3.5 p-5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Smart matches</Label>
                      <Switch defaultChecked aria-label="Smart matches" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lab-city" className="text-xs text-muted-foreground">
                        Your city
                      </Label>
                      <Input id="lab-city" placeholder="Search cities…" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Profile strength</Label>
                        <span className="text-xs font-medium tabular-nums text-gold">
                          Strong
                        </span>
                      </div>
                      <Progress value={82} aria-label="Profile strength" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Theme picker */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Choose a preset
            </p>
            <div className="space-y-4">
              {THEME_GROUPS.map((group) => (
                <div key={group}>
                  <p className="mb-1.5 px-1 text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    {group}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5" role="listbox" aria-label={`${group} themes`}>
                    {THEMES.filter((t) => t.group === group).map((t) => {
                      const active = previewTheme === t.id;
                      return (
                        <button
                          key={t.id}
                          role="option"
                          aria-selected={active}
                          onClick={() => applyTheme(t.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] font-medium transition-all cursor-pointer",
                            active
                              ? "border-gold/60 bg-gold/10 text-foreground shadow-sm"
                              : "border-border bg-background text-muted-foreground hover:border-gold/40 hover:text-foreground"
                          )}
                        >
                          <span className="flex shrink-0 -space-x-1" aria-hidden>
                            <span
                              className="size-3.5 rounded-full ring-1 ring-background"
                              style={{ backgroundColor: t.swatch[0] }}
                            />
                            <span
                              className="size-3.5 rounded-full ring-1 ring-background"
                              style={{ backgroundColor: t.swatch[1] }}
                            />
                          </span>
                          <span className="min-w-0 flex-1 truncate">{t.name}</span>
                          {active && <Check className="size-3 shrink-0 text-gold" aria-hidden />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-border px-1 pt-3 text-[10px] leading-relaxed text-muted-foreground">
              Applied site-wide via <code className="font-mono">data-theme</code> + a{" "}
              <code className="font-mono">.dark</code> class — zero CSS-in-JS, zero flash.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
