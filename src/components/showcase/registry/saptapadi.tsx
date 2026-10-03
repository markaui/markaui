"use client";

import * as React from "react";
import { Gem } from "lucide-react";

import type { ComponentDoc } from "./types";
import { MATRIMONY_PROFILES, type MatrimonyProfile } from "@/lib/matrimony-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShortlistProvider } from "@/components/matrimonial/shortlist-provider";
import { AuthProvider } from "@/components/matrimonial/auth-provider";
import { InterestsProvider } from "@/components/matrimonial/interests-provider";
import { OrdersProvider } from "@/components/matrimonial/orders-provider";
import { MemberDashboard } from "@/components/matrimonial/member-dashboard";
import { ProfileCard } from "@/components/matrimonial/profile-card";
import { ProfileDetailModal } from "@/components/matrimonial/profile-detail-modal";
import { AuthModal } from "@/components/matrimonial/auth-modal";
import { InterestsSheet } from "@/components/matrimonial/interests-sheet";
import { ConciergeChat } from "@/components/matrimonial/concierge-chat";
import { AnnouncementBar, BackToTop, ScrollProgressBar } from "@/components/matrimonial/scroll-floats";
import { MatchmakerDesk } from "@/components/matrimonial/matchmaker-desk";
import { ProfileEditDialog } from "@/components/matrimonial/profile-edit-dialog";
import { NotificationsProvider } from "@/components/matrimonial/notifications-provider";
import { NotificationsBell } from "@/components/matrimonial/notifications-bell";
import { SavedSearchesProvider } from "@/components/matrimonial/saved-searches-provider";
import { SavedSearchesPanel } from "@/components/matrimonial/saved-searches-panel";
import { SaveSearchDialog } from "@/components/matrimonial/save-search-dialog";

function pick(id: string): MatrimonyProfile {
  return MATRIMONY_PROFILES.find((p) => p.id === id) ?? MATRIMONY_PROFILES[0];
}

/** Demo host that opens the real profile detail modal. */
function DetailModalDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <ShortlistProvider>
      <AuthProvider>
        <InterestsProvider>
          <div className="flex flex-col items-center gap-3 py-2">
            <Button variant="gold" onClick={() => setOpen(true)}>
              Open Emma&apos;s profile
            </Button>
            <ProfileDetailModal
              profile={open ? pick("emma-wilson") : null}
              open={open}
              onOpenChange={setOpen}
            />
          </div>
        </InterestsProvider>
      </AuthProvider>
    </ShortlistProvider>
  );
}

/** Demo host for the member auth modal. */
function AuthModalDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <AuthProvider>
      <div className="flex flex-col items-center gap-2 py-2">
        <Button onClick={() => setOpen(true)}>
          <Gem className="size-4" />
          Open sign-in
        </Button>
        <AuthModal open={open} onOpenChange={setOpen} />
      </div>
    </AuthProvider>
  );
}

/** Demo host for the interests drawer. */
function InterestsSheetDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <AuthProvider>
      <InterestsProvider>
        <div className="flex flex-col items-center gap-2 py-2">
          <Button onClick={() => setOpen(true)}>Open my interests</Button>
          <InterestsSheet
            open={open}
            onOpenChange={setOpen}
            profiles={MATRIMONY_PROFILES}
          />
        </div>
      </InterestsProvider>
    </AuthProvider>
  );
}

/** Demo host for the concierge drawer (live AI replies). */
function ConciergeDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <AuthProvider>
      <SavedSearchesProvider>
        <div className="flex flex-col items-center gap-2 py-2">
          <Button variant="gradient" onClick={() => setOpen(true)}>
            Chat with Jane
          </Button>
          <ConciergeChat open={open} onOpenChange={setOpen} />
        </div>
      </SavedSearchesProvider>
    </AuthProvider>
  );
}

/** Demo host for the profile editor dialog. */
function ProfileEditDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <AuthProvider>
      <div className="flex flex-col items-center gap-2 py-2">
        <Button onClick={() => setOpen(true)}>
          <Gem className="size-4" />
          Open profile editor
        </Button>
        <ProfileEditDialog open={open} onOpenChange={setOpen} />
      </div>
    </AuthProvider>
  );
}

/** Demo host for the matchmaker desk (representative demo rows — no gated API calls). */
function MatchmakerDeskDemo() {
  return (
    <div className="max-h-[560px] overflow-y-auto rounded-2xl border border-border scrollbar-thin">
      <MatchmakerDesk startUnlocked forceDemo onBack={() => window.scrollTo({ top: 0 })} />
    </div>
  );
}

/** Demo host for the notification bell (needs auth + feed providers). */
function NotificationsBellDemo() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <div className="flex flex-col items-center gap-3 py-2">
          <NotificationsBell />
          <p className="max-w-sm text-center text-xs text-muted-foreground">
            Members see the live feed (sign in via AuthModal first); guests get
            nothing — the bell renders null without a session.
          </p>
        </div>
      </NotificationsProvider>
    </AuthProvider>
  );
}

const DEMO_QUERY = {
  seeking: "female" as const,
  age: "26 – 30 yrs",
  community: "Hindu",
  city: "Jaipur",
  term: "",
  sort: "match" as const,
};

/** Demo host for saved searches — a real provider you can save into (guest rows stay in localStorage). */
function SavedSearchesDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <AuthProvider>
      <SavedSearchesProvider>
        <div className="flex flex-col items-center gap-4 py-2">
          <Button variant="gold" onClick={() => setOpen(true)}>
            Save a sample search
          </Button>
          <div className="w-full max-w-xl">
            <SavedSearchesPanel
              onApply={() => window.scrollTo({ top: 0 })}
              onDiscover={() => window.scrollTo({ top: 0 })}
            />
          </div>
          <SaveSearchDialog
            open={open}
            onOpenChange={setOpen}
            query={DEMO_QUERY}
            matches={2}
          />
        </div>
      </SavedSearchesProvider>
    </AuthProvider>
  );
}

export const saptapadiDocs: ComponentDoc[] = [
  {
    id: "profile-card",
    name: "ProfileCard",
    category: "saptapadi",
    description:
      "The signature matrimonial profile card — hover image zoom with CTA overlay, premium/verified/match badges and a shortlist heart with burst ping. Used across the landing grid, results and shortlist sheet.",
    demos: [
      {
        id: "profile-card-basic",
        title: "Live card",
        description: "Shortlist the heart, hover for the View profile overlay.",
        wide: true,
        code: `<ProfileCard
  profile={profile}
  onView={(p) => openDetail(p)}
/>`,
        render: () => (
          <ShortlistProvider>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MATRIMONY_PROFILES.slice(0, 3).map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </ShortlistProvider>
        ),
      },
    ],
    props: [
      { name: "profile", type: "MatrimonyProfile", description: "Profile record to render." },
      { name: "onView", type: "(profile) => void", description: "Called when the card or CTA is activated." },
      { name: "className", type: "string", description: "Extra classes for the card root." },
      { name: "featured", type: "boolean", default: "false", description: "Pins the gold “Matchmaker’s pick” badge (desk curation)." },
      { name: "verifiedOverride", type: "boolean", description: "Overrides the profile’s verified chip when provided." },
    ],
  },
  {
    id: "profile-detail-modal",
    name: "ProfileDetailModal",
    category: "saptapadi",
    description:
      "Full profile dossier in a Modal (xl): gallery with thumbnails, match progress, Overview / Horoscope / Family / Preferences tabs, interest tags and a footer with shortlist + Send interest (server-persisted).",
    demos: [
      {
        id: "profile-detail-demo",
        title: "Open the dossier",
        description: "Fully interactive — tabs, gallery, shortlist and interests all work.",
        wide: true,
        code: `<ProfileDetailModal
  profile={active}
  open={open}
  onOpenChange={setOpen}
/>`,
        render: () => <DetailModalDemo />,
      },
    ],
    props: [
      { name: "profile", type: "MatrimonyProfile | null", description: "Active profile; null hides content." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Open-state callback." },
    ],
  },
  {
    id: "auth-modal",
    name: "AuthModal",
    category: "saptapadi",
    description:
      "Member sign-in / registration modal composed from Modal + Tabs + LoginForm + SignupForm. Sessions are HMAC cookies issued by /api/auth/*; interests become account-scoped on sign-in.",
    demos: [
      {
        id: "auth-modal-demo",
        title: "Try it",
        description: "Creates a real demo member in SQLite.",
        code: `<AuthModal
  open={open}
  onOpenChange={setOpen}
  initialTab="signin"
/>`,
        render: () => <AuthModalDemo />,
      },
    ],
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Open-state callback." },
      { name: "initialTab", type: '"signin" | "signup"', default: '"signin"', description: "Tab shown on open." },
    ],
  },
  {
    id: "interests-sheet",
    name: "InterestsSheet",
    category: "saptapadi",
    description:
      "\"My interests\" drawer backed by /api/interests. Shows lifecycle badges (Pending → Seen → Accepted), relative sent time, profile thumbnails, withdraw actions and an empty state.",
    demos: [
      {
        id: "interests-sheet-demo",
        title: "Open the drawer",
        description: "Reads real interests for the current session (guest or member).",
        code: `<InterestsSheet
  open={open}
  onOpenChange={setOpen}
  profiles={profiles}
  onViewProfile={openDetail}
  onDiscover={scrollToProfiles}
/>`,
        render: () => <InterestsSheetDemo />,
      },
    ],
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Open-state callback." },
      { name: "profiles", type: "MatrimonyProfile[]", description: "Catalogue for thumbnails and detail links." },
      { name: "onViewProfile", type: "(profile) => void", description: "Opens the profile dossier." },
      { name: "onDiscover", type: "() => void", description: "Empty-state discover action." },
    ],
  },
  {
    id: "concierge-chat",
    name: "ConciergeChat",
    category: "saptapadi",
    description:
      "Jane — the AI matchmaking concierge in a right-side Drawer. Streaming-style replies from /api/concierge (catalogue-aware), typing dots, quick-suggestion chips and persisted transcripts.",
    demos: [
      {
        id: "concierge-demo",
        title: "Live chat",
        description: "Replies come from the real LLM concierge with catalogue context.",
        wide: true,
        code: `<ConciergeChat
  open={open}
  onOpenChange={setOpen}
/>`,
        render: () => <ConciergeDemo />,
      },
    ],
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Open-state callback." },
    ],
  },
  {
    id: "profile-edit-dialog",
    name: "ProfileEditDialog",
    category: "saptapadi",
    description:
      "Member profile editor (name, city, profession, height, about + avatar) composed from Dialog, Input, Select, Textarea, AvatarPicker and Spinner. Saves through PATCH /api/auth/profile and live-updates the AuthProvider context — the navbar, dashboard and checkout prefill refresh instantly. Shows a live completion delta preview and about-bio character counter.",
    demos: [
      {
        id: "profile-edit-demo",
        title: "Try it",
        description: "Sign in first (via AuthModal) to save changes; otherwise it shows a friendly notice.",
        code: `<ProfileEditDialog
  open={open}
  onOpenChange={setOpen}
/>`,
        render: () => <ProfileEditDemo />,
      },
    ],
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Open-state callback." },
    ],
  },
  {
    id: "matchmaker-desk",
    name: "MatchmakerDesk",
    category: "saptapadi",
    description:
      "Admin-lite operations view behind a passcode gate (HMAC cookie, 12h sessions): an interest queue with live stats, status tabs, search and Accept / Decline / Reset decisions, plus a Profile catalogue curator — featured pins, verified overrides and internal notes that persist to SQLite and flow straight back into the landing page. Open it from the footer's “Matchmaker desk” team link (demo passcode: matchmaker2024).",
    aliases: ["AdminDesk", "MatchmakerDeskView", "DeskGate"],
    demos: [
      {
        id: "matchmaker-desk-demo",
        title: "Live ops feed",
        description: "startUnlocked skips the gate; falls back to demo data when the APIs are gated.",
        wide: true,
        code: `<MatchmakerDesk
  startUnlocked
  onBack={() => setView("home")}
/>`,
        render: () => <MatchmakerDeskDemo />,
      },
    ],
    props: [
      { name: "onBack", type: "() => void", description: "Return to the site view." },
      { name: "startUnlocked", type: "boolean", default: "false", description: "Docs/demo escape hatch — skips the passcode gate." },
    ],
  },
  {
    id: "notifications-bell",
    name: "NotificationsBell",
    category: "saptapadi",
    description:
      "Navbar notification bell + popover feed backed by /api/notifications. Interest decisions, order updates and the daily match digest appear here, with unread badge, staggered rows, tap-through rows (a notification opens the right dashboard tab or match results), mark-all-read, per-row dismiss and clear-all. Renders nothing for guests.",
    aliases: ["NotificationFeed"],
    demos: [
      {
        id: "notifications-bell-demo",
        title: "Live feed",
        description: "Reads your real feed — accept an interest on the Matchmaker Desk to see it land here.",
        code: `<NotificationsProvider>
  <NotificationsBell onNavigate={(dest) => go(dest)} />
</NotificationsProvider>`,
        render: () => <NotificationsBellDemo />,
      },
    ],
    props: [
      { name: "className", type: "string", description: "Extra classes for the trigger wrapper." },
      { name: "onNavigate", type: "(dest: { view; tab?; interestId? }) => void", description: "Tap-through handler — a notification row opens its destination." },
    ],
  },
  {
    id: "announcement-bar",
    name: "AnnouncementBar",
    category: "saptapadi",
    description:
      "Gradient announcement strip with dismiss — the dismissal persists to localStorage. Rendered above the navbar.",
    demos: [
      {
        id: "announcement-demo",
        title: "Strip",
        code: `<AnnouncementBar />`,
        render: () => (
          <div className="overflow-hidden rounded-xl border">
            <AnnouncementBar />
          </div>
        ),
      },
    ],
    props: [],
  },
  {
    id: "scroll-progress-bar",
    name: "ScrollProgressBar",
    category: "saptapadi",
    description:
      "Ultra-thin gold reading-progress bar. Place it sticky under the navbar; it fills as the page scrolls.",
    aliases: ["ScrollProgress"],
    demos: [
      {
        id: "scroll-progress-demo",
        title: "Inline preview",
        description: "Scroll the page — the bar under this text tracks progress.",
        code: `<ScrollProgressBar className="sticky top-16 z-30" />`,
        render: () => (
          <div className="space-y-2">
            <ScrollProgressBar />
            <p className="text-xs text-muted-foreground">
              The bar above tracks this page&apos;s scroll.
            </p>
          </div>
        ),
      },
    ],
    props: [{ name: "className", type: "string", description: "Positioning classes (sticky top offset)." }],
  },
  {
    id: "back-to-top",
    name: "BackToTop",
    category: "saptapadi",
    description:
      "Floating gold SVG progress-ring button that appears after 480px of scroll and smooth-scrolls back to the top.",
    aliases: ["BackToTopButton"],
    demos: [
      {
        id: "back-to-top-demo",
        title: "In place",
        description: "Scroll down the page to see it appear bottom-right.",
        code: `<BackToTop />`,
        render: () => <BackToTop />,
      },
    ],
    props: [],
  },
  {
    id: "member-dashboard",
    name: "MemberDashboard",
    category: "saptapadi",
    description:
      "Signed-in member home: gradient greeting header with membership badge and profile completion, live StatGroup (interests / shortlist / memberships / spend) and Tabs for interests, shortlist and order history — all fed by the Saptapadi providers.",
    aliases: ["Dashboard", "MemberHome"],
    demos: [
      {
        id: "member-dashboard-demo",
        title: "Live dashboard",
        description:
          "Real providers with your session — send an interest or place an order on the site and this view updates.",
        code: `<AuthProvider>
  <OrdersProvider>
    <InterestsProvider>
      <ShortlistProvider>
        <MemberDashboard
          onBack={…}
          onDiscover={…}
          onExplorePlans={…}
          onViewProfile={…}
        />
      </ShortlistProvider>
    </InterestsProvider>
  </OrdersProvider>
</AuthProvider>`,
        render: () => (
          <AuthProvider>
            <OrdersProvider>
              <InterestsProvider>
                <ShortlistProvider>
                  <div className="max-h-[560px] overflow-y-auto rounded-2xl border border-border scrollbar-thin">
                    <MemberDashboard
                      onBack={() => window.scrollTo({ top: 0 })}
                      onDiscover={() => window.scrollTo({ top: 0 })}
                      onExplorePlans={() => window.scrollTo({ top: 0 })}
                    />
                  </div>
                </ShortlistProvider>
              </InterestsProvider>
            </OrdersProvider>
          </AuthProvider>
        ),
      },
    ],
    props: [
      { name: "onBack", type: "() => void", description: "Return to browsing (home view)." },
      { name: "onDiscover", type: "() => void", description: "Open search results." },
      { name: "onExplorePlans", type: "() => void", description: "Jump to the pricing section." },
      { name: "onViewProfile", type: "(profile: MatrimonyProfile) => void", description: "Open a profile detail modal (optional)." },
      { name: "initialTab", type: '"interests" | "shortlist" | "orders" | "activity" | "searches"', default: '"interests"', description: "Deep-link tab (e.g. from a notification tap-through)." },
      { name: "onApplySearch", type: "(query: SearchQuery) => void", description: "Apply a saved search — switches to the results view with its filters." },
      { name: "focusInterestId", type: "string | null", description: "Spotlights one interest row with a gold ring and scrolls it into view." },
    ],
  },
  {
    id: "save-search-dialog",
    name: "SaveSearchDialog",
    category: "saptapadi",
    description:
      "Controlled dialog that names and stores the current search filter set. Shows a live summary + match count, a notify-me Switch for new-match alerts and a guest-mode notice. Members sync to the account; guests keep rows on this device.",
    aliases: ["SaveSearchModal"],
    demos: [
      {
        id: "save-search-dialog-demo",
        title: "Live dialog",
        description: "Save the sample Jaipur search — it lands in the panel below (real provider).",
        code: `<SaveSearchDialog
  open={open}
  onOpenChange={setOpen}
  query={currentQuery}
  matches={results.length}
/>`,
        render: () => <SavedSearchesDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Open-state callback." },
      { name: "query", type: "SearchQuery", description: "The filter set being saved." },
      { name: "matches", type: "number", default: "0", description: "Live catalogue match count for the summary line." },
    ],
  },
  {
    id: "saved-searches-panel",
    name: "SavedSearchesPanel",
    category: "saptapadi",
    description:
      "Dashboard panel for saved searches: apply with one tap, rename inline, per-search notify toggle and delete — with skeleton loading, a gold empty state and a synced/device storage hint. Backed by SavedSearchesProvider (API for members, localStorage for guests).",
    aliases: ["SavedSearchList", "SavedSearches"],
    demos: [
      {
        id: "saved-searches-panel-demo",
        title: "Live panel",
        description: "Same demo host as the dialog — save a search and manage it here.",
        code: `<SavedSearchesPanel
  onApply={(query) => goResults(query)}
  onDiscover={() => goResults()}
/>`,
        render: () => <SavedSearchesDemo />,
        wide: true,
      },
    ],
    props: [
      { name: "onApply", type: "(query: SearchQuery) => void", description: "Apply a saved search (navigate to results)." },
      { name: "onDiscover", type: "() => void", description: "Empty-state discovery action." },
    ],
  },
];

export function SaptapadiBadge() {
  return (
    <Badge variant="gold" className="gap-1">
      <Gem className="size-3" />
      Saptapadi composite
    </Badge>
  );
}
