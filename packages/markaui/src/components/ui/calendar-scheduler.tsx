"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { IconButton } from "./icon-button"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

/* ------------------------------------------------------------------ types */

export type SchedulerEventColor =
  | "primary"
  | "gold"
  | "success"
  | "info"
  | "destructive"

export interface SchedulerEvent {
  id: string
  title: string
  /** Day of week index, 0 (Sun) – 6 (Sat) */
  day: number
  /** Start hour in 24h notation. The grid spans 8:00 – 20:00 by default */
  start: number
  /** Duration in hours */
  duration: number
  color?: SchedulerEventColor
}

export interface CalendarSchedulerProps extends React.ComponentProps<"div"> {
  events: SchedulerEvent[]
  /** Static label rendered in the header, e.g. "16 – 22 February" */
  weekLabel?: string
  onEventClick?: (event: SchedulerEvent) => void
  /** Optional week navigation — buttons render disabled when absent */
  onPrevWeek?: () => void
  onNextWeek?: () => void
  hourHeight?: number
  startHour?: number
  endHour?: number
  /** 7 labels, index 0 = Sunday */
  dayLabels?: string[]
  showNowIndicator?: boolean
}

/* --------------------------------------------------------------- helpers */

const DEFAULT_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const eventToneClasses: Record<SchedulerEventColor, string> = {
  primary: "border-l-primary bg-primary/10 text-primary",
  gold: "border-l-gold bg-gold/15 text-gold-foreground dark:text-gold",
  success: "border-l-success bg-success/10 text-success",
  info: "border-l-info bg-info/10 text-info",
  destructive: "border-l-destructive bg-destructive/10 text-destructive",
}

function formatHour(hour: number): string {
  const suffix = hour >= 12 ? "PM" : "AM"
  const display = hour % 12 === 0 ? 12 : hour % 12
  return display + " " + suffix
}

const GUTTER_WIDTH = "56px"

/* ------------------------------------------------------------- component */

function CalendarScheduler({
  events,
  weekLabel,
  onEventClick,
  onPrevWeek,
  onNextWeek,
  hourHeight = 56,
  startHour = 8,
  endHour = 20,
  dayLabels = DEFAULT_DAY_LABELS,
  showNowIndicator = true,
  className,
  ...props
}: CalendarSchedulerProps) {
  const totalHours = Math.max(endHour - startHour, 1)
  const totalHeight = totalHours * hourHeight
  const hours = Array.from({ length: totalHours }, (_, i) => startHour + i)

  // Current-time indicator: measured client-side only to avoid hydration mismatch
  const [now, setNow] = React.useState<{ h: number; m: number } | null>(null)
  React.useEffect(() => {
    if (!showNowIndicator) return
    const update = () => {
      const d = new Date()
      setNow({ h: d.getHours(), m: d.getMinutes() })
    }
    update()
    const timer = window.setInterval(update, 60_000)
    return () => window.clearInterval(timer)
  }, [showNowIndicator])
  const nowTop =
    now === null
      ? null
      : (now.h + now.m / 60 - startHour) * hourHeight
  const showNow =
    nowTop !== null && nowTop >= 0 && nowTop <= totalHeight

  const clampTop = (start: number) =>
    Math.min(Math.max(start - startHour, 0), totalHours) * hourHeight
  const clampHeight = (start: number, duration: number) =>
    Math.min(Math.max(duration, 0.5), totalHours - Math.max(start - startHour, 0)) *
    hourHeight

  return (
    <div
      data-slot="calendar-scheduler"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      {/* header */}
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <div className="flex items-center gap-1">
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Previous week"
            disabled={!onPrevWeek}
            onClick={onPrevWeek}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Next week"
            disabled={!onNextWeek}
            onClick={onNextWeek}
          >
            <ChevronRight />
          </IconButton>
        </div>
        {weekLabel ? (
          <p className="font-serif text-sm font-semibold">{weekLabel}</p>
        ) : null}
        <Badge variant="gold" className="ml-auto hidden sm:inline-flex">
          <CalendarDays className="size-3" aria-hidden="true" />
          Week view
        </Badge>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <div className="min-w-[720px]">
          {/* day name row */}
          <div
            className="grid border-b"
            style={{
              gridTemplateColumns:
                GUTTER_WIDTH + " repeat(7, minmax(0, 1fr))",
            }}
          >
            <div aria-hidden="true" />
            {dayLabels.map((label, i) => (
              <div
                key={label + i}
                className={cn(
                  "border-l border-border/60 px-1 py-2 text-center",
                  (i === 0 || i === 6) && "bg-muted/40"
                )}
              >
                <span className="font-serif text-sm font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* body */}
          <div className="flex">
            {/* time gutter */}
            <div
              className="relative shrink-0"
              style={{ width: GUTTER_WIDTH, height: totalHeight }}
            >
              {hours.map((hour, i) => (
                <span
                  key={hour}
                  className="absolute right-2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground"
                  style={{ top: i * hourHeight }}
                >
                  {formatHour(hour)}
                </span>
              ))}
            </div>

            {/* day columns */}
            <div className="relative min-w-0 flex-1">
              <div className="grid grid-cols-7">
                {dayLabels.map((label, day) => (
                  <div
                    key={label + day}
                    className={cn(
                      "relative border-l border-border/60",
                      (day === 0 || day === 6) && "bg-muted/40"
                    )}
                    style={{ height: totalHeight }}
                  >
                    {hours.map((hour, i) => (
                      <div
                        key={hour}
                        aria-hidden="true"
                        className="absolute inset-x-0 border-t border-border/50"
                        style={{ top: i * hourHeight }}
                      />
                    ))}
                    {events
                      .filter((event) => event.day === day)
                      .map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => onEventClick?.(event)}
                          className={cn(
                            "absolute inset-x-1 cursor-pointer overflow-hidden rounded-md border-l-[3px] px-2 py-1 text-left transition-all duration-200 hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                            eventToneClasses[event.color ?? "primary"]
                          )}
                          style={{
                            top: clampTop(event.start),
                            height: clampHeight(event.start, event.duration),
                          }}
                        >
                          <span className="block truncate text-xs font-medium">
                            {event.title}
                          </span>
                          <span className="block text-[10px] opacity-80">
                            {formatHour(event.start)} –{" "}
                            {formatHour(event.start + Math.max(event.duration, 0.5))}
                          </span>
                        </button>
                      ))}
                  </div>
                ))}
              </div>
              {showNow && nowTop !== null ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                  style={{ top: nowTop }}
                >
                  <span className="-ml-1 size-2 rounded-full bg-destructive" />
                  <span className="h-px flex-1 bg-destructive" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CalendarScheduler }
