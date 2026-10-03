"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Gem,
  Heart,
  HeartHandshake,
  MapPin,
  Quote,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { useInView, animate } from "framer-motion";
import type { CarouselApi } from "@/components/ui/carousel";

import { cn } from "@/lib/utils";
import { PRESS_LOGOS, type MatrimonyProfile } from "@/lib/matrimony-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/primitives";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProfileCard } from "./profile-card";
import { Ornament, Reveal } from "./reveal";

/* ---------------------------------- Section header ---------------------------------- */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  action,
  ornament = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  action?: React.ReactNode;
  ornament?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "mb-10 flex gap-6",
        align === "center" ? "flex-col items-center text-center" : "flex-wrap items-end justify-between"
      )}
    >
      <div className={cn(align === "left" ? "max-w-xl" : "max-w-2xl")}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
      {ornament && <Ornament className="mt-2 w-full" />}
    </Reveal>
  );
}

/* ---------------------------------- Trust stats + press ---------------------------------- */

const STATS = [
  { icon: Users, value: 10, decimals: 0, suffix: " Lakh+", label: "Verified members", tone: "text-primary" },
  { icon: HeartHandshake, value: 92, decimals: 0, suffix: "%", label: "Match success rate", tone: "text-gold" },
  { icon: Gem, value: 50000, decimals: 0, suffix: "+", label: "Weddings blessed", tone: "text-primary", indianFormat: true },
  { icon: Star, value: 4.9, decimals: 1, suffix: " / 5", label: "Member happiness", tone: "text-gold" },
];

/** Count-up number that starts when scrolled into view. */
function CountUpValue({
  value,
  decimals = 0,
  suffix = "",
  indianFormat = false,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  indianFormat?: boolean;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplay(
          indianFormat
            ? Math.round(latest).toLocaleString("en-IN")
            : latest.toFixed(decimals)
        );
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, indianFormat]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

export function TrustStats() {
  return (
    <section aria-label="Trust statistics" className="relative overflow-hidden border-b border-border bg-background py-14">
      {/* soft radial glow behind the numbers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-40 max-w-3xl bg-radial-fade"
      />
      <Container className="relative">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, value, decimals, suffix, label, tone, indianFormat }, i) => (
            <Reveal key={label} delay={i * 0.08} className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "group mb-3 flex size-12 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                  tone
                )}
              >
                <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
              </span>
              <p className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                <CountUpValue
                  value={value}
                  decimals={decimals}
                  suffix={suffix}
                  indianFormat={indianFormat}
                />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </Reveal>
          ))}
        </div>

        {/* Press marquee */}
        <Reveal delay={0.15}>
          <Ornament className="mt-12" />
          <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
            As featured in
          </p>
          <div
            className="group relative mt-5 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }}
          >
            <div className="flex w-max animate-[marquee_32s_linear_infinite] items-center gap-14 pr-14 transition-[animation-play-state] duration-300 group-hover:[animation-play-state:paused]">
              {[...PRESS_LOGOS, ...PRESS_LOGOS].map((logo, i) => (
                <span
                  key={`${logo}-${i}`}
                  aria-hidden={i >= PRESS_LOGOS.length}
                  className="whitespace-nowrap font-serif text-lg font-semibold italic text-muted-foreground/45 transition-colors duration-300 hover:text-gold"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------- Featured profiles ---------------------------------- */

const FEATURED_IDS = [
  "ananya-sharma",
  "rohan-mehta",
  "ishita-iyer",
  "vikram-singhania",
  "meera-kulkarni",
  "kavya-nair",
  "arjun-malhotra",
  "diya-patel",
];

export function FeaturedProfiles({
  profiles,
  onViewProfile,
  onExploreAll,
}: {
  profiles: MatrimonyProfile[];
  onViewProfile: (profile: MatrimonyProfile) => void;
  onExploreAll: () => void;
}) {
  // Matchmaker-desk curation — featured pins and verified overrides decided
  // in the ops view flow back here so the landing page stays in sync.
  const [curation, setCuration] = React.useState<
    Map<string, { featured: boolean; verified: boolean }>
  >(new Map());

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/catalogue", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          curation: { profileId: string; featured: boolean; verified: boolean }[];
        };
        if (!cancelled) {
          setCuration(
            new Map(data.curation.map((c) => [c.profileId, { featured: c.featured, verified: c.verified }]))
          );
        }
      } catch {
        // curation is a progressive enhancement — base cards render without it
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const base = FEATURED_IDS.map((id) => profiles.find((p) => p.id === id)).filter(
    (p): p is MatrimonyProfile => Boolean(p)
  );

  // Curated-featured profiles bubble to the front of the handpicked rail.
  const featured = React.useMemo(() => {
    const scored = base.map((profile) => ({
      profile,
      featured: curation.get(profile.id)?.featured ?? false,
    }));
    return scored.sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [base, curation]);

  return (
    <section id="profiles" className="bg-background py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Handpicked for you"
          title="Featured profiles this week"
          subtitle="Every profile is personally verified by our trust & safety team before it reaches your feed."
          align="left"
          action={
            <Button variant="outline" className="gap-2 rounded-full" onClick={onExploreAll}>
              View all profiles
              <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ profile, featured: isCurated }, i) => (
            <Reveal key={profile.id} delay={Math.min(i * 0.06, 0.24)}>
              <ProfileCard
                profile={profile}
                onView={onViewProfile}
                featured={isCurated}
                verifiedOverride={curation.get(profile.id)?.verified}
                priority={i < 4}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------- Communities ---------------------------------- */

const COMMUNITIES = [
  { name: "Hindu Matrimony", members: "4.2 Lakh+", tone: "bg-primary/8 text-primary", icon: "🕉" },
  { name: "Muslim Matrimony", members: "1.8 Lakh+", tone: "bg-success/10 text-success", icon: "☾" },
  { name: "Christian Matrimony", members: "94 Thousand+", tone: "bg-info/10 text-info", icon: "✝" },
  { name: "Sikh Matrimony", members: "82 Thousand+", tone: "bg-gold/15 text-gold-foreground dark:text-gold", icon: "☬" },
  { name: "Jain Matrimony", members: "38 Thousand+", tone: "bg-warning/10 text-warning", icon: "卐" },
  { name: "Inter-Caste", members: "1.1 Lakh+", tone: "bg-destructive/10 text-destructive", icon: "♥" },
];

export function Communities({ onExplore }: { onExplore: (community?: string) => void }) {
  return (
    <section id="communities" className="border-y border-border bg-secondary/30 py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Browse by community"
          title="Your traditions, honoured"
          subtitle="Dedicated matchmakers for every community, caste and region across India and the diaspora."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITIES.map((community, i) => (
            <Reveal key={community.name} delay={Math.min(i * 0.05, 0.25)}>
              <button
                type="button"
                onClick={() =>
                  onExplore(
                    COMMUNITIES.some((c) => c.name === community.name)
                      ? community.name.replace(" Matrimony", "").replace("Inter-Caste", "Inter-Caste")
                      : undefined
                  )
                }
                className="shine-sweep group flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md cursor-pointer"
              >
                <span
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl text-xl",
                    community.tone
                  )}
                  aria-hidden="true"
                >
                  {community.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-serif text-base font-semibold text-foreground">
                    {community.name}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {community.members} members
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
              </button>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------- Success stories ---------------------------------- */

const STORIES = [
  {
    image: "/images/story-1.png",
    quote:
      "We were matched within three weeks. The concierge understood our families even better than we did.",
    names: "Priya & Arjun",
    city: "Chennai",
    date: "Married Dec 2024",
  },
  {
    image: "/images/story-2.png",
    quote:
      "From the first phone call to the varmala, Saptapadi handled every detail with so much grace.",
    names: "Simran & Karan",
    city: "Amritsar",
    date: "Married Feb 2025",
  },
  {
    image: "/images/story-3.png",
    quote:
      "Both our families approved within a month. It truly felt like destiny, organised beautifully.",
    names: "Nisha & Dev",
    city: "Udaipur",
    date: "Married Nov 2024",
  },
];

export function SuccessStories() {
  const api = React.useRef<CarouselApi>(null);
  const [paused, setPaused] = React.useState(false);

  // Gentle auto-advance; pauses on hover/focus or reduced motion.
  React.useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      api.current?.scrollNext();
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section id="stories" className="overflow-hidden bg-background py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Real love stories"
          title="Families who found their forever"
          subtitle="Over 50,000 weddings and counting — here are a few that began right here."
        />
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <Carousel
            opts={{ loop: true, align: "start" }}
            setApi={(instance) => {
              api.current = instance;
            }}
            className="mx-auto w-full"
          >
            <CarouselContent className="-ml-6">
              {STORIES.map((story, i) => (
                <CarouselItem key={story.names} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <Reveal delay={Math.min(i * 0.08, 0.16)} className="h-full">
                    <Card className="group h-full overflow-hidden rounded-2xl pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={story.image}
                          alt={`${story.names} wedding photograph`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute bottom-3 left-3 bg-background/85 text-foreground shadow-sm backdrop-blur">
                          {story.date}
                        </Badge>
                      </div>
                      <CardContent className="space-y-3 p-5">
                        <Quote className="size-5 text-gold/70" aria-hidden="true" />
                        <p className="text-sm leading-relaxed text-foreground/90">“{story.quote}”</p>
                        <div>
                          <p className="font-serif text-base font-semibold text-foreground">
                            {story.names}
                          </p>
                          <p className="text-xs text-muted-foreground">{story.city}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Reveal>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex items-center justify-center gap-3">
              <CarouselPrevious className="static size-9 translate-0 rounded-full" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                Drag or use the arrows
              </span>
              <CarouselNext className="static size-9 translate-0 rounded-full" />
            </div>
          </Carousel>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------- Pricing ---------------------------------- */

const PLANS = [
  {
    name: "Silver",
    tagline: "Begin your search",
    monthly: null as number | null,
    features: [
      "Create your detailed profile",
      "Browse 10 lakh+ members",
      "5 interests every month",
      "Community filters",
    ],
    cta: "Start free",
    variant: "outline" as const,
    featured: false,
  },
  {
    name: "Gold",
    tagline: "Our most loved plan",
    monthly: 1999,
    features: [
      "Unlimited interests & chats",
      "AI match score on every profile",
      "Priority placement in searches",
      "Kundli & horoscope reports",
      "Dedicated relationship advisor",
    ],
    cta: "Go Gold",
    variant: "gold" as const,
    featured: true,
  },
  {
    name: "Diamond",
    tagline: "The concierge experience",
    monthly: 4999,
    features: [
      "Everything in Gold",
      "Personal matchmaker concierge",
      "Hand-curated weekly shortlists",
      "Family meeting coordination",
      "Background verification reports",
    ],
    cta: "Go Diamond",
    variant: "outline" as const,
    featured: false,
  },
];

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function PricingPlans({
  onSelectPlan,
}: {
  onSelectPlan?: (plan: string, price: string) => void;
}) {
  const [billing, setBilling] = React.useState<"monthly" | "annual">("monthly");

  return (
    <section id="plans" className="border-t border-border bg-secondary/30 py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Membership"
          title="Choose how you meet forever"
          subtitle="Transparent plans, no hidden fees. Upgrade or pause anytime — your forever is worth it."
        />

        {/* Billing toggle */}
        <Reveal className="mb-10 flex justify-center">
          <div
            role="group"
            aria-label="Billing period"
            className="relative flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm"
          >
            {(["monthly", "annual"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={billing === option}
                onClick={() => setBilling(option)}
                className={cn(
                  "relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium capitalize transition-all duration-300",
                  billing === option
                    ? "bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option}
                {option === "annual" && (
                  <Badge
                    variant="success"
                    className={cn(
                      "ml-2 hidden text-[10px] sm:inline-flex",
                      billing === "annual" && "bg-background/25 text-primary-foreground"
                    )}
                  >
                    Save 20%
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const isAnnual = billing === "annual";
            const price =
              plan.monthly === null
                ? "Free"
                : isAnnual
                  ? inr(plan.monthly * 12 * 0.8)
                  : inr(plan.monthly);
            const period =
              plan.monthly === null ? "forever" : isAnnual ? "per year, billed annually" : "per month";
            return (
              <Reveal
                key={plan.name}
                delay={i * 0.08}
                className={cn("relative", plan.featured && "lg:-mt-3")}
              >
                {plan.featured && (
                  <Badge
                    variant="gold"
                    className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 gap-1 px-3 shadow-md"
                  >
                    <Gem className="size-3" />
                    Most loved
                  </Badge>
                )}
                <Card
                  className={cn(
                    "card-lift relative flex h-full flex-col rounded-3xl p-8 hover:shadow-xl",
                    plan.featured
                      ? "edge-gold-top glow-pulse ring-gold-soft border-gold/50 bg-card"
                      : "border-border"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-xl font-semibold text-foreground">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                    </div>
                    {isAnnual && plan.monthly !== null && (
                      <Badge variant="success" className="mt-1 shrink-0 text-[10px]">
                        2.4 months free
                      </Badge>
                    )}
                  </div>
                  <p className="mt-5 flex items-baseline gap-2">
                    <span
                      key={price}
                      className="font-serif text-4xl font-bold text-foreground [animation:shimmer_1.2s_ease-in-out]"
                    >
                      {price}
                    </span>
                    <span className="text-sm text-muted-foreground">/ {period}</span>
                  </p>
                  <div className="my-6 border-t border-border" />
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-foreground/90"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full",
                            plan.featured ? "bg-gold/20 text-gold" : "bg-primary/10 text-primary"
                          )}
                        >
                          <Check className="size-3" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.variant}
                    size="lg"
                    fullWidth
                    className="rounded-xl"
                    onClick={() => onSelectPlan?.(plan.name, price)}
                  >
                    {plan.cta}
                  </Button>
                </Card>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prices exclude GST · Cancel anytime · 7-day money-back promise on all paid plans
        </p>
      </Container>
    </section>
  );
}

/* ---------------------------------- Safety CTA ---------------------------------- */

const SAFETY_POINTS = [
  {
    title: "Profile verification",
    description: "Government ID, phone and family checks on every single member.",
  },
  {
    title: "Privacy first",
    description: "Control who sees your photos, contact details and horoscope.",
  },
  {
    title: "Secure conversations",
    description: "Encrypted chat with family-visible modes and moderation.",
  },
  {
    title: "Human support",
    description: "A dedicated safety desk available on call, 7 days a week.",
  },
];

export function SafetyCTA({ onStartProfile }: { onStartProfile?: () => void }) {
  return (
    <section
      aria-label="Safety and benefits"
      className="dark relative overflow-hidden bg-background text-foreground"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-gold/10 blur-[110px]"
      />
      <Container className="relative py-20 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/40">
              <ShieldCheck className="size-7" />
            </span>
            <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Safety is woven into <span className="text-gradient-gold">every step</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Matrimony is sacred — and so is your trust. From verified families to encrypted
              chats, every Saptapadi interaction is protected end to end.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="gold" size="lg" className="gap-2" onClick={onStartProfile}>
                <Heart className="size-4" />
                Create your profile
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Talk to our team
              </Button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SAFETY_POINTS.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-border bg-card/60 p-5 backdrop-blur transition-all duration-300 hover:border-gold/40 hover:bg-card">
                  <BadgeCheck className="mb-3 size-5 text-gold" aria-hidden="true" />
                  <p className="font-serif text-base font-semibold text-foreground">
                    {point.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Profile completeness nudge */}
        <Reveal delay={0.1}>
          <div className="glass mt-14 flex flex-col items-center gap-4 rounded-3xl border border-gold/30 p-6 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <p className="font-serif text-lg font-semibold text-foreground">
                Complete profiles receive 3× more interests
              </p>
              <p className="text-sm text-muted-foreground">
                Add photos, education and family details to unlock your best matches.
              </p>
              <Progress value={78} className="mt-3 h-2 max-w-md" aria-label="Profile completeness" />
            </div>
            <Button variant="gold" size="lg" className="gap-2 shrink-0" onClick={onStartProfile}>
              Complete profile — 78%
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
