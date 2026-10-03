"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { IconButton } from "./icon-button"

const calendarEventVariants = cva(
  "block truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-4",
  {
    variants: {
      tone: {
        default: "bg-primary/10 text-primary",
        gold: "bg-gold/20 text-gold-foreground dark:text-gold",
        success: "bg-success/15 text-success",
        info: "bg-info/15 text-info",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

export interface CalendarEvent extends VariantProps<typeof calendarEventVariants> {
  /** Event date as yyyy-MM-dd */
  date: string
  title: string
}

export interface CalendarViewProps extends React.ComponentProps<"div"> {
  /** Controlled displayed month */
  month?: Date
  /** Uncontrolled initial month (defaults to today) */
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  events?: CalendarEvent[]
  onDateClick?: (date: Date) => void
  /** 0 = Sunday (default), 1 = Monday */
  weekStartsOn?: 0 | 1
}

export function CalendarView({
  month: monthProp,
  defaultMonth,
  onMonthChange,
  events = [],
  onDateClick,
  weekStartsOn = 0,
  className,
  ...props
}: CalendarViewProps) {
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    defaultMonth ?? new Date()
  )
  const month = monthProp ?? internalMonth

  const navigate = (direction: 1 | -1) => {
    const next =
      direction === 1 ? addMonths(month, 1) : subMonths(month, 1)
    if (monthProp === undefined) setInternalMonth(next)
    onMonthChange?.(next)
  }

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn })
    return eachDayOfInterval({ start, end })
  }, [month, weekStartsOn])

  const weekdays = React.useMemo(() => {
    const anchor = new Date(2024, 0, 7) // a Sunday
    const start = startOfWeek(anchor, { weekStartsOn })
    const end = endOfWeek(anchor, { weekStartsOn })
    return eachDayOfInterval({ start, end }).map((day) => format(day, "EEEEE"))
  }, [weekStartsOn])

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of events) {
      const existing = map.get(event.date)
      if (existing) existing.push(event)
      else map.set(event.date, [event])
    }
    return map
  }, [events])

  return (
    <div
      data-slot="calendar-view"
      className={cn("w-full", className)}
      {...props}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-serif text-lg font-semibold text-foreground">
          {format(month, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-1">
          <IconButton
            variant="ghost"
            size="sm"
            shape="circle"
            aria-label="Previous month"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            shape="circle"
            aria-label="Next month"
            onClick={() => navigate(1)}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>

      <div data-slot="calendar-view-weekdays" className="mb-1 grid grid-cols-7">
        {weekdays.map((weekday, index) => (
          <div
            key={index}
            className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
      </div>

      <div
        data-slot="calendar-view-grid"
        className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border"
      >
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd")
          const dayEvents = eventsByDate.get(key) ?? []
          const visibleEvents = dayEvents.slice(0, 2)
          const hiddenCount = dayEvents.length - 2
          const outside = !isSameMonth(day, month)
          const today = isToday(day)

          const content = (
            <>
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-xs",
                  today && "bg-gold/15 font-semibold text-gold-foreground dark:text-gold"
                )}
              >
                {format(day, "d")}
              </span>
              <div className="space-y-0.5">
                {visibleEvents.map((event, index) => (
                  <span
                    key={event.date + "-" + index}
                    className={cn(calendarEventVariants({ tone: event.tone ?? undefined }))}
                  >
                    {event.title}
                  </span>
                ))}
                {hiddenCount > 0 ? (
                  <span className="block px-1 text-[10px] text-muted-foreground">
                    +{hiddenCount}
                  </span>
                ) : null}
              </div>
            </>
          )

          const cellClasses = cn(
            "relative flex min-h-20 flex-col gap-1 p-1.5 text-left transition-colors sm:min-h-24",
            onDateClick &&
              "cursor-pointer outline-none focus-visible:z-20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            outside ? "bg-muted/40 text-muted-foreground/50" : "bg-card",
            onDateClick && !outside && "hover:bg-accent/60",
            today && "z-10 ring-2 ring-gold"
          )

          return onDateClick ? (
            <button
              key={key}
              type="button"
              className={cellClasses}
              onClick={() => onDateClick(day)}
            >
              {content}
            </button>
          ) : (
            <div key={key} className={cellClasses}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}
