"use client"

import * as React from "react"
import { Clock3Icon } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

export interface TimePickerProps {
  /** Controlled time as 24h "HH:mm", e.g. "14:30" */
  value?: string
  /** Initial time when uncontrolled */
  defaultValue?: string
  /** Called with the complete "HH:mm" value */
  onChange?: (value: string) => void
  /** Render a 12-hour clock with an AM/PM select */
  use12Hour?: boolean
  /** Minute increment between options */
  minuteStep?: number
  disabled?: boolean
  className?: string
}

const pad2 = (n: number) => String(n).padStart(2, "0")

function parseTime(value?: string): {
  hour: number | null
  minute: number | null
} {
  if (!value) return { hour: null, minute: null }
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(value.trim())
  if (!match) return { hour: null, minute: null }
  const hour = Number(match[1])
  const minute = Number(match[2])
  return {
    hour: hour >= 0 && hour <= 23 ? hour : null,
    minute: minute >= 0 && minute <= 59 ? minute : null,
  }
}

function TimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  use12Hour = false,
  minuteStep = 1,
  disabled = false,
  className,
}: TimePickerProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue)
  const current = isControlled ? valueProp : internal
  const { hour, minute } = parseTime(current)
  const period = hour === null ? null : hour < 12 ? "AM" : "PM"

  const minutes = React.useMemo(() => {
    const step = Math.max(1, Math.min(30, minuteStep))
    const out: number[] = []
    for (let m = 0; m < 60; m += step) out.push(m)
    return out
  }, [minuteStep])

  const emit = (nextHour: number, nextMinute: number) => {
    const next = pad2(nextHour) + ":" + pad2(nextMinute)
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const handleHour = (display: string) => {
    const h24 = use12Hour
      ? (Number(display) % 12) + (period === "PM" ? 12 : 0)
      : Number(display)
    emit(h24, minute ?? 0)
  }

  const handleMinute = (display: string) => {
    emit(hour ?? 9, Number(display))
  }

  const handlePeriod = (nextPeriod: string) => {
    if (hour === null) {
      emit(nextPeriod === "PM" ? 12 : 0, minute ?? 0)
      return
    }
    if (nextPeriod === "PM" && hour < 12) emit(hour + 12, minute ?? 0)
    if (nextPeriod === "AM" && hour >= 12) emit(hour - 12, minute ?? 0)
  }

  const hourItems = use12Hour
    ? Array.from({ length: 12 }, (_, i) => {
        const display = i === 0 ? 12 : i
        return { value: String(display), label: pad2(display) }
      })
    : Array.from({ length: 24 }, (_, h) => ({ value: String(h), label: pad2(h) }))

  const selectedHourValue =
    hour === null
      ? undefined
      : use12Hour
        ? String(hour % 12 === 0 ? 12 : hour % 12)
        : String(hour)

  return (
    <div
      data-slot="time-picker"
      role="group"
      aria-label="Time"
      className={cn("flex items-center gap-1.5", className)}
    >
      <Clock3Icon
        className="text-muted-foreground size-4 shrink-0"
        aria-hidden="true"
      />
      <Select
        value={selectedHourValue}
        onValueChange={handleHour}
        disabled={disabled}
      >
        <SelectTrigger size="sm" className="w-16" aria-label="Hour">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          {hourItems.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="cursor-pointer"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span
        className="text-muted-foreground text-sm font-medium"
        aria-hidden="true"
      >
        :
      </span>
      <Select
        value={minute === null ? undefined : pad2(minute)}
        onValueChange={handleMinute}
        disabled={disabled}
      >
        <SelectTrigger size="sm" className="w-16" aria-label="Minute">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent className="max-h-56">
          {minutes.map((m) => (
            <SelectItem
              key={m}
              value={pad2(m)}
              className="cursor-pointer"
            >
              {pad2(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {use12Hour && (
        <Select
          value={period ?? undefined}
          onValueChange={handlePeriod}
          disabled={disabled}
        >
          <SelectTrigger size="sm" className="w-[4.5rem]" aria-label="AM or PM">
            <SelectValue placeholder="AM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM" className="cursor-pointer">
              AM
            </SelectItem>
            <SelectItem value="PM" className="cursor-pointer">
              PM
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

export { TimePicker }
