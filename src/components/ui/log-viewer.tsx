"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ArrowDownToLine, ScrollText } from "lucide-react"

/* ------------------------------------------------------------------ types */

export type LogLevel = "info" | "warn" | "error" | "debug"

export interface LogEntry {
  id: string
  time: string
  level: LogLevel
  message: string
}

export interface LogViewerProps extends React.ComponentProps<"div"> {
  entries: LogEntry[]
  /** Scrollable viewport height in px */
  maxHeight?: number
  defaultFilter?: LogLevel | "all"
}

/* --------------------------------------------------------------- mappings */

const levelBadgeVariant: Record<
  LogLevel,
  "info" | "warning" | "destructive" | "secondary"
> = {
  info: "info",
  warn: "warning",
  error: "destructive",
  debug: "secondary",
}

const FILTERS: { id: LogLevel | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "info", label: "Info" },
  { id: "warn", label: "Warn" },
  { id: "error", label: "Error" },
  { id: "debug", label: "Debug" },
]

/* ------------------------------------------------------------- component */

function LogViewer({
  entries,
  maxHeight,
  defaultFilter = "all",
  className,
  ...props
}: LogViewerProps) {
  const [filter, setFilter] = React.useState<LogLevel | "all">(defaultFilter)
  const [autoscroll, setAutoscroll] = React.useState(true)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const counts = React.useMemo(() => {
    const acc: Record<LogLevel | "all", number> = {
      all: entries.length,
      info: 0,
      warn: 0,
      error: 0,
      debug: 0,
    }
    for (const entry of entries) acc[entry.level] += 1
    return acc
  }, [entries])

  const filtered = React.useMemo(
    () => (filter === "all" ? entries : entries.filter((entry) => entry.level === filter)),
    [entries, filter]
  )

  React.useEffect(() => {
    if (!autoscroll) return
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries, filter, autoscroll])

  return (
    <div
      data-slot="log-viewer"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      {/* header */}
      <div className="flex flex-wrap items-center gap-2 border-b bg-muted/40 px-3 py-2">
        <span className="mr-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ScrollText className="size-3.5 text-gold" aria-hidden="true" />
          <span className="font-medium">Live log</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((option) => {
            const isActive = filter === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  isActive
                    ? "border-primary/40 bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {option.label}
                <span className="text-[10px] opacity-70">
                  {counts[option.id]}
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setAutoscroll((prev) => !prev)}
          aria-pressed={autoscroll}
          className={cn(
            "ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            autoscroll
              ? "border-primary/40 bg-primary/10 font-medium text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <ArrowDownToLine className="size-3.5" aria-hidden="true" />
          Autoscroll
        </button>
      </div>

      {/* rows */}
      <div
        ref={scrollRef}
        className="scrollbar-thin overflow-auto"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No {filter === "all" ? "" : filter + " "}log entries.
          </p>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 border-b border-border/40 px-4 py-2 font-mono text-xs leading-5 transition-colors last:border-b-0 hover:bg-muted/40"
            >
              <span className="shrink-0 text-muted-foreground">{entry.time}</span>
              <Badge
                variant={levelBadgeVariant[entry.level]}
                className="w-14 shrink-0 justify-center uppercase"
              >
                {entry.level}
              </Badge>
              <span className="min-w-0 break-words text-foreground/90">
                {entry.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export { LogViewer }
