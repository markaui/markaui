/**
 * Central site configuration — single source of truth for SEO URLs and brand
 * metadata. Update SITE_URL when the production domain goes live; every
 * canonical, sitemap entry, OG tag and JSON-LD block reads from here.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://markaui.vercel.app";

/*
 * To move the site to a custom domain, set NEXT_PUBLIC_SITE_URL in the Vercel
 * project environment variables (e.g. https://markaui.com) -- no code change
 * needed. Do NOT derive this from VERCEL_PROJECT_PRODUCTION_URL: that resolves to
 * the Vercel *project* name (`markaui-website.vercel.app`), which is not the
 * canonical host and would silently rewrite every canonical tag, og:url and
 * sitemap URL to the wrong origin.
 */

export const SITE_NAME = "MarkaUI";

/**
 * Single source of truth for the advertised library version.
 *
 * Keep in sync with `packages/markaui/package.json` -> "version".
 * Previously hardcoded in six places with three different values
 * (v1.0.0 in the hero + header, v2.1 in the docs shell, v1.0.1 in the
 * footer), all contradicting the published npm version on the very page a
 * prospective user lands on.
 */
export const SITE_VERSION = "1.0.1";

/** Prefixed form for UI badges and eyebrow pills. */
export const SITE_VERSION_LABEL = `v${SITE_VERSION}`;

export const SITE_TAGLINE = "Premium React Component Library";

export const SITE_DESCRIPTION =
  "MarkaUI is a premium, themeable React component library — 339+ accessible components, 12 luxury themes × light & dark, TypeScript-first, works with Next.js, Vite and plain React.";

export const SOCIAL = {
  /**
   * GitHub account used across footer, JSON-LD and structured data.
   *
   * NOTE: the organisation that hosts the open-source project is `markaui`
   * (see `githubRepo` below). Structured data previously pointed `sameAs` at
   * the personal account while every UI link pointed at the organisation, so
   * search engines saw two different "official" repos. This is now the org URL
   * so JSON-LD, footer and navbar agree.
   */
  github: "https://github.com/markaui",
  /** The open-source repository — navbar star button, README badges, GitHub icon links */
  githubRepo: "https://github.com/markaui/markaui",
  /** LinkedIn profile — username akram6t */
  linkedin: "https://www.linkedin.com/in/akram6t",
  npm: "https://www.npmjs.com/package/markaui",
  /** Contact email — footer connect cards, JSON-LD contactPoint */
  emailAddress: "developeruniqe@gmail.com",
  email: "mailto:developeruniqe@gmail.com",
} as const;
