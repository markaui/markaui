import Link from "next/link";
import { Gem } from "lucide-react";

import { Separator } from "@/components/ui/separator";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Components", href: "/components" },
      { label: "Theme laboratory", href: "/#themes" },
      { label: "Live demo — Saptapadi", href: "/demo/matrimuni" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Installation", href: "/#code" },
      { label: "Theming guide", href: "/#themes" },
      { label: "npm — markaui", href: "https://www.npmjs.com/package/markaui" },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "Why MarkaUI", href: "/#features" },
      { label: "MIT License", href: "https://opensource.org/licenses/MIT" },
      { label: "Changelog", href: "/components" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-md">
                <Gem className="size-4" aria-hidden />
              </span>
              <span className="font-serif text-lg font-bold tracking-tight text-foreground">
                MarkaUI
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The premium React component library. 339+ accessible components, 12 luxury
              themes, light &amp; dark — one install for every stack.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MarkaUI. Released under the MIT license.</p>
          <p className="flex items-center gap-1.5">
            Built with
            <span className="font-semibold text-foreground">MarkaUI</span>
            <span className="font-mono text-[10px] text-muted-foreground/70">v1.0.0</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
