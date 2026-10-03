"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "../../lib/utils"

export interface StepperStep {
  /** Unique step identifier */
  id: string
  /** Step title shown beside the circle */
  title: string
  /** Optional secondary line under the title */
  description?: string
}

const stepperCircleVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-full border font-medium tabular-nums transition-all duration-200 [&_svg]:shrink-0",
  {
    variants: {
      status: {
        completed: "border-primary bg-primary text-primary-foreground",
        current:
          "border-primary bg-background text-primary ring-4 ring-primary/15",
        upcoming: "border-border bg-muted text-muted-foreground",
      },
      size: {
        default: "size-9 text-sm [&_svg]:size-4",
        sm: "size-7 text-xs [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      status: "upcoming",
      size: "default",
    },
  }
)

export interface StepperProps extends React.ComponentProps<"ol"> {
  /** Step definitions */
  steps: StepperStep[]
  /** Controlled current step index (0-based). Steps before it are completed. */
  current?: number
  /** Uncontrolled initial step index */
  defaultCurrent?: number
  /** Called with (index, step) when a step is clicked */
  onStepClick?: (index: number, step: StepperStep) => void
  /** Layout direction */
  orientation?: "horizontal" | "vertical"
  /** Circle size */
  size?: "sm" | "default"
}

function Stepper({
  steps,
  current,
  defaultCurrent = 0,
  onStepClick,
  orientation = "horizontal",
  size = "default",
  className,
  ...props
}: StepperProps) {
  const [internalCurrent, setInternalCurrent] =
    React.useState(defaultCurrent)
  const value = current ?? internalCurrent
  const clickable = typeof onStepClick === "function"

  const handleClick = (index: number, step: StepperStep) => {
    if (current === undefined) setInternalCurrent(index)
    onStepClick?.(index, step)
  }

  return (
    <ol
      data-slot="stepper"
      data-orientation={orientation}
      className={cn(
        "w-full",
        orientation === "vertical"
          ? "flex flex-col"
          : "flex items-start gap-2",
        className
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const status =
          index < value
            ? ("completed" as const)
            : index === value
              ? ("current" as const)
              : ("upcoming" as const)
        const isLast = index === steps.length - 1
        const ariaLabel = "Step " + (index + 1) + ": " + step.title

        const circle = (
          <span className="relative inline-flex shrink-0">
            {status === "current" && (
              <span
                aria-hidden="true"
                data-slot="stepper-pulse"
                className="absolute inset-0 animate-ping rounded-full ring-2 ring-primary/40"
              />
            )}
            <span
              data-slot="stepper-circle"
              className={cn(stepperCircleVariants({ status, size }))}
            >
              {status === "completed" ? (
                <Check aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
          </span>
        )

        const labels = (
          <span className="flex min-w-0 flex-col gap-0.5 text-left">
            <span
              data-slot="stepper-title"
              className={cn(
                "truncate text-sm leading-tight font-medium",
                status === "upcoming" && "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
            {step.description ? (
              <span
                data-slot="stepper-description"
                className="truncate text-xs leading-snug text-muted-foreground"
              >
                {step.description}
              </span>
            ) : null}
          </span>
        )

        if (orientation === "vertical") {
          return (
            <li
              key={step.id}
              data-slot="stepper-step"
              data-status={status}
              className="flex gap-3"
            >
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  data-slot="stepper-trigger"
                  aria-label={ariaLabel}
                  aria-current={status === "current" ? "step" : undefined}
                  disabled={!clickable}
                  onClick={() => handleClick(index, step)}
                  className="rounded-full outline-none transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50 cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed"
                >
                  {circle}
                </button>
                {!isLast && (
                  <span
                    data-slot="stepper-connector"
                    data-state={index < value ? "filled" : "empty"}
                    className={cn(
                      "my-1 w-0.5 min-h-6 flex-1 rounded-full transition-colors duration-200",
                      index < value ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5 pt-1.5">{labels}</div>
            </li>
          )
        }

        return (
          <li
            key={step.id}
            data-slot="stepper-step"
            data-status={status}
            className="flex min-w-0 flex-1 items-center gap-3 last:flex-none"
          >
            <button
              type="button"
              data-slot="stepper-trigger"
              aria-label={ariaLabel}
              aria-current={status === "current" ? "step" : undefined}
              disabled={!clickable}
              onClick={() => handleClick(index, step)}
              className="flex min-w-0 items-center gap-3 rounded-lg py-1 pr-1 text-left outline-none transition-all duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50 cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed"
            >
              {circle}
              {labels}
            </button>
            {!isLast && (
              <span
                data-slot="stepper-connector"
                data-state={index < value ? "filled" : "empty"}
                className={cn(
                  "h-0.5 min-w-6 flex-1 rounded-full transition-colors duration-200",
                  index < value ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export { Stepper, stepperCircleVariants }
