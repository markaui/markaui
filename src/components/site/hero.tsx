import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Heart,
  MapPin,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { InstallCommand } from "./install-command";

/* ------------------------------- Hero copy -------------------------------- */

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--gold)_14%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_35%_at_85%_20%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-14 text-center sm:px-6 sm:pt-20">
        {/* Eyebrow pill */}
        <div className="mk-fade-up mb-6 flex justify-center">
          <Link
            href="/components"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold-foreground shadow-[0_0_24px_-10px] shadow-gold/40 transition-colors hover:bg-gold/15 dark:text-gold"
          >
            <Sparkles className="size-3.5 text-gold" aria-hidden />
            339+ components · 12 luxury themes · v1.0.0
            <ArrowRight className="size-3.5 text-gold transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="mk-fade-up mk-fade-up-1 mx-auto max-w-3xl font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          The premium React library for{" "}
          <span className="bg-[linear-gradient(110deg,var(--primary),var(--gold))] bg-clip-text text-transparent">
            products people love
          </span>
        </h1>

        <p className="mk-fade-up mk-fade-up-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          MarkaUI ships 339+ accessible, themeable components with a luxury design-token
          system — 12 gold-tuned themes, light &amp; dark, TypeScript-first. One install,
          every framework. Ship elegant interfaces in hours, not months.
        </p>

        {/* CTAs */}
        <div className="mk-fade-up mk-fade-up-3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="gold"
            className="w-full rounded-full gap-2 px-8 shadow-xl shadow-gold/20 transition-transform hover:scale-[1.03] sm:w-auto"
            asChild
          >
            <Link href="/components">
              Browse Components
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full rounded-full gap-2 px-8 transition-transform hover:scale-[1.03] sm:w-auto"
            asChild
          >
            <Link href="/demo/matrimuni">
              <Heart className="size-4 text-gold" aria-hidden />
              View Live Demo
            </Link>
          </Button>
        </div>

        {/* Install */}
        <div className="mk-fade-up mk-fade-up-4 mt-8">
          <InstallCommand />
        </div>

        {/* Component collage */}
        <div className="mk-fade-up mk-fade-up-4 mt-16">
          <ComponentCollage />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Component collage --------------------------- */

function MiniBars() {
  const bars = [42, 68, 55, 82, 64, 92, 74];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="flex h-24 items-end justify-between gap-2" aria-hidden>
      {bars.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-md bg-[linear-gradient(to_top,var(--gold),color-mix(in_srgb,var(--gold)_55%,var(--primary)))] opacity-90 transition-all"
            style={{ height: `${v}%` }}
          />
          <span className="text-[9px] text-muted-foreground">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

function ProfileCard() {
  return (
    <Card className="relative border-gold/30 shadow-xl shadow-gold/10 ring-1 ring-gold/20">
      <div
        aria-hidden
        className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-gold to-transparent"
      />
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="relative">
          <Avatar className="size-16 border-2 border-gold/40">
            <AvatarImage src="" alt="Portrait of Ananya Sharma" />
            <AvatarFallback className="bg-gold/15 font-serif text-lg text-gold-foreground dark:text-gold">
              AS
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-gold text-gold-foreground shadow">
            <BadgeCheck className="size-3" aria-hidden />
          </span>
        </div>
        <div>
          <p className="font-serif text-base font-bold text-foreground">Ananya Sharma</p>
          <p className="mt-0.5 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" aria-hidden />
            Jaipur · Interior Designer, 26
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          <Badge variant="gold">Verified</Badge>
          <Badge variant="soft">91% match</Badge>
        </div>
        <div className="mt-1 flex w-full gap-2">
          <Button variant="gold" size="sm" className="flex-1 rounded-full gap-1">
            <Heart className="size-3.5" aria-hidden />
            Connect
          </Button>
          <Button variant="outline" size="sm" className="flex-1 rounded-full">
            View profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard() {
  return (
    <Card className="mk-float">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Weekly matches</p>
          <Badge variant="soft" className="text-[10px] text-success">
            <Star className="size-3" aria-hidden /> +12.4%
          </Badge>
        </div>
        <MiniBars />
      </CardContent>
    </Card>
  );
}

function NotificationsCard() {
  const items = [
    { name: "Priya K.", action: "sent you an interest", time: "2m", tint: "bg-gold/20 text-gold-foreground dark:text-gold" },
    { name: "Meera AI", action: "found 4 new matches", time: "1h", tint: "bg-primary/15 text-primary" },
    { name: "Rahul V.", action: "accepted your request", time: "3h", tint: "bg-success/15 text-success" },
  ];
  return (
    <Card className="mk-float-delayed">
      <CardContent className="p-5">
        <p className="mb-3 text-sm font-semibold text-foreground">Activity</p>
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.name} className="flex items-center gap-3">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${it.tint}`}
                aria-hidden
              >
                {it.name.slice(0, 1)}
              </span>
              <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{it.name}</span> {it.action}
              </p>
              <span className="shrink-0 text-[10px] text-muted-foreground/70">{it.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ControlsCard() {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <p className="text-sm font-semibold text-foreground">Preferences</p>
        <div className="flex items-center justify-between">
          <Label htmlFor="hero-email-alerts" className="text-xs text-muted-foreground">
            Email alerts
          </Label>
          <Switch id="hero-email-alerts" defaultChecked aria-label="Email alerts" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="hero-visible" className="text-xs text-muted-foreground">
            Profile visible
          </Label>
          <Switch id="hero-visible" defaultChecked aria-label="Profile visible" />
        </div>
        <Separator />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Max distance</Label>
            <span className="text-xs font-medium tabular-nums text-foreground">48 km</span>
          </div>
          <Slider defaultValue={[48]} max={100} step={1} aria-label="Max distance" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Profile completion</Label>
            <span className="text-xs font-medium tabular-nums text-gold">82%</span>
          </div>
          <Progress value={82} aria-label="Profile completion" />
        </div>
      </CardContent>
    </Card>
  );
}

function FormCard() {
  return (
    <Card className="mk-float">
      <CardContent className="space-y-3 p-5">
        <p className="text-sm font-semibold text-foreground">Create account</p>
        <div className="space-y-1.5">
          <Label htmlFor="hero-email" className="text-xs text-muted-foreground">
            Email
          </Label>
          <Input id="hero-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input className="pl-9" placeholder="Find your city…" aria-label="Find your city" />
        </div>
        <Button variant="gold" className="w-full rounded-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}

function VariantsCard() {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <p className="text-sm font-semibold text-foreground">Tokens in action</p>
        <div className="flex flex-wrap gap-1.5" aria-label="Badge variants">
          <Badge>Default</Badge>
          <Badge variant="gold">Gold</Badge>
          <Badge variant="soft">Soft</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
        <Separator />
        <div className="flex flex-wrap gap-2" aria-label="Button variants">
          <Button size="sm" className="rounded-full">
            Primary
          </Button>
          <Button size="sm" variant="gold" className="rounded-full">
            Gold
          </Button>
          <Button size="sm" variant="outline" className="rounded-full">
            Outline
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full">
            Ghost
          </Button>
        </div>
        <div className="flex items-center gap-2" aria-hidden>
          <Bell className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] leading-snug text-muted-foreground">
            Every token pair is WCAG-AA tuned across all 24 theme combinations.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ComponentCollage() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 text-left sm:gap-5 md:grid-cols-3">
      <div className="flex flex-col gap-4 sm:gap-5 md:translate-y-8">
        <ChartCard />
        <NotificationsCard />
      </div>
      <div className="flex flex-col gap-4 sm:gap-5">
        <ProfileCard />
        <VariantsCard />
      </div>
      <div className="flex flex-col gap-4 sm:gap-5 md:translate-y-12">
        <ControlsCard />
        <FormCard />
      </div>
    </div>
  );
}
