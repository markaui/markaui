import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FamilyDocLoader } from "@/components/showcase/doc-loaders";
import { FAMILIES } from "@/components/showcase/registry/families";
import { familyHref, getFamilySlug, isAdHocFamilySlug } from "@/components/showcase/urls";
import { SITE_NAME } from "@/lib/site";

/**
 * Family page — /components/<family> (e.g. /components/buttons).
 * Statically generated for all 58 families; ad-hoc `doc-<id>` slugs are
 * resolved on demand (dynamicParams) by the client loader.
 */
export function generateStaticParams() {
  return FAMILIES.map((f) => ({ family: f.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ family: string }>;
}): Promise<Metadata> {
  const { family } = await params;
  const def = getFamilySlug(family);
  if (!def) return {};
  const title = `${def.name} — ${SITE_NAME} Components`;
  const description = `${def.description} Live preview, responsive device stages, copyable TSX code and full API reference.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: familyHref(def.id) },
    openGraph: { title, description, url: familyHref(def.id) },
  };
}

export default async function FamilyPage({
  params,
  searchParams,
}: {
  params: Promise<{ family: string }>;
  searchParams: Promise<{ m?: string }>;
}) {
  const [{ family }, { m }] = await Promise.all([params, searchParams]);
  const def = getFamilySlug(family);
  // real family slugs are known server-side; ad-hoc doc-<id> slugs are
  // resolved (or 404'd) by the client loader which has the full registry
  if (!def && !isAdHocFamilySlug(family)) notFound();

  // BreadcrumbList JSON-LD — Home › Components › <Family>
  const jsonLd = def
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "/" },
          { "@type": "ListItem", position: 2, name: "Components", item: "/components" },
          {
            "@type": "ListItem",
            position: 3,
            name: def.name,
            item: familyHref(def.id),
          },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <FamilyDocLoader familyId={family} memberId={typeof m === "string" ? m : null} />
    </>
  );
}
