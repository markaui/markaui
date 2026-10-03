"use client";

import * as React from "react";
import { ArrowUp, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { Progress } from "@/components/ui/progress";

/* ------------------------------- Back to top ------------------------------- */

/** Floating button with a gold circular scroll-progress ring. */
export function BackToTop() {
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
      setVisible(scrollTop > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circumference = 2 * Math.PI * 20;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`Back to top — ${Math.round(progress)}% scrolled`}
      className={cn(
        "fixed bottom-5 left-5 z-40 grid size-12 cursor-pointer place-items-center rounded-full border border-gold/40 bg-card/90 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-xl",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <svg viewBox="0 0 44 44" className="absolute inset-0 size-full -rotate-90">
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          strokeWidth="2.5"
          className="stroke-border"
        />
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-gold transition-[stroke-dashoffset] duration-150"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
        />
      </svg>
      <ArrowUp className="relative size-4 text-gold" aria-hidden="true" />
    </button>
  );
}

/* ----------------------------- Announcement bar ----------------------------- */

const STORAGE_KEY = "saptapadi-announcement-dismissed";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="relative z-50 bg-[linear-gradient(90deg,var(--primary),color-mix(in_srgb,var(--primary)_55%,var(--gold)),var(--primary))] px-10 py-2 text-center text-primary-foreground"
    >
      <p className="flex items-center justify-center gap-2 text-xs font-medium tracking-wide sm:text-sm">
        <Sparkles className="size-3.5 shrink-0 text-gold" aria-hidden="true" />
        <span className="truncate">
          <span className="font-serif font-semibold">New:</span> Meet Meera — our AI matchmaking
          concierge. Chat with her from the sparkle button, free for everyone.
        </span>
      </p>
      <IconButton
        variant="ghost"
        size="sm"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "1");
          setDismissed(true);
        }}
        className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"
      >
        <X className="size-3.5" />
      </IconButton>
    </div>
  );
}

/* ------------------------------ Scroll progress ----------------------------- */

/** Thin gold reading-progress bar pinned under the navbar. */
export function ScrollProgressBar({ className }: { className?: string }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Progress
      value={progress}
      aria-label="Reading progress"
      className={cn("h-0.5 rounded-none bg-transparent", className)}
    />
  );
}
