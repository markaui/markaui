"use client"

import * as React from "react"
import { format, isValid, parse } from "date-fns"

import { cn } from "../../lib/utils"
import { DatePicker } from "./date-picker"
import { TimePicker } from "./time-picker"

export interface DateTimePickerProps {
  /** Controlled value — ISO-like "YYYY-MM-DDTHH:mm" string or a Date */
  value?: string | Date
  /** Initial value when uncontrolled */
  defaultValue?: string | Date
  /** Called with an ISO-like "YYYY-MM-DDTHH:mm" string */
  onChange?: (value: string) => void
  /** Placeholder for the date trigger */
  placeholder?: string
  /** date-fns format pattern used on the date trigger */
  dateFormat?: string
  /** 12-hour clock with AM/PM select (forwarded to TimePicker) */
  use12Hour?: boolean
  /** Minute increment between options (forwarded to TimePicker) */
  minuteStep?: number
  disabled?: boolean
  className?: string
}

function parseDateTime(value?: string | Date): {
  date: Date | undefined
  time: string
} {
  if (!value) return { date: undefined, time: "" }
  if (value instanceof Date) {
    return isValid(value)
      ? { date: value, time: format(value, "HH:mm") }
      : { date: undefined, time: "" }
  }
  const [datePart, timePart] = value.split("T")
  if (!datePart) return { date: undefined, time: "" }
  const parsed = parse(datePart, "yyyy-MM-dd", new Date())
  return {
    date: isValid(parsed) ? parsed : undefined,
    time: timePart ?? "",
  }
}

function DateTimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Pick date",
  dateFormat = "dd MMM yyyy",
  use12Hour = false,
  minuteStep = 1,
  disabled = false,
  className,
}: DateTimePickerProps) {
  const isControlled = valueProp !== undefined
  const initial = React.useMemo(() => parseDateTime(defaultValue), [defaultValue])
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    initial.date
  )
  const [internalTime, setInternalTime] = React.useState<string>(initial.time)

  const current = isControlled
    ? parseDateTime(valueProp)
    : { date: internalDate, time: internalTime }

  const emit = (date: Date, time: string) => {
    onChange?.(format(date, "yyyy-MM-dd") + "T" + (time || "00:00"))
  }

  const handleDate = (date: Date | undefined) => {
    if (isControlled) {
      if (date) emit(date, current.time)
      return
    }
    setInternalDate(date)
    if (date) emit(date, internalTime)
  }

  const handleTime = (time: string) => {
    if (isControlled) {
      if (current.date) emit(current.date, time)
      return
    }
    setInternalTime(time)
    if (internalDate) emit(internalDate, time)
  }

  return (
    <div
      data-slot="date-time-picker"
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center",
        className
      )}
    >
      <DatePicker
        value={current.date}
        onChange={handleDate}
        placeholder={placeholder}
        dateFormat={dateFormat}
        disabled={disabled}
        className="sm:flex-1"
      />
      <TimePicker
        value={current.time === "" ? undefined : current.time}
        onChange={handleTime}
        use12Hour={use12Hour}
        minuteStep={minuteStep}
        disabled={disabled}
      />
    </div>
  )
}

export { DateTimePicker }
