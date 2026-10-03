"use client";

import * as React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { BellRing, CircleSlash, Eye, HeartHandshake, MessageSquareQuote, Trash2 } from "lucide-react";

import type { MatrimonyProfile } from "@/lib/matrimony-data";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInterests, type InterestRecord } from "./interests-provider";

const STATUS_META: Record<
  string,
  {
    label: string;
    variant: "warning" | "info" | "success" | "destructive";
    icon: React.ReactNode;
  }
> = {
  sent: { label: "Pending", variant: "warning", icon: <BellRing className="size-3" /> },
  seen: { label: "Seen", variant: "info", icon: <Eye className="size-3" /> },
  accepted: {
    label: "Accepted",
    variant: "success",
    icon: <HeartHandshake className="size-3" />,
  },
  declined: {
    label: "Declined",
    variant: "destructive",
    icon: <CircleSlash className="size-3" />,
  },
};

function InterestStatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.sent;
  return (
    <Badge variant={meta.variant} dot className="text-[10px]">
      {meta.icon}
      {meta.label}
    </Badge>
  );
}

export interface InterestsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: MatrimonyProfile[];
  onViewProfile?: (profile: MatrimonyProfile) => void;
  onDiscover?: () => void;
}

/**
 * "My interests" drawer — every interest sent from this browser/account,
 * server-backed with a stateless seen/accepted lifecycle simulation.
 */
export function InterestsSheet({
  open,
  onOpenChange,
  profiles,
  onViewProfile,
  onDiscover,
}: InterestsSheetProps) {
  const { records, ready, withdraw } = useInterests();

  const byId = React.useMemo(
    () => new Map(profiles.map((p) => [p.id, p])),
    [profiles]
  );

  const counts = React.useMemo(() => {
    let accepted = 0;
    let seen = 0;
    let declined = 0;
    for (const r of records) {
      if (r.status === "accepted") accepted += 1;
      else if (r.status === "seen") seen += 1;
      else if (r.status === "declined") declined += 1;
    }
    return { total: records.length, accepted, seen, declined };
  }, [records]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-serif">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground">
              <HeartHandshake className="size-3.5" />
            </span>
            My interests
          </SheetTitle>
          <SheetDescription>
            {ready && records.length > 0
              ? `${counts.total} sent · ${counts.seen} seen · ${counts.accepted} accepted${counts.declined > 0 ? ` · ${counts.declined} declined` : ""}`
              : "Interests you send from any profile appear here."}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-4 pb-4">
          {!ready ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <Skeleton className="size-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-2">
              <EmptyState
                title="No interests sent yet"
                description="Open a profile you love and tap “Send interest” — families respond within a day."
                size="sm"
                action={
                  <Button
                    variant="gold"
                    onClick={() => {
                      onOpenChange(false);
                      onDiscover?.();
                    }}
                  >
                    Discover profiles
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="space-y-3">
              {records.map((record) => (
                <InterestRow
                  key={record.id}
                  record={record}
                  profile={byId.get(record.profileId)}
                  onWithdraw={() => withdraw(record.profileId)}
                  onView={
                    byId.has(record.profileId)
                      ? () => {
                          onOpenChange(false);
                          onViewProfile?.(byId.get(record.profileId)!);
                        }
                      : undefined
                  }
                />
              ))}
            </ul>
          )}
        </div>

        {ready && records.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between gap-2 p-4">
              <p className="text-xs text-muted-foreground">
                Families typically respond within 24 hours.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onDiscover?.();
                }}
              >
                Find more matches
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InterestRow({
  record,
  profile,
  onWithdraw,
  onView,
}: {
  record: InterestRecord;
  profile?: MatrimonyProfile;
  onWithdraw: () => void;
  onView?: () => void;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-md">
      <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
        {profile ? (
          <Image src={profile.image} alt="" fill sizes="56px" className="object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center font-serif text-sm font-semibold text-muted-foreground">
            {record.profileName
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-sm font-semibold text-foreground">
          {record.profileName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {profile
            ? `${profile.age} yrs · ${profile.city} · ${profile.profession}`
            : "Saptapadi profile"}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <InterestStatusBadge status={record.status} />
          <span className="text-[10px] text-muted-foreground">
            sent {formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}
          </span>
        </div>
        {record.note && (
          <p className="mt-1.5 rounded-lg border border-gold/20 bg-gold/5 px-2 py-1 text-[10px] italic leading-relaxed text-foreground/75">
            <MessageSquareQuote className="mr-1 inline size-2.5 text-gold" aria-hidden="true" />
            “{record.note}”
          </p>
        )}
      </div>
      <div className={cn("flex shrink-0 items-center gap-1.5")}>
        {onView && (
          <Button size="sm" variant="outline" onClick={onView}>
            View
          </Button>
        )}
        <IconButton
          size="sm"
          variant="ghost"
          aria-label={`Withdraw interest in ${record.profileName}`}
          onClick={onWithdraw}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </IconButton>
      </div>
    </li>
  );
}
