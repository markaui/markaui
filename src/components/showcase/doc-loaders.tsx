"use client";

import * as React from "react";
import { Suspense } from "react";
import { notFound, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { FamilyDocView } from "./component-doc";
import { GuideDocView } from "./guide-doc";
import { getGuide } from "./guides-data";
import { ALIAS_TO_REAL, FAMILIES, getFamily, getFamilyForDoc, getFamilyMembers } from "./registry";
import type { ComponentDoc } from "./registry/types";
import { familyHref, guideHref } from "./urls";

/**
 * Client bridges between the server-rendered route pages and the client-side
 * doc views. The registry cannot cross the server/client boundary (demo
 * `render()` functions are not serializable), so pages pass ids and the
 * loaders resolve the data on the client — exactly what the old single-page
 * shell did, now per-route.
 */

/** Full slug resolution incl. ad-hoc `doc-<id>` families (client-side only). */
function resolveFamilyId(id: string) {
  if (id.startsWith("doc-")) return getFamilyForDoc(id.slice(4));
  return getFamily(id);
}

/**
 * `?m=` member deep link. Reads the query param client-side (inside its own
 * Suspense boundary so the family page stays fully static) and feeds the
 * resolved member id up to FamilyDocView's scroll+flash effect. Accepts both
 * real and alias member ids.
 */
function MemberDeepLink({
  docs,
  onChange,
}: {
  docs: ComponentDoc[];
  onChange: (memberId: string | null) => void;
}) {
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const raw = searchParams.get("m");
    if (!raw) {
      onChange(null);
      return;
    }
    const realMember = ALIAS_TO_REAL[raw] ?? raw;
    onChange(docs.some((d) => d.id === realMember) ? realMember : null);
  }, [searchParams, docs, onChange]);
  return null;
}

export function FamilyDocLoader({
  familyId,
}: {
  familyId: string;
}) {
  const router = useRouter();
  const family = resolveFamilyId(familyId);
  if (!family) notFound();

  const docs = getFamilyMembers(family);

  // `?m=` deep link target, resolved client-side (see MemberDeepLink)
  const [focusMemberId, setFocusMemberId] = React.useState<string | null>(null);
  const onFocusMember = React.useCallback(
    (id: string | null) => setFocusMemberId(id),
    []
  );

  const index = FAMILIES.findIndex((f) => f.id === family.id);
  const prevFamily = index > 0 ? FAMILIES[index - 1] : null;
  const nextFamily = index >= 0 && index < FAMILIES.length - 1 ? FAMILIES[index + 1] : null;

  return (
    <>
      <FamilyDocView
        key={family.id}
        family={family}
        docs={docs}
        focusMemberId={focusMemberId}
      />

      {/* `?m=` resolution — isolated Suspense boundary keeps the page static */}
      <Suspense fallback={null}>
        <MemberDeepLink docs={docs} onChange={onFocusMember} />
      </Suspense>

      {/* Prev / Next family */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-4 pb-16 sm:px-6">
        {prevFamily ? (
          <button
            onClick={() => router.push(familyHref(prevFamily.id))}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-gold/40 hover:shadow-md cursor-pointer"
          >
            <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                Previous family
              </span>
              <span className="block truncate text-sm font-medium text-foreground">
                {prevFamily.name}
              </span>
            </span>
          </button>
        ) : (
          <span />
        )}
        {nextFamily ? (
          <button
            onClick={() => router.push(familyHref(nextFamily.id))}
            className="group flex items-center justify-end gap-3 rounded-xl border border-border bg-card p-4 text-right transition-all hover:border-gold/40 hover:shadow-md cursor-pointer"
          >
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">
                Next family
              </span>
              <span className="block truncate text-sm font-medium text-foreground">
                {nextFamily.name}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : (
          <span />
        )}
      </div>
    </>
  );
}

export function GuideDocLoader({ guideId }: { guideId: string }) {
  const router = useRouter();
  const guide = getGuide(guideId);
  if (!guide) notFound();

  return (
    <GuideDocView guide={guide} onSelectGuide={(id) => router.push(guideHref(id))} />
  );
}
