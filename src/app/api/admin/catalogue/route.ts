import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { guardDesk } from "@/lib/desk-auth";
import { MATRIMONY_PROFILES } from "@/lib/matrimony-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/catalogue — the full profile catalogue with matchmaker
 * curation (featured pin, verified override, internal note) plus a per-profile
 * interest count. Desk-gated.
 */
export async function GET(request: NextRequest) {
  const denied = guardDesk(request);
  if (denied) return denied;

  try {
    const [curations, interests] = await Promise.all([
      db.profileCuration.findMany(),
      db.interest.groupBy({ by: ["profileId"], _count: { _all: true } }),
    ]);

    const byProfile = new Map(curations.map((c) => [c.profileId, c]));
    const interestCounts = new Map(interests.map((i) => [i.profileId, i._count._all]));

    const catalogue = MATRIMONY_PROFILES.map((profile) => {
      const curation = byProfile.get(profile.id);
      return {
        profileId: profile.id,
        name: profile.name,
        city: profile.city,
        profession: profile.profession,
        age: profile.age,
        image: profile.image,
        baseVerified: profile.verified,
        premium: profile.premium,
        interestCount: interestCounts.get(profile.id) ?? 0,
        featured: curation?.featured ?? false,
        verified: curation?.verified ?? false,
        note: curation?.note ?? "",
        updatedAt: curation?.updatedAt.toISOString() ?? null,
      };
    });

    return NextResponse.json({ catalogue });
  } catch (error) {
    console.error("[api/admin/catalogue] GET failed", error);
    return NextResponse.json({ error: "Failed to load the catalogue" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/catalogue — upsert curation for one profile.
 * Body: { profileId, featured?, verified?, note? }.
 */
export async function PATCH(request: NextRequest) {
  const denied = guardDesk(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as {
      profileId?: string;
      featured?: boolean;
      verified?: boolean;
      note?: string;
    };

    if (!body.profileId || !MATRIMONY_PROFILES.some((p) => p.id === body.profileId)) {
      return NextResponse.json({ error: "A known profileId is required." }, { status: 400 });
    }
    if (body.note !== undefined && body.note.length > 280) {
      return NextResponse.json({ error: "Notes are limited to 280 characters." }, { status: 400 });
    }

    const updated = await db.profileCuration.upsert({
      where: { profileId: body.profileId },
      create: {
        profileId: body.profileId,
        featured: body.featured ?? false,
        verified: body.verified ?? false,
        note: body.note ?? "",
      },
      update: {
        ...(body.featured !== undefined ? { featured: body.featured } : {}),
        ...(body.verified !== undefined ? { verified: body.verified } : {}),
        ...(body.note !== undefined ? { note: body.note } : {}),
      },
    });

    return NextResponse.json({
      curation: {
        profileId: updated.profileId,
        featured: updated.featured,
        verified: updated.verified,
        note: updated.note,
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[api/admin/catalogue] PATCH failed", error);
    return NextResponse.json({ error: "Failed to save the curation" }, { status: 500 });
  }
}
