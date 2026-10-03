"use client";

import * as React from "react";
import { Check, ChevronDown, Code2, Copy, Monitor, Smartphone, Tablet } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { highlightCodeElement } from "./syntax-highlight";
import type { DemoDef } from "./registry/types";

type StageWidth = "full" | "tablet" | "mobile";

const STAGE_PX: Record<Exclude<StageWidth, "full">, number> = { tablet: 768, mobile: 390 };
const STAGE_LABEL: Record<StageWidth, string> = {
  full: "Full width",
  tablet: "768 px",
  mobile: "390 px",
};

function StageToggle({
  value,
  onChange,
}: {
  value: StageWidth;
  onChange: (v: StageWidth) => void;
}) {
  const items: { id: StageWidth; icon: React.ReactNode; label: string }[] = [
    { id: "full", icon: <Monitor className="size-3.5" />, label: "Desktop preview" },
    { id: "tablet", icon: <Tablet className="size-3.5" />, label: "Tablet preview (768px)" },
    { id: "mobile", icon: <Smartphone className="size-3.5" />, label: "Mobile preview (390px)" },
  ];
  return (
    <div
      role="group"
      aria-label="Preview width"
      className="flex items-center rounded-full border border-border bg-muted/60 p-0.5"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-pressed={value === item.id}
          aria-label={item.label}
          title={item.label}
          className={cn(
            "flex size-6 items-center justify-center rounded-full transition-all cursor-pointer",
            value === item.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.icon}
        </button>
      ))}
      <span className="pr-2 pl-1 text-[10px] tabular-nums text-muted-foreground">
        {STAGE_LABEL[value]}
      </span>
    </div>
  );
}

export function DemoCard({ demo }: { demo: DemoDef }) {
  const [showCode, setShowCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [stage, setStage] = React.useState<StageWidth>("full");
  const constrained = demo.responsive && stage !== "full";
  const codeRef = React.useRef<HTMLElement>(null);

  // CDN syntax highlighting (Prism + tsx) — applied once the code panel is
  // opened; falls back to the existing plain-text render if the CDN is down.
  React.useEffect(() => {
    if (!showCode) return;
    const el = codeRef.current;
    if (!el) return;
    void highlightCodeElement(el, demo.code);
  }, [showCode, demo.code]);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(demo.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }, [demo.code]);

  return (
    <div
      data-slot="demo-card"
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md",
        (demo.wide || demo.responsive) && "md:col-span-2"
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{demo.title}</p>
          {demo.description && (
            <p className="truncate text-xs text-muted-foreground">{demo.description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {demo.responsive && (
            <div className="mr-1 hidden sm:block">
              <StageToggle value={stage} onChange={setStage} />
            </div>
          )}
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={copied ? "Copied" : "Copy code"}
            onClick={copy}
          >
            {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
          </IconButton>
          <IconButton
            variant={showCode ? "default" : "ghost"}
            size="sm"
            aria-label={showCode ? "Hide code" : "Show code"}
            aria-expanded={showCode}
            onClick={() => setShowCode((v) => !v)}
          >
            <Code2 className="size-4" />
          </IconButton>
        </div>
      </div>

      {demo.responsive && (
        <div className="border-b border-border/70 px-4 py-1.5 sm:hidden">
          <StageToggle value={stage} onChange={setStage} />
        </div>
      )}

      <div
        className={cn(
          "relative flex min-h-32 items-center justify-center px-4 py-8 sm:px-6",
          demo.responsive
            ? "@container bg-[radial-gradient(circle,color-mix(in_srgb,var(--border)_55%,transparent)_1px,transparent_1px)] [background-size:18px_18px] sm:px-8"
            : "bg-[radial-gradient(circle,color-mix(in_srgb,var(--border)_55%,transparent)_1px,transparent_1px)] [background-size:18px_18px]"
        )}
      >
        {demo.responsive ? (
          <div className="flex w-full justify-center overflow-x-auto scrollbar-thin py-1">
            <div
              data-slot="demo-stage"
              data-stage={stage}
              style={constrained ? { width: STAGE_PX[stage] } : undefined}
              className={cn(
                "w-full max-w-full origin-top overflow-hidden bg-background transition-[width,box-shadow] duration-500 ease-out",
                constrained
                  ? "rounded-xl border border-border shadow-lg ring-1 ring-black/5"
                  : "rounded-md"
              )}
            >
              {demo.render()}
            </div>
          </div>
        ) : (
          demo.render()
        )}
      </div>

      {showCode && (
        <div className="border-t border-border/70">
          <div className="flex items-center justify-between bg-muted/50 px-4 py-1.5">
            <Badge variant="soft" className="text-[10px]">
              TSX
            </Badge>
            <button
              onClick={() => setShowCode(false)}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              Hide <ChevronDown className="size-3" />
            </button>
          </div>
          <pre className="max-h-96 overflow-auto scrollbar-thin bg-[color-mix(in_srgb,var(--card)_92%,var(--primary))] px-4 py-3 font-mono text-xs leading-relaxed text-foreground/90">
            <code ref={codeRef}>{demo.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
