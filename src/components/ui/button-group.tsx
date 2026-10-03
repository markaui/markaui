import * as React from "react"

import { cn } from "@/lib/utils"

export interface ButtonGroupProps extends React.ComponentProps<"div"> {
  /** Attach buttons seamlessly with dividers */
  attached?: boolean
  /** Vertical layout */
  orientation?: "horizontal" | "vertical"
}

/**
 * Groups related buttons together with seamless spacing or attached borders.
 * Wrap any Button / IconButton components as children.
 */
function ButtonGroup({
  className,
  attached = false,
  orientation = "horizontal",
  ...props
}: ButtonGroupProps) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(
        "flex w-fit",
        orientation === "vertical" ? "flex-col" : "flex-row items-center",
        attached
          ? orientation === "vertical"
            ? "[&>*:not([data-slot='button-group'])]:rounded-none [&>*:first-child]:rounded-t-lg [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-b-lg [&>*:last-child]:rounded-t-none [&>*+*]:-mt-px"
            : "[&>*:not([data-slot='button-group'])]:rounded-none [&>*:first-child]:rounded-l-lg [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-r-lg [&>*:last-child]:rounded-l-none [&>*+*]:-ml-px"
          : "gap-2",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup }
