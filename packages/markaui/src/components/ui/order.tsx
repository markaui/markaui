"use client"

import * as React from "react"
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "../../lib/utils"
import { formatPrice } from "./price"

export type OrderStatusValue =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

const ORDER_STATUS_STEPS: OrderStatusValue[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
]

const ORDER_STATUS_CONFIG: Record<
  OrderStatusValue,
  { label: string; icon: LucideIcon; tone: string; bar: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    tone: "border-warning/30 bg-warning/10 text-warning",
    bar: "bg-warning",
  },
  processing: {
    label: "Processing",
    icon: LoaderCircle,
    tone: "border-info/30 bg-info/10 text-info",
    bar: "bg-info",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    tone: "border-primary/30 bg-primary/10 text-primary",
    bar: "bg-primary",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    tone: "border-success/30 bg-success/10 text-success",
    bar: "bg-success",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    tone: "border-destructive/30 bg-destructive/10 text-destructive",
    bar: "bg-destructive",
  },
}

export interface OrderStatusProps extends React.ComponentProps<"div"> {
  status: OrderStatusValue
  orderId?: string
  /** Human formatted date, e.g. "Fri, 14 Feb" */
  estimatedDate?: string
}

function OrderStatus({
  status,
  orderId,
  estimatedDate,
  className,
  ...props
}: OrderStatusProps) {
  const config = ORDER_STATUS_CONFIG[status]
  const Icon = config.icon
  const cancelled = status === "cancelled"
  const stepIndex = ORDER_STATUS_STEPS.indexOf(status)

  return (
    <div
      data-slot="order-status"
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-5",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full border",
            config.tone
          )}
        >
          <Icon
            className={cn("size-5", status === "processing" && "animate-spin")}
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-base font-semibold text-foreground">
            {config.label}
          </p>
          {orderId ? (
            <p className="truncate font-mono text-xs text-muted-foreground">
              {orderId}
            </p>
          ) : null}
        </div>
        {estimatedDate && !cancelled ? (
          <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {status === "delivered" ? "Delivered" : "Est."} {estimatedDate}
          </span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-label="Order progress"
        aria-valuemin={0}
        aria-valuemax={ORDER_STATUS_STEPS.length}
        aria-valuenow={cancelled ? 0 : stepIndex + 1}
        className="flex gap-1.5"
      >
        {ORDER_STATUS_STEPS.map((step, i) => {
          const reached = !cancelled && i <= stepIndex
          return (
            <span
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                reached ? ORDER_STATUS_CONFIG[step].bar : "bg-muted"
              )}
            />
          )
        })}
      </div>
      {cancelled ? (
        <p className="text-xs text-destructive">
          This order was cancelled. Any payment will be refunded within 5–7
          business days.
        </p>
      ) : null}
    </div>
  )
}

export interface TimelineEntry {
  name: string
  quantity?: number
  price?: number
}

export interface TimelineStep {
  title: string
  description?: string
  /** Human formatted time, e.g. "12 Feb, 4:40 PM" */
  time?: string
  /** Optional order items summary rendered under the step */
  items?: TimelineEntry[]
}

export interface OrderTimelineProps extends React.ComponentProps<"ol"> {
  steps: TimelineStep[]
  /** Index of the step currently in progress; steps before it are done */
  current?: number
  currency?: string
}

function OrderTimeline({
  steps,
  current = 0,
  currency = "₹",
  className,
  ...props
}: OrderTimelineProps) {
  return (
    <ol
      data-slot="order-timeline"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const done = i < current
        const isCurrent = i === current
        return (
          <li
            key={step.title + "-" + i}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {i < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-9 bottom-0 left-[15px] w-px",
                  done ? "bg-success/40" : "bg-border"
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border",
                done
                  ? "border-success/30 bg-success/10 text-success"
                  : isCurrent
                    ? "border-gold/40 bg-gold/10 text-gold ring-4 ring-gold/15"
                    : "border-border bg-muted text-muted-foreground"
              )}
            >
              {done ? (
                <Check className="size-4" aria-hidden="true" />
              ) : isCurrent ? (
                <span className="size-2 rounded-full bg-current" aria-hidden="true" />
              ) : (
                <span
                  className="size-2 rounded-full border border-current"
                  aria-hidden="true"
                />
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                  className={cn(
                    "text-sm font-medium",
                    done || isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.time ? (
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {step.time}
                  </span>
                ) : null}
              </div>
              {step.description ? (
                <p className="text-sm text-muted-foreground">{step.description}</p>
              ) : null}
              {step.items && step.items.length > 0 ? (
                <div className="mt-1 flex flex-col gap-1 rounded-lg bg-muted/50 p-3">
                  {step.items.map((entry, j) => (
                    <div
                      key={entry.name + "-" + j}
                      className="flex items-center justify-between gap-4 text-xs"
                    >
                      <span className="text-muted-foreground">
                        {entry.quantity ?? 1} × {entry.name}
                      </span>
                      <span className="font-medium text-foreground tabular-nums">
                        {currency}
                        {formatPrice((entry.price ?? 0) * (entry.quantity ?? 1))}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { OrderStatus, OrderTimeline }
