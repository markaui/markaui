"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  CalendarHeart,
  CreditCard,
  Globe,
  Heart,
  Inbox,
  Laptop,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/* ------------------------------------------------------------------ types */

export type ActivityActionType =
  | "match"
  | "message"
  | "profile"
  | "verification"
  | "payment"
  | "event"

export interface ActivityEntry {
  id: string
  type: ActivityActionType
  actor: { name: string; avatar?: string }
  /** Verb phrase, e.g. "shortlisted" */
  action: string
  /** Object of the action, rendered bold, e.g. "Arjun Nair" */
  target?: string
  /** Display time, e.g. "2:45 PM" */
  time: string
  /** Day group label, e.g. "Today", "Yesterday", "18 Feb 2025" */
  day: string
  ip?: string
  device?: string
}

export interface ActivityLogProps extends React.ComponentProps<"div"> {
  entries: ActivityEntry[]
  /** Scrollable viewport height in px */
  maxHeight?: number
}

/* --------------------------------------------------------------- mappings */

const actionStyles: Record<
  ActivityActionType,
  { icon: LucideIcon; className: string }
> = {
  match: { icon: Heart, className: "bg-primary/10 text-primary" },
  message: { icon: MessageCircle, className: "bg-info/10 text-info" },
  profile: { icon: UserRound, className: "bg-gold/15 text-gold-foreground dark:text-gold" },
  verification: { icon: ShieldCheck, className: "bg-success/10 text-success" },
  payment: { icon: CreditCard, className: "bg-warning/10 text-warning" },
  event: { icon: CalendarHeart, className: "bg-destructive/10 text-destructive" },
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/* ------------------------------------------------------------- component */

function ActivityLog({
  entries,
  maxHeight,
  className,
  ...props
}: ActivityLogProps) {
  const groups = React.useMemo(() => {
    const map = new Map<string, ActivityEntry[]>()
    for (const entry of entries) {
      const bucket = map.get(entry.day)
      if (bucket) bucket.push(entry)
      else map.set(entry.day, [entry])
    }
    return Array.from(map.entries())
  }, [entries])

  return (
    <div
      data-slot="activity-log"
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className
      )}
      {...props}
    >
      <div
        className="scrollbar-thin overflow-auto"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        {entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-muted-foreground">
            <Inbox className="size-8" aria-hidden="true" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          groups.map(([day, dayEntries]) => (
            <section key={day}>
              <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background/80 px-4 py-2 backdrop-blur">
                <h4 className="font-serif text-sm font-semibold">{day}</h4>
                <Badge variant="soft">
                  {dayEntries.length} {dayEntries.length === 1 ? "event" : "events"}
                </Badge>
              </div>
              <ul className="divide-y divide-border/60">
                {dayEntries.map((entry) => {
                  const styles = actionStyles[entry.type]
                  const Icon = styles.icon
                  return (
                    <li
                      key={entry.id}
                      className="flex items-start gap-3 px-4 py-3 transition-colors duration-200 hover:bg-muted/40"
                    >
                      <Avatar className="size-9 border">
                        {entry.actor.avatar ? (
                          <AvatarImage
                            src={entry.actor.avatar}
                            alt={entry.actor.name}
                          />
                        ) : null}
                        <AvatarFallback className="text-xs font-semibold">
                          {initialsOf(entry.actor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5">
                          <span className="font-medium">{entry.actor.name}</span>{" "}
                          <span className="text-muted-foreground">
                            {entry.action}
                          </span>{" "}
                          {entry.target ? (
                            <span className="font-medium text-foreground">
                              {entry.target}
                            </span>
                          ) : null}
                        </p>
                        {entry.ip || entry.device ? (
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[11px] text-muted-foreground">
                            {entry.ip ? (
                              <span className="inline-flex items-center gap-1">
                                <Globe className="size-3" aria-hidden="true" />
                                {entry.ip}
                              </span>
                            ) : null}
                            {entry.device ? (
                              <span className="inline-flex items-center gap-1">
                                <Laptop className="size-3" aria-hidden="true" />
                                {entry.device}
                              </span>
                            ) : null}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-full [&_svg]:size-3.5",
                            styles.className
                          )}
                        >
                          <Icon aria-hidden="true" />
                        </span>
                        <time className="text-xs text-muted-foreground">
                          {entry.time}
                        </time>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

export { ActivityLog }
