"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";

export function InstallCommand({ command = "npm install markaui" }: { command?: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }, [command]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy install command: ${command}`}
      className="group mx-auto flex items-center gap-3 rounded-full border border-border bg-card/80 py-2 pl-4 pr-2 font-mono text-sm text-foreground/90 shadow-sm backdrop-blur transition-all hover:border-gold/50 hover:shadow-md cursor-pointer"
    >
      <Terminal className="size-3.5 shrink-0 text-gold" aria-hidden />
      <span className="truncate">
        <span className="text-muted-foreground">$ </span>
        {command}
      </span>
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:border-gold/40 group-hover:text-gold"
      >
        {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
      </span>
      <span className="sr-only" role="status">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
