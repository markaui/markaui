import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ComponentsIndex } from "@/components/showcase/components-index";
import { getGuide } from "@/components/showcase/guides-data";
import { guideHref } from "@/components/showcase/urls";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Browse 339+ premium, themeable React components across 58 families — buttons, forms, navigation, charts, overlays and more. Live previews, responsive stages, API references and usage guides.",
  alternates: { canonical: "/components" },
  openGraph: {
    title: "MarkaUI Components — 339+ React components in 58 families",
    description:
      "Live previews, responsive device stages, copyable code and full API references for every MarkaUI component.",
    url: "/components",
  },
};

export default async function ComponentsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ guide?: string }>;
}) {
  const { guide } = await searchParams;
  // legacy deep links (/components?guide=theming) → real guide routes
  if (guide && getGuide(guide)) redirect(guideHref(guide));
  return <ComponentsIndex />;
}
