"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme/theme-provider";
import { LogoMark } from "./logo";
import { GitHubButton } from "./github-button";

const NAV_LINKS = [
  { href: "/components", label: "Components" },
  { href: "/#themes", label: "Themes" },
  { href: "/#features", label: "Why MarkaUI" },
  { href: "/demo/matrimuni", label: "Live demo" },
];

function ModeToggle() {
  const { mode, setMode } = useTheme();
  const isDark = mode === "dark";
  return (
    <button
      type="button"
      onClick={() => setMode(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-gold/40 hover:text-gold cursor-pointer"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled ? "glass border-border/80 shadow-sm" : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" aria-label="MarkaUI home" className="group flex items-center gap-2.5">
          <LogoMark className="size-9 shadow-md transition-transform group-hover:scale-105 group-hover:rotate-3" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              MarkaUI
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Premium UI
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="ml-8 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <GitHubButton className="hidden sm:flex" />
          <Badge variant="gold" className="hidden text-[10px] lg:inline-flex">
            v1.0.0
          </Badge>
          <ModeToggle />
          <Button
            variant="gold"
            size="sm"
            className="hidden rounded-full gap-1.5 sm:inline-flex"
            asChild
          >
            <Link href="/components">Get Started</Link>
          </Button>
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent md:hidden cursor-pointer"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button variant="gold" className="mt-3 rounded-full gap-1.5" asChild>
                  <Link href="/components" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
                <GitHubButton className="mt-3 w-full justify-center sm:hidden" showLabel />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
