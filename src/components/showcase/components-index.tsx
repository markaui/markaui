"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Gem, GraduationCap, Heart, Package, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CATEGORIES, TOTAL_COMPONENTS, getFamiliesByCategory, getFamilyMembers } from "./registry";
import { GUIDES } from "./guides-data";
import { familyHref, guideHref } from "./urls";

/**
 * /components index — the component directory. Rendered on the server with
 * real <Link> elements for every family and guide, so search engines can
 * crawl the entire docs graph from this hub page.
 */
export function ComponentsIndex() {
  const totalFamilies = CATEGORIES.reduce(
    (sum, c) => sum + getFamiliesByCategory(c.id).length,
    0
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-10">
        <Badge variant="gold" className="gap-1.5">
          <Package className="size-3" />
          Component library
        </Badge>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Components
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Every component, organized into {totalFamilies} families. Live previews, responsive
          device stages, copyable code and full API references — themed by 12 luxury palettes
          with light &amp; dark mode.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="soft" className="gap-1">
            <Sparkles className="size-3" />
            {TOTAL_COMPONENTS} components
          </Badge>
          <Badge variant="soft">{totalFamilies} families</Badge>
          <Badge variant="soft">{GUIDES.length} usage guides</Badge>
          <Badge variant="soft">12 themes × light &amp; dark</Badge>
        </div>
      </header>

      {/* ── Usage guides ───────────────────────────────────────────────── */}
      <section aria-labelledby="index-guides-heading" className="mb-12">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="index-guides-heading"
            className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-foreground"
          >
            <GraduationCap className="size-4.5 text-gold" />
            Start here — usage guides
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.id}
                href={guideHref(guide.id)}
                className="group relative flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-gold/50 hover:shadow-md"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="mt-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  {guide.title}
                </span>
                <span className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {guide.description}
                </span>
                <span className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="rounded-full bg-muted px-1.5 py-0.5 font-medium tabular-nums">
                    {guide.readingTime}
                  </span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Family directory, grouped by category ─────────────────────── */}
      {CATEGORIES.map((category) => {
        const families = getFamiliesByCategory(category.id);
        if (families.length === 0) return null;
        return (
          <section
            key={category.id}
            aria-labelledby={`index-cat-${category.id}`}
            className="mb-10 scroll-mt-20"
          >
            <div className="mb-4">
              <h2
                id={`index-cat-${category.id}`}
                className="font-serif text-xl font-bold tracking-tight text-foreground"
              >
                {category.label}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">{category.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {families.map((family) => {
                const members = getFamilyMembers(family);
                const preview = members.slice(0, 4);
                return (
                  <Link
                    key={family.id}
                    href={familyHref(family.id)}
                    className="group flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-gold/50 hover:shadow-md"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {family.name}
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                        {members.length} component{members.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {family.description}
                    </span>
                    <span className="mt-3 flex flex-wrap items-center gap-1">
                      {preview.map((doc) => (
                        <span
                          key={doc.id}
                          className="rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors group-hover:border-gold/30 group-hover:text-foreground/80"
                        >
                          {`<${doc.name} />`}
                        </span>
                      ))}
                      {members.length > preview.length && (
                        <span className="rounded-md px-1 py-0.5 text-[10px] text-muted-foreground/70">
                          +{members.length - preview.length} more
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section aria-label="Get started" className="mt-12 overflow-hidden rounded-2xl border border-gold/30 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_8%,transparent),color-mix(in_srgb,var(--gold)_10%,transparent))] p-6 sm:p-8">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-foreground">
              <Gem className="size-4.5 text-gold" />
              Ready to build?
            </h2>
            <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Install the package, pick a theme and compose your first screen — or see a full
              production site built entirely with MarkaUI.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Link
              href={guideHref("installation")}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            >
              Installation guide
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/demo/matrimuni"
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-gold hover:bg-gold/20"
            >
              <Heart className="size-3.5 text-gold" />
              View live demo
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
