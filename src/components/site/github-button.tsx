"use client";

import * as React from "react";
import { Github, Star } from "lucide-react";

import { SOCIAL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** 1234 → "1.2k", 12500 → "12.5k" */
function formatCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 100 ? Math.round(k) : Math.round(k * 10) / 10}k`;
  }
  return String(n);
}

/**
 * "Star on GitHub" pill with a live star count fetched from /api/github/stars.
 * Opens the markaui/markaui repository in a new tab. The count degrades
 * gracefully — if the API is unreachable the pill renders icon + label only.
 */
export function GitHubButton({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const [stars, setStars] = React.useState<number | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/github/stars")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok: boolean; stars: number | null } | null) => {
        if (alive && d?.ok && typeof d.stars === "number") setStars(d.stars);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <a
      href={SOCIAL.githubRepo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`MarkaUI on GitHub — ${stars === null ? "open repository" : `${stars} stars, open repository in new tab`}`}
      className={cn(
        "group flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground/90 transition-all hover:border-gold/50 hover:text-gold hover:shadow-sm",
        className
      )}
    >
      <Github className="size-4 transition-transform group-hover:scale-110" />
      {showLabel ? (
        <span>Star</span>
      ) : (
        <span className="hidden sm:inline">Star</span>
      )}
      {stars !== null && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] leading-none text-foreground/80 tabular-nums",
            "transition-colors group-hover:bg-gold/15 group-hover:text-gold"
          )}
        >
          <Star className="size-2.5 fill-current" aria-hidden />
          {formatCount(stars)}
        </span>
      )}
    </a>
  );
}
