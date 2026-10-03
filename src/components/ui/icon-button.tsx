import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] active:scale-[0.95] cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        gold: "bg-gold-strong text-gold-ink shadow-sm hover:brightness-95",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90",
      },
      size: {
        xs: "size-6 [&_svg:not([class*='size-'])]:size-3.5 rounded-md",
        sm: "size-8 [&_svg:not([class*='size-'])]:size-4 rounded-md",
        default: "size-9 [&_svg:not([class*='size-'])]:size-4",
        lg: "size-11 [&_svg:not([class*='size-'])]:size-5",
        xl: "size-13 [&_svg:not([class*='size-'])]:size-6 rounded-xl",
      },
      shape: {
        square: "",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "square",
    },
  }
)

export interface IconButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof iconButtonVariants> {
  /** Accessible label — required for a11y since icon-only buttons have no text */
  "aria-label": string
  /** Shows a spinner and disables the button */
  loading?: boolean
}

function IconButton({
  className,
  variant,
  size,
  shape,
  loading = false,
  children,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      data-slot="icon-button"
      className={cn(iconButtonVariants({ variant, size, shape, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : children}
    </button>
  )
}

export { IconButton, iconButtonVariants }
