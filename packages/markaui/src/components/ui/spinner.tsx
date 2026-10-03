import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"

import { cn } from "../../lib/utils"

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-current border-t-transparent text-primary",
  {
    variants: {
      size: {
        xs: "size-3 border-[1.5px]",
        sm: "size-4 border-2",
        default: "size-6 border-2",
        lg: "size-8 border-[3px]",
        xl: "size-12 border-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SpinnerProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof spinnerVariants> {
  /** Accessible loading label */
  label?: string
}

function Spinner({ className, size, label = "Loading…", ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      data-slot="spinner"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    >
      <LoaderCircle className="hidden" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export { Spinner, spinnerVariants }
