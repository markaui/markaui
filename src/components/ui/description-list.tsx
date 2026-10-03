"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface DescriptionListItem {
  term: React.ReactNode
  description: React.ReactNode
}

export interface DescriptionListProps extends React.ComponentProps<"dl"> {
  items: DescriptionListItem[]
  /** "plain" uses dividers only; "boxed" wraps rows in a bordered card */
  variant?: "plain" | "boxed"
}

export function DescriptionList({
  items,
  variant = "plain",
  className,
  ...props
}: DescriptionListProps) {
  return (
    <dl
      data-slot="description-list"
      className={cn(
        "divide-y divide-border",
        variant === "boxed" &&
          "rounded-xl border border-border bg-card px-5 py-1 shadow-sm",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <div
          key={index}
          data-slot="description-list-row"
          className="grid grid-cols-[minmax(7rem,10rem)_1fr] items-baseline gap-4 py-2.5"
        >
          <dt className="text-sm font-medium text-foreground">{item.term}</dt>
          <dd className="text-sm text-muted-foreground">{item.description}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Alias of DescriptionList */
export const KeyValue = DescriptionList
