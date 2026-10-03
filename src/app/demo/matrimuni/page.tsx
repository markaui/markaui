import type { Metadata } from "next";

import { LandingPage } from "@/components/matrimonial/landing-page";

export const metadata: Metadata = {
  title: "Saptapadi — Live MarkaUI Demo",
  description:
    "A complete premium matrimony product built entirely with MarkaUI — auth, discovery, AI concierge, matchmaker desk and checkout. See the library in production action.",
  alternates: { canonical: "/demo/matrimuni" },
};

export default function MatrimuniDemoPage() {
  return <LandingPage />;
}
