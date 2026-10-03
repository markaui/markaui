"use client";

import * as React from "react";
import Image from "next/image";
import {
  BellRing,
  Bookmark,
  ChevronDown,
  Gem,
  Heart,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { MatrimonyProfile } from "@/lib/matrimony-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { ThemeSwitcher } from "@/components/showcase/theme-switcher";
import { useToast } from "@/hooks/use-toast";
import { useShortlist } from "./shortlist-provider";
import { useAuth } from "./auth-provider";
import { useInterestsOptional } from "./interests-provider";
import { useNotificationsOptional } from "./notifications-provider";
import { useSavedSearchesOptional } from "./saved-searches-provider";
import { AuthModal } from "./auth-modal";
import { InterestsSheet } from "./interests-sheet";
import { NotificationsBell } from "./notifications-bell";

const LINKS = [
  { label: "Discover", href: "#profiles" },
  { label: "Communities", href: "#communities" },
  { label: "Stories", href: "#stories" },
  { label: "Plans", href: "#plans" },
];

export interface LandingNavbarProps {
  onOpenLibrary?: () => void;
  profiles: MatrimonyProfile[];
  onViewProfile?: (profile: MatrimonyProfile) => void;
  onExploreShortlist?: () => void;
  onOpenDashboard?: () => void;
  /** Deep-link handler for notification tap-through (dashboard tab, matches…). */
  onNavigate?: (destination: {
    view: "dashboard" | "results";
    tab?: "interests" | "shortlist" | "orders" | "searches";
    interestId?: string | null;
  }) => void;
}

export function LandingNavbar({
  onOpenLibrary,
  profiles,
  onViewProfile,
  onExploreShortlist,
  onOpenDashboard,
  onNavigate,
}: LandingNavbarProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [shortlistOpen, setShortlistOpen] = React.useState(false);
  const [interestsOpen, setInterestsOpen] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authTab, setAuthTab] = React.useState<"signin" | "signup">("signin");
  const shortlist = useShortlist();
  const { member, signOut } = useAuth();
  const { toast } = useToast();
  const interests = useInterestsOptional() ?? {
    count: 0,
    records: [],
    ready: true,
    sendingId: null,
    profileIds: new Set<string>(),
    has: () => false,
    send: async () => false,
    withdraw: async () => {},
    refresh: async () => {},
  };
  const notificationsUnread = useNotificationsOptional()?.unread ?? 0;
  const savedSearches = useSavedSearchesOptional();
  const prevName = React.useRef<string | null>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Welcome toast when a session appears (sign-in, sign-up or restore).
  React.useEffect(() => {
    const name = member?.name ?? null;
    if (name && name !== prevName.current) {
      toast({
        title: `Welcome, ${name.split(" ")[0]}`,
        description: "Your interests and shortlist are synced to your account.",
      });
    }
    prevName.current = name;
  }, [member, toast]);

  const savedProfiles = profiles.filter((p) => shortlist.ids.includes(p.id));

  function openAuth(tab: "signin" | "signup") {
    setAuthTab(tab);
    setAuthOpen(true);
  }

  const initials =
    member?.name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "";

  return (
    <header
      className={cn(
        "glass sticky top-0 z-50 border-b transition-all duration-300",
        scrolled ? "border-border shadow-sm" : "border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="#top" className="flex items-center gap-2.5" aria-label="Saptapadi home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-md">
            <Gem className="size-4.5" />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-bold tracking-tight text-foreground">
              Saptapadi
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
              Premium Matrimony
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="link-underline rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher className="hidden sm:flex" />

          {/* Shortlist */}
          <Sheet open={shortlistOpen} onOpenChange={setShortlistOpen}>
            <SheetTrigger asChild>
              <span className="relative">
                <IconButton
                  variant="ghost"
                  aria-label={`Shortlist — ${shortlist.count} saved`}
                  onClick={() => setShortlistOpen(true)}
                  className={cn(shortlist.count > 0 && "text-destructive")}
                >
                  <Heart className={cn("size-4.5", shortlist.count > 0 && "fill-destructive")} />
                </IconButton>
                {shortlist.count > 0 && (
                  <Badge
                    variant="gold"
                    className="pointer-events-none absolute -top-1 -right-1 size-4.5 min-w-4.5 justify-center rounded-full px-1 text-[9px] shadow-sm"
                  >
                    {shortlist.count}
                  </Badge>
                )}
              </span>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-serif">
                  <Heart className="size-4 fill-gold text-gold" />
                  Your shortlist
                </SheetTitle>
                <SheetDescription>
                  {savedProfiles.length === 0
                    ? "Tap the heart on any profile to keep them here."
                    : `${savedProfiles.length} ${savedProfiles.length === 1 ? "profile" : "profiles"} saved — they stay on this device.`}
                </SheetDescription>
              </SheetHeader>

              <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-4 pb-4">
                {savedProfiles.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card p-2">
                    <EmptyState
                      title="No one here yet"
                      description="Discover featured profiles and shortlist the ones that make your heart skip."
                      size="sm"
                      action={
                        <SheetClose asChild>
                          <Button variant="gold" onClick={onExploreShortlist}>
                            Explore profiles
                          </Button>
                        </SheetClose>
                      }
                    />
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {savedProfiles.map((profile) => (
                      <li
                        key={profile.id}
                        className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-md"
                      >
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={profile.image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-sm font-semibold text-foreground">
                            {profile.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {profile.age} yrs · {profile.city} · {profile.profession}
                          </p>
                          <Badge variant="gold" className="mt-1 text-[10px]">
                            {profile.matchScore}% match
                          </Badge>
                        </div>
                        <div className="flex shrink-0 flex-col gap-1.5">
                          <SheetClose asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onViewProfile?.(profile)}
                            >
                              View
                            </Button>
                          </SheetClose>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            aria-label={`Remove ${profile.name}`}
                            onClick={() => shortlist.remove(profile.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {savedProfiles.length > 0 && (
                <>
                  <Separator />
                  <div className="flex gap-2 p-4">
                    <Button variant="outline" className="flex-1" onClick={shortlist.clear}>
                      Clear all
                    </Button>
                    <SheetClose asChild>
                      <Button
                        variant="gold"
                        className="flex-1 gap-2"
                        onClick={onExploreShortlist}
                      >
                        <Sparkles className="size-4" />
                        Find more
                      </Button>
                    </SheetClose>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>

          {/* Interests */}
          <span className="relative">
            <IconButton
              variant="ghost"
              aria-label={`My interests — ${interests.count} sent`}
              onClick={() => setInterestsOpen(true)}
              className={cn(interests.count > 0 && "text-primary")}
            >
              <HeartHandshake
                className={cn("size-4.5", interests.count > 0 && "text-primary")}
              />
            </IconButton>
            {interests.count > 0 && (
              <Badge
                className="pointer-events-none absolute -top-1 -right-1 size-4.5 min-w-4.5 justify-center rounded-full px-1 text-[9px] shadow-sm"
                variant="default"
              >
                {interests.count}
              </Badge>
            )}
          </span>

          {/* Notifications (members only — the bell renders nothing for guests) */}
          <NotificationsBell onNavigate={onNavigate} />

          {/* Account */}
          {member ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden gap-2 pl-1 pr-2 md:inline-flex"
                  aria-label="Account menu"
                >
                  <Avatar className="size-7 ring-1 ring-border">
                    {member.avatarUrl ? (
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                    ) : null}
                    <AvatarFallback className="bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-[10px] font-semibold text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-24 truncate lg:inline">
                    {member.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <span className="block truncate font-serif text-sm font-semibold">
                    {member.name}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {member.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpenDashboard}>
                  <LayoutDashboard className="size-4" />
                  My dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setInterestsOpen(true)}>
                  <HeartHandshake className="size-4" />
                  My interests
                  {interests.count > 0 && (
                    <Badge variant="soft" className="ml-auto text-[10px]">
                      {interests.count}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    document
                      .querySelector<HTMLButtonElement>("[aria-label^='Notifications']")
                      ?.click()
                  }
                >
                  <BellRing className="size-4" />
                  Notifications
                  {notificationsUnread > 0 && (
                    <Badge variant="soft" className="ml-auto text-[10px]">
                      {notificationsUnread}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShortlistOpen(true)}>
                  <Heart className="size-4" />
                  Saved shortlist
                  {shortlist.count > 0 && (
                    <Badge variant="soft" className="ml-auto text-[10px]">
                      {shortlist.count}
                    </Badge>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate?.({ view: "dashboard", tab: "searches" })}
                >
                  <Bookmark className="size-4" />
                  Saved searches
                  {savedSearches?.count ? (
                    <Badge variant="soft" className="ml-auto text-[10px]">
                      {savedSearches.count}
                    </Badge>
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    void signOut();
                    toast({ title: "Signed out", description: "See you soon." });
                  }}
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => openAuth("signin")}
              >
                Sign in
              </Button>
              <Button
                variant="gold"
                size="sm"
                className="hidden gap-1.5 sm:inline-flex"
                onClick={() => openAuth("signup")}
              >
                <Sparkles className="size-3.5" />
                Join free
              </Button>
            </>
          )}

          <InterestsSheet
            open={interestsOpen}
            onOpenChange={setInterestsOpen}
            profiles={profiles}
            onViewProfile={onViewProfile}
            onDiscover={onExploreShortlist}
          />
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} initialTab={authTab} />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent md:hidden cursor-pointer"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-serif">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground">
                    <Gem className="size-3.5" />
                  </span>
                  Saptapadi
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
                {member && (
                  <div className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                    <Avatar className="size-9 ring-1 ring-border">
                      {member.avatarUrl ? (
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                      ) : null}
                      <AvatarFallback className="bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-[11px] font-semibold text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-serif text-sm font-semibold">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                )}
                {LINKS.map((link) => (
                  <SheetClose key={link.label} asChild>
                    <a
                      href={link.href}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <button
                    className="cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    onClick={onOpenDashboard}
                  >
                    My dashboard
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <button
                    className="cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    onClick={() => setInterestsOpen(true)}
                  >
                    My interests{interests.count > 0 ? ` (${interests.count})` : ""}
                  </button>
                </SheetClose>
                {member && (
                  <SheetClose asChild>
                    <button
                      className="cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      onClick={() => onNavigate?.({ view: "dashboard", tab: "searches" })}
                    >
                      Saved searches
                      {savedSearches?.count ? ` (${savedSearches.count})` : ""}
                    </button>
                  </SheetClose>
                )}
                {member && (
                  <SheetClose asChild>
                    <button
                      className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      onClick={() =>
                        document
                          .querySelector<HTMLButtonElement>("[aria-label^='Notifications']")
                          ?.click()
                      }
                    >
                      <BellRing className="size-4 text-muted-foreground" />
                      Notifications
                      {notificationsUnread > 0 && (
                        <Badge variant="soft" className="ml-auto text-[10px]">
                          {notificationsUnread} new
                        </Badge>
                      )}
                    </button>
                  </SheetClose>
                )}
                <div className="my-3 border-t border-border" />
                <div className="px-1 pb-2">
                  <ThemeSwitcher />
                </div>
                {member ? (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      void signOut();
                      toast({ title: "Signed out", description: "See you soon." });
                    }}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => openAuth("signin")}>
                      Sign in
                    </Button>
                    <Button variant="gold" onClick={() => openAuth("signup")}>
                      <Sparkles className="size-4" />
                      Join free
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

