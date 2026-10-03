"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover"

export interface AutocompleteProps {
  /** Suggestion pool (plain strings) */
  options: string[]
  /** Controlled text value — free text is allowed even if not in options */
  value?: string
  /** Initial text when uncontrolled */
  defaultValue?: string
  /** Called on every keystroke with the current text */
  onChange?: (value: string) => void
  /** Called when a suggestion is picked (fills the input) */
  onSelect?: (value: string) => void
  placeholder?: string
  /** Text shown when no option matches the query */
  emptyText?: string
  /** Max suggestions rendered at once */
  limit?: number
  disabled?: boolean
  className?: string
}

function Autocomplete({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  onSelect,
  placeholder = "Start typing...",
  emptyText = "No matches found.",
  limit = 8,
  disabled = false,
  className,
}: AutocompleteProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const value = isControlled ? valueProp : internal
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const commit = (next: string) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const filtered = React.useMemo(() => {
    const query = value.trim().toLowerCase()
    const matches = query
      ? options.filter((option) => option.toLowerCase().includes(query))
      : options
    return matches.slice(0, limit)
  }, [options, value, limit])

  React.useEffect(() => {
    setActiveIndex(-1)
  }, [value, open])

  const select = (option: string) => {
    commit(option)
    onSelect?.(option)
    setOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        event.preventDefault()
        select(filtered[activeIndex])
      }
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => {
            commit(event.target.value)
            setOpen(true)
          }}
          onFocus={() => {
            if (!disabled) setOpen(true)
          }}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className={className}
        />
      </PopoverAnchor>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-(--radix-popover-anchor-width) min-w-56 p-1"
      >
        {filtered.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            {emptyText}
          </p>
        ) : (
          <ul
            data-slot="autocomplete-list"
            role="listbox"
            className="scrollbar-thin max-h-60 overflow-y-auto"
          >
            {filtered.map((option, index) => (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => select(option)}
                  className={cn(
                    "flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors",
                    index === activeIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/60"
                  )}
                >
                  <span className="truncate">{option}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { Autocomplete }
