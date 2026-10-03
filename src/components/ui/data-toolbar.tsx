"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  FilterBar,
  SearchFilter,
  type ActiveFilter,
  type SearchFilterProps,
} from "@/components/ui/filter-bar"
import {
  SortControl,
  type SortControlProps,
} from "@/components/ui/sort-control"
import {
  ViewSwitcher,
  type ViewSwitcherProps,
} from "@/components/ui/view-switcher"

export interface DataToolbarProps {
  /** Props for the left-hand debounced search input */
  search?: SearchFilterProps
  /** Middle slot: filter dropdowns / selects */
  filters?: React.ReactNode
  /** Active filter chips shown next to the controls */
  activeFilters?: ActiveFilter[]
  onRemoveFilter?: (id: string) => void
  onClearAllFilters?: () => void
  /** Props for the sort control */
  sort?: SortControlProps
  /** Props for the view switcher */
  view?: ViewSwitcherProps
  /** Extra controls rendered on the right, before sort and view */
  children?: React.ReactNode
  className?: string
}

/**
 * DataToolbar — premium composition of SearchFilter + FilterBar chips +
 * SortControl + ViewSwitcher. Thin pass-through composition only.
 */
function DataToolbar({
  search,
  filters,
  activeFilters,
  onRemoveFilter,
  onClearAllFilters,
  sort,
  view,
  children,
  className,
}: DataToolbarProps) {
  return (
    <div
      data-slot="data-toolbar"
      className={cn(
        "bg-card flex flex-col gap-2 rounded-xl border border-border p-2 shadow-sm lg:flex-row lg:items-center lg:gap-3",
        className
      )}
    >
      {search ? (
        <div className="min-w-0 flex-1 lg:max-w-xs">
          <SearchFilter {...search} />
        </div>
      ) : null}
      <FilterBar
        filters={filters}
        activeFilters={activeFilters}
        onRemoveFilter={onRemoveFilter}
        onClearAll={onClearAllFilters}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none"
      />
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {sort ? <SortControl {...sort} /> : null}
        {view ? <ViewSwitcher {...view} /> : null}
      </div>
    </div>
  )
}

export { DataToolbar }
