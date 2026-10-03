"use client";

import * as React from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Info, Lightbulb, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { highlightCodeElement } from "./syntax-highlight";
import { GUIDES, type GuideCode, type GuideDef, type GuideSection } from "./guides-data";

/* ------------------------------------------------------------------ */
/*  Syntax-highlighted code block (same Prism pipeline as demo cards)  */
/* ------------------------------------------------------------------ */
function GuideCodeBlock({ code }: { code: GuideCode }) {
  const codeRef = React.useRef<HTMLElement>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    void highlightCodeElement(el, code.code);
  }, [code.code]);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }, [code.code]);

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-muted/50 px-4 py-1.5">
        <Badge variant="soft" className="text-[10px] uppercase">
          {code.label ?? code.language}
        </Badge>
        <button
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-success" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="max-h-96 overflow-auto scrollbar-thin bg-[color-mix(in_srgb,var(--card)_92%,var(--primary))] px-4 py-3 font-mono text-xs leading-relaxed text-foreground/90">
        <code ref={codeRef}>{code.code}</code>
      </pre>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Callouts                                                           */
/* ------------------------------------------------------------------ */
const CALLOUT_STYLES = {
  tip: {
    icon: Lightbulb,
    box: "border-gold/40 bg-gold/10",
    iconBox: "bg-gold/20 text-gold-foreground dark:text-gold",
  },
  note: {
    icon: Info,
    box: "border-primary/30 bg-primary/5",
    iconBox: "bg-primary/15 text-primary",
  },
  warning: {
    icon: TriangleAlert,
    box: "border-destructive/40 bg-destructive/10",
    iconBox: "bg-destructive/15 text-destructive",
  },
} as const;

function GuideCallout({ callout }: { callout: NonNullable<GuideSection["callout"]> }) {
  const styles = CALLOUT_STYLES[callout.variant];
  const Icon = styles.icon;
  return (
    <aside className={cn("flex gap-3 rounded-xl border p-4", styles.box)}>
      <span
        className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", styles.iconBox)}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{callout.title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{callout.body}</p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Section body                                                       */
/* ------------------------------------------------------------------ */
function GuideSectionView({ section }: { section: GuideSection }) {
  return (
    <section id={section.id} className="scroll-mt-20 space-y-4">
      <h2 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {section.heading}
      </h2>
      {section.body?.map((p, i) => (
        <p key={i} className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {p}
        </p>
      ))}
      {section.list && (
        <ul className="max-w-3xl space-y-1.5">
          {section.list.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      )}
      {section.code &&
        (Array.isArray(section.code) ? section.code : [section.code]).map((c, i) => (
          <GuideCodeBlock key={i} code={c} />
        ))}
      {section.table && (
        <div className="max-w-3xl overflow-x-auto scrollbar-thin rounded-xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {section.table.headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left font-semibold text-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border/60 last:border-0">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={cn(
                        "px-4 py-2.5",
                        ci === 0 ? "font-mono text-xs text-primary" : "text-muted-foreground"
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {section.callout && <GuideCallout callout={section.callout} />}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Full guide page                                                    */
/* ------------------------------------------------------------------ */
export function GuideDocView({
  guide,
  onSelectGuide,
}: {
  guide: GuideDef;
  onSelectGuide: (guideId: string) => void;
}) {
  const index = GUIDES.findIndex((g) => g.id === guide.id);
  const prev = index > 0 ? GUIDES[index - 1] : null;
  const next = index >= 0 && index < GUIDES.length - 1 ? GUIDES[index + 1] : null;
  const Icon = guide.icon;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* header */}
      <header className="space-y-4 border-b border-border pb-8">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--primary),var(--gold))] text-primary-foreground shadow-md">
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold" className="gap-1">
              Guide
            </Badge>
            <Badge variant="soft">{guide.readingTime} read</Badge>
            <Badge variant="soft">
              {GUIDES.findIndex((g) => g.id === guide.id) + 1} / {GUIDES.length}
            </Badge>
          </div>
        </div>
        <div>
          <h1 className="font-serif text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {guide.description}
          </p>
        </div>
      </header>

      <div className="mt-8 flex gap-10">
        {/* sections */}
        <div className="min-w-0 flex-1 space-y-10">
          {guide.sections.map((section) => (
            <GuideSectionView key={section.id} section={section} />
          ))}

          {/* prev / next guide */}
          <div className="grid grid-cols-2 gap-3 border-t border-border pt-8">
            {prev ? (
              <button
                onClick={() => onSelectGuide(prev.id)}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-gold/40 hover:shadow-md cursor-pointer"
              >
                <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                    Previous guide
                  </span>
                  <span className="block truncate text-sm font-medium text-foreground">
                    {prev.shortTitle}
                  </span>
                </span>
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button
                onClick={() => onSelectGuide(next.id)}
                className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-card p-4 text-right transition-all hover:border-gold/40 hover:shadow-md cursor-pointer"
              >
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                    Next guide
                  </span>
                  <span className="block truncate text-sm font-medium text-foreground">
                    {next.shortTitle}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <span />
            )}
          </div>
        </div>

        {/* on this page */}
        <aside className="sticky top-6 hidden h-fit w-52 shrink-0 xl:block" aria-label="On this page">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            On this page
          </p>
          <nav className="space-y-1 border-l border-border">
            {guide.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="-ml-px block border-l-2 border-transparent pl-3 text-xs leading-relaxed text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
              >
                {s.heading}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
