"use client";

import * as React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Bookmark,
  Briefcase,
  CalendarClock,
  Crown,
  Eye,
  Gem,
  Heart,
  HeartHandshake,
  LayoutDashboard,
  MessageSquareQuote,
  PencilLine,
  Receipt,
  Ruler,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import type { MatrimonyProfile, SearchQuery } from "@/lib/matrimony-data";
import { MATRIMONY_PROFILES } from "@/lib/matrimony-data";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { StatGroup, Stat } from "@/components/ui/stat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { NotificationList, type NotificationItem } from "@/components/ui/notification";
import {
  Activity,
  BellRing,
  CheckCheck,
  CircleSlash,
  Heart as HeartIcon,
  History,
  Sparkles as SparklesIcon,
} from "lucide-react";
import { useAuth } from "./auth-provider";
import { useNotificationsOptional, type NotificationRecord } from "./notifications-provider";
import { useInterests } from "./interests-provider";
import { useOrders } from "./orders-provider";
import { useShortlist } from "./shortlist-provider";
import { useSavedSearchesOptional } from "./saved-searches-provider";
import { SavedSearchesPanel } from "./saved-searches-panel";
import { ProfileEditDialog } from "./profile-edit-dialog";

export interface MemberDashboardProps {
  onBack: () => void;
  onDiscover: () => void;
  onExplorePlans: () => void;
  onViewProfile?: (profile: MatrimonyProfile) => void;
  /** Deep-link: the tab to land on (e.g. from a notification tap-through). */
  initialTab?: "interests" | "shortlist" | "orders" | "activity" | "searches";
  /** Apply a saved search — switches to the results view with its filters. */
  onApplySearch?: (query: SearchQuery) => void;
  /** Deep-link: an interest record to spotlight once the tab renders. */
  focusInterestId?: string | null;
  /** Tap-through handler for activity rows (delegates to the view machine). */
  onNavigate?: (destination: {
    view: "dashboard" | "results";
    tab?: "interests" | "shortlist" | "orders" | "searches";
    interestId?: string | null;
  }) => void;
}

const ORDER_STATUS_STYLES: Record<string, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed",
    className: "border-info/30 bg-info/10 text-info",
  },
  activating: {
    label: "Activating",
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  active: {
    label: "Active",
    className: "border-success/30 bg-success/15 text-success",
  },
};

const INTEREST_STATUS_STYLES: Record<string, { label: string; className: string; dot: string }> = {
  sent: {
    label: "Sent",
    className: "border-border bg-secondary text-secondary-foreground",
    dot: "bg-muted-foreground",
  },
  seen: {
    label: "Seen",
    className: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
  },
  accepted: {
    label: "Accepted",
    className: "border-success/30 bg-success/15 text-success",
    dot: "bg-success",
  },
  declined: {
    label: "Declined",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

function profileById(id: string): MatrimonyProfile | undefined {
  return MATRIMONY_PROFILES.find((p) => p.id === id);
}

export function MemberDashboard({
  onBack,
  onDiscover,
  onExplorePlans,
  onViewProfile,
  initialTab = "interests",
  onApplySearch,
  focusInterestId = null,
  onNavigate,
}: MemberDashboardProps) {
  const { member } = useAuth();
  const interests = useInterests();
  const shortlist = useShortlist();
  const orders = useOrders();
  const notifications = useNotificationsOptional();
  const savedSearches = useSavedSearchesOptional();
  const recent = useRecentlyViewed();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = React.useState(false);
  const [tab, setTab] = React.useState<
    "interests" | "shortlist" | "orders" | "activity" | "searches"
  >(initialTab);

  // Deep-link sync — a notification tap-through can re-target the tabs while
  // the dashboard is already mounted.
  React.useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Spotlight scroll — bring the focused interest row into view after paint.
  React.useEffect(() => {
    if (!focusInterestId) return;
    const timer = window.setTimeout(() => {
      document
        .querySelector(`[data-interest-id="${CSS.escape(focusInterestId)}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [focusInterestId]);

  const firstName = member?.name.split(" ")[0] ?? "there";

  // Unified activity feed — the same records the navbar bell mirrors, mapped
  // onto the shared NotificationList primitive with tap-through actions.
  const activityItems = React.useMemo<NotificationItem[]>(() => {
    if (!notifications) return [];
    return notifications.records.map((record: NotificationRecord) => {
      const meta = (() => {
        switch (record.type) {
          case "interest_accepted":
            return {
              variant: "success" as const,
              icon: <HeartIcon aria-hidden="true" />,
              destination: {
                view: "dashboard" as const,
                tab: "interests" as const,
                interestId: record.refId,
              },
              label: "View your interests",
            };
          case "interest_declined":
            return {
              variant: "destructive" as const,
              icon: <CircleSlash aria-hidden="true" />,
              destination: {
                view: "dashboard" as const,
                tab: "interests" as const,
                interestId: record.refId,
              },
              label: "View your interests",
            };
          case "order":
            return {
              variant: "gold" as const,
              icon: <CheckCheck aria-hidden="true" />,
              destination: { view: "dashboard" as const, tab: "orders" as const },
              label: "View your orders",
            };
          case "match_digest":
            return {
              variant: "gold" as const,
              icon: <SparklesIcon aria-hidden="true" />,
              destination: { view: "results" as const },
              label: "View today's matches",
            };
          case "saved_search_matches":
            return {
              variant: "gold" as const,
              icon: <Bookmark aria-hidden="true" />,
              destination: { view: "dashboard" as const, tab: "searches" as const },
              label: "Open saved searches",
            };
          default:
            return null;
        }
      })();

      return {
        id: record.id,
        title: record.title,
        description: record.body,
        variant: meta?.variant ?? ("info" as const),
        icon: meta?.icon,
        time: formatDistanceToNow(new Date(record.createdAt), { addSuffix: true }),
        unread: !record.read,
        actionLabel: meta?.label,
        onClick: meta
          ? () => {
              void notifications.markRead(record.id);
              onNavigate?.(meta.destination);
            }
          : undefined,
      };
    });
  }, [notifications, onNavigate]);
  const initials =
    member?.name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "SP";

  const savedProfiles = MATRIMONY_PROFILES.filter((p) => shortlist.ids.includes(p.id));

  // Recently viewed — most-recent first, existing catalogue profiles only.
  const recentProfiles = React.useMemo(
    () =>
      recent.ids
        .map((id) => MATRIMONY_PROFILES.find((p) => p.id === id))
        .filter((p): p is MatrimonyProfile => Boolean(p))
        .slice(0, 6),
    [recent.ids]
  );

  const acceptedCount = interests.records.filter((r) => r.status === "accepted").length;
  const totalSpend = orders.records.reduce((sum, o) => {
    const n = Number(o.amount.replace(/[^\d.]/g, ""));
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
  const planLabel = orders.bestPlan ? `${orders.bestPlan} member` : "Free member";

  // Dynamic profile completion — fields the member has actually filled in.
  const completion = React.useMemo(() => {
    let score = 20; // account created with a name
    if (member?.city) score += 15;
    if (member?.profession) score += 15;
    if (member?.about) score += 20;
    if (interests.count > 0) score += 10;
    if (shortlist.count > 0) score += 5;
    if (orders.bestPlan) score += 15;
    return Math.min(100, score);
  }, [member?.city, member?.profession, member?.about, interests.count, shortlist.count, orders.bestPlan]);
  const completionHint = !member?.about
    ? "Write a short “about you” — members with bios get 3× more interests."
    : !member?.profession
      ? "Add your profession to complete your profile."
      : !member?.city
        ? "Add your city to personalise matches."
        : interests.count === 0
          ? "Send your first interest to move the needle."
          : shortlist.count === 0
            ? "Shortlist profiles you love to refine suggestions."
            : orders.bestPlan
              ? "Your profile shines — keep the conversation going."
              : "Upgrade to unlock concierge matchmaking.";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Greeting header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-[linear-gradient(120deg,var(--secondary),color-mix(in_srgb,var(--gold)_14%,var(--card)))] p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-[radial-gradient(circle,var(--gold)_0%,transparent_65%)] opacity-25"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <Avatar className="size-16 border-2 border-gold/50 shadow-lg">
            {member?.avatarUrl ? (
              <AvatarImage src={member.avatarUrl} alt={member.name} />
            ) : null}
            <AvatarFallback className="bg-[linear-gradient(135deg,var(--primary),var(--gold))] font-serif text-xl font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Welcome back, {firstName}
              </h1>
              <Badge
                variant="gold"
                className="gap-1 rounded-full px-2.5 py-1 shadow-sm"
              >
                <Crown className="size-3" />
                {planLabel}
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {member
                ? `${member.email}${member.city ? ` · ${member.city}` : ""}`
                : "Sign in to sync your matches across devices."}
            </p>
            {(member?.profession || member?.height) && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {member?.profession && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-gold/35 bg-gold/10 text-[11px] text-foreground/85"
                  >
                    <Briefcase className="size-3 text-gold" />
                    {member.profession}
                  </Badge>
                )}
                {member?.height && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-border bg-secondary text-[11px] text-secondary-foreground"
                  >
                    <Ruler className="size-3 text-muted-foreground" />
                    {member.height}
                  </Badge>
                )}
              </div>
            )}
            {member?.about && (
              <p className="mt-2 max-w-xl border-l-2 border-gold/50 pl-3 font-serif text-sm italic text-foreground/75 line-clamp-2">
                “{member.about}”
              </p>
            )}
            {member && acceptedCount > 0 && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                {`${acceptedCount} of your interests were accepted 🎉`}
              </p>
            )}
            <div className="mt-3 max-w-md">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Profile completion</span>
                <span className="font-semibold text-foreground">{completion}%</span>
              </div>
              <Progress
                value={completion}
                className="progress-shimmer h-2 [&>div]:bg-[linear-gradient(90deg,var(--gold),var(--primary))]"
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">{completionHint}</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2 sm:flex-col">
            <Button
              variant="outline"
              onClick={() => setEditOpen(true)}
              className="gap-2"
              aria-label="Edit your profile details"
            >
              <PencilLine className="size-4" />
              Edit profile
            </Button>
            <Button variant="outline" onClick={onBack} className="gap-2">
              <Search className="size-4" />
              Discover
            </Button>
            <Button
              variant="gold"
              onClick={onExplorePlans}
              className="gap-2"
              aria-label={orders.bestPlan ? "Manage your membership plan" : "Upgrade your membership plan"}
            >
              <Gem className="size-4" />
              {orders.bestPlan ? "Manage plan" : "Upgrade"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <StatGroup className="mt-6">
        <Stat
          label="Interests sent"
          value={interests.count}
          icon={<HeartHandshake className="text-primary" />}
          delta={acceptedCount > 0 ? { value: `${acceptedCount} accepted`, trend: "up" } : undefined}
        />
        <Stat
          label="Shortlisted"
          value={shortlist.count}
          icon={<Heart className="text-destructive" />}
        />
        <Stat
          label="Memberships"
          value={orders.count}
          icon={<Receipt className="text-gold" />}
        />
        <Stat
          label="Lifetime spend"
          value={`₹${totalSpend.toLocaleString("en-IN")}`}
          icon={<TrendingUp className="text-success" />}
        />
      </StatGroup>

      {/* ── Recently viewed ─────────────────────────────────────────── */}
      {recent.ready && recentProfiles.length > 0 && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden size-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold sm:flex">
              <History className="size-4.5" />
            </span>
            <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recently
              <br className="sm:hidden" /> viewed
            </p>
            <ul className="flex min-w-0 items-center gap-2 overflow-x-auto scrollbar-thin">
              {recentProfiles.map((profile) => (
                <li key={profile.id}>
                  <button
                    type="button"
                    onClick={() => onViewProfile?.(profile)}
                    className="group flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background py-1 pr-3 pl-1 transition-all hover:border-gold/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label={`Open ${profile.name}'s profile — viewed recently`}
                  >
                    <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={profile.image}
                        alt=""
                        fill
                        sizes="28px"
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </span>
                    <span className="text-xs font-medium whitespace-nowrap text-foreground/85">
                      {profile.name.split(" ")[0]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Clear recently viewed history"
            onClick={() => {
              recent.clear();
              toast({ title: "History cleared", description: "Recently viewed profiles removed." });
            }}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </IconButton>
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────────────────── */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-8">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 self-start sm:w-fit">
          <TabsTrigger value="interests" className="gap-1.5">
            <HeartHandshake className="size-4" />
            Interests
            {interests.count > 0 && (
              <Badge variant="soft" className="ml-1 text-[10px]">
                {interests.count}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="shortlist" className="gap-1.5">
            <Heart className="size-4" />
            Shortlist
            {shortlist.count > 0 && (
              <Badge variant="soft" className="ml-1 text-[10px]">
                {shortlist.count}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-1.5">
            <Receipt className="size-4" />
            Orders
            {orders.count > 0 && (
              <Badge variant="soft" className="ml-1 text-[10px]">
                {orders.count}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5">
            <Activity className="size-4" />
            Activity
            {notifications && notifications.unread > 0 && (
              <Badge variant="default" className="ml-1 text-[10px]">
                {notifications.unread}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="searches" className="gap-1.5">
            <Bookmark className="size-4" />
            Saved searches
            {savedSearches && savedSearches.count > 0 && (
              <Badge variant="soft" className="ml-1 text-[10px]">
                {savedSearches.count}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Interests ─────────────────────────────────────────────── */}
        <TabsContent value="interests" className="mt-4 focus-visible:outline-none">
          {interests.count === 0 ? (
            <Card className="p-2">
              <EmptyState
                icon={<HeartHandshake className="size-8" />}
                title="No interests sent yet"
                description="When you send an interest to a profile, the conversation starts here — and they'll appear in your navbar too."
                size="sm"
                action={
                  <Button variant="gold" onClick={onDiscover} className="gap-2">
                    <Sparkles className="size-4" />
                    Discover matches
                  </Button>
                }
              />
            </Card>
          ) : (
            <ul className="space-y-3">
              {interests.records.map((record) => {
                const profile = profileById(record.profileId);
                const status =
                  INTEREST_STATUS_STYLES[record.status] ?? INTEREST_STATUS_STYLES.sent;
                return (
                  <li key={record.id}>
                    <Card
                      data-interest-id={record.id}
                      className={cn(
                        "flex-row items-center gap-4 p-3.5 transition-all hover:border-gold/40 hover:shadow-md sm:p-4",
                        record.id === focusInterestId && "spotlight-row"
                      )}
                    >
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-16">
                        {profile ? (
                          <Image
                            src={profile.image}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-muted-foreground">
                            <HeartHandshake className="size-5" />
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-base font-semibold text-foreground">
                          {record.profileName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {profile
                            ? `${profile.age} yrs · ${profile.city} · ${profile.profession}`
                            : "Profile details unavailable"}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={cn("gap-1.5 text-[11px]", status.className)}>
                            <span className={cn("size-1.5 rounded-full", status.dot)} />
                            {status.label}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            sent{" "}
                            {formatDistanceToNow(new Date(record.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        {record.note && (
                          <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-gold/20 bg-gold/5 px-2.5 py-1.5 text-[11px] italic leading-relaxed text-foreground/80">
                            <MessageSquareQuote className="mt-0.5 size-3 shrink-0 text-gold" aria-hidden="true" />
                            <span className="line-clamp-2">“{record.note}”</span>
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {profile && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewProfile?.(profile)}
                          >
                            View
                          </Button>
                        )}
                        <IconButton
                          size="sm"
                          variant="ghost"
                          aria-label={`Withdraw interest in ${record.profileName}`}
                          onClick={() => {
                            void interests.withdraw(record.profileId);
                            toast({
                              title: "Interest withdrawn",
                              description: `${record.profileName} has been removed from your interests.`,
                            });
                          }}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </IconButton>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>

        {/* ── Shortlist ─────────────────────────────────────────────── */}
        <TabsContent value="shortlist" className="mt-4 focus-visible:outline-none">
          {savedProfiles.length === 0 ? (
            <Card className="p-2">
              <EmptyState
                icon={<Heart className="size-8" />}
                title="Your shortlist is empty"
                description="Tap the heart on any profile to keep them here. Shortlists stay on this device."
                size="sm"
                action={
                  <Button variant="gold" onClick={onDiscover} className="gap-2">
                    <Sparkles className="size-4" />
                    Explore profiles
                  </Button>
                }
              />
            </Card>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {savedProfiles.map((profile) => (
                <li key={profile.id}>
                  <Card className="flex-row items-center gap-4 p-3.5 transition-all hover:border-gold/40 hover:shadow-md sm:p-4">
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={profile.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-base font-semibold text-foreground">
                        {profile.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {profile.age} yrs · {profile.city} · {profile.profession}
                      </p>
                      <Badge variant="gold" className="mt-1.5 text-[10px]">
                        {profile.matchScore}% match
                      </Badge>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => onViewProfile?.(profile)}>
                        View
                      </Button>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label={`Remove ${profile.name} from shortlist`}
                        onClick={() => shortlist.remove(profile.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </IconButton>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {/* ── Orders ────────────────────────────────────────────────── */}
        <TabsContent value="orders" className="mt-4 focus-visible:outline-none">
          {orders.count === 0 ? (
            <Card className="p-2">
              <EmptyState
                icon={<Receipt className="size-8" />}
                title="No memberships yet"
                description="Upgrade any time from our plans — every membership includes verified families and a 7-day money-back promise."
                size="sm"
                action={
                  <Button variant="gold" onClick={onExplorePlans} className="gap-2">
                    <Gem className="size-4" />
                    View plans
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 p-3.5 text-sm">
                <BadgeCheck className="size-4 shrink-0 text-gold" />
                <p className="text-foreground/90">
                  You&apos;re on the{" "}
                  <span className="font-semibold">{orders.bestPlan ?? "Free"}</span> plan — thank
                  you for trusting Saptapadi with this journey.
                </p>
              </div>
              <ul className="space-y-3">
                {orders.records.map((order) => {
                  const status =
                    ORDER_STATUS_STYLES[order.status] ?? ORDER_STATUS_STYLES.confirmed;
                  return (
                    <li key={order.id}>
                      <Card className="flex flex-col gap-3 p-4 transition-all hover:border-gold/40 hover:shadow-md sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-sm">
                          <Gem className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-serif text-base font-semibold text-foreground">
                              {order.plan} membership
                            </p>
                            <Badge
                              variant="outline"
                              className={cn("text-[11px]", status.className)}
                            >
                              {status.label}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Order <span className="font-mono font-semibold">{order.id}</span>
                            {" · "}
                            {order.city || "—"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                          <p className="font-serif text-lg font-bold text-foreground">
                            {order.amount}
                          </p>
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <CalendarClock className="size-3" />
                            {formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </TabsContent>

        {/* ── Activity (unified feed) ───────────────────────────────── */}
        <TabsContent value="activity" className="mt-4 focus-visible:outline-none">
          {!member || !notifications ? (
            <Card className="p-2">
              <EmptyState
                icon={<BellRing className="size-8" />}
                title="Your story, updates at a glance"
                description="Sign in to see interest decisions, membership updates and match digests in one timeline."
                size="sm"
              />
            </Card>
          ) : activityItems.length === 0 ? (
            <Card className="p-2">
              <EmptyState
                icon={<SparklesIcon className="size-8" />}
                title="Nothing here yet — for now"
                description="Interest decisions and match digests will appear in this timeline as they happen."
                size="sm"
                action={
                  <Button variant="gold" onClick={onDiscover} className="gap-2">
                    <Sparkles className="size-4" />
                    Discover matches
                  </Button>
                }
              />
            </Card>
          ) : (
            <NotificationList
              items={activityItems}
              title="Recent activity"
              stagger
              maxHeight="max-h-[28rem]"
              onMarkAllRead={() => void notifications.markAllRead()}
              onDismiss={(id) => void notifications.markRead(id)}
            />
          )}
        </TabsContent>

        {/* ── Saved searches (re-appliable filter sets) ─────────────── */}
        <TabsContent value="searches" className="mt-4 focus-visible:outline-none">
          {savedSearches ? (
            <SavedSearchesPanel
              onDiscover={onDiscover}
              onApply={(query) => {
                onApplySearch?.(query);
              }}
            />
          ) : (
            <Card className="p-2">
              <EmptyState
                icon={<Bookmark className="size-8" />}
                title="Saved searches live here"
                description="Save any search from the results view and it will wait for you in this tab."
                size="sm"
              />
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Edit profile dialog ────────────────────────────────────── */}
      <ProfileEditDialog open={editOpen} onOpenChange={setEditOpen} />

      {/* ── Support strip ───────────────────────────────────────────── */}
      <Separator className="my-8" />
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <LayoutDashboard className="size-5" />
          </span>
          <div>
            <p className="font-serif text-sm font-semibold text-foreground">
              Need a hand with your journey?
            </p>
            <p className="text-xs text-muted-foreground">
              Jane, our AI concierge, can curate matches just for you.
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <Eye className="size-4" />
          Back to browsing
        </Button>
      </div>
    </div>
  );
}
