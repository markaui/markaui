/**
 * Central site configuration — single source of truth for SEO URLs and brand
 * metadata. Update SITE_URL when the production domain goes live; every
 * canonical, sitemap entry, OG tag and JSON-LD block reads from here.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://markaui.com";

export const SITE_NAME = "MarkaUI";

export const SITE_TAGLINE = "Premium React Component Library";

export const SITE_DESCRIPTION =
  "MarkaUI is a premium, themeable React component library — 339+ accessible components, 12 luxury themes × light & dark, TypeScript-first, works with Next.js, Vite and plain React.";

export const SOCIAL = {
  /** GitHub account used across footer, JSON-LD and structured data */
  github: "https://github.com/akram6t",
  /** The open-source repository — navbar star button, README badges, GitHub icon links */
  githubRepo: "https://github.com/markaui/markaui",
  /** LinkedIn profile — username akram6t */
  linkedin: "https://www.linkedin.com/in/akram6t",
  npm: "https://www.npmjs.com/package/markaui",
} as const;
