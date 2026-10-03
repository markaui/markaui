"use client"

import * as React from "react"
import { ArrowDownRight, ArrowUpRight, Bell, ChevronRight, Minus } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card"
import { IconButton } from "./icon-button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Progress } from "./progress"

/* --------------------------------- Trends --------------------------------- */

export type Trend = "up" | "down" | "flat"

const TREND_STYLES: Record<Trend, { className: string; icon: React.ReactNode }> = {
  up: { className: "text-success", icon: <ArrowUpRight className="size-3.5" /> },
  down: { className: "text-destructive", icon: <ArrowDownRight className="size-3.5" /> },
  flat: { className: "text-muted-foreground", icon: <Minus className="size-3.5" /> },
}

/* ------------------------------- MetricCard ------------------------------- */

export interface MetricCardProps extends React.ComponentProps<"div"> {
  label: string
  value: string
  /** Change indicator, e.g. "+12.4%" */
  delta?: string
  trend?: Trend
  /** Leading icon rendered in a tinted square */
  icon?: React.ReactNode
}

export function MetricCard({
  label,
  value,
  delta,
  trend = "flat",
  icon,
  className,
  ...props
}: MetricCardProps) {
  const trendStyle = TREND_STYLES[trend]
  return (
    <div
      data-slot="metric-card"
      className={cn(
        "bg-card text-card-foreground rounded-xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex min-h-10 items-start justify-between gap-3">
        {icon && (
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5">
            {icon}
          </span>
        )}
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium",
              trendStyle.className
            )}
          >
            {trendStyle.icon}
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-serif text-2xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  )
}

/* -------------------------------- StatsCard ------------------------------- */

export interface StatsCardProps extends React.ComponentProps<"div"> {
  label: string
  value: string
  /** Secondary metric line below the value */
  sub?: string
  delta?: string
  trend?: Trend
  /** Show a mini progress bar (0–100) instead of plain sub text */
  progress?: number
  icon?: React.ReactNode
}

export function StatsCard({
  label,
  value,
  sub,
  delta,
  trend = "flat",
  progress,
  icon,
  className,
  ...props
}: StatsCardProps) {
  const trendStyle = TREND_STYLES[trend]
  return (
    <div
      data-slot="stats-card"
      className={cn(
        "bg-card text-card-foreground rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className="flex size-9 items-center justify-center rounded-lg bg-gold/15 text-gold-foreground dark:text-gold [&_svg]:size-4.5">
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-serif text-3xl font-semibold tracking-tight">{value}</p>
        {delta && (
          <span
            className={cn("inline-flex items-center gap-0.5 text-xs font-medium", trendStyle.className)}
          >
            {trendStyle.icon}
            {delta}
          </span>
        )}
      </div>

      {typeof progress === "number" ? (
        <div className="mt-4 space-y-1.5">
          <Progress value={progress} className="h-1.5" aria-label={label + " progress"} />
          <p className="text-xs text-muted-foreground">{sub ?? progress + "% of target"}</p>
        </div>
      ) : (
        sub && <p className="mt-2 text-xs text-muted-foreground">{sub}</p>
      )}
    </div>
  )
}

/* --------------------------------- KPIGrid -------------------------------- */

export interface KpiMetric {
  id: string
  label: string
  value: string
  delta?: string
  trend?: Trend
}

export interface KPIGridProps extends React.ComponentProps<"div"> {
  metrics: KpiMetric[]
  /** Columns on large screens (default 4) */
  columns?: 2 | 3 | 4
}

const KPI_COLUMNS: Record<NonNullable<KPIGridProps["columns"]>, string> = {
  2: "@5xl:grid-cols-2",
  3: "@5xl:grid-cols-3",
  4: "@5xl:grid-cols-4",
}

export function KPIGrid({ metrics, columns = 4, className, ...props }: KPIGridProps) {
  return (
    <div
      data-slot="kpi-grid"
      className={cn(
        "@container grid grid-cols-1 gap-4 @2xl:grid-cols-2",
        KPI_COLUMNS[columns],
        className
      )}
      {...props}
    >
      {metrics.map((metric) => {
        const trendStyle = TREND_STYLES[metric.trend ?? "flat"]
        return (
          <div
            key={metric.id}
            data-slot="kpi-card"
            className="bg-card text-card-foreground rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <p className="font-serif text-2xl font-semibold tracking-tight">{metric.value}</p>
              {metric.delta && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    trendStyle.className
                  )}
                >
                  {trendStyle.icon}
                  {metric.delta}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------- ChartCard ------------------------------- */

export interface ChartCardProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  /** Header actions — filters, range tabs, export buttons */
  actions?: React.ReactNode
  /** Chart slot — drop any chart or placeholder content here */
  children?: React.ReactNode
}

export function ChartCard({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: ChartCardProps) {
  return (
    <Card data-slot="chart-card" className={cn("gap-4", className)} {...props}>
      <CardHeader>
        <CardTitle className="font-serif text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {actions && <CardAction>{actions}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

/* ------------------------------- ActivityCard ------------------------------ */

export interface ActivityItem {
  id: string
  name: string
  action: string
  time: string
  /** Optional leading node; defaults to an initial circle */
  avatar?: React.ReactNode
}

export interface ActivityCardProps extends React.ComponentProps<"div"> {
  title?: string
  items: ActivityItem[]
  /** Optional header action node */
  action?: React.ReactNode
}

export function ActivityCard({
  title = "Recent activity",
  items,
  action,
  className,
  ...props
}: ActivityCardProps) {
  return (
    <div
      data-slot="activity-card"
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {action}
      </div>
      <div className="scrollbar-thin max-h-64 overflow-y-auto">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-5 py-3">
              {item.avatar ?? (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {item.name.charAt(0)}
                </span>
              )}
              <p className="min-w-0 flex-1 text-sm">
                <span className="font-medium">{item.name}</span>{" "}
                <span className="text-muted-foreground">{item.action}</span>
              </p>
              <time className="shrink-0 text-xs text-muted-foreground">{item.time}</time>
            </li>
          ))}
        </ul>
        {items.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No recent activity.
          </p>
        )}
      </div>
    </div>
  )
}

/* ------------------------------- RecentItems ------------------------------- */

export interface RecentItem {
  id: string
  name: string
  meta?: string
  time?: string
  /** Optional thumbnail node; defaults to an initial tile */
  thumb?: React.ReactNode
}

export interface RecentItemsProps extends React.ComponentProps<"div"> {
  title?: string
  items: RecentItem[]
}

export function RecentItems({ title = "Recent items", items, className, ...props }: RecentItemsProps) {
  return (
    <div
      data-slot="recent-items"
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
        className
      )}
      {...props}
    >
      <div className="border-b px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <ul className="divide-y divide-border p-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent/50 disabled:pointer-events-none disabled:opacity-50"
            >
              {item.thumb ?? (
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted font-serif text-sm font-semibold text-primary">
                  {item.name.charAt(0)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{item.name}</span>
                {item.meta && (
                  <span className="block truncate text-xs text-muted-foreground">{item.meta}</span>
                )}
              </span>
              {item.time && (
                <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
              )}
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-muted-foreground">Nothing here yet.</li>
        )}
      </ul>
    </div>
  )
}

/* ------------------------------- QuickActions ------------------------------ */

export interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export interface QuickActionsProps extends React.ComponentProps<"div"> {
  actions: QuickAction[]
  title?: string
}

export function QuickActions({ actions, title, className, ...props }: QuickActionsProps) {
  return (
    <div data-slot="quick-actions" className={cn("@container space-y-3", className)} {...props}>
      {title && <h3 className="text-sm font-semibold">{title}</h3>}
      <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className="group flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md disabled:pointer-events-none disabled:opacity-50"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-gold/20 group-hover:text-gold-foreground group-hover:dark:text-gold [&_svg]:size-5">
              {action.icon}
            </span>
            <span className="text-center text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------- NotificationCenter --------------------------- */

export interface Notification {
  id: string
  title: string
  description?: string
  time: string
  read?: boolean
}

export interface NotificationCenterProps extends React.ComponentProps<"div"> {
  notifications?: Notification[]
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "New match found",
    description: "Priya S. matches 9 of your 10 preferences.",
    time: "2m",
  },
  {
    id: "n2",
    title: "Profile verified",
    description: "Your ID check is complete. You now have a verified badge.",
    time: "1h",
  },
  {
    id: "n3",
    title: "Interest received",
    description: "Arjun R. sent you an interest with a personal note.",
    time: "3h",
  },
  {
    id: "n4",
    title: "Subscription expiring",
    description: "Your Gold plan renews in 5 days.",
    time: "1d",
    read: true,
  },
]

export function NotificationCenter({ notifications, className, ...props }: NotificationCenterProps) {
  const [items, setItems] = React.useState<Notification[]>(notifications ?? DEFAULT_NOTIFICATIONS)

  React.useEffect(() => {
    if (notifications) setItems(notifications)
  }, [notifications])

  const unread = items.filter((item) => !item.read).length

  function markAllRead() {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  return (
    <div data-slot="notification-center" className={cn("inline-flex", className)} {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <IconButton
            variant="outline"
            aria-label={
              unread > 0 ? "Notifications — " + unread + " unread" : "Notifications — all read"
            }
            className="relative cursor-pointer"
          >
            <Bell />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </IconButton>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="cursor-pointer text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="scrollbar-thin max-h-72 overflow-y-auto">
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => markRead(item.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                      !item.read && "bg-primary/5"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 size-2 shrink-0 rounded-full",
                        item.read ? "bg-muted-foreground/30" : "bg-gold"
                      )}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-sm",
                          item.read ? "font-normal text-muted-foreground" : "font-medium"
                        )}
                      >
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                  </button>
                </li>
              ))}
            </ul>
            {items.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                You are all caught up.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

/* ------------------------ DashboardGrid / DashboardPanel ------------------- */

const PANEL_SPANS: Record<number, string> = {
  1: "@3xl:col-span-1",
  2: "@3xl:col-span-2",
  3: "@3xl:col-span-3",
  4: "@3xl:col-span-4",
  5: "@3xl:col-span-5",
  6: "@3xl:col-span-6",
  7: "@3xl:col-span-7",
  8: "@3xl:col-span-8",
  9: "@3xl:col-span-9",
  10: "@3xl:col-span-10",
  11: "@3xl:col-span-11",
  12: "@3xl:col-span-12",
}

export type DashboardGridProps = React.ComponentProps<"div">

export function DashboardGrid({ className, ...props }: DashboardGridProps) {
  return (
    <div
      data-slot="dashboard-grid"
      className={cn("@container grid grid-cols-1 gap-4 @3xl:grid-cols-12", className)}
      {...props}
    />
  )
}

export interface DashboardPanelProps extends React.ComponentProps<"div"> {
  /** Columns spanned on container widths ≥48rem, 1–12 (default 12) */
  span?: number
}

export function DashboardPanel({ span = 12, className, ...props }: DashboardPanelProps) {
  return (
    <div
      data-slot="dashboard-panel"
      className={cn("col-span-1", PANEL_SPANS[span] ?? "@3xl:col-span-12", className)}
      {...props}
    />
  )
}
