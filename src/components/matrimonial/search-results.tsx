"use client";

import * as React from "react";
import { Bookmark, BookmarkCheck, BookmarkPlus, Check, ChevronLeft, Pencil, Search, SlidersHorizontal, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AGE_OPTIONS,
  CITY_OPTIONS,
  COMMUNITY_OPTIONS,
  MATRIMONY_PROFILES,
  filterProfiles,
  type MatrimonyProfile,
  type SearchQuery,
} from "@/lib/matrimony-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/ui/primitives";
import { ProfileCard } from "./profile-card";
import { Reveal } from "./reveal";
import { useSavedSearches, type SavedSearchRecord } from "./saved-searches-provider";
import { SaveSearchDialog, describeQuery } from "./save-search-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export interface SearchResultsProps {
  query: SearchQuery;
  onQueryChange: (q: SearchQuery) => void;
  onViewProfile: (profile: MatrimonyProfile) => void;
  onBack: () => void;
}

function sameQuery(a: SearchQuery, b: SearchQuery): boolean {
  return (
    a.seeking === b.seeking &&
    a.age === b.age &&
    a.community === b.community &&
    a.city === b.city &&
    (a.term ?? "") === (b.term ?? "")
  );
}

const SORT_OPTIONS = [
  { value: "match", label: "Best match" },
  { value: "age-asc", label: "Age: low to high" },
  { value: "age-desc", label: "Age: high to low" },
  { value: "name", label: "Name (A–Z)" },
] as const;

export function SearchResults({
  query,
  onQueryChange,
  onViewProfile,
  onBack,
}: SearchResultsProps) {
  const [term, setTerm] = React.useState(query.term ?? "");
  const [showFilters, setShowFilters] = React.useState(true);
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [renaming, setRenaming] = React.useState(false);
  const [renameDraft, setRenameDraft] = React.useState("");
  const savedSearches = useSavedSearches();
  const { toast } = useToast();

  // The saved search currently being viewed (query matches a saved set)
  const activeSaved = React.useMemo<SavedSearchRecord | undefined>(
    () => savedSearches.records.find((s) => sameQuery(s.query, query)),
    [savedSearches.records, query]
  );

  const startRename = () => {
    if (!activeSaved) return;
    setRenameDraft(activeSaved.name);
    setRenaming(true);
  };

  const commitRename = async () => {
    if (!activeSaved) return;
    const name = renameDraft.trim();
    if (!name || name === activeSaved.name) {
      setRenaming(false);
      return;
    }
    const res = await savedSearches.renameSearch(activeSaved.id, name);
    if (res.ok) {
      toast({ title: "Search renamed", description: `Saved search is now “${name}”.` });
      setRenaming(false);
    } else {
      toast({ title: "Could not rename", description: res.error, variant: "destructive" });
    }
  };

  const unsaveActive = async () => {
    if (!activeSaved) return;
    const name = activeSaved.name;
    await savedSearches.removeSearch(activeSaved.id);
    toast({ title: "Saved search removed", description: `“${name}” was deleted from your account.` });
  };

  const exitSavedView = () => {
    onQueryChange({ ...query, community: "Any", city: "Any", age: "Any", term: "" });
  };

  React.useEffect(() => {
    setTerm(query.term ?? "");
  }, [query.term]);

  const results = React.useMemo(
    () => filterProfiles(MATRIMONY_PROFILES, query),
    [query]
  );

  const update = (patch: Partial<SearchQuery>) => onQueryChange({ ...query, ...patch });

  const activeFilterCount = [
    query.community !== "Any" ? 1 : 0,
    query.city !== "Any" ? 1 : 0,
    query.age !== "Any" ? 1 : 0,
  ].reduce<number>((a, b) => a + b, 0);

  const chips: { label: string; onClear: () => void }[] = [];
  if (query.community !== "Any")
    chips.push({ label: query.community, onClear: () => update({ community: "Any" }) });
  if (query.city !== "Any")
    chips.push({ label: query.city, onClear: () => update({ city: "Any" }) });
  if (query.age !== "Any")
    chips.push({ label: query.age, onClear: () => update({ age: "Any" }) });

  return (
    <section className="bg-secondary/30 pb-24 pt-12" aria-label="Search results">
      <Container>
        {/* Header */}
        <Reveal>
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <ChevronLeft className="size-4" />
            Back to home
          </button>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                {query.seeking === "female" ? "Matches for a groom" : "Matches for a bride"}
              </p>
              <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {results.length} {results.length === 1 ? "match" : "matches"} waiting for you
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Hand-verified profiles sorted by Saptapadi match score. Refine with the filters
                below — every tap updates results instantly.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full"
                    onClick={() => setSaveOpen(true)}
                    aria-label="Save this search"
                  >
                    <BookmarkPlus className="size-4" />
                    <span className="hidden sm:inline">Save search</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Keep this filter set for one-tap recall</TooltipContent>
              </Tooltip>
              <Button
                variant="outline"
                className="gap-2 rounded-full"
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
              >
                <SlidersHorizontal className="size-4" />
                {showFilters ? "Hide filters" : "Show filters"}
                {activeFilterCount > 0 && (
                  <Badge variant="gold" className="px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Viewing a saved search — dedicated banner with quick actions */}
        {activeSaved && (
          <Reveal delay={0.03}>
            <div
              className="edge-gold-top mt-5 flex flex-col gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-4 sm:flex-row sm:items-center"
              aria-label="Viewing a saved search"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-foreground dark:text-gold">
                <BookmarkCheck className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-wider text-gold">
                  Viewing saved search
                  {activeSaved.newSinceSaved > 0 && (
                    <Badge variant="success" className="px-1.5 py-0 text-[10px] normal-case tracking-normal">
                      +{activeSaved.newSinceSaved} new since saved
                    </Badge>
                  )}
                </p>
                {renaming ? (
                  <div className="mt-1 flex max-w-md items-center gap-2">
                    <Input
                      value={renameDraft}
                      onChange={(e) => setRenameDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void commitRename();
                        if (e.key === "Escape") setRenaming(false);
                      }}
                      autoFocus
                      aria-label="Rename saved search"
                      maxLength={60}
                      className="h-8"
                    />
                    <Button size="sm" variant="gold" className="h-8 gap-1 rounded-full px-3" onClick={() => void commitRename()}>
                      <Check className="size-3.5" />
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 rounded-full px-3" onClick={() => setRenaming(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="mt-0.5 truncate font-serif text-lg font-bold text-foreground">{activeSaved.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{describeQuery(activeSaved.query)}</p>
                  </>
                )}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {!renaming && (
                  <Button size="sm" variant="outline" className="h-8 gap-1.5 rounded-full" onClick={startRename}>
                    <Pencil className="size-3.5" />
                    Rename
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => void unsaveActive()}
                >
                  <Trash2 className="size-3.5" />
                  Unsave
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={exitSavedView}
                      aria-label="Exit saved search view and clear filters"
                    >
                      <X className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear filters and browse everything</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Reveal>
        )}

        {/* Mobile sticky summary — count + filter access while scrolling */}
        <div className="sticky top-[4.4rem] z-20 mt-5 lg:hidden">
          <div className="glass flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 shadow-sm">
            <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {results.length} {results.length === 1 ? "match" : "matches"}
              {activeFilterCount > 0 && (
                <Badge variant="gold" className="ml-0.5 px-1.5 text-[10px]">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                </Badge>
              )}
            </p>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 rounded-full px-2.5 text-xs"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="size-3" />
              {showFilters ? "Hide" : "Filters"}
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        {showFilters && (
          <Reveal delay={0.05}>
            <div className="edge-gold-top mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Looking for
                  </label>
                  <Select
                    value={query.seeking}
                    onValueChange={(v) => update({ seeking: v as SearchQuery["seeking"] })}
                  >
                    <SelectTrigger className="w-full" aria-label="Looking for">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Bride (female profiles)</SelectItem>
                      <SelectItem value="male">Groom (male profiles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Age
                  </label>
                  <Select value={query.age} onValueChange={(v) => update({ age: v })}>
                    <SelectTrigger className="w-full" aria-label="Age range">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any age</SelectItem>
                      {AGE_OPTIONS.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Community
                  </label>
                  <Select
                    value={query.community}
                    onValueChange={(v) => update({ community: v })}
                  >
                    <SelectTrigger className="w-full" aria-label="Community">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMUNITY_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    City
                  </label>
                  <Select value={query.city} onValueChange={(v) => update({ city: v })}>
                    <SelectTrigger className="w-full" aria-label="City">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any city</SelectItem>
                      {CITY_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-56 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={term}
                    onChange={(e) => {
                      setTerm(e.target.value);
                      update({ term: e.target.value });
                    }}
                    placeholder="Search by name, profession, education…"
                    aria-label="Search profiles"
                    className="pl-9"
                  />
                </div>
                <Select
                  value={query.sort ?? "match"}
                  onValueChange={(v) => update({ sort: v as SearchQuery["sort"] })}
                >
                  <SelectTrigger className="w-44" aria-label="Sort by">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {chips.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {chips.map((chip) => (
                      <Badge key={chip.label} variant="soft" className="gap-1 py-1 pl-3">
                        {chip.label}
                        <button
                          type="button"
                          onClick={chip.onClear}
                          aria-label={`Clear ${chip.label} filter`}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-primary/15 cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                    <button
                      type="button"
                      onClick={() => update({ community: "Any", city: "Any", age: "Any" })}
                      className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* Saved searches — one-tap recall of a previous filter set */}
        {savedSearches.count > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Saved searches">
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Bookmark className="size-3.5 text-gold" aria-hidden="true" />
              Saved
            </span>
            {savedSearches.records.slice(0, 5).map((saved) => {
              const active = sameQuery(saved.query, query);
              return (
                <button
                  key={saved.id}
                  type="button"
                  onClick={() => onQueryChange({ ...saved.query })}
                  title={describeQuery(saved.query)}
                  aria-pressed={active}
                  className={cn(
                    "group flex max-w-[16rem] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                    active
                      ? "border-gold/60 bg-gold/10 text-foreground shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground"
                  )}
                >
                  {active ? (
                    <BookmarkCheck className="size-3.5 shrink-0 text-gold" aria-hidden="true" />
                  ) : (
                    <Bookmark className="size-3.5 shrink-0 text-gold/70 transition-colors group-hover:text-gold" aria-hidden="true" />
                  )}
                  <span className="truncate">{saved.name}</span>
                  {saved.newSinceSaved > 0 && (
                    <Badge variant="success" className="shrink-0 px-1.5 py-0 text-[10px]">
                      +{saved.newSinceSaved}
                    </Badge>
                  )}
                </button>
              );
            })}
            {savedSearches.count > 5 && (
              <span className="text-[11px] text-muted-foreground">
                +{savedSearches.count - 5} more in your dashboard
              </span>
            )}
          </div>
        )}

        {/* Results grid */}
        {results.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((profile, i) => (
              <Reveal key={profile.id} delay={Math.min(i * 0.06, 0.3)}>
                <ProfileCard profile={profile} onView={onViewProfile} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-10">
            <div className="rounded-2xl border border-border bg-card p-4">
              <EmptyState
                title="No matches found — yet"
                description={`No profiles match “${query.community === "Any" ? "" : query.community + " · "}${
                  query.city === "Any" ? "" : query.city + " · "
                }${query.age === "Any" ? "" : query.age}”. Try widening your filters or explore everyone.`}
                action={
                  <Button
                    variant="gold"
                    onClick={() => update({ community: "Any", city: "Any", age: "Any", term: "" })}
                  >
                    Reset filters
                  </Button>
                }
                secondaryAction={
                  <Button variant="outline" onClick={onBack}>
                    Back to home
                  </Button>
                }
              />
            </div>
          </Reveal>
        )}

      <SaveSearchDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        query={query}
        matches={results.length}
      />
      </Container>
    </section>
  );
}
