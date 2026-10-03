"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

/** The 8 house luxury swatches */
export const LUXURY_SWATCHES = [
  { name: "Maroon", value: "#7d1f2e" },
  { name: "Gold", value: "#c9a227" },
  { name: "Emerald", value: "#166a48" },
  { name: "Plum", value: "#6d3087" },
  { name: "Copper", value: "#c17a4a" },
  { name: "Ivory", value: "#fdf6ec" },
  { name: "Charcoal", value: "#2b2b2b" },
  { name: "Navy", value: "#1f2a44" },
] as const

const HEX_FULL = /^#?[0-9a-fA-F]{6}$/
const HEX_PARTIAL = /^#?[0-9a-fA-F]{0,6}$/

export interface ColorPickerProps {
  /** Controlled hex string, e.g. "#7d1f2e" */
  value?: string
  /** Initial hex when uncontrolled */
  defaultValue?: string
  /** Called with a normalized lowercase "#rrggbb" hex string */
  onChange?: (hex: string) => void
  /** Preset swatch hex values; defaults to the 8 luxury swatches */
  presetSwatches?: string[]
  /** Render the picker inside a popover attached to a trigger button */
  popover?: boolean
  disabled?: boolean
  /** Trigger text when no color is set (popover variant only) */
  placeholder?: string
  className?: string
}

function ColorPicker({
  value: valueProp,
  defaultValue,
  onChange,
  presetSwatches,
  popover = false,
  disabled = false,
  placeholder = "Pick a color",
  className,
}: ColorPickerProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue)
  const [text, setText] = React.useState<string>(valueProp ?? defaultValue ?? "")
  const [open, setOpen] = React.useState(false)

  const swatches = presetSwatches ?? LUXURY_SWATCHES.map((s) => s.value)
  const current = (isControlled ? valueProp : internal) ?? ""
  const normalizedCurrent = HEX_FULL.test(current) ? current.toLowerCase() : ""

  React.useEffect(() => {
    if (valueProp !== undefined) setText(valueProp)
  }, [valueProp])

  const commit = (hex: string) => {
    const normalized = ("#" + hex.replace("#", "")).toLowerCase()
    if (!isControlled) setInternal(normalized)
    setText(normalized)
    onChange?.(normalized)
  }

  const handleTextChange = (raw: string) => {
    const trimmed = raw.trim()
    if (trimmed !== "" && !HEX_PARTIAL.test(trimmed)) return
    setText(trimmed)
    if (HEX_FULL.test(trimmed)) {
      const normalized = ("#" + trimmed.replace("#", "")).toLowerCase()
      if (!isControlled) setInternal(normalized)
      onChange?.(normalized)
    }
  }

  const nativeSwatch = (
    <input
      type="color"
      value={normalizedCurrent || "#000000"}
      disabled={disabled}
      onChange={(event) => commit(event.target.value)}
      aria-label="Custom color"
      className={cn(
        "border-input size-9 shrink-0 cursor-pointer rounded-lg border bg-transparent p-1 shadow-xs transition-[color,box-shadow] outline-none",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border-0"
      )}
    />
  )

  const hexInput = (
    <Input
      value={text}
      onChange={(event) => handleTextChange(event.target.value)}
      placeholder="#7d1f2e"
      maxLength={7}
      spellCheck={false}
      disabled={disabled}
      aria-label="Hex color"
      className="w-28 font-mono text-xs"
    />
  )

  const swatchRow = (
    <div
      role="listbox"
      aria-label="Preset swatches"
      className="flex flex-wrap items-center gap-1.5"
    >
      {swatches.map((swatch) => {
        const isSelected = normalizedCurrent === swatch.toLowerCase()
        return (
          <button
            key={swatch}
            type="button"
            role="option"
            aria-selected={isSelected}
            aria-label={"Use color " + swatch}
            disabled={disabled}
            onClick={() => commit(swatch)}
            style={{ backgroundColor: swatch }}
            className={cn(
              "border-border size-6 cursor-pointer rounded-full border shadow-xs transition-all duration-200 hover:scale-110",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
              "disabled:pointer-events-none disabled:opacity-50",
              isSelected && "ring-ring ring-offset-background ring-2 ring-offset-2"
            )}
          />
        )
      })}
    </div>
  )

  const panel = (
    <div data-slot="color-picker-panel" className="space-y-3">
      <div className="flex items-center gap-2">
        {nativeSwatch}
        {hexInput}
      </div>
      {swatchRow}
    </div>
  )

  if (popover) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn("justify-start gap-2 font-normal", className)}
          >
            <span
              aria-hidden="true"
              className="border-border size-4 shrink-0 rounded-full border shadow-xs"
              style={{ backgroundColor: normalizedCurrent || "transparent" }}
            />
            {normalizedCurrent ? (
              normalizedCurrent
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          {panel}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div data-slot="color-picker" className={cn("w-fit", className)}>
      {panel}
    </div>
  )
}

export { ColorPicker }
