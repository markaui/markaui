"use client";

import * as React from "react";
import { ChevronDown, Layers, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CATEGORIES, type ComponentDoc, type FamilyDef } from "./registry";
import { DemoCard } from "./demo-card";
import { PropsTable } from "./props-table";

/* ------------------------------ Member section ------------------------------ */

function MemberSection({
  doc,
  flash,
  onAnchorClick,
}: {
  doc: ComponentDoc;
  flash: boolean;
  onAnchorClick?: () => void;
}) {
  const [apiOpen, setApiOpen] = React.useState(false);

  return (
    <section
      id={`member-${doc.id}`}
      data-member={doc.id}
      aria-labelledby={`member-${doc.id}-heading`}
      className={cn(
        "scroll-mt-6 rounded-2xl border border-transparent p-4 transition-all duration-500 sm:p-6 -mx-4 sm:-mx-6",
        flash && "border-gold/40 bg-gold/[0.04] shadow-[0_0_40px_-18px] shadow-gold/50"
      )}
    >
      {/* Member header */}
      <header className="mb-5 border-b border-border/70 pb-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            id={`member-${doc.id}-heading`}
            className="font-serif text-2xl font-bold tracking-tight text-foreground"
          >
            {doc.name}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">{`<${doc.name} />`}</span>
          {doc.aliases && doc.aliases.length > 0 && (
            <Badge
              variant="outline"
              className="max-w-full min-w-0 whitespace-normal font-normal break-words text-muted-foreground"
            >
              also: {doc.aliases.slice(0, 3).join(", ")}
              {doc.aliases.length > 3 ? ` +${doc.aliases.length - 3}` : ""}
            </Badge>
          )}
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {doc.description}
        </p>
      </header>

      {/* Demos */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {doc.demos.map((demo) => (
          <DemoCard key={demo.id} demo={demo} />
        ))}
      </div>

      {/* Per-member API reference (collapsed by default — family pages are long) */}
      <Collapsible open={apiOpen} onOpenChange={setApiOpen} className="mt-5">
        <CollapsibleTrigger
          className={cn(
            "group flex w-full items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:border-gold/40 hover:bg-muted/70 cursor-pointer",
            apiOpen && "rounded-b-none border-b-0"
          )}
          aria-expanded={apiOpen}
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              apiOpen && "rotate-180"
            )}
          />
          API reference
          <Badge variant="soft" className="ml-auto text-[10px] tabular-nums">
            {doc.props.length} props
          </Badge>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-b-lg border border-border px-4 pb-4 pt-3">
            <PropsTable props={doc.props} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* anchor end marker for chip click without navigation */}
      <button
        type="button"
        data-member-anchor={doc.id}
        onClick={onAnchorClick}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />
    </section>
  );
}

/* -------------------------------- Family view ------------------------------- */

export function FamilyDocView({
  family,
  docs,
  focusMemberId,
  className,
}: {
  family: FamilyDef;
  docs: ComponentDoc[];
  /** member doc id to scroll to + flash highlight on mount */
  focusMemberId?: string | null;
  className?: string;
}) {
  const category = CATEGORIES.find((c) => c.id === family.category);
  const [flashId, setFlashId] = React.useState<string | null>(null);

  // focus a member: scroll + flash
  const focusMember = React.useCallback(
    (memberId: string, behavior: ScrollBehavior = "smooth") => {
      const el = document.getElementById(`member-${memberId}`);
      if (!el) return;
      el.scrollIntoView({ behavior, block: "start" });
      setFlashId(memberId);
      window.setTimeout(() => setFlashId((v) => (v === memberId ? null : v)), 1800);
    },
    []
  );

  React.useEffect(() => {
    if (focusMemberId) {
      // wait a frame so sections are mounted
      const raf = requestAnimationFrame(() => focusMember(focusMemberId, "instant"));
      return () => cancelAnimationFrame(raf);
    }
  }, [focusMemberId, family.id, focusMember]);

  // "On this page" active tracking via IntersectionObserver
  const [activeMember, setActiveMember] = React.useState<string>(docs[0]?.id ?? "");
  React.useEffect(() => {
    if (docs.length <= 1) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.member;
            if (id) setActiveMember(id);
          }
        }
      },
      { rootMargin: "-72px 0px -60% 0px", threshold: 0 }
    );
    const sections = document.querySelectorAll<HTMLElement>("[data-member]");
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [docs.length, family.id]);

  if (docs.length === 0) return null;

  const scrollToMember = (id: string) => {
    const el = document.getElementById(`member-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6", className)}>
      {/* Family header */}
      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="gold" className="gap-1.5">
            <Layers className="size-3" />
            {category?.label ?? family.category}
          </Badge>
          <Badge variant="soft" className="gap-1.5">
            <Users className="size-3" />
            Family · {docs.length} component{docs.length === 1 ? "" : "s"}
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {family.name}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {family.description}
        </p>

        {/* Member anchor chips */}
        <nav aria-label="Components on this page" className="mt-5 -mx-1 overflow-x-auto pb-1">
          <div className="flex w-max items-center gap-1.5 px-1">
            {docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => scrollToMember(doc.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                  activeMember === doc.id
                    ? "border-gold/50 bg-gold/10 text-gold-foreground dark:text-gold"
                    : "border-border bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground"
                )}
              >
                {doc.name}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Body: members + right TOC */}
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
        <div className="min-w-0 space-y-12">
          {docs.map((doc) => (
            <MemberSection key={doc.id} doc={doc} flash={flashId === doc.id} />
          ))}
        </div>

        {/* Right "On this page" rail */}
        {docs.length > 1 && (
          <aside className="hidden xl:block">
            <nav
              aria-label="On this page"
              className="sticky top-6 space-y-0.5 border-l border-border pl-4"
            >
              <p className="pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                On this page
              </p>
              {docs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => scrollToMember(doc.id)}
                  aria-current={activeMember === doc.id ? "true" : undefined}
                  className={cn(
                    "block w-full truncate rounded px-2 py-1 text-left text-xs transition-colors cursor-pointer",
                    activeMember === doc.id
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {doc.name}
                </button>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
