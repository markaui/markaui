"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/ui/icon-button"

/** Deterministic Indian-locale amount formatting (safe for SSR hydration) */
const priceAmountFormat = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
})

export function formatPrice(value: number): string {
  return priceAmountFormat.format(value)
}

export const priceSizeVariants = cva("", {
  variants: {
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface PriceProps extends React.ComponentProps<"div"> {
  /** Final price in whole currency units */
  value: number
  /** Original price — struck through and muted; only shown when greater than value */
  original?: number
  currency?: string
  size?: VariantProps<typeof priceSizeVariants>["size"]
}

function Price({
  value,
  original,
  currency = "₹",
  size = "default",
  className,
  ...props
}: PriceProps) {
  const showOriginal = typeof original === "number" && original > value
  return (
    <div
      data-slot="price"
      className={cn("inline-flex flex-wrap items-baseline gap-2", className)}
      {...props}
    >
      <span
        className={cn(
          "font-serif font-semibold tracking-tight text-foreground",
          priceSizeVariants({ size })
        )}
      >
        <span className="mr-0.5 text-[0.65em] font-normal text-muted-foreground">
          {currency}
        </span>
        {formatPrice(value)}
      </span>
      {showOriginal ? (
        <span className="text-sm text-muted-foreground line-through tabular-nums">
          {currency}
          {formatPrice(original)}
        </span>
      ) : null}
    </div>
  )
}

export interface PriceRangeProps extends React.ComponentProps<"div"> {
  min: number
  max: number
  currency?: string
  size?: VariantProps<typeof priceSizeVariants>["size"]
}

function PriceRange({
  min,
  max,
  currency = "₹",
  size = "default",
  className,
  ...props
}: PriceRangeProps) {
  return (
    <div
      data-slot="price-range"
      className={cn("inline-flex flex-wrap items-baseline gap-1.5", className)}
      {...props}
    >
      <span
        className={cn(
          "font-serif font-semibold tracking-tight text-foreground",
          priceSizeVariants({ size })
        )}
      >
        {currency}
        {formatPrice(min)}
      </span>
      <span className="text-muted-foreground" aria-hidden="true">
        –
      </span>
      <span
        className={cn(
          "font-serif font-semibold tracking-tight text-foreground",
          priceSizeVariants({ size })
        )}
      >
        {currency}
        {formatPrice(max)}
      </span>
    </div>
  )
}

const quantitySizeVariants = cva("", {
  variants: {
    size: {
      sm: "gap-1 p-0.5",
      default: "gap-1.5 p-1",
      lg: "gap-2 p-1.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface QuantitySelectorProps
  extends Omit<React.ComponentProps<"div">, "value" | "defaultValue" | "onChange"> {
  /** Controlled value */
  value?: number
  /** Initial value when uncontrolled */
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  size?: VariantProps<typeof quantitySizeVariants>["size"]
  disabled?: boolean
}

function QuantitySelector({
  value,
  defaultValue = 1,
  onChange,
  min = 1,
  max = 99,
  size = "default",
  disabled = false,
  className,
  ...props
}: QuantitySelectorProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const current = value ?? internalValue

  const setValue = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max)
    if (value === undefined) setInternalValue(clamped)
    onChange?.(clamped)
  }

  const iconButtonSize = size === "lg" ? "sm" : "xs"

  return (
    <div
      data-slot="quantity-selector"
      role="group"
      aria-label="Quantity"
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-border bg-card",
        quantitySizeVariants({ size }),
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      <IconButton
        type="button"
        aria-label="Decrease quantity"
        variant="ghost"
        size={iconButtonSize}
        shape="circle"
        disabled={disabled || current <= min}
        onClick={() => setValue(current - 1)}
      >
        <Minus />
      </IconButton>
      <span
        data-slot="quantity-selector-value"
        className={cn(
          "min-w-6 text-center font-medium tabular-nums",
          size === "sm" && "text-xs",
          size === "lg" && "text-base"
        )}
        aria-live="polite"
      >
        {current}
      </span>
      <IconButton
        type="button"
        aria-label="Increase quantity"
        variant="ghost"
        size={iconButtonSize}
        shape="circle"
        disabled={disabled || current >= max}
        onClick={() => setValue(current + 1)}
      >
        <Plus />
      </IconButton>
    </div>
  )
}

export { Price, PriceRange, QuantitySelector }
