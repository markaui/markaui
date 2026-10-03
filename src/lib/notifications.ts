import { db } from "@/lib/db";

/**
 * Server-side notification helpers (shared by the notifications API and the
 * matchmaker-desk admin API).
 *
 * The interest lifecycle is stateless ("sent" → "seen" → "accepted" derived
 * from record age, manual decisions win) — so "decided" notifications are
 * produced in two places:
 *   1. eagerly, when the matchmaker desk records a decision;
 *   2. lazily, whenever a member reads their notifications (the derived
 *      "accepted" status is synced then).
 * `refId` keeps both paths idempotent: one notification per interest+type.
 */

export type InterestDecisionType = "interest_accepted" | "interest_declined";

/** Insert a decision notification unless one already exists for the ref. */
export async function notifyInterestDecision(input: {
  owner: string;
  type: InterestDecisionType;
  profileName: string;
  refId: string;
}) {
  if (input.owner === "guest") return; // guests have no account to notify

  const existing = await db.notification.findFirst({
    where: { owner: input.owner, type: input.type, refId: input.refId },
  });
  if (existing) return existing;

  const isAccepted = input.type === "interest_accepted";
  return db.notification.create({
    data: {
      owner: input.owner,
      type: input.type,
      title: isAccepted
        ? `${input.profileName} accepted your interest`
        : `${input.profileName} declined your interest`,
      body: isAccepted
        ? "Wonderful news — the matchmaker has connected you. Keep the conversation going from your dashboard."
        : "Every match is a step closer to the right one. Explore more curated profiles today.",
      refId: input.refId,
    },
  });
}

/** Remove decision notifications for an interest (used when a desk reset resumes the lifecycle). */
export async function clearInterestNotifications(refId: string) {
  await db.notification.deleteMany({
    where: { refId, type: { in: ["interest_accepted", "interest_declined"] } },
  });
}
