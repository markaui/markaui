import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CircleCheck, CircleX, Info, Sparkles, TriangleAlert } from "lucide-react"

import { cn } from "../../lib/utils"

const calloutVariants = cva(
  "flex gap-3 rounded-xl border p-4 text-sm",
  {
    variants: {
      variant: {
        info: "border-info/30 border-l-4 border-l-info bg-info/10",
        success: "border-success/30 border-l-4 border-l-success bg-success/10",
        warning: "border-warning/30 border-l-4 border-l-warning bg-warning/10",
        destructive:
          "border-destructive/30 border-l-4 border-l-destructive bg-destructive/10",
        gold: "border-gold/40 border-l-4 border-l-gold bg-gold/10",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const calloutIcons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleX,
  gold: Sparkles,
} as const

const calloutIconColors = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  gold: "text-gold",
} as const

export interface CalloutProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof calloutVariants> {
  title?: React.ReactNode
  /** Override the default per-variant icon */
  icon?: React.ReactNode
}

function Callout({
  variant = "info",
  title,
  icon,
  className,
  children,
  ...props
}: CalloutProps) {
  const DefaultIcon = calloutIcons[variant ?? "info"]
  return (
    <div
      data-slot="callout"
      role="note"
      className={cn(calloutVariants({ variant }), className)}
      {...props}
    >
      {icon ?? (
        <DefaultIcon
          aria-hidden="true"
          className={cn("mt-0.5 size-5 shrink-0", calloutIconColors[variant ?? "info"])}
        />
      )}
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium text-foreground">{title}</p>}
        {children && (
          <div className={cn("text-sm leading-relaxed text-muted-foreground", title && "mt-1")}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export { Callout, calloutVariants }
