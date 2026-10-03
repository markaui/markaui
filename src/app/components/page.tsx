import type { Metadata } from "next";

import { DocsShell } from "@/components/showcase/docs-shell";

export const metadata: Metadata = {
  title: "Components — MarkaUI",
  description:
    "Browse 339+ premium, themeable React components across 58 families — buttons, forms, navigation, charts, overlays and more. Live previews, responsive stages, API references.",
  alternates: { canonical: "/components" },
};

export default function ComponentsPage() {
  return <DocsShell />;
}
