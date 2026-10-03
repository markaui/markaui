"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable, type DataTableProps } from "@/components/ui/data-table"

export type DataGridDensity = "comfortable" | "compact"

export interface DataGridProps<TData>
  extends Omit<DataTableProps<TData>, "striped" | "density" | "bordered"> {
  /** Row padding scale (default "comfortable") */
  density?: DataGridDensity
  /** Outer bordered card around the grid (default true) */
  bordered?: boolean
  /** Zebra striping on alternating rows */
  zebra?: boolean
  /** Show a skeleton overlay instead of interactive rows */
  loading?: boolean
  /** Enable a select-all / per-row checkbox column */
  selection?: boolean
  /** Controlled selected row ids */
  selectedIds?: string[]
  /** Uncontrolled initial selection */
  defaultSelectedIds?: string[]
  /** Fired whenever the selection changes */
  onSelectionChange?: (selectedIds: string[]) => void
}

function defaultGetRowId<TData>(row: TData, index: number): string {
  const maybe = row as { id?: unknown }
  if (maybe && maybe.id !== undefined && maybe.id !== null) return String(maybe.id)
  return String(index)
}

export function DataGrid<TData>({
  columns,
  data,
  density = "comfortable",
  bordered = true,
  zebra = false,
  loading = false,
  selection = false,
  selectedIds: selectedIdsProp,
  defaultSelectedIds,
  onSelectionChange,
  getRowId,
  className,
  ...props
}: DataGridProps<TData>) {
  const [internalSelected, setInternalSelected] = React.useState<string[]>(
    defaultSelectedIds ?? []
  )
  const isControlled = selectedIdsProp !== undefined
  const selected = isControlled ? selectedIdsProp : internalSelected

  const resolveId = React.useCallback(
    (row: TData, index: number) =>
      getRowId ? getRowId(row, index) : defaultGetRowId(row, index),
    [getRowId]
  )

  const rowIds = React.useMemo(
    () => data.map((row, index) => resolveId(row, index)),
    [data, resolveId]
  )

  const finalColumns = React.useMemo<ColumnDef<TData>[]>(() => {
    if (!selection) return columns
    const selectedSet = new Set(selected)
    const allSelected = rowIds.length > 0 && rowIds.every((id) => selectedSet.has(id))
    const someSelected = rowIds.some((id) => selectedSet.has(id))
    const commit = (next: string[]) => {
      if (!isControlled) setInternalSelected(next)
      onSelectionChange?.(next)
    }
    return [
      {
        id: "__selection",
        enableSorting: false,
        enableHiding: false,
        size: 40,
        header: () => (
          <Checkbox
            checked={allSelected ? true : someSelected ? "indeterminate" : false}
            onCheckedChange={(checked) =>
              commit(
                checked === true
                  ? Array.from(new Set([...selected, ...rowIds]))
                  : selected.filter((id) => !rowIds.includes(id))
              )
            }
            aria-label="Select all rows"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedSet.has(row.id)}
            onCheckedChange={(checked) =>
              commit(
                checked
                  ? [...selected, row.id]
                  : selected.filter((id) => id !== row.id)
              )
            }
            onClick={(event) => event.stopPropagation()}
            aria-label="Select row"
          />
        ),
      },
      ...columns,
    ]
  }, [selection, columns, selected, rowIds, isControlled, onSelectionChange])

  return (
    <div data-slot="data-grid" className={cn("relative w-full", className)}>
      <DataTable
        columns={finalColumns}
        data={data}
        density={density}
        bordered={bordered}
        striped={zebra}
        getRowId={resolveId}
        aria-busy={loading || undefined}
        className={loading ? "pointer-events-none select-none opacity-50" : undefined}
        {...props}
      />
      {loading ? (
        <div
          data-slot="data-grid-loading"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-full max-w-md space-y-4 rounded-xl bg-card/85 p-6 shadow-sm backdrop-blur-sm">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
