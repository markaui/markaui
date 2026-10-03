"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Command, Gem, Home, Menu, Moon, Sparkles, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CommandPalette, type CommandPaletteGroup } from "@/components/ui/command-palette";
import { useTheme } from "@/components/theme/theme-provider";
import { GitHubButton } from "@/components/site/github-button";
import { ThemeSwitcher } from "./theme-switcher";
import { DocsNav } from "./docs-nav";
import { GUIDES, getGuide } from "./guides-data";
import {
  CATEGORIES,
  COMPONENT_DOCS,
  FAMILIES,
  TOTAL_COMPONENTS,
  getFamily,
  getFamilyForDoc,
} from "./registry";
import { familyHref, guideHref } from "./urls";

/**
 * Persistent docs shell (sidebar + topbar + scroll container) rendered by
 * src/app/components/layout.tsx. The active page is derived from the URL —
 * every family and guide is a real route (/components/<family>,
 * /components/guides/<guide>) and all navigation performs real router
 * navigation, so every view is shareable, crawlable and history-friendly.
 */
export function DocsShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { mode, setMode } = useTheme();

  // ⌘K / Ctrl+K opens the command palette
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Active page derived from the URL — the single source of truth.
  const { activeFamily, activeGuide } = React.useMemo(() => {
    const seg = pathname.split("/").filter(Boolean);
    if (seg[0] !== "components") return { activeFamily: null, activeGuide: null };
    if (seg[1] === "guides") {
      return { activeFamily: null, activeGuide: (seg[2] ? getGuide(seg[2]) : null) ?? null };
    }
    if (seg[1]) {
      const family = getFamily(seg[1]) ?? (seg[1].startsWith("doc-") ? getFamilyForDoc(seg[1].slice(4)) : undefined);
      return { activeFamily: family ?? null, activeGuide: null };
    }
    return { activeFamily: null, activeGuide: null };
  }, [pathname]);
  const isIndex = !activeFamily && !activeGuide;

  // reset the scroll container on navigation (member deep links re-scroll
  // themselves via FamilyDocView's focus effect, which runs after this)
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  // All navigation is real URL navigation — back/forward and sharing work.
  const selectFamily = React.useCallback(
    (familyId: string, memberId?: string) => {
      router.push(familyHref(familyId, memberId));
    },
    [router]
  );

  const selectGuide = React.useCallback(
    (guideId: string) => {
      router.push(guideHref(guideId));
    },
    [router]
  );

  const category = activeFamily
    ? CATEGORIES.find((c) => c.id === activeFamily.category)
    : null;

  const paletteGroups = React.useMemo<CommandPaletteGroup[]>(
    () => [
      {
        heading: "Quick actions",
        items: [
          {
            id: "action-landing",
            label: "Open matrimony site",
            icon: <Home className="size-4" />,
            onSelect: () => {
              setPaletteOpen(false);
              router.push("/demo/matrimuni");
            },
          },
          {
            id: "action-theme",
            label: mode === "dark" ? "Switch to light mode" : "Switch to dark mode",
            icon: mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />,
            onSelect: () => {
              setMode(mode === "dark" ? "light" : "dark");
              setPaletteOpen(false);
            },
          },
        ],
      },
      {
        heading: "Guides",
        items: GUIDES.map((g) => ({
          id: `guide-${g.id}`,
          label: g.title,
          icon: <g.icon className="size-4" />,
          onSelect: () => {
            selectGuide(g.id);
            setPaletteOpen(false);
          },
        })),
      },
      ...CATEGORIES.map((cat) => ({
        heading: cat.label,
        items: COMPONENT_DOCS.filter((d) => d.category === cat.id).map((d) => ({
          id: d.id,
          label: d.name,
          onSelect: () => {
            const f = getFamilyForDoc(d.id);
            if (f) selectFamily(f.id, d.id);
            setPaletteOpen(false);
          },
        })),
      })),
    ],
    [mode, setMode, router, selectFamily, selectGuide]
  );

  return (
    <div className="fixed inset-0 flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-border bg-sidebar lg:block">
        <DocsNav
          activeFamilyId={activeGuide ? null : (activeFamily?.id ?? null)}
          activeGuideId={activeGuide?.id ?? null}
          onSelectFamily={selectFamily}
          onSelectGuide={selectGuide}
          query={query}
          onQueryChange={setQuery}
        />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-80 bg-sidebar p-0">
          <SheetTitle className="sr-only">Component navigation</SheetTitle>
          <DocsNav
            activeFamilyId={activeGuide ? null : (activeFamily?.id ?? null)}
            activeGuideId={activeGuide?.id ?? null}
            onSelectFamily={selectFamily}
            onSelectGuide={selectGuide}
            query={query}
            onQueryChange={setQuery}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="glass sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent lg:hidden cursor-pointer"
          >
            <Menu className="size-5" />
          </button>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
            {isIndex ? (
              <span className="truncate font-medium text-foreground">All components</span>
            ) : (
              <>
                <span className="hidden text-muted-foreground sm:inline">
                  {activeGuide ? "Guides" : (category?.label ?? "Components")}
                </span>
                <ChevronRight className="hidden size-3.5 text-muted-foreground/60 sm:inline" />
                <span className="truncate font-medium text-foreground">
                  {activeGuide ? activeGuide.title : (activeFamily?.name ?? "Components")}
                </span>
              </>
            )}
          </nav>

          {/* Command palette trigger */}
          <button
            onClick={() => setPaletteOpen(true)}
            aria-label="Open command palette (Control K)"
            className="ml-2 hidden items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-gold/40 hover:text-foreground md:flex cursor-pointer"
          >
            <Command className="size-3.5" />
            Search components
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground/70">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <GitHubButton className="hidden sm:flex" />
            <Badge variant="soft" className="hidden md:inline-flex gap-1">
              <Sparkles className="size-3" />
              {TOTAL_COMPONENTS} components · {FAMILIES.length} families
            </Badge>
            <ThemeSwitcher />
            <Button
              variant="gold"
              size="sm"
              className="rounded-full gap-1.5"
              onClick={() => router.push("/demo/matrimuni")}
            >
              <Gem className="size-3.5" />
              <span className="hidden sm:inline">View Demo</span>
            </Button>
          </div>
        </header>

        {/* Scrollable content — swapped by the active route */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>

      {/* ⌘K command palette */}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        groups={paletteGroups}
        placeholder="Jump to a component or action…"
      />
    </div>
  );
}
