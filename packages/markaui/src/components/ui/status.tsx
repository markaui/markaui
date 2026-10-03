import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"

/* ----------------------------- StatusIndicator ----------------------------- */

export type PresenceStatus =
  | "online"
  | "away"
  | "busy"
  | "offline"
  | "success"
  | "warning"
  | "error"

const statusDotVariants = cva("size-2.5 rounded-full", {
  variants: {
    status: {
      online: "bg-success",
      away: "bg-warning",
      busy: "bg-destructive",
      offline: "bg-muted-foreground/40",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-destructive",
    },
  },
  defaultVariants: {
    status: "offline",
  },
})

export interface StatusIndicatorProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof statusDotVariants> {
  status: PresenceStatus
  /** Optional label rendered after the dot */
  label?: string
}

export function StatusIndicator({ status, label, className, ...props }: StatusIndicatorProps) {
  return (
    <span
      data-slot="status-indicator"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <span className="relative flex size-2.5">
        {status === "online" && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"
            aria-hidden="true"
          />
        )}
        <span className={cn("relative inline-flex size-2.5 rounded-full", statusDotVariants({ status }))} />
      </span>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </span>
  )
}

export { statusDotVariants }

/* -------------------------------- APIStatus -------------------------------- */

export type ServiceStatus = "operational" | "degraded" | "down"

export interface ApiService {
  name: string
  status: ServiceStatus
  /** Average latency in milliseconds */
  latency?: number
  /** Uptime percentage, e.g. 99.98 */
  uptime?: number
}

export interface APIStatusProps extends React.ComponentProps<"div"> {
  services: ApiService[]
  title?: string
}

const SERVICE_TONE: Record<
  ServiceStatus,
  { dot: string; badge: React.ComponentProps<typeof Badge>["variant"] }
> = {
  operational: { dot: "bg-success", badge: "success" },
  degraded: { dot: "bg-warning", badge: "warning" },
  down: { dot: "bg-destructive", badge: "destructive" },
}

export function APIStatus({ services, title = "Service status", className, ...props }: APIStatusProps) {
  const operational = services.filter((service) => service.status === "operational").length

  return (
    <div
      data-slot="api-status"
      className={cn("bg-card text-card-foreground rounded-xl border p-5 shadow-sm", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          {operational}/{services.length} operational
        </span>
      </div>
      <ul className="mt-3 divide-y divide-border">
        {services.map((service) => {
          const tone = SERVICE_TONE[service.status]
          return (
            <li key={service.name} className="flex items-center gap-3 py-2.5">
              <span className={cn("size-2 shrink-0 rounded-full", tone.dot)} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm">{service.name}</span>
              {typeof service.uptime === "number" && (
                <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                  {service.uptime.toFixed(2)}% uptime
                </span>
              )}
              {typeof service.latency === "number" && (
                <span className="font-mono text-xs text-muted-foreground">{service.latency} ms</span>
              )}
              <Badge variant={tone.badge} className="capitalize">
                {service.status}
              </Badge>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ------------------------------- VersionBadge ------------------------------ */

export type ReleaseChannel = "stable" | "beta" | "alpha"

export interface VersionBadgeProps extends React.ComponentProps<"span"> {
  version?: string
  channel?: ReleaseChannel
}

const CHANNEL_TONE: Record<ReleaseChannel, string> = {
  stable: "border-success/30 bg-success/10 text-success",
  beta: "border-warning/30 bg-warning/10 text-warning",
  alpha: "border-info/30 bg-info/10 text-info",
}

export function VersionBadge({
  version = "v1.2.0",
  channel = "stable",
  className,
  ...props
}: VersionBadgeProps) {
  return (
    <span
      data-slot="version-badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium",
        CHANNEL_TONE[channel],
        className
      )}
      {...props}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {version}
      <span className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
        {channel}
      </span>
    </span>
  )
}

/* ----------------------------- EnvironmentBadge ---------------------------- */

export type Environment = "dev" | "staging" | "prod"

export interface EnvironmentBadgeProps extends React.ComponentProps<"span"> {
  environment?: Environment
}

const ENV_TONE: Record<Environment, string> = {
  dev: "border-info/30 bg-info/10 text-info",
  staging: "border-warning/30 bg-warning/10 text-warning",
  prod: "border-success/30 bg-success/10 text-success",
}

export function EnvironmentBadge({
  environment = "dev",
  className,
  ...props
}: EnvironmentBadgeProps) {
  return (
    <span
      data-slot="environment-badge"
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
        ENV_TONE[environment],
        className
      )}
      {...props}
    >
      {environment}
    </span>
  )
}
