"use client"

import * as React from "react"
import { ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { Checkbox } from "./checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { ScrollArea } from "./scroll-area"

export interface MultiSelectOption {
  /** Unique value stored in the selection array */
  value: string
  /** Display label for the option */
  label: string
  /** Optional leading icon rendered before the label */
  icon?: React.ReactNode
}

export interface MultiSelectProps {
  /** Available options */
  options: MultiSelectOption[]
  /** Controlled selection (array of option values) */
  value?: string[]
  /** Initial selection when uncontrolled */
  defaultValue?: string[]
  /** Called with the full next selection array */
  onChange?: (value: string[]) => void
  /** Trigger text when nothing is selected */
  placeholder?: string
  /** Max chips shown on the trigger — extras collapse into a +N badge */
  maxCount?: number
  /** Show a search input inside the panel */
  searchable?: boolean
  disabled?: boolean
  className?: string
}

function MultiSelect({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Select options",
  maxCount,
  searchable = true,
  disabled = false,
  className,
}: MultiSelectProps) {
  const isControlled = valueProp !== undefined
  const [internalValue, setInternalValue] = React.useState<string[]>(
    defaultValue ?? []
  )
  const value = isControlled ? valueProp : internalValue
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const labelByValue = React.useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options]
  )

  const commit = React.useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  const toggle = (optionValue: string) => {
    commit(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
    )
  }

  const clear = (event: React.MouseEvent) => {
    event.stopPropagation()
    commit([])
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filtered = normalizedSearch
    ? options.filter(
        (option) =>
          option.label.toLowerCase().includes(normalizedSearch) ||
          option.value.toLowerCase().includes(normalizedSearch)
      )
    : options

  const visibleChips = maxCount === undefined ? value : value.slice(0, maxCount)
  const hiddenCount = value.length - visibleChips.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          data-slot="multi-select-trigger"
          role="combobox"
          aria-expanded={open}
          aria-controls={undefined}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(event) => {
            if (disabled) return
            if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
              event.preventDefault()
              setOpen(true)
            }
          }}
          className={cn(
            "border-input dark:bg-input/30 flex min-h-9 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border bg-transparent px-3 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "hover:bg-accent/40",
            disabled && "pointer-events-none cursor-not-allowed opacity-50",
            className
          )}
        >
          {value.length === 0 && (
            <span className="text-muted-foreground mr-auto">{placeholder}</span>
          )}
          {visibleChips.map((v) => {
            const option = labelByValue.get(v)
            return (
              <Badge key={v} variant="soft" className="gap-1 py-1 pr-1 pl-2.5">
                {option?.icon}
                {option?.label ?? v}
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={"Remove " + (option?.label ?? v)}
                  onClick={(event) => {
                    event.stopPropagation()
                    toggle(v)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      event.stopPropagation()
                      toggle(v)
                    }
                  }}
                  className="ml-0.5 flex size-4 cursor-pointer items-center justify-center rounded-full opacity-60 transition-colors hover:bg-foreground/10 hover:opacity-100"
                >
                  <XIcon className="size-3" />
                </span>
              </Badge>
            )
          })}
          {hiddenCount > 0 && (
            <Badge variant="secondary" className="py-1">
              +{hiddenCount}
            </Badge>
          )}
          <ChevronDownIcon className="text-muted-foreground ml-auto size-4 shrink-0 opacity-60" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-56 p-0"
      >
        <div data-slot="multi-select-content" className="flex flex-col">
          {searchable && (
            <div className="border-b px-3 py-1">
              <div className="flex h-9 items-center gap-2">
                <SearchIcon className="text-muted-foreground size-4 shrink-0 opacity-60" />
                <input
                  data-slot="multi-select-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search options..."
                  className="placeholder:text-muted-foreground h-full w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          )}
          <ScrollArea className="max-h-64">
            <div data-slot="multi-select-options" role="listbox" className="p-1">
              {filtered.length === 0 ? (
                <p className="text-muted-foreground py-6 text-center text-sm">
                  No options found.
                </p>
              ) : (
                filtered.map((option) => {
                  const selected = value.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      disabled={disabled}
                      onClick={() => toggle(option.value)}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50",
                        selected && "bg-accent/50"
                      )}
                    >
                      <Checkbox
                        checked={selected}
                        tabIndex={-1}
                        className="pointer-events-none"
                      />
                      {option.icon && (
                        <span className="text-muted-foreground [&_svg]:size-4">
                          {option.icon}
                        </span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </button>
                  )
                })
              )}
            </div>
          </ScrollArea>
          {value.length > 0 && (
            <div className="flex items-center justify-between border-t px-3 py-2">
              <span className="text-muted-foreground text-xs">
                {value.length} selected
              </span>
              <button
                type="button"
                onClick={clear}
                disabled={disabled}
                className="text-primary cursor-pointer rounded-sm text-xs font-medium outline-none transition-colors hover:underline focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
