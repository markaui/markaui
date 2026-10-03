"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { highlightCodeElement } from "@/components/showcase/syntax-highlight";

const USAGE_CODE = `import { MarkaUIProvider, Button, Badge } from "markaui";
import "markaui/theme.css";

export default function App() {
  return (
    <MarkaUIProvider defaultTheme="maroon">
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Button variant="gold" size="lg">
          Get started with MarkaUI
        </Button>
        <Badge variant="soft">Beautifully themeable</Badge>
      </main>
    </MarkaUIProvider>
  );
}`;

const INSTALL_CODE = `# npm
npm install markaui

# pnpm · yarn · bun
pnpm add markaui
yarn add markaui
bun add markaui`;

export function CodeUsage() {
  const usageRef = React.useRef<HTMLElement>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!usageRef.current) return;
    void highlightCodeElement(usageRef.current, USAGE_CODE);
  }, []);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(USAGE_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }, []);

  return (
    <section id="code" aria-labelledby="code-heading" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <Badge variant="gold" className="mb-4 gap-1.5">
            Developer experience
          </Badge>
          <h2
            id="code-heading"
            className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Up and running in one minute
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Install the package, import the theme tokens, wrap your app in the provider.
            That&apos;s the whole setup — for Next.js, Vite or a plain JavaScript app.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
          {/* Install panel */}
          <div className="overflow-hidden rounded-xl border border-border bg-[color-mix(in_srgb,var(--card)_92%,var(--primary))]">
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/50 px-4 py-2">
              <Badge variant="soft" className="text-[10px]">
                Terminal
              </Badge>
            </div>
            <pre className="scrollbar-thin overflow-x-auto px-4 py-3.5 font-mono text-xs leading-relaxed text-foreground/90">
              <code>{INSTALL_CODE}</code>
            </pre>
          </div>

          {/* Usage panel */}
          <div className="overflow-hidden rounded-xl border border-border bg-[color-mix(in_srgb,var(--card)_92%,var(--primary))]">
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/50 px-4 py-2">
              <Badge variant="soft" className="text-[10px]">
                app.tsx
              </Badge>
              <button
                type="button"
                onClick={copy}
                aria-label="Copy usage example"
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
              >
                {copied ? (
                  <Check className="size-3.5 text-success" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="scrollbar-thin max-h-80 overflow-auto px-4 py-3.5 font-mono text-xs leading-relaxed text-foreground/90">
              <code ref={usageRef}>{USAGE_CODE}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
