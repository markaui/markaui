"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { FileDiff } from "lucide-react"

/* ------------------------------------------------------------------ types */

export type DiffRowType = "context" | "removed" | "added"

export interface DiffRow {
  type: DiffRowType
  text: string
  oldNumber?: number
  newNumber?: number
}

export interface DiffViewerProps extends React.ComponentProps<"div"> {
  oldText: string
  newText: string
  /** Two-column split view instead of unified */
  split?: boolean
  /** Optional filename shown in the header */
  filename?: string
}

/* ------------------------------------------------------------ diff engine */

/**
 * Line diff via longest-common-subsequence dynamic programming.
 * Complexity is O(n*m) — fine for inputs up to a few hundred lines; larger
 * inputs fall back to a simple per-index comparison.
 */
function computeDiff(oldText: string, newText: string): DiffRow[] {
  const oldLines = oldText.length === 0 ? [] : oldText.split("\n")
  const newLines = newText.length === 0 ? [] : newText.split("\n")
  const n = oldLines.length
  const m = newLines.length
  const rows: DiffRow[] = []

  if (n * m > 1_000_000) {
    // Fallback for very large inputs
    const max = Math.max(n, m)
    for (let i = 0; i < max; i++) {
      const o = oldLines[i]
      const w = newLines[i]
      if (o === w) {
        rows.push({ type: "context", text: o ?? "", oldNumber: i + 1, newNumber: i + 1 })
      } else {
        if (o !== undefined) rows.push({ type: "removed", text: o, oldNumber: i + 1 })
        if (w !== undefined) rows.push({ type: "added", text: w, newNumber: i + 1 })
      }
    }
    return rows
  }

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  )
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        oldLines[i] === newLines[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (oldLines[i] === newLines[j]) {
      rows.push({ type: "context", text: oldLines[i], oldNumber: i + 1, newNumber: j + 1 })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({ type: "removed", text: oldLines[i], oldNumber: i + 1 })
      i++
    } else {
      rows.push({ type: "added", text: newLines[j], newNumber: j + 1 })
      j++
    }
  }
  while (i < n) {
    rows.push({ type: "removed", text: oldLines[i], oldNumber: i + 1 })
    i++
  }
  while (j < m) {
    rows.push({ type: "added", text: newLines[j], newNumber: j + 1 })
    j++
  }
  return rows
}

const rowClasses: Record<DiffRowType, string> = {
  context: "text-muted-foreground",
  removed: "bg-destructive/10 text-destructive",
  added: "bg-success/10 text-success",
}

const rowPrefix: Record<DiffRowType, string> = {
  context: " ",
  removed: "−",
  added: "+",
}

/* ------------------------------------------------------------- component */

function DiffViewer({
  oldText,
  newText,
  split = false,
  filename,
  className,
  ...props
}: DiffViewerProps) {
  const rows = React.useMemo(() => computeDiff(oldText, newText), [oldText, newText])
  const addedCount = rows.filter((row) => row.type === "added").length
  const removedCount = rows.filter((row) => row.type === "removed").length

  // Pair rows so split view keeps both columns aligned
  const pairs = React.useMemo(() => {
    const out: { left: DiffRow | null; right: DiffRow | null }[] = []
    for (const row of rows) {
      if (row.type === "context") out.push({ left: row, right: row })
      else if (row.type === "removed") out.push({ left: row, right: null })
      else out.push({ left: null, right: row })
    }
    return out
  }, [rows])

  const renderRow = (row: DiffRow | null, side?: "left" | "right") => {
    if (row === null) {
      return (
        <div
          className="grid h-5 grid-cols-[2.25rem_1.25rem_1fr] bg-muted/30"
          aria-hidden="true"
        />
      )
    }
    return (
      <div
        className={cn(
          "grid grid-cols-[2.25rem_1.25rem_1fr]",
          rowClasses[row.type]
        )}
      >
        <span className="pr-1.5 text-right text-muted-foreground/60 select-none">
          {side === "right" ? (row.newNumber ?? "") : (row.oldNumber ?? "")}
        </span>
        <span className="text-center font-semibold select-none">
          {rowPrefix[row.type]}
        </span>
        <span className="pr-3 whitespace-pre-wrap break-words">
          {row.text === "" ? " " : row.text}
        </span>
      </div>
    )
  }

  return (
    <div
      data-slot="diff-viewer"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      {/* header */}
      <div className="flex flex-wrap items-center gap-2 border-b bg-muted/40 px-3 py-2">
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <FileDiff className="size-3.5 text-gold" aria-hidden="true" />
          {filename ? (
            <span className="font-mono font-medium">{filename}</span>
          ) : (
            <span className="font-medium">Comparison</span>
          )}
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <Badge variant="success">+{addedCount}</Badge>
          <Badge variant="destructive">−{removedCount}</Badge>
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Both texts are empty — nothing to compare.
        </p>
      ) : split ? (
        <div className="grid grid-cols-1 font-mono text-xs leading-5 sm:grid-cols-2">
          {pairs.map((pair, index) => (
            <React.Fragment key={index}>
              <div
                className={cn(
                  "sm:border-r border-border/50",
                  pair.left === null && "sm:border-r-0"
                )}
              >
                {renderRow(pair.left, "left")}
              </div>
              <div>{renderRow(pair.right, "right")}</div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="font-mono text-xs leading-5">
          {rows.map((row, index) => (
            <div key={index}>{renderRow(row)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export { DiffViewer }
