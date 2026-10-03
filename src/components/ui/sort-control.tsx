"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SortDirection = "asc" | "desc"

export interface SortField {
  id: string
  label: string
}

export interface SortValue {
  field: string
  direction: SortDirection
}

export interface SortControlProps {
  /** Sortable fields */
  fields: SortField[]
  /** Current sort value, or null when nothing is sorted */
  value: SortValue | null
  /** Called with the next sort value; null clears sorting */
  onChange: (value: SortValue | null) => void
  /** Trigger label when nothing is sorted */
  placeholder?: string
  className?: string
}

function SortControl({
  fields,
  value,
  onChange,
  placeholder = "Sort",
  className,
}: SortControlProps) {
  const activeField = value
    ? fields.find((field) => field.id === value.field)
    : undefined
  const label = activeField ? activeField.label : placeholder

  const flip = (current: SortValue): SortValue => ({
    field: current.field,
    direction: current.direction === "asc" ? "desc" : "asc",
  })

  const selectField = (fieldId: string) => {
    if (value && value.field === fieldId) {
      onChange(flip(value))
    } else {
      onChange({ field: fieldId, direction: "asc" })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={"Sort by " + label}
          className={cn("cursor-pointer", className)}
        >
          {value ? (
            value.direction === "asc" ? (
              <ArrowUp className="size-4" />
            ) : (
              <ArrowDown className="size-4" />
            )
          ) : (
            <ArrowUpDown className="size-4" />
          )}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={value?.field ?? ""}
          onValueChange={selectField}
        >
          {fields.map((field) => (
            <DropdownMenuRadioItem key={field.id} value={field.id}>
              {field.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {value ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onChange(flip(value))}>
              {value.direction === "asc" ? (
                <ArrowDown className="size-4" />
              ) : (
                <ArrowUp className="size-4" />
              )}
              Switch to {value.direction === "asc" ? "descending" : "ascending"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChange(null)}>
              <X className="size-4" />
              Clear sorting
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { SortControl }
