"use client"

import * as React from "react"
import { ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible"
import { Input, type InputProps } from "./input"

/* -------------------------------------------------------------------------- */
/*  SearchFilter — debounced search input                                     */
/* -------------------------------------------------------------------------- */

export interface SearchFilterProps
  extends Omit<InputProps, "value" | "onChange"> {
  /** Current committed search value (controlled) */
  value: string
  /** Called with the debounced value after the user stops typing */
  onChange: (value: string) => void
  /** Debounce delay in ms */
  delay?: number
}

function SearchFilter({
  value,
  onChange,
  delay = 300,
  placeholder = "Search...",
  className,
  ...props
}: SearchFilterProps) {
  const [raw, setRaw] = React.useState(value)
  const timerRef = React.useRef<number | null>(null)

  // Keep the visible text in sync when the controlled value changes externally
  React.useEffect(() => {
    setRaw(value)
  }, [value])

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  const schedule = (next: string) => {
    setRaw(next)
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => onChange(next), delay)
  }

  const clear = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    setRaw("")
    onChange("")
  }

  return (
    <Input
      data-slot="search-filter"
      value={raw}
      placeholder={placeholder}
      onChange={(event) => schedule(event.target.value)}
      leadingIcon={<Search className="size-4" />}
      trailingIcon={
        raw ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clear}
            className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center rounded-full p-0.5 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        ) : null
      }
      className={className}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  FilterBar — controls + active chips + right actions                       */
/* -------------------------------------------------------------------------- */

export interface ActiveFilter {
  id: string
  label: string
}

export interface FilterBarProps extends React.ComponentProps<"div"> {
  /** Left slot: filter controls (dropdowns, selects, toggles...) */
  filters?: React.ReactNode
  /** Currently active filter chips */
  activeFilters?: ActiveFilter[]
  /** Remove a single chip by id */
  onRemoveFilter?: (id: string) => void
  /** Remove every chip */
  onClearAll?: () => void
  /** Right slot: trailing actions (sort, view switcher...) */
  actions?: React.ReactNode
}

function FilterBar({
  filters,
  activeFilters = [],
  onRemoveFilter,
  onClearAll,
  actions,
  className,
  children,
  ...props
}: FilterBarProps) {
  const hasChips = activeFilters.length > 0

  return (
    <div
      data-slot="filter-bar"
      className={cn(
        "bg-card flex flex-wrap items-center gap-2 rounded-xl border border-border p-2 shadow-sm",
        className
      )}
      {...props}
    >
      {filters ? (
        <div
          data-slot="filter-bar-controls"
          className="flex flex-wrap items-center gap-2"
        >
          {filters}
        </div>
      ) : null}
      {hasChips ? (
        <div
          data-slot="filter-bar-chips"
          className="flex flex-wrap items-center gap-1.5"
        >
          {activeFilters.map((filter) => (
            <Badge key={filter.id} variant="gold" className="gap-1 pr-1">
              {filter.label}
              <button
                type="button"
                aria-label={"Remove filter: " + filter.label}
                onClick={() => onRemoveFilter?.(filter.id)}
                className="hover:bg-gold-foreground/15 ml-0.5 flex size-4 cursor-pointer items-center justify-center rounded-full transition-colors"
              >
                <X className="size-2.5" />
              </button>
            </Badge>
          ))}
          {onClearAll ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 px-2 text-xs"
              onClick={onClearAll}
            >
              Clear all
            </Button>
          ) : null}
        </div>
      ) : null}
      {children}
      {actions ? (
        <div
          data-slot="filter-bar-actions"
          className="ml-auto flex items-center gap-2"
        >
          {actions}
        </div>
      ) : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  FilterPanel — collapsible sections + Reset / Apply                        */
/* -------------------------------------------------------------------------- */

export interface FilterPanelSection {
  title: string
  /** Number of applied options in this section — renders a gold count badge */
  count?: number
  /** Custom section body: checkboxes, range inputs, anything */
  children?: React.ReactNode
}

export interface FilterPanelProps extends React.ComponentProps<"div"> {
  /** Panel heading */
  title?: string
  /** Optional helper line under the heading */
  description?: string
  /** Sections rendered top to bottom */
  sections: FilterPanelSection[]
  /** Controlled open state */
  open?: boolean
  /** Uncontrolled initial open state */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onApply?: () => void
  onReset?: () => void
  applyLabel?: string
}

function FilterPanel({
  title = "Filters",
  description,
  sections,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  onApply,
  onReset,
  applyLabel = "Apply",
  className,
  ...props
}: FilterPanelProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = openProp ?? internalOpen

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next)
    onOpenChange?.(next)
  }

  const total = sections.reduce((sum, section) => sum + (section.count ?? 0), 0)

  return (
    <div
      data-slot="filter-panel"
      className={cn(
        "bg-card overflow-hidden rounded-xl border border-border shadow-sm",
        className
      )}
      {...props}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="hover:bg-accent/50 focus-visible:ring-ring/50 flex w-full cursor-pointer items-center gap-2.5 px-5 py-3.5 text-left outline-none transition-colors focus-visible:ring-[3px]">
          <SlidersHorizontal className="text-muted-foreground size-4 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="font-serif text-sm font-semibold">{title}</span>
            {description ? (
              <span className="text-muted-foreground block truncate text-xs">
                {description}
              </span>
            ) : null}
          </span>
          {total > 0 ? <Badge variant="gold">{total}</Badge> : null}
          <ChevronDown
            className={cn(
              "text-muted-foreground size-4 shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 duration-200"
        >
          <div className="space-y-5 border-t px-5 py-4">
            {sections.map((section) => (
              <section
                key={section.title}
                data-slot="filter-panel-section"
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    {section.title}
                  </h4>
                  {typeof section.count === "number" && section.count > 0 ? (
                    <Badge variant="gold">{section.count} applied</Badge>
                  ) : null}
                </div>
                {section.children}
              </section>
            ))}
          </div>
          <div className="bg-muted/30 flex items-center justify-between gap-2 border-t px-5 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground cursor-pointer"
              onClick={onReset}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
            <Button type="button" variant="gold" size="sm" onClick={onApply}>
              {applyLabel}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export { SearchFilter, FilterBar, FilterPanel }
