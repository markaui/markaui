import { FAMILIES } from "./registry/families";
import type { FamilyDef } from "./registry/types";

/**
 * Canonical URL builders for the docs section. Every navigation (sidebar,
 * command palette, prev/next pagers, index cards) and every canonical/OG tag
 * flows through these helpers so the URL scheme stays consistent.
 *
 * URL scheme:
 *   /components                    → index directory
 *   /components/<family>           → family page (e.g. /components/buttons)
 *   /components/<family>?m=<doc>   → family page scrolled to a member
 *   /components/guides/<guide>     → usage guide (e.g. /components/guides/theming)
 *
 * NOTE: this module is imported by server components (route pages, metadata,
 * sitemap) — it must only depend on pure data (registry/families), never on
 * the full registry index whose demo files pull client-only libraries.
 */

export function familyHref(familyId: string, memberId?: string | null): string {
  return memberId ? `/components/${familyId}?m=${memberId}` : `/components/${familyId}`;
}

export function guideHref(guideId: string): string {
  return `/components/guides/${guideId}`;
}

/** Resolve a real (58-family) route slug. Server-safe. */
export function getFamilySlug(slug: string): FamilyDef | undefined {
  return FAMILIES.find((f) => f.id === slug);
}

/**
 * The registry can also synthesize ad-hoc single-member families
 * (`doc-<docId>`) for docs not attached to a family — reachable via the
 * command palette and search. Those slugs cannot be validated on the server
 * (they need the full registry), so pages accept the prefix and let the
 * client loader resolve or 404.
 */
export function isAdHocFamilySlug(slug: string): boolean {
  return slug.startsWith("doc-");
}
