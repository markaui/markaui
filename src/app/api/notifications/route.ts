import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getAuthedMember, ownerKeyForMember, SESSION_COOKIE } from "@/lib/auth";
import { notifyInterestDecision } from "@/lib/notifications";
import { MATRIMONY_PROFILES } from "@/lib/matrimony-data";

export const dynamic = "force-dynamic";

/**
 * Demo-facing interest lifecycle — identical rules to /api/interests so the
 * notification sync agrees with what the member sees.
 */
function displayStatus(record: { status: string; createdAt: Date }): string {
  if (record.status === "accepted" || record.status === "declined") return record.status;
  const ageMs = Date.now() - record.createdAt.getTime();
  if (ageMs > 1000 * 60 * 5) return "accepted";
  if (ageMs > 1000 * 60) return "seen";
  return "sent";
}

/**
 * Daily match digest — created at most once per 24h per member. Copy is
 * derived deterministically from the catalogue and the member's city so the
 * row always feels personal without extra state.
 */
async function ensureDailyDigest(owner: string, member: { city: string | null }) {
  const dayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const recent = await db.notification.findFirst({
    where: { owner, type: "match_digest", createdAt: { gte: dayAgo } },
    select: { id: true },
  });
  if (recent) return;

  const inCity = member.city
    ? MATRIMONY_PROFILES.filter(
        (p) => p.city.toLowerCase() === member.city!.toLowerCase()
      ).length
    : 0;

  const title = "Your daily match digest is ready ✨";
  const body = member.city
    ? inCity > 0
      ? `${inCity} handpicked ${inCity === 1 ? "profile matches" : "profiles match"} ${member.city} — and fresh faces joined this week.`
      : `Fresh faces joined this week. Broaden your city to see ${MATRIMONY_PROFILES.length} curated profiles.`
    : `Add your city to unlock ${MATRIMONY_PROFILES.length} curated profiles near you.`;

  await db.notification.create({
    data: { owner, type: "match_digest", title, body, refId: `digest:${new Date().toISOString().slice(0, 10)}` },
  });
}

/**
 * GET /api/notifications — the signed-in member's notification feed.
 *
 * Before reading, lazily syncs the interest lifecycle: any interest whose
 * derived status became "accepted" (the automatic 5-minute demo promotion)
 * gets an "accepted" notification exactly once, and the daily match digest
 * is topped up at most once per day. Manual decisions are notified by the
 * matchmaker desk when they happen. Guests get 401.
 */
export async function GET(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    if (!member) {
      return NextResponse.json(
        { error: "Sign in to see your notifications." },
        { status: 401 }
      );
    }
    const owner = ownerKeyForMember(member);

    // Lazy sync — promote derived "accepted" interests into notifications.
    try {
      const pending = await db.interest.findMany({
        where: { owner, status: { notIn: ["accepted", "declined"] } },
        take: 100,
      });
      await Promise.all(
        pending
          .filter((row) => displayStatus(row) === "accepted")
          .map((row) =>
            notifyInterestDecision({
              owner,
              type: "interest_accepted",
              profileName: row.profileName,
              refId: row.id,
            })
          )
      );
    } catch (syncError) {
      // The feed is still valuable if the sync fails — log and continue.
      console.error("[api/notifications] interest sync failed", syncError);
    }

    // Daily match digest — top up the feed once per day (best effort).
    try {
      await ensureDailyDigest(owner, member);
    } catch (digestError) {
      console.error("[api/notifications] digest failed", digestError);
    }

    const [records, unread] = await Promise.all([
      db.notification.findMany({
        where: { owner },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.notification.count({ where: { owner, read: false } }),
    ]);

    return NextResponse.json({
      owner,
      unread,
      notifications: records.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        read: n.read,
        refId: n.refId,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[api/notifications] GET failed", error);
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications — mark notifications as read.
 * Body: { id } to mark one, or { all: true } to mark everything.
 */
export async function PATCH(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    if (!member) {
      return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    }
    const owner = ownerKeyForMember(member);
    const body = (await request.json()) as { id?: string; all?: boolean };

    if (body.all) {
      await db.notification.updateMany({ where: { owner, read: false }, data: { read: true } });
    } else if (body.id) {
      await db.notification.updateMany({ where: { owner, id: body.id }, data: { read: true } });
    } else {
      return NextResponse.json({ error: "Provide an id or all:true." }, { status: 400 });
    }

    const unread = await db.notification.count({ where: { owner, read: false } });
    return NextResponse.json({ ok: true, unread });
  } catch (error) {
    console.error("[api/notifications] PATCH failed", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications — remove notifications.
 * Query: ?id=… to remove one, or ?all=1 to clear the feed.
 */
export async function DELETE(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    if (!member) {
      return NextResponse.json({ error: "Sign in first." }, { status: 401 });
    }
    const owner = ownerKeyForMember(member);
    const id = request.nextUrl.searchParams.get("id");
    const all = request.nextUrl.searchParams.get("all");

    if (all) {
      await db.notification.deleteMany({ where: { owner } });
    } else if (id) {
      await db.notification.deleteMany({ where: { owner, id } });
    } else {
      return NextResponse.json({ error: "Provide ?id= or ?all=1." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/notifications] DELETE failed", error);
    return NextResponse.json({ error: "Failed to remove notifications" }, { status: 500 });
  }
}
