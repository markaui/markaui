import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideDocLoader } from "@/components/showcase/doc-loaders";
import { GUIDES, getGuide } from "@/components/showcase/guides-data";
import { guideHref } from "@/components/showcase/urls";
import { SITE_NAME } from "@/lib/site";

/**
 * Usage guide page — /components/guides/<guide>
 * (e.g. /components/guides/theming). Statically generated for all guides.
 */
export function generateStaticParams() {
  return GUIDES.map((g) => ({ guide: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guide: string }>;
}): Promise<Metadata> {
  const { guide } = await params;
  const def = getGuide(guide);
  if (!def) return {};
  const title = `${def.title} — ${SITE_NAME} Guide`;
  return {
    title: { absolute: title },
    description: def.description,
    alternates: { canonical: guideHref(def.id) },
    openGraph: { title, description: def.description, url: guideHref(def.id) },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ guide: string }>;
}) {
  const { guide } = await params;
  const def = getGuide(guide);
  if (!def) notFound();

  // BreadcrumbList JSON-LD — Home › Guides › <Guide>
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Components", item: "/components" },
      { "@type": "ListItem", position: 3, name: def.title, item: guideHref(def.id) },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuideDocLoader guideId={def.id} />
    </>
  );
}
