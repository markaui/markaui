"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"
import { IconButton } from "./icon-button"

export interface AnnouncementProps extends React.ComponentProps<"div"> {
  /** Banner text */
  text: React.ReactNode
  /** Optional leading icon (e.g. Sparkles) */
  icon?: React.ReactNode
  /** Optional action slot — a link or small button */
  action?: React.ReactNode
  /** Pill vs. softly-rounded silhouette */
  rounded?: "full" | "lg"
  /** Called after the banner is dismissed */
  onDismiss?: () => void
}

function Announcement({
  text,
  icon,
  action,
  rounded = "full",
  onDismiss,
  className,
  ...props
}: AnnouncementProps) {
  const [visible, setVisible] = React.useState(true)

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div
      data-slot="announcement"
      role="status"
      className={cn(
        "bg-gradient-to-r from-primary/10 via-gold/10 to-primary/10 relative flex items-center justify-center gap-2 border border-border/60 px-4 py-2 text-sm shadow-sm",
        rounded === "full" ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-gold [&_svg]:size-4">{icon}</span>}
      <span className="min-w-0 truncate text-foreground">{text}</span>
      {action && <span className="shrink-0">{action}</span>}
      <IconButton
        variant="ghost"
        size="xs"
        shape="circle"
        aria-label="Dismiss announcement"
        onClick={dismiss}
        className="ml-1 shrink-0 text-muted-foreground"
      >
        <X className="size-3.5" />
      </IconButton>
    </div>
  )
}

export { Announcement }
