"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export const circularProgressVariants = cva("", {
  variants: {
    color: {
      primary: "stroke-primary",
      gold: "stroke-gold",
      success: "stroke-success",
      warning: "stroke-warning",
      destructive: "stroke-destructive",
      info: "stroke-info",
    },
  },
  defaultVariants: {
    color: "primary",
  },
})

const circularProgressTrackVariants = cva("", {
  variants: {
    color: {
      primary: "stroke-primary/15",
      gold: "stroke-gold/20",
      success: "stroke-success/15",
      warning: "stroke-warning/20",
      destructive: "stroke-destructive/15",
      info: "stroke-info/15",
    },
  },
  defaultVariants: {
    color: "primary",
  },
})

const circularProgressTextVariants = cva("", {
  variants: {
    color: {
      primary: "text-primary",
      gold: "text-gold",
      success: "text-success",
      warning: "text-warning",
      destructive: "text-destructive",
      info: "text-info",
    },
  },
  defaultVariants: {
    color: "primary",
  },
})

const INDETERMINATE_KEYFRAMES =
  "@keyframes saptapadi-circular-indeterminate { 0% { stroke-dasharray: 6 94; stroke-dashoffset: 0; } 50% { stroke-dasharray: 48 52; stroke-dashoffset: -24; } 100% { stroke-dasharray: 6 94; stroke-dashoffset: -100; } }"

export interface CircularProgressProps
  extends Omit<React.ComponentProps<"div">, "color">,
    VariantProps<typeof circularProgressVariants> {
  /** Progress value from 0 to 100. Omit to show an indeterminate dash animation. */
  value?: number
  /** Outer diameter of the ring in pixels */
  size?: number
  /** Stroke width in pixels */
  thickness?: number
  /** Show the numeric percentage in the center */
  showValue?: boolean
  /** Center text — shown below the value when both are set */
  label?: string
}

function CircularProgress({
  className,
  style,
  value,
  size = 64,
  thickness = 6,
  color,
  showValue = false,
  label,
  children,
  ...props
}: CircularProgressProps) {
  const indeterminate = value === undefined
  const clampedValue = Math.min(100, Math.max(0, value ?? 0))
  const center = size / 2
  const radius = Math.max(0, (size - thickness) / 2)
  const dashOffset = 100 - clampedValue
  const hasCenterContent =
    Boolean(children) || Boolean(label) || (showValue && !indeterminate)

  return (
    <div
      data-slot="circular-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : Math.round(clampedValue)}
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {indeterminate && <style>{INDETERMINATE_KEYFRAMES}</style>}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          data-slot="circular-progress-track"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className={circularProgressTrackVariants({ color })}
        />
        <circle
          data-slot="circular-progress-value"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={indeterminate ? undefined : 100}
          strokeDashoffset={indeterminate ? undefined : dashOffset}
          style={
            indeterminate
              ? {
                  animation:
                    "saptapadi-circular-indeterminate 1.4s ease-in-out infinite",
                }
              : undefined
          }
          className={cn(
            circularProgressVariants({ color }),
            !indeterminate &&
              "transition-[stroke-dashoffset] duration-700 ease-out"
          )}
        />
      </svg>
      {hasCenterContent && (
        <div
          data-slot="circular-progress-content"
          className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center leading-tight"
        >
          {children ?? (
            <>
              {showValue && !indeterminate && (
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    circularProgressTextVariants({ color })
                  )}
                  style={{ fontSize: Math.max(10, Math.round(size * 0.24)) }}
                >
                  {Math.round(clampedValue)}%
                </span>
              )}
              {label && (
                <span
                  className="text-muted-foreground"
                  style={{ fontSize: Math.max(8, Math.round(size * 0.15)) }}
                >
                  {label}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export { CircularProgress }
