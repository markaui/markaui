"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface TagProps
  extends Omit<React.ComponentProps<"button">, "onSelect"> {
  /** Controlled selected state */
  selected?: boolean
  /** Uncontrolled initial state */
  defaultSelected?: boolean
  /** Fired with the next selected state on toggle */
  onSelect?: (selected: boolean) => void
  /** When provided, renders an X button inside the pill */
  onRemove?: () => void
  size?: "sm" | "default"
}

function TagImpl({
  selected: selectedProp,
  defaultSelected = false,
  onSelect,
  onRemove,
  size = "default",
  className,
  children,
  onClick,
  ...props
}: TagProps) {
  const [internalSelected, setInternalSelected] =
    React.useState(defaultSelected)
  const isControlled = selectedProp !== undefined
  const selected = isControlled ? selectedProp : internalSelected

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    const next = !selected
    if (!isControlled) setInternalSelected(next)
    onSelect?.(next)
  }

  return (
    <Badge
      asChild
      variant={selected ? "default" : "soft"}
      className={cn(
        "cursor-pointer border-transparent transition-all duration-200 select-none active:scale-[0.98]",
        size === "sm"
          ? "gap-1 px-2.5 py-0.5 text-[11px] [&_svg]:size-3"
          : "gap-1.5 px-3 py-1 text-xs [&_svg]:size-3.5",
        !selected && "hover:bg-primary/15",
        onRemove ? "pr-1" : null,
        className
      )}
    >
      <button
        type="button"
        data-slot="tag"
        data-selected={selected || undefined}
        aria-pressed={selected}
        onClick={handleClick}
        {...props}
      >
        {children}
        {onRemove ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Remove"
            onClick={(event) => {
              event.stopPropagation()
              onRemove()
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                event.stopPropagation()
                onRemove()
              }
            }}
            className="ml-0.5 flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none transition-colors hover:bg-destructive/20 hover:text-destructive focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            <X />
          </span>
        ) : null}
      </button>
    </Badge>
  )
}

/** Selectable / removable pill built on Badge. */
export function Tag(props: TagProps) {
  return <TagImpl {...props} className={cn("rounded-lg", props.className)} />
}

/** Chip — same API as Tag, slightly rounder (full pill) style. */
export function Chip(props: TagProps) {
  return <TagImpl {...props} className={cn("rounded-full", props.className)} />
}
