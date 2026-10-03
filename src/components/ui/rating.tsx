"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const ratingVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "gap-0.5 [&_svg]:size-3.5",
      default: "gap-1 [&_svg]:size-5",
      lg: "gap-1 [&_svg]:size-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface RatingProps
  extends Omit<React.ComponentProps<"div">, "onChange">,
    VariantProps<typeof ratingVariants> {
  /** Controlled rating value */
  value?: number
  /** Uncontrolled initial value */
  defaultValue?: number
  onChange?: (value: number) => void
  /** Number of stars (default 5) */
  max?: number
  /** Display-only, no hover/click/keyboard */
  readonly?: boolean
  /** Show the numeric value next to the stars */
  showValue?: boolean
  /** Review count, rendered as "(128)" */
  count?: number
}

type StarFill = "full" | "half" | "empty"

function RatingStar({ fill }: { fill: StarFill }) {
  return (
    <span className="relative inline-flex">
      <Star className="text-muted-foreground/30" />
      {fill !== "empty" ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 overflow-hidden",
            fill === "half" ? "w-1/2" : "w-full"
          )}
        >
          <Star className="fill-gold text-gold" />
        </span>
      ) : null}
    </span>
  )
}

export function Rating({
  value: valueProp,
  defaultValue = 0,
  onChange,
  max = 5,
  readonly = false,
  size,
  showValue = false,
  count,
  className,
  ...props
}: RatingProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const isControlled = valueProp !== undefined
  const current = isControlled ? valueProp : internalValue
  const display = hoverValue ?? current

  const commit = (next: number) => {
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      next = Math.min(max, display + 1)
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      next = Math.max(0, display - 1)
    } else if (event.key === "Home") {
      next = 0
    } else if (event.key === "End") {
      next = max
    }
    if (next !== null) {
      event.preventDefault()
      commit(next)
    }
  }

  const fillFor = (starValue: number): StarFill => {
    if (display >= starValue) return "full"
    if (display >= starValue - 0.5) return "half"
    return "empty"
  }

  const valueText =
    Number.isInteger(display) ? String(display) : display.toFixed(1)

  return (
    <div
      data-slot="rating"
      role={readonly ? "img" : "slider"}
      aria-label={readonly ? "Rated " + valueText + " out of " + max : "Rating"}
      aria-valuemin={readonly ? undefined : 0}
      aria-valuemax={readonly ? undefined : max}
      aria-valuenow={readonly ? undefined : display}
      aria-valuetext={readonly ? undefined : valueText}
      tabIndex={readonly ? undefined : 0}
      onKeyDown={readonly ? undefined : handleKeyDown}
      onMouseLeave={readonly ? undefined : () => setHoverValue(null)}
      className={cn(
        ratingVariants({ size }),
        readonly ? "gap-1.5" : "cursor-pointer outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] rounded-md",
        className
      )}
      {...props}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1
        return (
          <span
            key={starValue}
            aria-hidden={readonly ? undefined : true}
            onMouseEnter={
              readonly ? undefined : () => setHoverValue(starValue)
            }
            onClick={
              readonly ? undefined : () => commit(starValue)
            }
            className={cn(
              "relative inline-flex rounded-full",
              !readonly && "transition-transform duration-150 hover:scale-110"
            )}
          >
            <RatingStar fill={fillFor(starValue)} />
          </span>
        )
      })}
      {showValue ? (
        <span
          aria-hidden="true"
          className="ml-1.5 text-sm font-medium text-foreground"
        >
          {valueText}
        </span>
      ) : null}
      {count !== undefined ? (
        <span
          aria-hidden="true"
          className="ml-1.5 text-xs text-muted-foreground"
        >
          ({count})
        </span>
      ) : null}
    </div>
  )
}
