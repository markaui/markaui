"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Badge } from "./badge"

export interface ActivityFeedItem {
  id: string
  /** Avatar image URL (falls back to initials) */
  avatarSrc?: string
  /** Initials shown when no image loads */
  avatarFallback: string
  /** Actor name — rendered bold */
  name: string
  /** Action phrase, e.g. "sent you an interest" */
  action: React.ReactNode
  /** Highlighted tail of the sentence, e.g. "92% match" */
  target?: React.ReactNode
  time: React.ReactNode
  unread?: boolean
  /** Optional square thumbnail on the right */
  image?: string
  imageAlt?: string
  /** Optional action buttons under the text */
  actions?: React.ReactNode
}

export interface ActivityFeedProps extends React.ComponentProps<"ul"> {
  items: ActivityFeedItem[]
}

export function ActivityFeed({
  items,
  className,
  ...props
}: ActivityFeedProps) {
  return (
    <ul
      data-slot="activity-feed"
      className={cn("space-y-1", className)}
      {...props}
    >
      {items.length === 0 ? (
        <li className="rounded-xl p-6 text-center text-sm text-muted-foreground">
          No activity yet — matches and interests will show up here.
        </li>
      ) : null}
      {items.map((item) => (
        <li
          key={item.id}
          data-slot="activity-feed-item"
          data-unread={item.unread || undefined}
          className={cn(
            "flex items-start gap-3 rounded-xl p-3 transition-colors",
            item.unread ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-accent/50"
          )}
        >
          <div className="relative shrink-0">
            <Avatar className="size-10">
              {item.avatarSrc ? (
                <AvatarImage src={item.avatarSrc} alt={item.name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {item.avatarFallback}
              </AvatarFallback>
            </Avatar>
            {item.unread ? (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-background"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-foreground">{item.name}</span>{" "}
              <span className="text-muted-foreground">{item.action}</span>
              {item.target ? (
                <>
                  {" "}
                  <span className="font-medium text-primary">{item.target}</span>
                </>
              ) : null}
            </p>
            {item.actions ? (
              <div className="mt-2 flex flex-wrap gap-2">{item.actions}</div>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-xs text-muted-foreground">{item.time}</span>
            {item.image ? (
               
              <img
                src={item.image}
                alt={item.imageAlt ?? ""}
                className="size-12 rounded-lg border object-cover"
              />
            ) : null}
            {item.unread ? (
              <Badge variant="gold" className="text-[10px]">
                New
              </Badge>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
