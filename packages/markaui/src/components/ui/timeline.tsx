"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const timelineDotVariants = cva(
  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border [&_svg]:size-3.5",
  {
    variants: {
      tone: {
        default: "border-primary/20 bg-primary/10 text-primary",
        gold: "border-gold/40 bg-gold/15 text-gold-foreground dark:text-gold",
        success: "border-success/30 bg-success/15 text-success",
        destructive: "border-destructive/30 bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

export interface TimelineItemData {
  id?: string
  title: React.ReactNode
  description?: React.ReactNode
  time?: React.ReactNode
  icon?: React.ReactNode
  tone?: "default" | "gold" | "success" | "destructive"
  /** Optional image URL rendered below the description */
  image?: string
  imageAlt?: string
}

export interface TimelineProps extends React.ComponentProps<"ol"> {
  items: TimelineItemData[]
  /** Only "vertical" is supported today */
  orientation?: "vertical"
}

export function Timeline({
  items,
  // vertical is the only supported orientation; kept out of the <ol> spread
  orientation: _orientation,
  className,
  ...props
}: TimelineProps) {
  return (
    <ol data-slot="timeline" className={cn("relative", className)} {...props}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li
            key={item.id ?? index}
            data-slot="timeline-item"
            className="relative flex gap-4"
          >
            <div className="flex flex-col items-center">
              <div className={cn(timelineDotVariants({ tone: item.tone }))}>
                {item.icon ?? <span className="size-1.5 rounded-full bg-current" />}
              </div>
              {!isLast ? (
                <span
                  aria-hidden="true"
                  className="mt-1 w-px flex-1 bg-border"
                />
              ) : items.length > 1 ? (
                <span
                  aria-hidden="true"
                  className="mt-1 w-px flex-1 bg-gradient-to-b from-border to-transparent"
                />
              ) : null}
            </div>
            <div className={cn("min-w-0 flex-1 pt-1", isLast ? "pb-0" : "pb-6")}>
              {item.time ? (
                <p className="text-xs font-medium tracking-wide text-muted-foreground">
                  {item.time}
                </p>
              ) : null}
              <h4 className="text-sm font-semibold text-foreground">
                {item.title}
              </h4>
              {item.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.imageAlt ?? ""}
                  className="mt-3 h-28 w-full max-w-xs rounded-lg border object-cover"
                />
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
