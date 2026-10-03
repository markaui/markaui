"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input, type InputProps } from "@/components/ui/input"

/**
 * Text addon used inside an InputGroup (or standalone as a prefix / suffix pill).
 */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "bg-muted text-muted-foreground flex shrink-0 select-none items-center justify-center rounded-md px-3 py-1 text-sm [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export interface InputGroupProps
  extends Omit<React.ComponentProps<"div">, "prefix" | "suffix"> {
  /** Addon rendered before the input (e.g. a ₹ symbol) */
  prefix?: React.ReactNode
  /** Addon rendered after the input (e.g. ".com") */
  suffix?: React.ReactNode
}

/**
 * A bordered row that wraps an Input with attached prefix / suffix addon slots.
 * Addons are rendered via InputGroupText; plain children pass through untouched.
 */
function InputGroup({
  prefix,
  suffix,
  className,
  children,
  ...props
}: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        "border-input dark:bg-input/30 focus-within:border-ring focus-within:ring-ring/50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-destructive/20 has-[[aria-invalid=true]]:ring-[3px] flex h-9 w-full items-center gap-1 rounded-lg border bg-transparent px-1 shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px]",
        className
      )}
      {...props}
    >
      {prefix != null ? <InputGroupText>{prefix}</InputGroupText> : null}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Input) {
          return React.cloneElement(child as React.ReactElement<InputProps>, {
            className: cn(
              "min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
              (child.props as InputProps).className
            ),
          })
        }
        return child
      })}
      {suffix != null ? <InputGroupText>{suffix}</InputGroupText> : null}
    </div>
  )
}

export { InputGroup, InputGroupText }
