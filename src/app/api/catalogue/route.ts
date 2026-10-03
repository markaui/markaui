import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { MATRIMONY_PROFILES } from "@/lib/matrimony-data";

export const dynamic = "force-dynamic";

/**
 * Public curation feed — which profiles the matchmaker desk has pinned as
 * "featured" this week. Internal notes are intentionally NOT exposed.
 */
export async function GET() {
  try {
    const curations = await db.profileCuration.findMany({
      where: { OR: [{ featured: true }, { verified: true }] },
    });

    const known = new Set(MATRIMONY_PROFILES.map((p) => p.id));

    return NextResponse.json({
      curation: curations
        .filter((c) => known.has(c.profileId))
        .map((c) => ({
          profileId: c.profileId,
          featured: c.featured,
          verified: c.verified,
        })),
    });
  } catch (error) {
    console.error("[api/catalogue] GET failed", error);
    return NextResponse.json({ curation: [] }, { status: 200 });
  }
}
