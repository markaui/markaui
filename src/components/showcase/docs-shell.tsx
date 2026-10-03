"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Command, Gem, Home, Menu, Moon, Sparkles, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CommandPalette, type CommandPaletteGroup } from "@/components/ui/command-palette";
import { useTheme } from "@/components/theme/theme-provider";
import { ThemeSwitcher } from "./theme-switcher";
import { DocsNav } from "./docs-nav";
import { FamilyDocView } from "./component-doc";
import { GuideDocView } from "./guide-doc";
import { GUIDES, getGuide } from "./guides-data";
import {
  CATEGORIES,
  COMPONENT_DOCS,
  FAMILIES,
  TOTAL_COMPONENTS,
  getFamily,
  getFamilyForDoc,
  getFamilyMembers,
} from "./registry";

const ACTIVE_KEY = "markaui-active-family";
const ACTIVE_GUIDE_KEY = "markaui-active-guide";
const DEFAULT_GUIDE_ID = "installation";

export function DocsShell() {
  const router = useRouter();
  const [activeFamilyId, setActiveFamilyId] = React.useState<string | null>(null);
  const [activeGuideId, setActiveGuideId] = React.useState<string | null>(null);
  const [focusMemberId, setFocusMemberId] = React.useState<string | null>(null);
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

  // hydrate last visited page — precedence: ?guide= URL param > stored guide >
  // stored family > default (Installation guide). Deterministic initial state
  // (null) keeps SSR and first client render identical; localStorage/URL are
  // only read AFTER hydration to avoid the mismatch crash fixed in Round 23.
  React.useEffect(() => {
    try {
      const legacyFamily = localStorage.getItem("saptapadi-active-family");
      const legacyDoc = localStorage.getItem("saptapadi-active-doc");
      localStorage.removeItem("saptapadi-active-family");
      localStorage.removeItem("saptapadi-active-doc");

      const urlGuide = new URLSearchParams(window.location.search).get("guide");
      if (urlGuide && getGuide(urlGuide)) {
        setActiveGuideId(urlGuide);
        localStorage.setItem(ACTIVE_GUIDE_KEY, urlGuide);
        return;
      }
      const storedGuide = localStorage.getItem(ACTIVE_GUIDE_KEY);
      if (storedGuide && getGuide(storedGuide)) {
        setActiveGuideId(storedGuide);
        return;
      }
      const storedFamily = localStorage.getItem(ACTIVE_KEY);
      if (storedFamily && getFamily(storedFamily)) {
        setActiveFamilyId(storedFamily);
        return;
      }
      if (legacyFamily && getFamily(legacyFamily)) {
        setActiveFamilyId(legacyFamily);
        localStorage.setItem(ACTIVE_KEY, legacyFamily);
        return;
      }
      if (legacyDoc) {
        const family = getFamilyForDoc(legacyDoc);
        if (family) {
          setActiveFamilyId(family.id);
          localStorage.setItem(ACTIVE_KEY, family.id);
          return;
        }
      }
      // first visit → start on the Installation guide (docs convention)
      setActiveGuideId(DEFAULT_GUIDE_ID);
      localStorage.setItem(ACTIVE_GUIDE_KEY, DEFAULT_GUIDE_ID);
    } catch {
      /* ignore */
    }
  }, []);

  // fall back to a valid page once state has hydrated
  const guide = getGuide(activeGuideId) ?? null;
  const family = (activeFamilyId ? getFamily(activeFamilyId) : null) ?? FAMILIES[0];
  const docs = React.useMemo(() => getFamilyMembers(family), [family]);

  const selectFamily = React.useCallback((familyId: string, memberId?: string) => {
    setActiveFamilyId(familyId);
    setActiveGuideId(null);
    setFocusMemberId(memberId ?? null);
    try {
      localStorage.setItem(ACTIVE_KEY, familyId);
      localStorage.removeItem(ACTIVE_GUIDE_KEY);
    } catch {
      /* ignore */
    }
    window.history.replaceState(null, "", "/components");
    if (!memberId) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  const selectGuide = React.useCallback((guideId: string) => {
    if (!getGuide(guideId)) return;
    setActiveGuideId(guideId);
    setFocusMemberId(null);
    try {
      localStorage.setItem(ACTIVE_GUIDE_KEY, guideId);
    } catch {
      /* ignore */
    }
    window.history.replaceState(null, "", `/components?guide=${guideId}`);
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const currentIndex = FAMILIES.findIndex((f) => f.id === family.id);
  const prevFamily = currentIndex > 0 ? FAMILIES[currentIndex - 1] : null;
  const nextFamily =
    currentIndex >= 0 && currentIndex < FAMILIES.length - 1 ? FAMILIES[currentIndex + 1] : null;
  const category = CATEGORIES.find((c) => c.id === family.category);

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
          activeFamilyId={guide ? null : family.id}
          activeGuideId={guide?.id ?? null}
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
            activeFamilyId={guide ? null : family.id}
            activeGuideId={guide?.id ?? null}
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
            <span className="hidden text-muted-foreground sm:inline">
              {guide ? "Guides" : (category?.label ?? "Components")}
            </span>
            <ChevronRight className="hidden size-3.5 text-muted-foreground/60 sm:inline" />
            <span className="truncate font-medium text-foreground">
              {guide ? guide.title : family.name}
            </span>
            {!guide && focusMemberId && (
              <>
                <ChevronRight className="hidden size-3.5 text-muted-foreground/60 sm:inline" />
                <span className="hidden truncate text-muted-foreground sm:inline">
                  {docs.find((d) => d.id === focusMemberId)?.name}
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

        {/* Scrollable content */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          {guide ? (
            <GuideDocView key={guide.id} guide={guide} onSelectGuide={selectGuide} />
          ) : (
            <>
              <FamilyDocView
                key={family.id}
                family={family}
                docs={docs}
                focusMemberId={focusMemberId}
              />

              {/* Prev / Next family */}
              <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-4 pb-16 sm:px-6">
                {prevFamily ? (
                  <button
                    onClick={() => selectFamily(prevFamily.id)}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-gold/40 hover:shadow-md cursor-pointer"
                  >
                    <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                        Previous family
                      </span>
                      <span className="block truncate text-sm font-medium text-foreground">
                        {prevFamily.name}
                      </span>
                    </span>
                  </button>
                ) : (
                  <span />
                )}
                {nextFamily ? (
                  <button
                    onClick={() => selectFamily(nextFamily.id)}
                    className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-card p-4 text-right transition-all hover:border-gold/40 hover:shadow-md cursor-pointer"
                  >
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                        Next family
                      </span>
                      <span className="block truncate text-sm font-medium text-foreground">
                        {nextFamily.name}
                      </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </>
          )}
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
