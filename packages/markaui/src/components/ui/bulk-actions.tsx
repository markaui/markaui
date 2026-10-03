"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"

export interface BulkAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  tone?: "default" | "destructive"
}

export interface BulkActionsProps {
  /** Number of selected rows — the bar renders only when count > 0 */
  count: number
  actions: BulkAction[]
  /** Clear-selection handler; renders an X button when provided */
  onClear?: () => void
  /** Render inline instead of fixed at the bottom center of the viewport */
  inline?: boolean
  /** Text after the count badge */
  label?: string
  className?: string
}

function BulkActions({
  count,
  actions,
  onClear,
  inline = false,
  label = "selected",
  className,
}: BulkActionsProps) {
  if (count <= 0) return null

  return (
    <div
      data-slot="bulk-actions"
      role="toolbar"
      aria-label="Bulk actions"
      className={cn(
        inline ? "relative" : "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        className
      )}
    >
      <div
        className={cn(
          "border-gold/40 shadow-gold/20 animate-in fade-in-0 slide-in-from-bottom-4 flex flex-wrap items-center gap-2 rounded-xl border px-4 py-2.5 shadow-lg duration-300",
          "bg-[linear-gradient(120deg,var(--gold)_0%,color-mix(in_srgb,var(--gold)_75%,var(--primary))_100%)]"
        )}
      >
        <span className="text-gold-foreground flex items-center gap-2 text-sm font-medium">
          <Badge className="border-transparent bg-primary text-primary-foreground">
            {count}
          </Badge>
          {label}
        </span>
        <span
          aria-hidden="true"
          className="bg-gold-foreground/20 hidden h-5 w-px sm:block"
        />
        {actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            size="sm"
            variant={action.tone === "destructive" ? "destructive" : "default"}
            onClick={action.onClick}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
        {onClear ? (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={onClear}
            className="text-gold-foreground/70 hover:bg-gold-foreground/10 hover:text-gold-foreground ml-1 flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

export { BulkActions }
