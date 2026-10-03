"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "../../lib/utils"
import { Input } from "./input"

function formatValueText(value: number | undefined, precision?: number): string {
  if (value === undefined || Number.isNaN(value)) return ""
  const rounded = precision !== undefined ? Number(value.toFixed(precision)) : value
  return String(rounded)
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value
  if (min !== undefined && next < min) next = min
  if (max !== undefined && next > max) next = max
  return next
}

export interface NumberInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "size" | "type" | "value" | "defaultValue" | "onChange"
  > {
  /** Controlled numeric value */
  value?: number
  /** Initial value when uncontrolled */
  defaultValue?: number
  /** Fired with the parsed number, or undefined when the field is emptied */
  onChange?: (value: number | undefined) => void
  /** Minimum allowed value */
  min?: number
  /** Maximum allowed value */
  max?: number
  /** Increment / decrement amount (also bound to ArrowUp / ArrowDown) */
  step?: number
  /** Fixed number of decimal places */
  precision?: number
  disabled?: boolean
  placeholder?: string
}

function NumberInput({
  value: valueProp,
  defaultValue,
  onChange,
  onBlur,
  onKeyDown,
  min,
  max,
  step = 1,
  precision,
  disabled = false,
  placeholder,
  className,
  ...props
}: NumberInputProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<number | undefined>(defaultValue)
  const value = isControlled ? valueProp : internal
  const [text, setText] = React.useState<string>(() =>
    formatValueText(value, precision)
  )

  // Keep the text field in sync when the controlled value changes externally,
  // without clobbering intermediate input states like "12." or "-3,"
  React.useEffect(() => {
    if (!isControlled) return
    setText((current) => {
      const currentNum = Number(current)
      if (
        current.trim() !== "" &&
        !Number.isNaN(currentNum) &&
        currentNum === valueProp
      ) {
        return current
      }
      return formatValueText(valueProp, precision)
    })
  }, [isControlled, valueProp, precision])

  const emit = (next: number | undefined) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    if (raw.trim() === "") {
      setText("")
      emit(undefined)
      return
    }
    setText(raw)
    const parsed = Number(raw)
    if (!Number.isNaN(parsed)) emit(clamp(parsed, min, max))
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const parsed = text.trim() === "" ? undefined : Number(text)
    if (parsed === undefined || Number.isNaN(parsed)) {
      setText(formatValueText(value, precision))
    } else {
      const next = precision !== undefined
        ? Number(clamp(parsed, min, max).toFixed(precision))
        : clamp(parsed, min, max)
      setText(formatValueText(next, precision))
      emit(next)
    }
    onBlur?.(event)
  }

  const stepBy = (direction: 1 | -1) => {
    if (disabled) return
    const parsed = text.trim() === "" ? undefined : Number(text)
    const base =
      parsed !== undefined && !Number.isNaN(parsed) ? parsed : (min ?? 0)
    const decimals = precision ?? (String(step).split(".")[1] ?? "").length
    const next = Number(clamp(base + direction * step, min, max).toFixed(decimals))
    setText(formatValueText(next, precision))
    emit(next)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      stepBy(1)
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      stepBy(-1)
    }
    onKeyDown?.(event)
  }

  const canDecrement = min === undefined || value === undefined || value > min
  const canIncrement = max === undefined || value === undefined || value < max

  return (
    <div
      data-slot="number-input"
      className={cn(
        "border-input dark:bg-input/30 focus-within:border-ring focus-within:ring-ring/50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-destructive/20 has-[[aria-invalid=true]]:ring-[3px] flex h-9 w-full items-center rounded-lg border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px]",
        className
      )}
    >
      <Input
        data-slot="number-input-field"
        type="text"
        inputMode="decimal"
        {...props}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-l-lg border-0 bg-transparent pr-1 pl-3 shadow-none focus-visible:border-0 focus-visible:ring-0 aria-invalid:ring-0"
      />
      <div
        data-slot="number-input-stepper"
        className="flex h-full shrink-0 flex-col border-l"
      >
        <button
          type="button"
          aria-label="Increase value"
          disabled={disabled || !canIncrement}
          onClick={() => stepBy(1)}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex h-1/2 w-8 cursor-pointer items-center justify-center rounded-tr-lg transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-40"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Decrease value"
          disabled={disabled || !canDecrement}
          onClick={() => stepBy(-1)}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex h-1/2 w-8 cursor-pointer items-center justify-center rounded-br-lg border-t transition-colors outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-40"
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export { NumberInput }
