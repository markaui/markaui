import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      inputSize: {
        sm: "h-8 text-xs",
        default: "h-9 text-base md:text-sm",
        lg: "h-11 text-base",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
)

const inputStateStyles =
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  /** Leading icon or element rendered inside the field */
  leadingIcon?: React.ReactNode
  /** Trailing icon or element rendered inside the field */
  trailingIcon?: React.ReactNode
  /** Error state — red border/ring */
  error?: boolean
  /** Visual size of the input */
  size?: "sm" | "default" | "lg"
}

function Input({
  className,
  inputSize,
  size = "default",
  leadingIcon,
  trailingIcon,
  error = false,
  ...props
}: InputProps) {
  const resolvedSize = inputSize ?? size
  const hasIcon = Boolean(leadingIcon || trailingIcon)

  const inputEl = (
    <input
      type="text"
      data-slot="input"
      aria-invalid={error || props["aria-invalid"] || undefined}
      className={cn(
        inputVariants({ inputSize: resolvedSize }),
        inputStateStyles,
        hasIcon && "min-w-0 flex-1 border-0 shadow-none focus-visible:ring-0 aria-invalid:ring-0",
        hasIcon && error && "ring-destructive/20",
        className
      )}
      {...props}
    />
  )

  if (!hasIcon) return inputEl

  return (
    <div
      data-slot="input-wrapper"
      data-invalid={error || undefined}
      className={cn(
        "border-input dark:bg-input/30 flex h-auto w-full items-center rounded-lg border bg-transparent px-3 shadow-xs transition-[color,box-shadow] outline-none has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-[3px]",
        "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20 data-[invalid=true]:ring-[3px]",
        "focus-within:has-[input[aria-invalid]]:ring-destructive/20",
        resolvedSize === "sm" && "h-8",
        resolvedSize === "default" && "h-9",
        resolvedSize === "lg" && "h-11",
        error && "border-destructive ring-destructive/20 focus-within:ring-destructive/20 focus-within:border-destructive",
        className
      )}
    >
      {leadingIcon && (
        <span className="text-muted-foreground mr-2 flex shrink-0 items-center [&_svg:not([class*='size-'])]:size-4">
          {leadingIcon}
        </span>
      )}
      {inputEl}
      {trailingIcon && (
        <span className="text-muted-foreground ml-2 flex shrink-0 items-center [&_svg:not([class*='size-'])]:size-4">
          {trailingIcon}
        </span>
      )}
    </div>
  )
}

export { Input, inputVariants }
