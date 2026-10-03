import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { guardDesk } from "@/lib/desk-auth";
import { clearInterestNotifications, notifyInterestDecision } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const DECIDED = new Set(["accepted", "declined"]);

/**
 * Demo-facing interest lifecycle ("sent" → "seen" → "accepted") derived
 * statelessly from record age — identical rules to /api/interests so both
 * views agree. A manual decision (accepted/declined) always wins.
 */
function displayStatus(record: { status: string; createdAt: Date }): string {
  if (DECIDED.has(record.status)) return record.status;
  const ageMs = Date.now() - record.createdAt.getTime();
  if (ageMs > 1000 * 60 * 5) return "accepted";
  if (ageMs > 1000 * 60) return "seen";
  return "sent";
}

/**
 * GET /api/admin/interests — every interest across all owners (matchmaker
 * desk view), newest first, with aggregate stats.
 */
export async function GET(request: NextRequest) {
  const denied = guardDesk(request);
  if (denied) return denied;

  try {
    const rows = await db.interest.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const interests = rows.map((row) => ({
      id: row.id,
      profileId: row.profileId,
      profileName: row.profileName,
      note: row.note,
      owner: row.owner,
      status: displayStatus(row),
      decided: DECIDED.has(row.status),
      createdAt: row.createdAt.toISOString(),
    }));

    const stats = {
      total: interests.length,
      pending: interests.filter((i) => i.status === "sent" || i.status === "seen").length,
      accepted: interests.filter((i) => i.status === "accepted").length,
      declined: interests.filter((i) => i.status === "declined").length,
    };

    return NextResponse.json({ interests, stats });
  } catch (error) {
    console.error("[api/admin/interests] GET failed", error);
    return NextResponse.json({ error: "Failed to load interests" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/interests — record a matchmaker decision.
 * Body: { id, status: "accepted" | "declined" | "sent" }.
 * "sent" resets the record so the automatic lifecycle resumes.
 */
export async function PATCH(request: NextRequest) {
  const denied = guardDesk(request);
  if (denied) return denied;

  try {
    const body = (await request.json()) as { id?: string; status?: string };

    if (!body.id || !body.status || !["accepted", "declined", "sent"].includes(body.status)) {
      return NextResponse.json(
        { error: "id and a status of accepted | declined | sent are required" },
        { status: 400 }
      );
    }

    const existing = await db.interest.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json({ error: "Interest not found" }, { status: 404 });
    }

    const updated = await db.interest.update({
      where: { id: body.id },
      data: { status: body.status },
    });

    // Notify the member (never guests) about manual decisions; a reset to
    // "sent" clears stale decision notifications so the feed stays truthful.
    if (body.status === "sent") {
      await clearInterestNotifications(updated.id).catch(() => undefined);
    } else {
      await notifyInterestDecision({
        owner: updated.owner,
        type: body.status === "accepted" ? "interest_accepted" : "interest_declined",
        profileName: updated.profileName,
        refId: updated.id,
      }).catch(() => undefined);
    }

    return NextResponse.json({
      interest: {
        id: updated.id,
        profileId: updated.profileId,
        profileName: updated.profileName,
        owner: updated.owner,
        status: displayStatus(updated),
        decided: DECIDED.has(updated.status),
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[api/admin/interests] PATCH failed", error);
    return NextResponse.json({ error: "Failed to update interest" }, { status: 500 });
  }
}
