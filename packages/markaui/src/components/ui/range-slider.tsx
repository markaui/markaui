"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"
import { Slider } from "./slider"

export interface RangeSliderProps
  extends Omit<
    React.ComponentProps<typeof SliderPrimitive.Root>,
    "value" | "defaultValue" | "onValueChange"
  > {
  /**
   * Selected value(s). Pass [min, max] for a dual-thumb range,
   * or a single-element array [x] to behave like a one-thumb Slider.
   */
  value?: number[]
  /** Initial value(s) when uncontrolled — same shape rules as value */
  defaultValue?: number[]
  /** Fired with the ordered array of thumb values */
  onValueChange?: (value: number[]) => void
  /** Renders the selected value(s) above the track */
  showValue?: boolean
  /** Formatter used for the displayed values */
  formatValue?: (value: number) => string
}

function RangeSlider({
  className,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = false,
  formatValue = (value: number) => String(value),
  ...props
}: RangeSliderProps) {
  const [internal, setInternal] = React.useState<number[]>(() =>
    Array.isArray(defaultValue) && defaultValue.length > 0 ? defaultValue : [min, max]
  )

  const values =
    Array.isArray(value) && value.length > 0 ? value : internal
  const isRange = values.length > 1

  const handleValueChange = (next: number[]) => {
    setInternal(next)
    onValueChange?.(next)
  }

  return (
    <div data-slot="range-slider" className={cn("w-full", className)}>
      {showValue ? (
        <div
          data-slot="range-slider-values"
          className="mb-3 flex items-baseline justify-between gap-2"
        >
          <span className="text-foreground text-sm font-semibold">
            {formatValue(values[0] ?? min)}
          </span>
          {isRange ? (
            <span className="text-foreground text-sm font-semibold">
              {formatValue(values[1] ?? max)}
            </span>
          ) : null}
        </div>
      ) : null}
      <Slider
        {...props}
        value={values}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
      />
    </div>
  )
}

export { RangeSlider }
