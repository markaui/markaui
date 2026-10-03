"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  Bell,
  CheckCircle2,
  Sparkles,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"
import { IconButton } from "./icon-button"
import { ChevronRight } from "lucide-react"

export type NotificationVariant =
  | "info"
  | "success"
  | "warning"
  | "gold"
  | "destructive"

const notificationIconVariants = cva(
  "flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "bg-info/15 text-info",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        gold: "bg-gold/15 text-gold-foreground dark:bg-gold/20 dark:text-gold",
        destructive: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const toneIcons: Record<NotificationVariant, React.ElementType> = {
  info: Bell,
  success: CheckCircle2,
  warning: TriangleAlert,
  gold: Sparkles,
  destructive: XCircle,
}

export interface NotificationProps
  extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  /** Tone — selects the default icon and the tinted icon circle */
  variant?: NotificationVariant
  /** Custom icon; overrides the tone default */
  icon?: React.ReactNode
  /** Primary line of the notification */
  title: React.ReactNode
  /** Secondary line */
  description?: React.ReactNode
  /** Timestamp label, e.g. "2 min ago" */
  time?: React.ReactNode
  /** Shows the unread dot and a subtle gold surface */
  unread?: boolean
  /** Row of action elements under the copy */
  actions?: React.ReactNode
  /** When provided, shows a dismiss button on the right */
  onDismiss?: () => void
  /** When provided, the whole row becomes an interactive tap-through target */
  onClick?: () => void
  /** Accessible label for the tap-through affordance (defaults to "Open") */
  actionLabel?: string
}

function Notification({
  variant = "info",
  icon,
  title,
  description,
  time,
  unread = false,
  actions,
  onDismiss,
  onClick,
  actionLabel = "Open",
  className,
  ...props
}: NotificationProps) {
  const DefaultIcon = toneIcons[variant]

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!onClick) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      data-slot="notification"
      data-variant={variant}
      data-unread={unread || undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${actionLabel}: ${typeof title === "string" ? title : "notification"}` : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md",
        unread && "border-gold/40 bg-gold/5",
        onClick &&
          "cursor-pointer select-none transition-[box-shadow,background-color,transform] hover:bg-accent/40 active:scale-[0.995] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
        className
      )}
      {...props}
    >
      <span
        data-slot="notification-icon"
        className={notificationIconVariants({ variant })}
      >
        {icon ?? <DefaultIcon aria-hidden="true" />}
      </span>
      <div data-slot="notification-content" className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-snug font-semibold text-foreground">
            {title}
            {unread && (
              <span
                data-slot="notification-unread-dot"
                aria-label="Unread"
                className="ml-2 inline-block size-2 shrink-0 rounded-full bg-gold align-middle"
              />
            )}
          </p>
          {time ? (
            <span className="shrink-0 pt-0.5 text-xs text-muted-foreground">
              {time}
            </span>
          ) : null}
        </div>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
        {actions ? (
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            {actions}
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <IconButton
          variant="ghost"
          size="xs"
          shape="circle"
          aria-label="Dismiss notification"
          onClick={(event) => {
            event.stopPropagation()
            onDismiss()
          }}
          className="text-muted-foreground opacity-60 transition-opacity duration-200 hover:opacity-100"
        >
          <X aria-hidden="true" />
        </IconButton>
      ) : onClick ? (
        <span
          aria-hidden="true"
          className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:bg-gold/15 group-hover:text-gold"
        >
          <ChevronRight className="size-4" />
        </span>
      ) : null}
    </div>
  )
}

export interface NotificationItem {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  variant?: NotificationVariant
  icon?: React.ReactNode
  time?: React.ReactNode
  unread?: boolean
  actions?: React.ReactNode
  /** Tap-through — invoked when the row (or its keyboard target) is activated */
  onClick?: () => void
  /** Accessible label for the tap-through affordance */
  actionLabel?: string
}

export interface NotificationListProps
  extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  /** Notification data; read/dismiss state is layered on top so the list works controlled or not */
  items: NotificationItem[]
  /** Called when a single item is dismissed (the item is removed from view) */
  onDismiss?: (id: string) => void
  /** Called after the header action clears every unread flag */
  onMarkAllRead?: () => void
  /** Max-height utility class for the scroll area, e.g. "max-h-80" */
  maxHeight?: string
  /** Header heading text */
  title?: React.ReactNode
  /** One-time staggered entrance for the rows (popovers, dropdown panels) */
  stagger?: boolean
}

function NotificationList({
  items,
  onDismiss,
  onMarkAllRead,
  maxHeight = "max-h-96",
  title = "Notifications",
  stagger = false,
  className,
  ...props
}: NotificationListProps) {
  const [readIds, setReadIds] = React.useState<string[]>([])
  const [dismissedIds, setDismissedIds] = React.useState<string[]>([])

  const visibleItems = items.filter((item) => !dismissedIds.includes(item.id))
  const unreadCount = visibleItems.filter(
    (item) => item.unread && !readIds.includes(item.id)
  ).length

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id])
    onDismiss?.(id)
  }

  const handleMarkAllRead = () => {
    const unreadIds = items.filter((item) => item.unread).map((item) => item.id)
    setReadIds((prev) => [...new Set([...prev, ...unreadIds])])
    onMarkAllRead?.()
  }

  return (
    <div
      data-slot="notification-list"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-base font-semibold text-foreground">
            {title}
          </h3>
          {unreadCount > 0 ? (
            <Badge variant="soft" dot>
              {unreadCount} new
            </Badge>
          ) : (
            <Badge variant="outline">All read</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="cursor-pointer"
        >
          Mark all read
        </Button>
      </div>
      <div
        data-slot="notification-list-scroll"
        className={cn(
          "scrollbar-thin divide-y divide-border overflow-y-auto",
          stagger && "stagger-rows",
          maxHeight
        )}
      >
        {visibleItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <Bell className="size-5 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              You are all caught up.
            </p>
          </div>
        ) : (
          visibleItems.map((item) => (
            <Notification
              key={item.id}
              variant={item.variant}
              icon={item.icon}
              title={item.title}
              description={item.description}
              time={item.time}
              unread={Boolean(item.unread) && !readIds.includes(item.id)}
              actions={item.actions}
              onClick={item.onClick}
              actionLabel={item.actionLabel}
              onDismiss={() => handleDismiss(item.id)}
              className="rounded-none border-0 shadow-none hover:shadow-none"
            />
          ))
        )}
      </div>
    </div>
  )
}

export { Notification, NotificationList }
