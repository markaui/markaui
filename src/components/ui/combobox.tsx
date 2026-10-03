"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  /** Unique value emitted on change */
  value: string
  /** Display label (also used for search matching) */
  label: string
  /** Optional leading icon rendered before the label */
  icon?: React.ReactNode
}

export interface ComboboxProps {
  /** Available options */
  options: ComboboxOption[]
  /** Controlled selected value */
  value?: string
  /** Initial value when uncontrolled */
  defaultValue?: string
  /** Called with the selected option value */
  onChange?: (value: string) => void
  /** Trigger text when nothing is selected */
  placeholder?: string
  /** Placeholder for the search input */
  searchPlaceholder?: string
  /** Text shown when the search has no matches */
  emptyText?: string
  disabled?: boolean
  className?: string
}

function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search options...",
  emptyText = "No results found.",
  disabled = false,
  className,
}: ComboboxProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue)
  const value = isControlled ? valueProp : internal
  const [open, setOpen] = React.useState(false)

  const commit = (next: string) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  const selected = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-56 p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value + " " + option.label}
                    disabled={disabled}
                    onSelect={() => {
                      commit(option.value)
                      setOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                    {option.icon && (
                      <span className="text-muted-foreground">{option.icon}</span>
                    )}
                    <span className="truncate">{option.label}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto size-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
