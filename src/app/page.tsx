import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { ThemeLab } from "@/components/site/theme-lab";
import { Features } from "@/components/site/features";
import { CodeUsage } from "@/components/site/code-usage";
import { StatsBand } from "@/components/site/stats-band";
import { SiteFooter } from "@/components/site/site-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
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
