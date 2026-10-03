"use client";

import * as React from "react";
import {
  BadgeCheck,
  Facebook,
  Gem,
  Heart,
  Instagram,
  Lock,
  Send,
  ShieldCheck,
  Twitter,
  Youtube,
} from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Company", links: ["About us", "Careers", "Press", "Contact"] },
  { title: "Explore", links: ["Search profiles", "Communities", "Success stories", "Membership"] },
  { title: "Support", links: ["Help centre", "Safety guide", "Privacy policy", "Terms of use"] },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Youtube, label: "YouTube" },
];

export interface LandingFooterProps {
  /** Opens the internal Matchmaker Desk (demo operations view). */
  onOpenDesk?: () => void;
}

export function LandingFooter({ onOpenDesk }: LandingFooterProps) {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) return;
    setEmail("");
    toast({
      title: "Welcome to the Saptapadi letter 💌",
      description: "Success stories and matchmaking wisdom, monthly — no noise.",
    });
  };

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-md">
                <Gem className="size-4.5" />
              </span>
              <span className="leading-tight">
                <span className="block font-serif text-lg font-bold tracking-tight text-foreground">
                  Saptapadi
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
                  Premium Matrimony
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Seven steps, one forever. India&apos;s most trusted premium matchmaking service for
              families who value tradition and taste.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#top"
                  aria-label={`Saptapadi on ${label}`}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-gold/50 hover:text-gold"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                  {column.title}
                </p>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm text-muted-foreground transition-colors hover:text-gold"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Newsletter */}
        <div className="mb-8 flex flex-col items-start gap-4 rounded-2xl border border-gold/25 bg-gold/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-base font-semibold text-foreground">
              The Saptapadi letter
            </p>
            <p className="text-sm text-muted-foreground">
              Real success stories, matchmaking wisdom and early access to events. Once a
              month, always worth it.
            </p>
          </div>
          <form
            className="flex w-full max-w-sm items-center gap-2"
            onSubmit={subscribe}
            aria-label="Subscribe to the Saptapadi newsletter"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="flex-1 rounded-full bg-background"
              required
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:brightness-110 hover:shadow-md"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>

        {/* Trust strip — payments & security */}
        <div className="mb-8 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card/60 p-5 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
            {[
              { icon: ShieldCheck, label: "256-bit SSL encrypted" },
              { icon: Lock, label: "PCI-DSS secure payments" },
              { icon: BadgeCheck, label: "ISO 27001 certified" },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
              >
                <Icon className="size-3.5 text-gold" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <ul
            className="flex flex-wrap items-center gap-2"
            aria-label="Accepted payment methods"
          >
            {["VISA", "Mastercard", "UPI", "RuPay"].map((method) => (
              <li
                key={method}
                className="rounded-md border border-border bg-background px-2.5 py-1 text-[10px] font-bold tracking-wide text-muted-foreground shadow-sm transition-colors hover:border-gold/40 hover:text-foreground"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>

        <Separator className="mb-8" />

        {/* Ornamental craft line */}
        <div
          aria-hidden="true"
          className="ornament-divider mb-7 w-full justify-center text-gold sm:pr-44"
        >
          <Gem className="size-3" />
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pr-0 text-center sm:flex-row sm:text-left sm:pr-44">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Saptapadi Matrimony Pvt. Ltd. All rights reserved.
          </p>
          <p className="flex items-center gap-4 text-xs text-muted-foreground">
            {onOpenDesk && (
              <button
                type="button"
                onClick={onOpenDesk}
                className="group inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-foreground"
                aria-label="Open the internal Matchmaker Desk"
              >
                <ShieldCheck
                  className="size-3.5 text-muted-foreground transition-colors group-hover:text-gold"
                  aria-hidden="true"
                />
                Matchmaker desk
                <span className="rounded border border-border px-1 py-px text-[9px] uppercase tracking-wider text-muted-foreground/80">
                  Team
                </span>
              </button>
            )}
            <span className="flex items-center gap-1.5">
              Made with <Heart className="size-3 fill-gold text-gold" aria-hidden="true" /> in India
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
