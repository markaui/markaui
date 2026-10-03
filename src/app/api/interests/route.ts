import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getAuthedMember, ownerKeyForMember } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Demo-facing interest lifecycle: "sent" → "seen" → "accepted", derived
 * statelessly from the record age so the UI feels alive without a worker.
 * A manual decision from the Matchmaker Desk (accepted/declined) always wins.
 */
function displayStatus(record: { status: string; createdAt: Date }): string {
  if (record.status === "accepted" || record.status === "declined") return record.status;
  const ageMs = Date.now() - record.createdAt.getTime();
  if (ageMs > 1000 * 60 * 5) return "accepted";
  if (ageMs > 1000 * 60) return "seen";
  return "sent";
}

/** GET /api/interests — list the visitor's interests (member-scoped or guest). */
export async function GET(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    const owner = ownerKeyForMember(member);

    const interests = await db.interest.findMany({
      where: { owner },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      owner,
      interests: interests.map((i) => ({
        ...i,
        status: displayStatus(i),
      })),
    });
  } catch (error) {
    console.error("[api/interests] GET failed", error);
    return NextResponse.json({ error: "Failed to load interests" }, { status: 500 });
  }
}

/** POST /api/interests — record a "Send Interest" action. Idempotent per profile+owner. */
export async function POST(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    const owner = ownerKeyForMember(member);

    const body = (await request.json()) as {
      profileId?: string;
      profileName?: string;
      note?: string | null;
    };

    if (!body.profileId || !body.profileName) {
      return NextResponse.json(
        { error: "profileId and profileName are required" },
        { status: 400 }
      );
    }

    // Personal note — trimmed, capped at 240 chars, empty string becomes null.
    const rawNote = typeof body.note === "string" ? body.note.trim() : "";
    if (rawNote.length > 240) {
      return NextResponse.json(
        { error: "Your note is limited to 240 characters." },
        { status: 400 }
      );
    }
    const note = rawNote.length > 0 ? rawNote : null;

    const interest = await db.interest.upsert({
      where: { profileId_owner: { profileId: body.profileId, owner } },
      update: { profileName: body.profileName, ...(note !== null ? { note } : {}) },
      create: {
        profileId: body.profileId,
        profileName: body.profileName,
        note,
        owner,
      },
    });

    return NextResponse.json({ interest }, { status: 201 });
  } catch (error) {
    console.error("[api/interests] POST failed", error);
    return NextResponse.json({ error: "Failed to record interest" }, { status: 500 });
  }
}

/** DELETE /api/interests?profileId=… — withdraw one interest (or all when no id given). */
export async function DELETE(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    const owner = ownerKeyForMember(member);
    const profileId = request.nextUrl.searchParams.get("profileId");

    if (profileId) {
      await db.interest.deleteMany({ where: { profileId, owner } });
    } else {
      await db.interest.deleteMany({ where: { owner } });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/interests] DELETE failed", error);
    return NextResponse.json({ error: "Failed to withdraw interest" }, { status: 500 });
  }
}
