import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { ThemeLab } from "@/components/site/theme-lab";
import { Features } from "@/components/site/features";
import { CodeUsage } from "@/components/site/code-usage";
import { StatsBand } from "@/components/site/stats-band";
import { SiteFooter } from "@/components/site/site-footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SITE_VERSION, SOCIAL } from "@/lib/site";

/** Schema.org structured data — helps search engines understand the product */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      sameAs: [SOCIAL.github, SOCIAL.linkedin, SOCIAL.npm],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SOCIAL.emailAddress,
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#library`,
      name: SITE_NAME,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (React 18+)",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      softwareVersion: SITE_VERSION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: { "@id": `${SITE_URL}/#organization` },
      license: "https://opensource.org/licenses/MIT",
      sameAs: [SOCIAL.npm, SOCIAL.github],
    },
  ],
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <StatsBand />
        <ThemeLab />
        <Features />
        <CodeUsage />
      </main>
      <SiteFooter />
    </div>
  );
}
