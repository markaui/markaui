"use client";

import * as React from "react";
import Link from "next/link";
import { Blocks, Sparkles } from "lucide-react";

import type { MatrimonyProfile, SearchQuery } from "@/lib/matrimony-data";
import { MATRIMONY_PROFILES } from "@/lib/matrimony-data";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { InterestsProvider } from "./interests-provider";
import { OrdersProvider } from "./orders-provider";
import { ShortlistProvider } from "./shortlist-provider";
import { AuthProvider } from "./auth-provider";
import { NotificationsProvider } from "./notifications-provider";
import { SavedSearchesProvider } from "./saved-searches-provider";
import { LandingNavbar } from "./landing-navbar";
import { LandingHero } from "./landing-hero";
import {
  Communities,
  FeaturedProfiles,
  PricingPlans,
  SafetyCTA,
  SuccessStories,
  TrustStats,
} from "./landing-sections";
import { SearchResults } from "./search-results";
import { ProfileDetailModal } from "./profile-detail-modal";
import { PlanCheckout } from "./plan-checkout";
import { MemberDashboard } from "./member-dashboard";
import { MatchmakerDesk } from "./matchmaker-desk";
import { ConciergeChat } from "./concierge-chat";
import { AnnouncementBar, BackToTop, ScrollProgressBar } from "./scroll-floats";
import { LandingFooter } from "./landing-footer";

type LandingView = "home" | "results" | "dashboard" | "desk";

/** Where a notification tap-through should land. */
export interface NavigateDestination {
  view: "dashboard" | "results";
  tab?: "interests" | "shortlist" | "orders" | "searches";
  interestId?: string | null;
}

const DEFAULT_QUERY: SearchQuery = {
  seeking: "female",
  age: "26 – 30 yrs",
  community: "Any",
  city: "Any",
  sort: "match",
};

export function LandingPage() {
  const [view, setView] = React.useState<LandingView>("home");
  const [query, setQuery] = React.useState<SearchQuery>(DEFAULT_QUERY);
  const [activeProfile, setActiveProfile] = React.useState<MatrimonyProfile | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [checkoutPlan, setCheckoutPlan] = React.useState<{ name: string; price: string } | null>(
    null
  );
  const [chatOpen, setChatOpen] = React.useState(false);
  const recent = useRecentlyViewed();
  // Deep-link state for the dashboard (tab + a specific interest to spotlight).
  const [dashboardTab, setDashboardTab] = React.useState<
    "interests" | "shortlist" | "orders" | "searches"
  >("interests");
  const [focusInterestId, setFocusInterestId] = React.useState<string | null>(null);
  const { toast } = useToast();

  // jump to top whenever the primary view changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [view]);

  const openProfile = React.useCallback((profile: MatrimonyProfile) => {
    recent.record(profile.id);
    setActiveProfile(profile);
    setDetailOpen(true);
  }, [recent]);

  const goResults = React.useCallback((patch?: Partial<SearchQuery>) => {
    if (patch) setQuery((q) => ({ ...DEFAULT_QUERY, ...patch }));
    setView("results");
  }, []);

  /** Apply a saved search verbatim — full filter set, not a patch. */
  const applySearch = React.useCallback((full: SearchQuery) => {
    setQuery({ ...DEFAULT_QUERY, ...full });
    setView("results");
  }, []);

  const goHome = React.useCallback((sectionId?: string) => {
    setView((prev) => {
      if (prev !== "home" && sectionId) {
        // scroll after the home view paints
        requestAnimationFrame(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        });
      }
      return "home";
    });
  }, []);

  /** Notification tap-through — land on the right view, tab and record. */
  const handleNavigate = React.useCallback((destination: NavigateDestination) => {
    if (destination.view === "results") {
      setView("results");
      return;
    }
    setFocusInterestId(destination.interestId ?? null);
    setDashboardTab(destination.tab ?? "interests");
    setView("dashboard");
  }, []);

  const closeDetail = React.useCallback((open: boolean) => {
    setDetailOpen(open);
    if (!open) setActiveProfile(null);
  }, []);

  return (
    <AuthProvider>
      <SavedSearchesProvider>
      <NotificationsProvider>
        <OrdersProvider>
          <InterestsProvider>
            <ShortlistProvider>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <AnnouncementBar />
            <LandingNavbar
              profiles={MATRIMONY_PROFILES}
              onViewProfile={openProfile}
              onExploreShortlist={() => goResults()}
              onOpenDashboard={() => setView("dashboard")}
              onNavigate={handleNavigate}
            />
            <ScrollProgressBar className="sticky top-16 z-30" />

            <main className="flex-1">
              {view === "home" ? (
                <>
                  <LandingHero onSearch={(q) => goResults(q)} />
                  <TrustStats />
                  <FeaturedProfiles
                    profiles={MATRIMONY_PROFILES}
                    onViewProfile={openProfile}
                    onExploreAll={() => goResults()}
                  />
                  <Communities
                    onExplore={(community) =>
                      goResults({ community: community ? community.replace(" Matrimony", "") : "Any" })
                    }
                  />
                  <SuccessStories />
                  <PricingPlans
                    onSelectPlan={(name, price) => setCheckoutPlan({ name, price })}
                  />
                  <SafetyCTA
                    onStartProfile={() =>
                      toast({
                        title: "Let's begin your profile 💛",
                        description:
                          "Sign-up takes under three minutes — verify once, meet forever.",
                      })
                    }
                  />
                </>
              ) : view === "results" ? (
                <SearchResults
                  query={query}
                  onQueryChange={setQuery}
                  onViewProfile={openProfile}
                  onBack={() => setView("home")}
                />
              ) : view === "desk" ? (
                <MatchmakerDesk onBack={() => setView("home")} />
              ) : (
                <MemberDashboard
                  onBack={() => setView("home")}
                  onDiscover={() => goResults()}
                  onExplorePlans={() => goHome("plans")}
                  onViewProfile={openProfile}
                  initialTab={dashboardTab}
                  onApplySearch={applySearch}
                  focusInterestId={focusInterestId}
                  onNavigate={handleNavigate}
                />
              )}
            </main>

          <LandingFooter onOpenDesk={() => setView("desk")} />

          <ProfileDetailModal
            profile={activeProfile}
            open={detailOpen}
            onOpenChange={closeDetail}
          />

          <PlanCheckout
            plan={checkoutPlan?.name ?? null}
            price={checkoutPlan?.price ?? ""}
            onOpenChange={(open) => {
              if (!open) setCheckoutPlan(null);
            }}
          />

          <ConciergeChat open={chatOpen} onOpenChange={setChatOpen} />

          {/* Floating action stack — concierge chat above library entry */}
          <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
            <Button
              onClick={() => setChatOpen(true)}
              variant="gradient"
              size="lg"
              className="gap-2 rounded-full shadow-xl shadow-primary/25 transition-transform hover:scale-105"
              aria-label="Chat with Jane, our AI matchmaking concierge"
            >
              <Sparkles className="size-4" />
              <span className="hidden sm:inline">Ask Jane</span>
            </Button>
            <Button
              size="lg"
              className="gap-2 rounded-full shadow-xl shadow-primary/25 transition-transform hover:scale-105"
              aria-label="Open the MarkaUI component library"
              asChild
            >
              <Link href="/components">
                <Blocks className="size-4" />
                <span className="hidden sm:inline">Built with MarkaUI</span>
              </Link>
            </Button>
          </div>

          <BackToTop />
        </div>
            </ShortlistProvider>
          </InterestsProvider>
        </OrdersProvider>
      </NotificationsProvider>
      </SavedSearchesProvider>
    </AuthProvider>
  );
}
