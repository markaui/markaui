import { cn } from "@/lib/utils";

/**
 * Brand mark — the markaui "m" monogram on a maroon→gold gradient tile.
 * Mirrors public/logo.svg so the navbar, docs sidebar and footer share one
 * crisp, theme-independent mark (never a raster).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="MarkaUI logo"
      className={cn("size-9 shrink-0", className)}
    >
      <defs>
        <linearGradient id="mk-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7d1f2e" />
          <stop offset="0.55" stopColor="#9a2733" />
          <stop offset="1" stopColor="#c9a227" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#mk-logo-g)" />
      <rect
        x="3.5"
        y="3.5"
        width="57"
        height="57"
        rx="13.5"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />
      <g
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 43 V30.5 Q17 23 24.5 23 Q32 23 32 30.5 V43" />
        <path d="M32 30.5 Q32 23 39.5 23 Q47 23 47 30.5 V43" />
      </g>
    </svg>
  );
}
