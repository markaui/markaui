"use client";

import * as React from "react";
import Image from "next/image";
import { BadgeCheck, Heart, Search, ShieldCheck, Sparkles } from "lucide-react";

import type { SearchQuery } from "@/lib/matrimony-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AGE_RANGES = ["18 – 25 yrs", "26 – 30 yrs", "31 – 35 yrs", "36 – 45 yrs"];
const COMMUNITIES = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Any"];
const CITIES = ["Any", "Mumbai", "Delhi NCR", "Bengaluru", "Pune", "Jaipur", "Kolkata", "Chennai"];

export interface LandingHeroProps {
  onSearch?: (query: SearchQuery) => void;
}

export function LandingHero({ onSearch }: LandingHeroProps) {
  const [looking, setLooking] = React.useState("groom");
  const [age, setAge] = React.useState("26 – 30 yrs");
  const [community, setCommunity] = React.useState("Any");
  const [city, setCity] = React.useState("Any");

  return (
    <section id="top" className="dark relative overflow-hidden bg-background text-foreground">
      {/* Decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 h-[360px] w-[360px] rounded-full bg-primary/30 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 h-[280px] w-[280px] rounded-full bg-gold/10 blur-[90px]"
      />

      {/* Decorative mandala ring, slow spin */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 hidden size-[560px] -translate-y-1/2 rounded-full border border-dashed border-gold/15 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden size-[400px] -translate-y-1/2 rounded-full border border-gold/10 lg:block"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:pb-28 lg:pt-24">
        {/* Copy + search */}
        <div className="max-w-xl">
          {/* Call-site override: `text-gold-foreground` (dark brown, for solid gold
              backgrounds) is unreadable on this translucent tint over the dark hero.
              Use the gold accent itself for the text — readable in light & dark modes
              since this hero is always dark-scoped. Only changed here, not the Badge. */}
          <Badge
            variant="gold"
            className="mb-5 gap-1.5 border-gold/40 bg-gold/15 px-3 py-1 text-gold shadow-[0_0_24px_-8px] shadow-gold/40 dark:text-gold"
          >
            <Sparkles className="size-3" />
            India&apos;s most loved premium matrimony
          </Badge>

          <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Where two souls
            <br />
            begin <span className="text-gradient-gold">one forever</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Curated matches, verified families and a matchmaking concierge devoted to finding
            the one your heart has been waiting for.
          </p>

          {/* Search card */}
          <form
            className="glass mt-8 rounded-2xl border border-border p-4 shadow-xl sm:p-5"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.({
                seeking: looking === "groom" ? "female" : "male",
                age,
                community,
                city,
              });
            }}
            aria-label="Search profiles"
          >
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="col-span-1 space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  I&apos;m a
                </label>
                <Select value={looking} onValueChange={setLooking}>
                  <SelectTrigger className="w-full" aria-label="Looking for">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groom">Groom</SelectItem>
                    <SelectItem value="bride">Bride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Age
                </label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger className="w-full" aria-label="Age range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_RANGES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Community
                </label>
                <Select value={community} onValueChange={setCommunity}>
                  <SelectTrigger className="w-full" aria-label="Community">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMUNITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1 space-y-1.5">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  City
                </label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="w-full" aria-label="City">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === "Any" ? "Any city" : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" variant="gold" size="lg" className="mt-4 w-full gap-2 sm:w-auto sm:px-10">
              <Search className="size-4" />
              Find my match
            </Button>
          </form>

          {/* Trust row */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2.5">
              {["https://picsum.photos/seed/markaui-face-1/400/400", "https://picsum.photos/seed/markaui-face-2/400/400", "https://picsum.photos/seed/markaui-face-3/400/400", "https://picsum.photos/seed/markaui-face-4/400/400"].map(
                (src, i) => (
                  <span
                    key={src}
                    className="relative inline-block size-9 overflow-hidden rounded-full ring-2 ring-background"
                  >
                    <Image src={src} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                )
              )}
              <span className="flex size-9 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-gold-foreground ring-2 ring-background">
                10L+
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">2,400+ couples</span> matched this
              month · verified families only
            </p>
          </div>
        </div>

        {/* Layered collage */}
        <div className="relative mx-auto hidden w-full max-w-lg sm:block lg:max-w-none">
          <div className="relative aspect-[4/5]">
            {/* Main image */}
            <figure className="absolute left-1/2 top-6 z-10 h-[88%] w-[62%] -translate-x-1/2 rotate-2 overflow-hidden rounded-3xl border border-gold/30 shadow-2xl shadow-black/40">
              <Image
                src="https://picsum.photos/seed/markaui-couple/600/800"
                alt="Saptapadi couple in traditional maroon and gold wedding attire"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75),transparent)] p-4 pt-10">
                <p className="font-serif text-sm font-semibold text-white">
                  Noah &nbsp;&amp;&nbsp; Jane
                </p>
                <p className="text-xs text-white/70">Matched 94% · Married Jan 2025</p>
              </figcaption>
            </figure>

            {/* Left image */}
            <figure className="absolute left-0 top-0 z-0 h-[58%] w-[42%] -rotate-6 overflow-hidden rounded-3xl border border-white/10 shadow-xl shadow-black/30">
              <Image
                src="https://picsum.photos/seed/markaui-bride/600/800"
                alt="Bride in maroon and gold lehenga"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </figure>

            {/* Right image */}
            <figure className="absolute bottom-0 right-0 z-20 h-[54%] w-[40%] rotate-6 overflow-hidden rounded-3xl border border-white/10 shadow-xl shadow-black/30">
              <Image
                src="https://picsum.photos/seed/markaui-groom/600/800"
                alt="Groom in ivory and gold sherwani"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </figure>

            {/* Floating chips — gentle alternating bob */}
            <div className="glass absolute -left-2 top-[38%] z-30 flex items-center gap-2 rounded-2xl border border-gold/40 px-3.5 py-2.5 shadow-lg [animation:float-soft_5.5s_ease-in-out_infinite]">
              <span className="flex size-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                <Heart className="size-4" />
              </span>
              <span>
                <span className="block font-serif text-sm font-bold text-foreground">98.2%</span>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                  Match score
                </span>
              </span>
            </div>

            <div className="glass absolute -right-2 bottom-[16%] z-30 flex items-center gap-2 rounded-2xl border border-border px-3.5 py-2.5 shadow-lg [animation:float-soft-late_6.5s_ease-in-out_0.8s_infinite]">
              <span className="flex size-8 items-center justify-center rounded-full bg-success/20 text-success">
                <BadgeCheck className="size-4" />
              </span>
              <span>
                <span className="block font-serif text-sm font-bold text-foreground">100%</span>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                  Verified profiles
                </span>
              </span>
            </div>

            <div className="glass absolute bottom-[38%] right-[6%] z-30 hidden items-center gap-2 rounded-2xl border border-border px-3.5 py-2.5 shadow-lg [animation:float-soft_7.5s_ease-in-out_1.6s_infinite] lg:flex">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                <ShieldCheck className="size-4" />
              </span>
              <span>
                <span className="block font-serif text-sm font-bold text-foreground">50K+</span>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
                  Weddings blessed
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
