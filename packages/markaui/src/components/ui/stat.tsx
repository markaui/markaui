"use client"

import * as React from "react"
import { TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "../../lib/utils"
import { Card } from "./card"

export interface StatDelta {
  /** Short label, e.g. "+12%" */
  value: string
  trend: "up" | "down"
}

export interface StatProps extends Omit<React.ComponentProps<"div">, "prefix"> {
  label: string
  /** Main figure — usually a string or number */
  value: React.ReactNode
  delta?: StatDelta
  icon?: React.ReactNode
  /** Rendered before the value, e.g. currency */
  prefix?: React.ReactNode
  /** Rendered after the value, e.g. unit */
  suffix?: React.ReactNode
}

export function Stat({
  label,
  value,
  delta,
  icon,
  prefix,
  suffix,
  className,
  ...props
}: StatProps) {
  return (
    <div data-slot="stat" className={cn("min-w-0", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <span className="shrink-0 text-muted-foreground/70 [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          {prefix ? (
            <span className="mr-0.5 text-xl text-muted-foreground">{prefix}</span>
          ) : null}
          {value}
          {suffix ? (
            <span className="ml-0.5 text-lg text-muted-foreground">{suffix}</span>
          ) : null}
        </span>
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              delta.trend === "up" ? "text-success" : "text-destructive"
            )}
          >
            {delta.trend === "up" ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {delta.value}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export interface StatGroupProps extends React.ComponentProps<"div"> {
  /** Render as a hairline-divided panel instead of a plain grid */
  bordered?: boolean
}

export function StatGroup({
  bordered = false,
  className,
  children,
  ...props
}: StatGroupProps) {
  return (
    <div
      data-slot="stat-group"
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        bordered
          ? "gap-px overflow-hidden rounded-xl border border-border bg-border [&>*]:bg-card [&>*]:p-5"
          : "gap-6 sm:gap-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface KPIProps extends Omit<React.ComponentProps<"div">, "prefix"> {
  label: string
  /** Big serif figure, e.g. "82%" */
  value: React.ReactNode
  /** Progress 0–100, renders the gold gradient bar */
  progress?: number
  /** Vertical target marker position 0–100 */
  target?: number
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  delta?: StatDelta
  icon?: React.ReactNode
  /** Caption under the bar */
  hint?: React.ReactNode
}

export function KPI({
  label,
  value,
  progress,
  target,
  prefix,
  suffix,
  delta,
  icon,
  hint,
  className,
  ...props
}: KPIProps) {
  const clamped =
    typeof progress === "number"
      ? Math.min(100, Math.max(0, progress))
      : undefined
  const clampedTarget =
    typeof target === "number" ? Math.min(100, Math.max(0, target)) : undefined

  return (
    <Card data-slot="kpi" className={cn("gap-4 p-6", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          {prefix ? (
            <span className="mr-0.5 text-xl text-muted-foreground">{prefix}</span>
          ) : null}
          {value}
          {suffix ? (
            <span className="ml-0.5 text-lg text-muted-foreground">{suffix}</span>
          ) : null}
        </span>
        {delta ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              delta.trend === "up" ? "text-success" : "text-destructive"
            )}
          >
            {delta.trend === "up" ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {delta.value}
          </span>
        ) : null}
      </div>
      {clamped !== undefined ? (
        <div>
          <div className="relative h-2 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--gold))] transition-[width] duration-500"
              style={{ width: clamped + "%" }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={clamped}
            />
            {clampedTarget !== undefined ? (
              <span
                aria-hidden="true"
                title={"Target " + clampedTarget + "%"}
                className="absolute -top-1 h-4 w-0.5 rounded-full bg-foreground/50"
                style={{ left: clampedTarget + "%" }}
              />
            ) : null}
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">{hint ?? "Progress"}</span>
            <span className="font-medium text-foreground">{clamped}%</span>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
