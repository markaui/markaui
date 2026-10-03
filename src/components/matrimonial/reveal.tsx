"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** seconds */
  delay?: number;
  /** initial vertical offset in px */
  y?: number;
  as?: "div" | "section" | "li" | "span";
}

/** Fade-up reveal on scroll — respects reduced-motion preferences. */
export function Reveal({ children, className, delay = 0, y = 26 }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Gold ornamental divider — a classic luxury flourish between sections. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center justify-center gap-3", className)}>
      <span className="h-px w-14 bg-[linear-gradient(to_right,transparent,var(--gold))]" />
      <span className="flex size-6 items-center justify-center rounded-full border border-gold/40 text-gold">
        <svg viewBox="0 0 24 24" className="size-3" fill="currentColor">
          <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
        </svg>
      </span>
      <span className="h-px w-14 bg-[linear-gradient(to_left,transparent,var(--gold))]" />
    </div>
  );
}
