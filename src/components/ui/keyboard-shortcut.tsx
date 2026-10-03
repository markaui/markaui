import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const keyboardShortcutVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "gap-1",
      md: "gap-1.5",
    },
  },
  defaultVariants: {
    size: "sm",
  },
})

const keyVariants = cva(
  "inline-flex items-center justify-center rounded border bg-muted font-mono text-muted-foreground shadow-xs select-none",
  {
    variants: {
      size: {
        sm: "h-5 min-w-5 px-1.5 py-0.5 text-[10px] leading-none",
        md: "h-6 min-w-6 px-2 py-1 text-xs leading-none",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

export interface KeyboardShortcutProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof keyboardShortcutVariants> {
  /** Key sequence, rendered left-to-right with "+" separators */
  keys: string[]
}

export function KeyboardShortcut({ keys, size, className, ...props }: KeyboardShortcutProps) {
  return (
    <span
      data-slot="keyboard-shortcut"
      className={cn(keyboardShortcutVariants({ size }), className)}
      {...props}
    >
      {keys.map((key, index) => (
        <React.Fragment key={key + "-" + index}>
          {index > 0 && (
            <span aria-hidden="true" className="text-xs text-muted-foreground">
              +
            </span>
          )}
          <kbd className={keyVariants({ size })}>{key}</kbd>
        </React.Fragment>
      ))}
    </span>
  )
}

export { keyboardShortcutVariants }
