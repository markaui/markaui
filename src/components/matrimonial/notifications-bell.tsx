"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { BellRing, Bookmark, CheckCheck, Heart, Settings2, Sparkles, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationList } from "@/components/ui/notification";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  useNotificationsOptional,
  type NotificationRecord,
} from "./notifications-provider";
import { useAuth } from "./auth-provider";

export interface NotificationsBellProps {
  className?: string;
  /**
   * Tap-through destination handler — invoked when a notification row is
   * activated. The bell closes itself before delegating navigation.
   */
  onNavigate?: (destination: {
    view: "dashboard" | "results";
    tab?: "interests" | "shortlist" | "orders" | "searches";
    interestId?: string | null;
  }) => void;
}

type RecordVariant = "success" | "destructive" | "gold" | "info";

function variantFor(record: NotificationRecord): RecordVariant {
  switch (record.type) {
    case "interest_accepted":
      return "success";
    case "interest_declined":
      return "destructive";
    case "order":
    case "match_digest":
    case "saved_search_matches":
      return "gold";
    default:
      return "info";
  }
}

function iconFor(record: NotificationRecord) {
  switch (record.type) {
    case "interest_accepted":
      return <Heart aria-hidden="true" />;
    case "interest_declined":
      return <BellRing aria-hidden="true" />;
    case "order":
      return <CheckCheck aria-hidden="true" />;
    case "match_digest":
      return <Sparkles aria-hidden="true" />;
    case "saved_search_matches":
      return <Bookmark aria-hidden="true" />;
    default:
      return <BellRing aria-hidden="true" />;
  }
}

function actionFor(record: NotificationRecord): { label: string; destination: {
  view: "dashboard" | "results";
  tab?: "interests" | "shortlist" | "orders" | "searches";
  interestId?: string | null;
} } | null {
  switch (record.type) {
    case "interest_accepted":
    case "interest_declined":
      return {
        label: "View your interests",
        destination: { view: "dashboard", tab: "interests", interestId: record.refId },
      };
    case "order":
      return { label: "View your orders", destination: { view: "dashboard", tab: "orders" } };
    case "match_digest":
      return { label: "View today's matches", destination: { view: "results" } };
    case "saved_search_matches":
      return { label: "Open saved searches", destination: { view: "dashboard", tab: "searches" } };
    default:
      return null;
  }
}

/**
 * Navbar notification bell — a controlled popover that mirrors the
 * NotificationsProvider feed through the shared NotificationList primitive.
 * Members only; renders nothing for guests.
 */
export function NotificationsBell({ className, onNavigate }: NotificationsBellProps) {
  const { member } = useAuth();
  const notifications = useNotificationsOptional();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  // Guests / doc demos without a provider: nothing to show.
  if (!member || !notifications) return null;

  const { records, unread, ready, markRead, markAllRead, remove, clearAll, refresh } =
    notifications;

  const items = records.map((record) => {
    const action = actionFor(record);
    return {
      id: record.id,
      title: record.title,
      description: record.body,
      variant: variantFor(record),
      icon: iconFor(record),
      time: formatDistanceToNow(new Date(record.createdAt), { addSuffix: true }),
      unread: !record.read,
      actionLabel: action?.label,
      onClick: action
        ? () => {
            setOpen(false);
            void markRead(record.id);
            onNavigate?.(action.destination);
          }
        : undefined,
    };
  });

  const isEmpty = ready && records.length === 0;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next && unread > 0) {
          // Opening the panel marks the feed as seen shortly after, so the
          // next visit shows fresh content instead of stale unread noise.
          window.setTimeout(() => void markAllRead(), 2200);
        }
      }}
    >
      <PopoverTrigger asChild>
        <span className={cn("relative inline-flex", className)}>
          <IconButton
            variant="ghost"
            aria-label={
              unread > 0
                ? `Notifications — ${unread} unread`
                : "Notifications — all caught up"
            }
            className={cn(
              unread > 0 && "glow-pulse text-primary",
            )}
          >
            <BellRing className="size-4.5" />
          </IconButton>
          {unread > 0 && (
            <Badge
              className="pointer-events-none absolute -top-1 -right-1 size-4.5 min-w-4.5 animate-in zoom-in-50 justify-center rounded-full px-1 text-[9px] shadow-sm duration-300"
              variant="default"
            >
              {unread > 9 ? "9+" : unread}
            </Badge>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[min(92vw,26rem)] p-0"
        role="region"
        aria-label="Notifications panel"
      >
        {ready ? (
          <>
            <NotificationList
              items={items}
              title="Notifications"
              stagger
              onMarkAllRead={() => void markAllRead()}
              onDismiss={(id) => void remove(id)}
              maxHeight="max-h-[min(60vh,24rem)]"
            />
            <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                disabled={records.length === 0}
                onClick={() => {
                  void clearAll();
                  toast({ title: "Notifications cleared" });
                }}
              >
                <Trash2 className="size-3.5" />
                Clear all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={() => {
                  void refresh();
                  toast({ title: "Refreshed", description: "Feed is up to date." });
                }}
              >
                <Settings2 className="size-3.5" />
                Refresh
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3 p-4" aria-label="Loading notifications">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}
        {ready && isEmpty && (
          <div className="border-t border-border bg-gold/5 px-4 py-2.5 text-center text-xs text-muted-foreground">
            Interest decisions from the matchmaker will appear here.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
