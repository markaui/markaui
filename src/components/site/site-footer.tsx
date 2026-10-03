import Link from "next/link";
import { ArrowUpRight, Gem, Github, Linkedin } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SOCIAL } from "@/lib/site";

const COLUMNS: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
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
      { label: "Installation guide", href: "/components?guide=installation" },
      { label: "Theming & colors", href: "/components?guide=theming" },
      { label: "Dark mode", href: "/components?guide=dark-mode" },
      { label: "npm — markaui", href: SOCIAL.npm, external: true },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "Why MarkaUI", href: "/#features" },
      { label: "MIT License", href: "https://opensource.org/licenses/MIT", external: true },
      { label: "Changelog", href: "/components" },
    ],
  },
];

/** Contact cards — usernames stay in the href, never rendered as text */
const CONNECT = [
  {
    label: "GitHub",
    hint: "Star the repo, file issues & contribute",
    href: SOCIAL.github,
    icon: Github,
  },
  {
    label: "LinkedIn",
    hint: "Connect with the team & follow updates",
    href: SOCIAL.linkedin,
    icon: Linkedin,
  },
] as const;

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
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          ))}
        </div>

        {/* Connect with us — opens in a new tab, no usernames displayed */}
        <div className="mt-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Connect with us
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CONNECT.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} (opens in a new tab)`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-gold/50 hover:shadow-md"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.hint}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                    aria-hidden
                  />
                </a>
              );
            })}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MarkaUI. Released under the MIT license.</p>
          <p className="flex items-center gap-1.5">
            Built with
            <span className="font-semibold text-foreground">MarkaUI</span>
            <span className="font-mono text-[10px] text-muted-foreground/70">v1.0.1</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
