"use client"

import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "../../lib/utils"
import { IconButton } from "./icon-button"
import { Input } from "./input"
import { Spinner } from "./spinner"

export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "size" | "type" | "onChange"> {
  /** Controlled value */
  value?: string
  /** Initial value when uncontrolled */
  defaultValue?: string
  /** Standard input change handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * Fired when the user presses Enter — debounce upstream as needed.
   * Note: onChange still fires for every keystroke.
   */
  onSearch?: (value: string) => void
  /** Shows a spinner in place of the clear button */
  loading?: boolean
}

function SearchInput({
  value: valueProp,
  defaultValue = "",
  onChange,
  onSearch,
  onKeyDown,
  loading = false,
  disabled,
  placeholder = "Search…",
  className,
  ...props
}: SearchInputProps) {
  const isControlled = valueProp !== undefined
  const [internal, setInternal] = React.useState(defaultValue)
  const value = isControlled ? valueProp : internal
  const hasValue = value.trim().length > 0

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(event.target.value)
    onChange?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !loading && !event.defaultPrevented) {
      onSearch?.(value ?? "")
    }
    onKeyDown?.(event)
  }

  const handleClear = () => {
    if (!isControlled) setInternal("")
    onChange?.({ target: { value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <Input
      data-slot="search-input"
      type="search"
      {...props}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder={placeholder}
      className={cn("[&::-webkit-search-cancel-button]:hidden", className)}
      leadingIcon={<Search className="size-4" aria-hidden="true" />}
      trailingIcon={
        loading ? (
          <Spinner size="sm" className="text-muted-foreground" />
        ) : hasValue ? (
          <IconButton
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Clear search"
            disabled={disabled}
            onClick={handleClear}
          >
            <X className="size-3.5" aria-hidden="true" />
          </IconButton>
        ) : undefined
      }
    />
  )
}

export { SearchInput }
