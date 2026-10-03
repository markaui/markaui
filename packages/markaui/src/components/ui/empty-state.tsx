import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const emptyStateVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    size: {
      sm: "gap-3 py-8",
      default: "gap-4 py-12",
      lg: "gap-5 py-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const emptyStateIconStyles = {
  sm: "size-12 [&_svg]:size-5",
  default: "size-16 [&_svg]:size-7",
  lg: "size-20 [&_svg]:size-9",
} as const

const emptyStateTitleStyles = {
  sm: "text-base",
  default: "text-xl",
  lg: "text-2xl",
} as const

export interface EmptyStateProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Primary action slot (button/link) */
  action?: React.ReactNode
  /** Secondary action slot */
  secondaryAction?: React.ReactNode
}

function EmptyState({
  size,
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(emptyStateVariants({ size }), className)}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            "bg-gold/15 text-gold flex items-center justify-center rounded-full",
            emptyStateIconStyles[size ?? "default"]
          )}
        >
          {icon}
        </div>
      )}
      <div className="max-w-md space-y-1.5">
        <h3
          className={cn(
            "font-serif font-semibold tracking-tight text-foreground",
            emptyStateTitleStyles[size ?? "default"]
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
      {children}
    </div>
  )
}

export { EmptyState, emptyStateVariants }
