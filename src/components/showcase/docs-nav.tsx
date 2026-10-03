"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  ChevronRight,
  Compass,
  Gem,
  GraduationCap,
  Heart,
  KeyRound,
  Layers,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Moon,
  PanelsTopLeft,
  Search,
  ShoppingBag,
  Sparkles,
  Sun,
  Table,
  TextCursorInput,
  Wand2,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/theme/theme-provider";
import {
  CATEGORIES,
  COMPONENT_DOCS,
  FAMILIES,
  TOTAL_COMPONENTS,
  getFamiliesByCategory,
  getFamilyForDoc,
} from "./registry";
import type { FamilyDef } from "./registry";
import { GUIDES, type GuideDef } from "./guides-data";

const GROUPS_KEY = "markaui-docs-nav-groups";
const GROUPS_LEGACY_KEY = "saptapadi-docs-nav-groups";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  core: Box,
  forms: TextCursorInput,
  navigation: Compass,
  layout: PanelsTopLeft,
  overlay: Layers,
  data: Table,
  charts: LineChart,
  advanced: Wand2,
  feedback: MessageSquare,
  ecommerce: ShoppingBag,
  auth: KeyRound,
  dashboard: LayoutDashboard,
  utility: Wrench,
  saptapadi: Heart,
};

export interface DocsNavProps {
  /** active family page id (null while a guide is open) */
  activeFamilyId: string | null;
  /** active usage guide id (null while a family is open) */
  activeGuideId: string | null;
  /** select a family page; memberId focuses (scrolls to) one of its members */
  onSelectFamily: (familyId: string, memberId?: string) => void;
  /** open a usage guide */
  onSelectGuide: (guideId: string) => void;
  query: string;
  onQueryChange: (q: string) => void;
  className?: string;
  onNavigate?: () => void;
}

export function DocsNav({
  activeFamilyId,
  activeGuideId,
  onSelectFamily,
  onSelectGuide,
  query,
  onQueryChange,
  className,
  onNavigate,
}: DocsNavProps) {
  const { mode, setMode } = useTheme();
  const normalized = query.trim().toLowerCase();
  const activeFamily = FAMILIES.find((f) => f.id === activeFamilyId);

  // ---- collapsible groups -------------------------------------------------
  // Deterministic initial state (SSR-safe): focus the active category and
  // collapse the rest. Persisted group state is applied AFTER hydration in an
  // effect — reading localStorage during render caused a hydration mismatch
  // (server default vs client stored state) that could take down the tree.
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>(() => {
    const activeCategory = FAMILIES.find((f) => f.id === activeFamilyId)?.category;
    const initial: Record<string, boolean> = { guides: false };
    for (const c of CATEGORIES) initial[c.id] = c.id !== activeCategory;
    return initial;
  });

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(GROUPS_KEY) ?? localStorage.getItem(GROUPS_LEGACY_KEY);
      if (GROUPS_LEGACY_KEY && localStorage.getItem(GROUPS_LEGACY_KEY)) {
        localStorage.removeItem(GROUPS_LEGACY_KEY);
      }
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      if (parsed && typeof parsed === "object") setCollapsed(parsed);
    } catch {
      /* ignore corrupt group state */
    }
    // run once on mount — group prefs don't depend on the active family
  }, []);

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // keep the active category reachable: auto-expand it when navigation
  // happens from outside the nav (deep links, ⌘K palette, prev/next).
  const lastActiveCategory = React.useRef<string | null>(null);
  React.useEffect(() => {
    const cat = activeFamily?.category ?? null;
    if (cat && cat !== lastActiveCategory.current) {
      lastActiveCategory.current = cat;
      setCollapsed((prev) => (prev[cat] ? { ...prev, [cat]: false } : prev));
    }
  }, [activeFamily?.category]);

  // keep the Guides group reachable when a guide is opened from outside the nav
  React.useEffect(() => {
    if (activeGuideId) {
      setCollapsed((prev) => (prev.guides ? { ...prev, guides: false } : prev));
    }
  }, [activeGuideId]);

  // scroll the active item into view when it changes
  const activeRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeFamilyId, normalized]);

  // ---- search: families + members -----------------------------------------
  const familyResults = React.useMemo(() => {
    if (!normalized) return null;
    return FAMILIES.filter(
      (f) =>
        f.name.toLowerCase().includes(normalized) ||
        f.description.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  const memberResults = React.useMemo(() => {
    if (!normalized) return null;
    return COMPONENT_DOCS.filter(
      (d) =>
        d.name.toLowerCase().includes(normalized) ||
        d.description.toLowerCase().includes(normalized) ||
        d.aliases?.some((a) => a.toLowerCase().includes(normalized))
    );
  }, [normalized]);

  const guideResults = React.useMemo(() => {
    if (!normalized) return null;
    return GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(normalized) ||
        g.description.toLowerCase().includes(normalized) ||
        g.shortTitle.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  const handleSelectFamily = (familyId: string, memberId?: string) => {
    onSelectFamily(familyId, memberId);
    onNavigate?.();
  };

  const handleSelectGuide = (guideId: string) => {
    onSelectGuide(guideId);
    onNavigate?.();
  };

  const renderGuideRow = (guide: GuideDef) => {
    const isActive = guide.id === activeGuideId;
    const Icon = guide.icon;
    return (
      <button
        key={guide.id}
        ref={isActive ? activeRef : undefined}
        onClick={() => handleSelectGuide(guide.id)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group/item relative flex w-full items-center gap-2 rounded-md pl-3 pr-2 py-1.5 text-left text-sm transition-colors duration-150 cursor-pointer",
          isActive
            ? "bg-gold/10 font-medium text-foreground"
            : "text-foreground/75 hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-1/2 h-4.5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-gold to-primary transition-all duration-200",
            isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          )}
        />
        <Icon
          className={cn(
            "size-3.5 shrink-0 transition-colors",
            isActive ? "text-gold" : "text-muted-foreground"
          )}
        />
        <span className="min-w-0 flex-1 truncate">{guide.shortTitle}</span>
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
            isActive ? "bg-gold/20 text-gold-foreground dark:text-gold" : "bg-muted text-muted-foreground"
          )}
        >
          {guide.readingTime}
        </span>
      </button>
    );
  };

  const renderFamilyRow = (family: FamilyDef) => {
    const isActive = family.id === activeFamilyId;
    return (
      <button
        key={family.id}
        ref={isActive ? activeRef : undefined}
        onClick={() => handleSelectFamily(family.id)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group/item relative flex w-full items-center rounded-md pl-3 pr-2 py-1.5 text-left text-sm transition-colors duration-150 cursor-pointer",
          isActive
            ? "bg-primary/10 font-medium text-primary"
            : "text-foreground/75 hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {/* gold active rail */}
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-1/2 h-4.5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-gold to-primary transition-all duration-200",
            isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          )}
        />
        <span className="min-w-0 flex-1 truncate">{family.name}</span>
        <span
          className={cn(
            "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
            isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {family.memberIds.length}
        </span>
      </button>
    );
  };

  const renderMemberResult = (docId: string, docName: string, index: number) => {
    const family = getFamilyForDoc(docId);
    if (!family) return null;
    return (
      <button
        key={`${docId}-search`}
        onClick={() => handleSelectFamily(family.id, docId)}
        className="group/item relative flex w-full items-center rounded-md pl-3 pr-2 py-1.5 text-left text-sm transition-colors duration-150 cursor-pointer text-foreground/75 hover:bg-accent hover:text-accent-foreground"
      >
        <span
          aria-hidden
          className="w-5 shrink-0 text-[10px] tabular-nums text-muted-foreground/50"
        >
          {index + 1}
        </span>
        <span className="min-w-0 flex-1 truncate">{docName}</span>
        <span className="ml-auto shrink-0 pl-2 truncate text-[10px] text-muted-foreground/70">
          {family.name}
        </span>
      </button>
    );
  };

  const searching = normalized.length > 0;

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* Brand → home */}
      <div className="relative flex items-center gap-2.5 px-4 pb-3 pt-4">
        <Link
          href="/"
          aria-label="MarkaUI home"
          onClick={() => onNavigate?.()}
          className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-lg"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Gem className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-serif text-sm font-bold tracking-tight text-foreground">
              MarkaUI
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
              Component library
            </span>
          </span>
          <Badge variant="gold" className="text-[10px]">
            v2.1
          </Badge>
        </Link>
        <span
          aria-hidden
          className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        />
      </div>

      {/* Landing shortcut */}
      <div className="px-3 pb-2">
        <Link
          href="/demo/matrimuni"
          onClick={() => onNavigate?.()}
          className="group flex w-full items-center gap-2.5 rounded-lg border border-gold/30 bg-gold/10 px-3 py-2.5 text-left transition-all duration-200 hover:border-gold/60 hover:bg-gold/15 hover:shadow-sm"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-gold/20 text-gold-foreground dark:text-gold">
            <Heart className="size-3.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">Matrimony Demo</span>
            <span className="block text-[11px] text-muted-foreground">
              Live site built with this library · /demo/matrimuni
            </span>
          </span>
          <ChevronRight className="size-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Search */}
      <div className="relative px-3 pb-3">
        <Search className="pointer-events-none absolute left-6 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search families or components…"
          aria-label="Search families and components"
          className="pl-9 pr-16 transition-shadow focus-visible:ring-gold/40"
        />
        {query ? (
          <button
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground/60 sm:block">
            /
          </kbd>
        )}
      </div>

      {/* Nav list */}
      <ScrollArea className="min-h-0 flex-1">
        <nav aria-label="Components" className="px-3 pb-6">
          {searching ? (
            <div className="space-y-1">
              <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {(familyResults?.length ?? 0) +
                  (memberResults?.length ?? 0) +
                  (guideResults?.length ?? 0)}{" "}
                result
                {(familyResults?.length ?? 0) +
                  (memberResults?.length ?? 0) +
                  (guideResults?.length ?? 0) ===
                1
                  ? ""
                  : "s"}
                <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground/60">
                  for “{query.trim()}”
                </span>
              </p>

              {guideResults && guideResults.length > 0 && (
                <>
                  <p className="px-2 pb-0.5 pt-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
                    Guides
                  </p>
                  {guideResults.map((g) => renderGuideRow(g))}
                </>
              )}
              {familyResults && familyResults.length > 0 && (
                <>
                  <p className="px-2 pb-0.5 pt-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
                    Families
                  </p>
                  {familyResults.map((f) => renderFamilyRow(f))}
                </>
              )}
              {memberResults && memberResults.length > 0 && (
                <>
                  <p className="px-2 pb-0.5 pt-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
                    Components
                  </p>
                  {memberResults.map((d, i) => renderMemberResult(d.id, d.name, i))}
                </>
              )}
              {(familyResults?.length ?? 0) +
                (memberResults?.length ?? 0) +
                (guideResults?.length ?? 0) ===
                0 && (
                <div className="px-3 py-8 text-center">
                  <Sparkles className="mx-auto mb-2 size-5 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground">
                    Nothing matches “{query}”. Try “button”, “chart”, “input”…
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Usage guides — pinned above the component categories */}
              <div className="mb-1">
                <button
                  onClick={() => toggleGroup("guides")}
                  aria-expanded={!collapsed.guides}
                  aria-controls="docs-nav-panel-guides"
                  className={cn(
                    "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors cursor-pointer hover:bg-accent/60",
                    activeGuideId && !collapsed.guides && "text-foreground"
                  )}
                >
                  <GraduationCap
                    className={cn(
                      "size-3.5 shrink-0 transition-colors",
                      activeGuideId ? "text-gold" : "text-muted-foreground"
                    )}
                  />
                  <span className="flex-1 truncate text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                    Usage guides
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                    {GUIDES.length}
                  </span>
                  <ChevronRight
                    className={cn(
                      "size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200",
                      !collapsed.guides && "rotate-90"
                    )}
                  />
                </button>
                {!collapsed.guides && (
                  <div id="docs-nav-panel-guides" className="space-y-0.5 pb-1.5 pl-1.5">
                    {GUIDES.map((g) => renderGuideRow(g))}
                  </div>
                )}
              </div>

              {CATEGORIES.map((category) => {
              const families = getFamiliesByCategory(category.id);
              if (families.length === 0) return null;
              const Icon = CATEGORY_ICONS[category.id] ?? Box;
              const isCollapsed = !!collapsed[category.id];
              const containsActive = families.some((f) => f.id === activeFamilyId);
              const groupPanelId = `docs-nav-panel-${category.id}`;
              const memberCount = families.reduce((sum, f) => sum + f.memberIds.length, 0);
              return (
                <div key={category.id} className="mb-1">
                  <button
                    onClick={() => toggleGroup(category.id)}
                    aria-expanded={!isCollapsed}
                    aria-controls={groupPanelId}
                    className={cn(
                      "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors cursor-pointer hover:bg-accent/60",
                      containsActive && !isCollapsed && "text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-3.5 shrink-0 transition-colors",
                        containsActive ? "text-gold" : "text-muted-foreground"
                      )}
                    />
                    <span className="flex-1 truncate text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                      {category.label}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                      {memberCount}
                    </span>
                    <ChevronRight
                      className={cn(
                        "size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200",
                        !isCollapsed && "rotate-90"
                      )}
                    />
                  </button>
                  {!isCollapsed && (
                    <div id={groupPanelId} className="space-y-0.5 pb-1.5 pl-1.5">
                      {families.map((f) => renderFamilyRow(f))}
                    </div>
                  )}
                </div>
              );
              })}
            </>
          )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">{TOTAL_COMPONENTS}</span> components ·{" "}
            <span className="font-semibold text-foreground">{FAMILIES.length}</span> families
          </p>
          {/* quick light/dark switch */}
          <div
            role="group"
            aria-label="Color mode"
            className="flex items-center rounded-full border border-border bg-muted/60 p-0.5"
          >
            {(["light", "dark"] as const).map((m) => {
              const activeMode = mode === m;
              const Icon = m === "light" ? Sun : Moon;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={activeMode}
                  aria-label={`Switch to ${m} mode`}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full transition-all cursor-pointer",
                    activeMode
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                </button>
              );
            })}
          </div>
        </div>
        <p className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-muted-foreground/70">
          <Sparkles className="size-3 shrink-0 text-gold" />
          Family pages · responsive stages · v2.1
        </p>
      </div>
    </div>
  );
}
