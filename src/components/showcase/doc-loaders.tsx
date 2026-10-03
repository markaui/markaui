"use client";

import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { FamilyDocView } from "./component-doc";
import { GuideDocView } from "./guide-doc";
import { getGuide } from "./guides-data";
import { ALIAS_TO_REAL, FAMILIES, getFamily, getFamilyForDoc, getFamilyMembers } from "./registry";
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

export function FamilyDocLoader({
  familyId,
  memberId,
}: {
  familyId: string;
  /** optional `?m=` deep link — scroll to + flash this member on mount */
  memberId?: string | null;
}) {
  const router = useRouter();
  const family = resolveFamilyId(familyId);
  if (!family) notFound();

  const docs = getFamilyMembers(family);

  // accept both real and alias member ids in the deep link
  const realMember = memberId ? (ALIAS_TO_REAL[memberId] ?? memberId) : null;
  const member = realMember && docs.some((d) => d.id === realMember) ? realMember : null;

  const index = FAMILIES.findIndex((f) => f.id === family.id);
  const prevFamily = index > 0 ? FAMILIES[index - 1] : null;
  const nextFamily = index >= 0 && index < FAMILIES.length - 1 ? FAMILIES[index + 1] : null;

  return (
    <>
      <FamilyDocView
        key={family.id}
        family={family}
        docs={docs}
        focusMemberId={member}
      />

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
