"use client"

import * as React from "react"
import {
  Archive,
  BookOpen,
  ChevronDown,
  Download,
  Heart,
  Home,
  LifeBuoy,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  UserPlus,
} from "lucide-react"

import type { ComponentDoc } from "./types"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommandPalette } from "@/components/ui/command-palette"
import {
  FilterBar,
  FilterPanel,
  SearchFilter,
  type ActiveFilter,
} from "@/components/ui/filter-bar"
import { SortControl, type SortValue } from "@/components/ui/sort-control"
import { ViewSwitcher, type ViewMode } from "@/components/ui/view-switcher"
import { BulkActions } from "@/components/ui/bulk-actions"
import {
  QueryBuilder,
  type QueryField,
  type QueryRule,
} from "@/components/ui/query-builder"
import { DataToolbar } from "@/components/ui/data-toolbar"

/* ------------------------------ shared seed ------------------------------- */

const CITY_LIST = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune"]

const SORT_FIELDS = [
  { id: "name", label: "Name" },
  { id: "age", label: "Age" },
  { id: "city", label: "City" },
]

/* --------------------------------- demos ---------------------------------- */

function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false)
  const [lastAction, setLastAction] = React.useState("Nothing run yet")

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", down)
    return () => window.removeEventListener("keydown", down)
  }, [])

  const run = (label: string) => () => setLastAction(label)

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <Button variant="gold" onClick={() => setOpen(true)}>
        <SlidersHorizontal className="size-4" />
        Open command palette
        <Badge
          variant="outline"
          className="border-gold/40 ml-1 font-mono text-[10px]"
        >
          ⌘K
        </Badge>
      </Button>
      <span className="text-muted-foreground text-sm">
        Last action: <span className="text-foreground font-medium">{lastAction}</span>
      </span>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        placeholder="Search actions, pages, help..."
        groups={[
          {
            heading: "Actions",
            items: [
              { id: "new-profile", label: "Create new profile", icon: <Plus className="size-4" />, shortcut: "⌘N", onSelect: run("Create new profile") },
              { id: "invite", label: "Invite family member", icon: <UserPlus className="size-4" />, shortcut: "⌘I", onSelect: run("Invite family member") },
              { id: "shortlist", label: "Add to shortlist", icon: <Heart className="size-4" />, shortcut: "⌘S", onSelect: run("Add to shortlist") },
              { id: "export", label: "Export profiles", icon: <Download className="size-4" />, shortcut: "⌘E", onSelect: run("Export profiles") },
            ],
          },
          {
            heading: "Navigation",
            items: [
              { id: "home", label: "Go to dashboard", icon: <Home className="size-4" />, shortcut: "G D", onSelect: run("Go to dashboard") },
              { id: "search", label: "Search profiles", icon: <Search className="size-4" />, shortcut: "G S", onSelect: run("Search profiles") },
              { id: "messages", label: "Open messages", icon: <MessageCircle className="size-4" />, shortcut: "G M", onSelect: run("Open messages") },
              { id: "settings", label: "Open settings", icon: <Settings className="size-4" />, shortcut: "G P", onSelect: run("Open settings") },
            ],
          },
          {
            heading: "Help",
            items: [
              { id: "docs", label: "Read documentation", icon: <BookOpen className="size-4" />, shortcut: "?", onSelect: run("Read documentation") },
              { id: "support", label: "Contact support", icon: <LifeBuoy className="size-4" />, onSelect: run("Contact support") },
            ],
          },
        ]}
      />
    </div>
  )
}

function FilterBarDemo() {
  const [active, setActive] = React.useState<ActiveFilter[]>([
    { id: "city-mumbai", label: "City: Mumbai" },
    { id: "age-25-32", label: "Age 25–32" },
  ])

  const addFilter = (filter: ActiveFilter) =>
    setActive((prev) =>
      prev.some((f) => f.id === filter.id) ? prev : [...prev, filter]
    )

  return (
    <div className="flex w-full flex-col gap-3">
      <FilterBar
        filters={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <MapPin className="size-4" />
                  City
                  <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {CITY_LIST.slice(0, 4).map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onSelect={() =>
                      addFilter({ id: "city-" + city.toLowerCase(), label: "City: " + city })
                    }
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Heart className="size-4" />
                  Marital status
                  <ChevronDown className="size-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {["Never married", "Divorced", "Widowed"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onSelect={() =>
                      addFilter({ id: "status-" + status.toLowerCase(), label: status })
                    }
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
        activeFilters={active}
        onRemoveFilter={(id) => setActive((prev) => prev.filter((f) => f.id !== id))}
        onClearAll={() => setActive([])}
        actions={
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            More
          </Button>
        }
      />
      <p className="text-muted-foreground text-xs">
        {active.length} active filter{active.length === 1 ? "" : "s"} — pick from the
        dropdowns, remove chips with ×, or clear everything.
      </p>
    </div>
  )
}

function FilterPanelDemo() {
  const INTERESTS = ["Classical music", "Travel", "Yoga", "Cooking", "Cricket", "Poetry"]
  const [minAge, setMinAge] = React.useState("24")
  const [maxAge, setMaxAge] = React.useState("32")
  const [interests, setInterests] = React.useState<string[]>(["Travel"])
  const [applied, setApplied] = React.useState("")

  const ageCount = minAge !== "24" || maxAge !== "32" ? 1 : 0

  const toggleInterest = (interest: string) =>
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <FilterPanel
        title="Preferences"
        description="Refine match suggestions"
        sections={[
          {
            title: "Age range",
            count: ageCount,
            children: (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={minAge}
                  onChange={(event) => setMinAge(event.target.value)}
                  className="w-24"
                  aria-label="Minimum age"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={maxAge}
                  onChange={(event) => setMaxAge(event.target.value)}
                  className="w-24"
                  aria-label="Maximum age"
                />
              </div>
            ),
          },
          {
            title: "Interests",
            count: interests.length,
            children: (
              <div className="grid grid-cols-2 gap-2">
                {INTERESTS.map((interest) => (
                  <label
                    key={interest}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={interests.includes(interest)}
                      onCheckedChange={() => toggleInterest(interest)}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            ),
          },
        ]}
        onApply={() =>
          setApplied(
            "Applied: ages " + minAge + "–" + maxAge + ", " + interests.length + " interest(s)"
          )
        }
        onReset={() => {
          setMinAge("24")
          setMaxAge("32")
          setInterests([])
          setApplied("")
        }}
      />
      {applied ? (
        <Badge variant="success" className="w-fit">
          {applied}
        </Badge>
      ) : null}
    </div>
  )
}

function SortControlDemo() {
  const [sort, setSort] = React.useState<SortValue | null>(null)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SortControl fields={SORT_FIELDS} value={sort} onChange={setSort} />
      <span className="text-muted-foreground text-sm">
        {sort
          ? "Sorted by " +
            (SORT_FIELDS.find((f) => f.id === sort.field)?.label ?? sort.field) +
            " (" +
            sort.direction +
            ") — pick the same field again to flip direction"
          : "No sorting applied"}
      </span>
    </div>
  )
}

function ViewSwitcherDemo() {
  const [view, setView] = React.useState<ViewMode>("grid")
  const NAMES = ["Aarav", "Diya", "Kabir", "Meera", "Rohan", "Sanya"]

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-3">
        <ViewSwitcher value={view} onChange={setView} />
        <span className="text-muted-foreground text-xs">current view: {view}</span>
      </div>
      <div
        className={cn(
          "bg-muted/30 rounded-xl border border-border p-3",
          view === "grid" && "grid grid-cols-3 gap-2",
          view === "list" && "flex flex-col gap-2",
          view === "table" && "flex flex-col gap-1"
        )}
      >
        {view === "table" ? (
          <div className="text-muted-foreground grid grid-cols-[2fr_1fr_1fr] gap-2 px-2 text-xs font-semibold uppercase tracking-wider">
            <span>Name</span>
            <span>Age</span>
            <span>City</span>
          </div>
        ) : null}
        {NAMES.map((name, index) =>
          view === "table" ? (
            <div
              key={name}
              className="bg-card grid grid-cols-[2fr_1fr_1fr] gap-2 rounded-md px-2 py-1.5 text-sm shadow-xs"
            >
              <span className="font-medium">{name}</span>
              <span className="text-muted-foreground">{24 + index}</span>
              <span className="text-muted-foreground">
                {CITY_LIST[index % CITY_LIST.length]}
              </span>
            </div>
          ) : (
            <div
              key={name}
              className={cn(
                "bg-card flex items-center gap-2 rounded-lg border border-border px-3 py-2 shadow-xs",
                view === "grid" && "flex-col justify-center py-4 text-center"
              )}
            >
              <span className="bg-gold/20 text-gold-foreground dark:text-gold flex size-7 shrink-0 items-center justify-center rounded-full font-serif text-xs font-semibold">
                {name.charAt(0)}
              </span>
              <span className="text-sm font-medium">{name}</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}

function BulkActionsDemo() {
  const PROFILES = ["Aarav Sharma", "Diya Patel", "Kabir Singh", "Meera Iyer", "Rohan Mehta"]
  const [selected, setSelected] = React.useState<string[]>([])
  const [note, setNote] = React.useState("")

  const toggle = (profile: string) =>
    setSelected((prev) =>
      prev.includes(profile) ? prev.filter((s) => s !== profile) : [...prev, profile]
    )

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="bg-card divide-border rounded-xl border border-border shadow-sm">
        {PROFILES.map((profile) => (
          <label
            key={profile}
            className="hover:bg-accent/40 flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
          >
            <Checkbox
              checked={selected.includes(profile)}
              onCheckedChange={() => toggle(profile)}
            />
            <span className="font-medium">{profile}</span>
          </label>
        ))}
      </div>
      <BulkActions
        inline
        count={selected.length}
        onClear={() => setSelected([])}
        actions={[
          {
            id: "archive",
            label: "Archive",
            icon: <Archive className="size-4" />,
            onClick: () => setNote("Archived " + selected.length + " profile(s)"),
          },
          {
            id: "delete",
            label: "Delete",
            icon: <Trash2 className="size-4" />,
            tone: "destructive",
            onClick: () => setNote("Deleted " + selected.length + " profile(s)"),
          },
        ]}
      />
      {note ? (
        <Badge variant="info" className="w-fit">
          {note}
        </Badge>
      ) : null}
      <p className="text-muted-foreground text-xs">
        Select profiles to reveal the gold bulk actions bar.
      </p>
    </div>
  )
}

function SearchFilterDemo() {
  const [query, setQuery] = React.useState("")
  const matches = CITY_LIST.filter((city) =>
    city.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SearchFilter value={query} onChange={setQuery} placeholder="Search cities..." />
      <ul className="space-y-1.5">
        {matches.map((city) => (
          <li
            key={city}
            className="bg-card flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm shadow-xs"
          >
            <span className="font-medium">{city}</span>
            <MapPin className="text-muted-foreground size-4" />
          </li>
        ))}
        {matches.length === 0 ? (
          <li className="text-muted-foreground border-border rounded-lg border border-dashed px-3 py-4 text-center text-sm">
            No cities match your search.
          </li>
        ) : null}
      </ul>
    </div>
  )
}

function QueryBuilderDemo() {
  const FIELDS: QueryField[] = [
    { id: "name", label: "Name", type: "text" },
    { id: "age", label: "Age", type: "number" },
    { id: "city", label: "City", type: "select", options: CITY_LIST.slice(0, 4) },
  ]
  const [rules, setRules] = React.useState<QueryRule[]>([
    { id: "r1", field: "name", operator: "contains", value: "Sharma" },
    { id: "r2", field: "age", operator: "lt", value: "32" },
  ])

  return (
    <div className="flex w-full flex-col gap-3">
      <QueryBuilder fields={FIELDS} rules={rules} onChange={setRules} />
      <div className="bg-muted/40 text-muted-foreground rounded-lg px-3 py-2 font-mono text-xs">
        {rules.length === 0
          ? "match all profiles"
          : rules
              .map(
                (rule) =>
                  rule.field + " " + rule.operator + " '" + (rule.value || "…") + "'"
              )
              .join(" AND ")}
      </div>
    </div>
  )
}

function DataToolbarDemo() {
  const PROFILES = [
    { name: "Aarav Sharma", age: 28, city: "Mumbai" },
    { name: "Diya Patel", age: 26, city: "Bengaluru" },
    { name: "Kabir Singh", age: 30, city: "Delhi" },
    { name: "Meera Iyer", age: 27, city: "Chennai" },
    { name: "Rohan Mehta", age: 31, city: "Pune" },
    { name: "Sanya Kapoor", age: 25, city: "Mumbai" },
  ]
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<SortValue | null>(null)
  const [view, setView] = React.useState<ViewMode>("grid")
  const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([
    { id: "city-mumbai", label: "City: Mumbai" },
  ])

  const filtered = PROFILES.filter((profile) => {
    const needle = query.trim().toLowerCase()
    const matchesQuery =
      profile.name.toLowerCase().includes(needle) ||
      profile.city.toLowerCase().includes(needle)
    const cityFilters = activeFilters
      .filter((f) => f.id.startsWith("city-"))
      .map((f) => f.id.replace("city-", ""))
    const matchesCity =
      cityFilters.length === 0 || cityFilters.includes(profile.city.toLowerCase())
    return matchesQuery && matchesCity
  })

  const sorted = sort
    ? [...filtered].sort((a, b) => {
        let result = 0
        if (sort.field === "age") result = a.age - b.age
        else if (sort.field === "name") result = a.name.localeCompare(b.name)
        else result = a.city.localeCompare(b.city)
        return sort.direction === "asc" ? result : -result
      })
    : filtered

  return (
    <div className="flex w-full flex-col gap-4">
      <DataToolbar
        search={{ value: query, onChange: setQuery, placeholder: "Search name or city..." }}
        filters={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <MapPin className="size-4" />
                City
                <ChevronDown className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {CITY_LIST.slice(0, 4).map((city) => (
                <DropdownMenuItem
                  key={city}
                  onSelect={() =>
                    setActiveFilters((prev) =>
                      prev.some((f) => f.id === "city-" + city.toLowerCase())
                        ? prev
                        : [...prev, { id: "city-" + city.toLowerCase(), label: "City: " + city }]
                    )
                  }
                >
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
        activeFilters={activeFilters}
        onRemoveFilter={(id) => setActiveFilters((prev) => prev.filter((f) => f.id !== id))}
        onClearAllFilters={() => setActiveFilters([])}
        sort={{ fields: SORT_FIELDS, value: sort, onChange: setSort }}
        view={{ value: view, onChange: setView }}
      />
      <div
        className={cn(
          "gap-3",
          view === "grid" ? "grid grid-cols-2 sm:grid-cols-3" : "flex flex-col"
        )}
      >
        {sorted.map((profile) => (
          <div
            key={profile.name}
            className="bg-card flex items-center gap-3 rounded-xl border border-border p-3 shadow-sm"
          >
            <span className="bg-gold/20 text-gold-foreground dark:text-gold flex size-9 shrink-0 items-center justify-center rounded-full font-serif text-sm font-semibold">
              {profile.name.charAt(0)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{profile.name}</span>
              <span className="text-muted-foreground block text-xs">
                {profile.age} yrs · {profile.city}
              </span>
            </span>
          </div>
        ))}
        {sorted.length === 0 ? (
          <p className="text-muted-foreground border-border col-span-full rounded-xl border border-dashed py-8 text-center text-sm">
            No profiles match the current filters.
          </p>
        ) : null}
      </div>
    </div>
  )
}

/* -------------------------------- registry -------------------------------- */

export const advanced_1Docs: ComponentDoc[] = [
  {
    id: "command-palette",
    name: "CommandPalette",
    category: "advanced",
    description:
      "⌘K command palette built on cmdk and Dialog — grouped commands with icons, keyboard shortcuts and a gold selected state, plus a footer hints row.",
    aliases: ["CommandDialog"],
    demos: [
      {
        id: "basic",
        title: "Controlled palette",
        description:
          "Opens from a button or ⌘K/Ctrl+K. Selecting an item runs onSelect and closes the palette.",
        code: `const [open, setOpen] = React.useState(false)

<Button variant="gold" onClick={() => setOpen(true)}>
  Open command palette
</Button>

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  placeholder="Search actions, pages, help..."
  groups={[
    {
      heading: "Actions",
      items: [
        { id: "new", label: "Create new profile", icon: <Plus className="size-4" />, shortcut: "⌘N" },
        { id: "shortlist", label: "Add to shortlist", icon: <Heart className="size-4" />, shortcut: "⌘S" },
      ],
    },
    {
      heading: "Navigation",
      items: [
        { id: "home", label: "Go to dashboard", icon: <Home className="size-4" />, shortcut: "G D" },
      ],
    },
    {
      heading: "Help",
      items: [
        { id: "docs", label: "Read documentation", icon: <BookOpen className="size-4" />, shortcut: "?" },
      ],
    },
  ]}
/>`,
        render: () => <CommandPaletteDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "open", type: "boolean", default: "—", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", description: "Open/close handler; selecting an item also closes." },
      { name: "groups", type: "CommandPaletteGroup[]", default: "—", description: "Grouped items: heading + items with id, label, icon?, shortcut?, onSelect?." },
      { name: "placeholder", type: "string", default: '"Type a command or search..."', description: "Search input placeholder." },
      { name: "className", type: "string", default: '"sm:max-w-xl"', description: "Width override applied to the dialog content." },
    ],
  },
  {
    id: "filter-bar",
    name: "FilterBar",
    category: "advanced",
    description:
      "Horizontal filter surface: left control slot, gold removable active-filter chips with a clear-all action, and a right actions slot.",
    aliases: ["ActiveFilters"],
    demos: [
      {
        id: "chips",
        title: "Chips + dropdown filters",
        description: "Dropdown selections add chips; remove them individually or clear all at once.",
        code: `const [active, setActive] = React.useState([
  { id: "city-mumbai", label: "City: Mumbai" },
])

<FilterBar
  filters={
    <Button variant="outline" size="sm">
      <MapPin className="size-4" /> City
    </Button>
  }
  activeFilters={active}
  onRemoveFilter={(id) => setActive((prev) => prev.filter((f) => f.id !== id))}
  onClearAll={() => setActive([])}
  actions={<ViewSwitcher value={view} onChange={setView} />}
/>`,
        render: () => <FilterBarDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "filters", type: "ReactNode", default: "—", description: "Left slot: filter controls (dropdowns, selects...)." },
      { name: "activeFilters", type: "{ id: string; label: string }[]", default: "[]", description: "Active filter chips." },
      { name: "onRemoveFilter", type: "(id: string) => void", default: "—", description: "Called when a chip X is clicked." },
      { name: "onClearAll", type: "() => void", default: "—", description: "Renders a Clear all button when provided." },
      { name: "actions", type: "ReactNode", default: "—", description: "Right slot for trailing actions." },
    ],
  },
  {
    id: "filter-panel",
    name: "FilterPanel",
    category: "advanced",
    description:
      "Collapsible filter panel with titled sections (custom children), per-section applied-count badges, and Reset / Apply actions.",
    demos: [
      {
        id: "preferences",
        title: "Preferences panel",
        description: "Age range inputs plus interest checkboxes with live applied-count badges.",
        code: `<FilterPanel
  title="Preferences"
  description="Refine match suggestions"
  sections={[
    {
      title: "Age range",
      count: 1,
      children: (
        <div className="flex items-center gap-2">
          <Input type="number" value={minAge} className="w-24" aria-label="Minimum age" />
          <span className="text-muted-foreground text-xs">to</span>
          <Input type="number" value={maxAge} className="w-24" aria-label="Maximum age" />
        </div>
      ),
    },
    {
      title: "Interests",
      count: interests.length,
      children: <div className="grid grid-cols-2 gap-2">{/* Checkbox rows */}</div>,
    },
  ]}
  onReset={reset}
  onApply={apply}
/>`,
        render: () => <FilterPanelDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "sections", type: "FilterPanelSection[]", default: "—", description: "{ title, count?, children? } — children are the custom section body." },
      { name: "title", type: "string", default: '"Filters"', description: "Panel heading." },
      { name: "open / defaultOpen", type: "boolean", default: "true", description: "Controlled and uncontrolled open state." },
      { name: "onApply", type: "() => void", default: "—", description: "Gold Apply button handler." },
      { name: "onReset", type: "() => void", default: "—", description: "Ghost Reset button handler." },
    ],
  },
  {
    id: "sort-control",
    name: "SortControl",
    category: "advanced",
    description:
      "Dropdown sort control: pick a field to sort ascending, pick it again (or use the menu) to flip direction, clear anytime.",
    demos: [
      {
        id: "controlled",
        title: "Controlled sort state",
        description: "The trigger shows the active field with an ArrowUp/ArrowDown indicator.",
        code: `const [sort, setSort] = React.useState<SortValue | null>(null)

<SortControl
  fields={[
    { id: "name", label: "Name" },
    { id: "age", label: "Age" },
    { id: "city", label: "City" },
  ]}
  value={sort}
  onChange={setSort}
/>`,
        render: () => <SortControlDemo />,
      },
    ],
    props: [
      { name: "fields", type: "{ id: string; label: string }[]", default: "—", description: "Sortable fields." },
      { name: "value", type: "{ field: string; direction: \"asc\" | \"desc\" } | null", default: "null", description: "Current sort value; null shows the placeholder label." },
      { name: "onChange", type: "(value: SortValue | null) => void", default: "—", description: "Next sort value; null clears sorting." },
      { name: "placeholder", type: "string", default: '"Sort"', description: "Trigger label when nothing is sorted." },
    ],
  },
  {
    id: "view-switcher",
    name: "ViewSwitcher",
    category: "advanced",
    description:
      "Segmented grid / list / table control built on ToggleGroup, with a gold active segment. Controlled or uncontrolled.",
    demos: [
      {
        id: "modes",
        title: "Switch a preview area",
        description: "The same six records rendered as a grid, list and table.",
        code: `const [view, setView] = React.useState<ViewMode>("grid")

<ViewSwitcher value={view} onChange={setView} />
<ViewSwitcher defaultValue="list" views={["grid", "list"]} />

// view: "grid" | "list" | "table"
{view === "grid" ? (
  <div className="grid grid-cols-3 gap-2">{/* cards */}</div>
) : null}`,
        render: () => <ViewSwitcherDemo />,
      },
    ],
    props: [
      { name: "value", type: '"grid" | "list" | "table"', default: "—", description: "Controlled active view." },
      { name: "defaultValue", type: '"grid" | "list" | "table"', default: '"grid"', description: "Initial view when uncontrolled." },
      { name: "onChange", type: "(value: ViewMode) => void", default: "—", description: "Fires when a segment is picked." },
      { name: "views", type: "ViewMode[]", default: '["grid", "list", "table"]', description: "Which segments to render." },
    ],
  },
  {
    id: "bulk-actions",
    name: "BulkActions",
    category: "advanced",
    description:
      "Floating gold-gradient action bar for multi-select workflows — count badge, tone-aware action buttons, clear-selection X and a slide-up entrance.",
    demos: [
      {
        id: "selection",
        title: "Checkbox list + action bar",
        description: "Select rows to reveal the bar (inline in this preview; fixed bottom-center by default).",
        code: `const [selected, setSelected] = React.useState<string[]>([])

<BulkActions
  inline
  count={selected.length}
  onClear={() => setSelected([])}
  actions={[
    { id: "archive", label: "Archive", icon: <Archive className="size-4" />, onClick: archive },
    { id: "delete", label: "Delete", icon: <Trash2 className="size-4" />, tone: "destructive", onClick: remove },
  ]}
/>`,
        render: () => <BulkActionsDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "count", type: "number", default: "—", description: "Selected row count; renders nothing when 0." },
      { name: "actions", type: "BulkAction[]", default: "—", description: "{ id, label, icon?, onClick, tone? } — tone destructive styles the button red." },
      { name: "onClear", type: "() => void", default: "—", description: "Clear-selection handler; renders an X when provided." },
      { name: "inline", type: "boolean", default: "false", description: "Render in flow instead of fixed at the bottom center." },
      { name: "label", type: "string", default: '"selected"', description: "Text after the count badge." },
    ],
  },
  {
    id: "search-filter",
    name: "SearchFilter",
    category: "advanced",
    description:
      "Debounced search input with a leading Search icon and a clear button — commits onChange 300ms (configurable) after typing stops.",
    demos: [
      {
        id: "live",
        title: "Live city filter",
        description: "Six Indian cities filtered as you type, debounced at 300ms.",
        code: `const [query, setQuery] = React.useState("")

<SearchFilter
  value={query}
  onChange={setQuery}
  placeholder="Search cities..."
  delay={300}
/>

const matches = cities.filter((city) =>
  city.toLowerCase().includes(query.trim().toLowerCase())
)`,
        render: () => <SearchFilterDemo />,
      },
    ],
    props: [
      { name: "value", type: "string", default: "—", description: "Committed (debounced) search value." },
      { name: "onChange", type: "(value: string) => void", default: "—", description: "Called after the debounce delay; empty string on clear." },
      { name: "placeholder", type: "string", default: '"Search..."', description: "Input placeholder." },
      { name: "delay", type: "number", default: "300", description: "Debounce delay in ms." },
    ],
  },
  {
    id: "query-builder",
    name: "QueryBuilder",
    category: "advanced",
    description:
      "Rule rows with field / operator / value editors per field type, gold AND connectors between rows, add and remove controls, in a rounded bordered container.",
    demos: [
      {
        id: "rules",
        title: "Name / Age / City rules",
        description: "Text fields get contains/equals, numbers get >,<,= and selects get is — fully interactive.",
        code: `const [rules, setRules] = React.useState<QueryRule[]>([
  { id: "r1", field: "name", operator: "contains", value: "Sharma" },
  { id: "r2", field: "age", operator: "lt", value: "32" },
])

<QueryBuilder
  fields={[
    { id: "name", label: "Name", type: "text" },
    { id: "age", label: "Age", type: "number" },
    { id: "city", label: "City", type: "select", options: ["Mumbai", "Delhi"] },
  ]}
  rules={rules}
  onChange={setRules}
/>`,
        render: () => <QueryBuilderDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "fields", type: "QueryField[]", default: "—", description: "{ id, label, type: text | number | select, options? }." },
      { name: "rules", type: "QueryRule[]", default: "—", description: "Controlled rules: { id, field, operator, value }." },
      { name: "onChange", type: "(rules: QueryRule[]) => void", default: "—", description: "Called on add, edit and remove." },
      { name: "match", type: '"AND" | "OR"', default: '"AND"', description: "Connector badge between rows." },
      { name: "addLabel", type: "string", default: '"Add rule"', description: "Label for the dashed add button." },
    ],
  },
  {
    id: "data-toolbar",
    name: "DataToolbar",
    category: "advanced",
    description:
      "One-row premium data surface: debounced search on the left, filter dropdowns + active chips in the middle, sort and view controls on the right.",
    demos: [
      {
        id: "mini-grid",
        title: "Toolbar over a mini grid",
        description: "Search, city chips, sorting and view mode all drive the same six profiles.",
        code: `<DataToolbar
  search={{ value: query, onChange: setQuery, placeholder: "Search name or city..." }}
  filters={<CityFilterButton />}
  activeFilters={activeFilters}
  onRemoveFilter={removeFilter}
  onClearAllFilters={clearFilters}
  sort={{ fields: SORT_FIELDS, value: sort, onChange: setSort }}
  view={{ value: view, onChange: setView }}
/>

// below: render profiles per view + filters + sort`,
        render: () => <DataToolbarDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "search", type: "SearchFilterProps", default: "—", description: "Pass-through props for the left search input." },
      { name: "filters", type: "ReactNode", default: "—", description: "Middle slot for filter dropdowns / selects." },
      { name: "activeFilters", type: "ActiveFilter[]", default: "[]", description: "Chips shown next to the controls." },
      { name: "sort", type: "SortControlProps", default: "—", description: "Pass-through props for the sort control." },
      { name: "view", type: "ViewSwitcherProps", default: "—", description: "Pass-through props for the view switcher." },
      { name: "children", type: "ReactNode", default: "—", description: "Extra right-side controls before sort/view." },
    ],
  },
]
