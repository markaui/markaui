"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  /** Controlled selected date */
  value?: Date
  /** Initial date when uncontrolled */
  defaultValue?: Date
  /** Called with the picked date (or undefined when cleared) */
  onChange?: (date: Date | undefined) => void
  /** Trigger text when no date is selected */
  placeholder?: string
  /** date-fns format pattern used on the trigger */
  dateFormat?: string
  disabled?: boolean
  className?: string
}

function DatePicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  dateFormat = "dd MMM yyyy",
  disabled = false,
  className,
}: DatePickerProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue)
  const selected = isControlled ? valueProp : internal
  const [open, setOpen] = React.useState(false)

  const commit = (date: Date | undefined) => {
    if (!isControlled) setInternal(date)
    onChange?.(date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="size-4 opacity-60" />
          {selected ? format(selected, dateFormat) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={commit} />
      </PopoverContent>
    </Popover>
  )
}

export interface DateRangePickerProps {
  /** Controlled range — { from: Date, to?: Date } */
  value?: DateRange
  /** Initial range when uncontrolled */
  defaultValue?: DateRange
  /** Called with the picked range */
  onChange?: (range: DateRange | undefined) => void
  /** Trigger text when no range is selected */
  placeholder?: string
  /** date-fns format pattern for the range end */
  dateFormat?: string
  /** Number of months rendered in the panel */
  numberOfMonths?: number
  disabled?: boolean
  className?: string
}

function DateRangePicker({
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Pick a date range",
  dateFormat = "dd MMM yyyy",
  numberOfMonths = 2,
  disabled = false,
  className,
}: DateRangePickerProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<DateRange | undefined>(
    defaultValue
  )
  const selected = isControlled ? valueProp : internal
  const [open, setOpen] = React.useState(false)

  const commit = (range: DateRange | undefined) => {
    if (!isControlled) setInternal(range)
    onChange?.(range)
    if (range?.from && range.to) setOpen(false)
  }

  const label = selected?.from
    ? selected.to
      ? format(selected.from, "dd MMM") +
        " – " +
        format(selected.to, dateFormat)
      : format(selected.from, dateFormat) + " – ..."
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected?.from && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="size-4 opacity-60" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          numberOfMonths={numberOfMonths}
          selected={selected}
          onSelect={commit}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, DateRangePicker }
