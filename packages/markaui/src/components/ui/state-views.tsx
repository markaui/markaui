"use client"

import * as React from "react"
import { RotateCcw, WifiOff, XCircle } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Skeleton } from "./skeleton"
import { Spinner } from "./spinner"

export interface LoadingStateProps extends React.ComponentProps<"div"> {
  /** Accessible label spoken by the spinner; shown as caption text */
  label?: string
  /** When set, renders an elegant skeleton with this many lines instead of the spinner */
  lines?: number
}

const SKELETON_WIDTHS = ["w-2/3", "w-full", "w-5/6", "w-3/4", "w-full"] as const

function LoadingState({
  label = "Loading…",
  lines,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      data-slot="loading-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className
      )}
      {...props}
    >
      {typeof lines === "number" && lines > 0 ? (
        <div className="w-full max-w-sm space-y-2.5" role="status" aria-label={label}>
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn("h-4", SKELETON_WIDTHS[index % SKELETON_WIDTHS.length])}
            />
          ))}
        </div>
      ) : (
        <>
          <Spinner size="lg" label={label} className="text-gold" />
          <p className="text-sm text-muted-foreground">{label}</p>
        </>
      )}
    </div>
  )
}

export interface ErrorStateProps extends React.ComponentProps<"div"> {
  title?: string
  description?: string
  retryLabel?: string
  /** When provided, a retry button is rendered */
  onRetry?: () => void
}

function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this section. Please try again.",
  retryLabel = "Try again",
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
      {...props}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="size-7" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry} className="mt-1">
          <RotateCcw data-slot="error-state-retry-icon" />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}

export interface OfflineStateProps extends React.ComponentProps<"div"> {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
}

function OfflineState({
  title = "You're offline",
  description = "It looks like your internet connection dropped. Reconnect to keep browsing the collections.",
  retryLabel = "Try again",
  onRetry,
  className,
  ...props
}: OfflineStateProps) {
  return (
    <div
      data-slot="offline-state"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-warning/10 text-warning">
        <WifiOff className="size-7" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="gold" onClick={onRetry} className="mt-1">
          <RotateCcw data-slot="offline-state-retry-icon" />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { LoadingState, ErrorState, OfflineState }
