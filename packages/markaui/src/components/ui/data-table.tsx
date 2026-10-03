"use client"

import * as React from "react"
import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Inbox,
} from "lucide-react"

import { cn } from "../../lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import { IconButton } from "./icon-button"

export type DataTableDensity = "comfortable" | "compact"

export interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  /** TanStack column definitions */
  columns: ColumnDef<TData>[]
  /** Row data */
  data: TData[]
  /** Rows shown per page (default 5) */
  pageSize?: number
  /** Slot rendered above the table (search, actions, etc.) */
  toolbar?: React.ReactNode
  /** Called with the original row when a body row is clicked */
  onRowClick?: (row: TData) => void
  /** Tint alternating rows */
  striped?: boolean
  /** Hover highlight on body rows (default true) */
  hoverable?: boolean
  /** Pin the header row to the top of the scroll container */
  stickyHeader?: boolean
  /** Cell padding scale */
  density?: DataTableDensity
  /** Draw an outer border card around the table */
  bordered?: boolean
  /** Message shown when there is no data */
  emptyMessage?: string
  /** Stable row ids (used by selection features downstream) */
  getRowId?: (row: TData, index: number) => string
}

export function DataTable<TData>({
  columns,
  data,
  pageSize = 5,
  toolbar,
  onRowClick,
  striped = false,
  hoverable = true,
  stickyHeader = false,
  density = "comfortable",
  bordered = false,
  emptyMessage = "No results found.",
  getRowId,
  className,
  ...props
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  React.useEffect(() => {
    setPagination((prev) =>
      prev.pageSize === pageSize ? prev : { ...prev, pageSize }
    )
  }, [pageSize])

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount()
  const cellPad =
    density === "compact" ? "h-8 px-3 py-1 text-[13px]" : "h-11 px-4 py-2"

  return (
    <div data-slot="data-table" className={cn("w-full", className)} {...props}>
      {toolbar ? (
        <div data-slot="data-table-toolbar" className="mb-4">
          {toolbar}
        </div>
      ) : null}
      <div
        className={cn(
          "overflow-hidden rounded-xl",
          bordered ? "border bg-card shadow-sm" : "border border-transparent"
        )}
      >
        <Table>
          <TableHeader
            className={cn(
              stickyHeader &&
                "sticky top-0 z-10 bg-card shadow-[0_1px_0_0_var(--border)] [&_th]:bg-card"
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead key={header.id} className={cellPad}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="group inline-flex cursor-pointer items-center gap-1.5 rounded-md outline-none transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" ? (
                            <ChevronUp className="size-3.5 text-primary" />
                          ) : sorted === "desc" ? (
                            <ChevronDown className="size-3.5 text-primary" />
                          ) : (
                            <ArrowUpDown className="size-3.5 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={cn(
                    onRowClick && "cursor-pointer",
                    striped && index % 2 === 1 && "bg-muted/40",
                    !hoverable && "hover:bg-transparent"
                  )}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cellPad}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Inbox className="size-6 opacity-50" />
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div
        data-slot="data-table-pagination"
        className="mt-3 flex items-center justify-between gap-4"
      >
        <p className="text-xs text-muted-foreground">
          {data.length} {data.length === 1 ? "record" : "records"}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Page {Math.min(table.getState().pagination.pageIndex + 1, Math.max(pageCount, 1))} of{" "}
            {Math.max(pageCount, 1)}
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              variant="outline"
              size="xs"
              aria-label="Previous page"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              variant="outline"
              size="xs"
              aria-label="Next page"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronRight />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}
