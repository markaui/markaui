"use client"

import * as React from "react"
import { LayoutGrid, List, Table } from "lucide-react"

import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type ViewMode = "grid" | "list" | "table"

export interface ViewSwitcherProps {
  /** Controlled active view */
  value?: ViewMode
  /** Uncontrolled initial view */
  defaultValue?: ViewMode
  onChange?: (value: ViewMode) => void
  /** Which segments to show; defaults to all three */
  views?: ViewMode[]
  className?: string
}

const VIEW_META: Record<ViewMode, { icon: React.ReactNode; label: string }> = {
  grid: { icon: <LayoutGrid className="size-4" />, label: "Grid view" },
  list: { icon: <List className="size-4" />, label: "List view" },
  table: { icon: <Table className="size-4" />, label: "Table view" },
}

function ViewSwitcher({
  value,
  defaultValue = "grid",
  onChange,
  views = ["grid", "list", "table"],
  className,
}: ViewSwitcherProps) {
  const [internal, setInternal] = React.useState<ViewMode>(defaultValue)
  const current = value ?? internal

  const handleChange = (next: string) => {
    if (!next) return // ignore deselect clicks on the active segment
    const mode = next as ViewMode
    setInternal(mode)
    onChange?.(mode)
  }

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={current}
      onValueChange={handleChange}
      aria-label="Display mode"
      className={cn("bg-card rounded-md", className)}
    >
      {views.map((view) => (
        <ToggleGroupItem
          key={view}
          value={view}
          aria-label={VIEW_META[view].label}
          title={VIEW_META[view].label}
          className="cursor-pointer px-2.5 data-[state=on]:bg-gold/20 data-[state=on]:text-gold-foreground data-[state=on]:dark:text-gold"
        >
          {VIEW_META[view].icon}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { ViewSwitcher }
