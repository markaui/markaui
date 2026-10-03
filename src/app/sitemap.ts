import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { FAMILIES } from "@/components/showcase/registry/families";
import { GUIDES } from "@/components/showcase/guides-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/components`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // every family page is a real, indexable route
    ...FAMILIES.map((f) => ({
      url: `${SITE_URL}/components/${f.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // usage guides
    ...GUIDES.map((g) => ({
      url: `${SITE_URL}/components/guides/${g.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE_URL}/demo/matrimuni`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
