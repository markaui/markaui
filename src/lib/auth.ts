import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { db } from "@/lib/db";

/**
 * Auth-lite session helpers (server-only).
 *
 * Sessions are stateless: an HMAC-signed `memberId.expiry` token stored in an
 * httpOnly cookie. Passwords are hashed with scrypt (salt embedded in the
 * digest) so no extra dependency is required.
 */

export const SESSION_COOKIE = "saptapadi_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  return process.env.AUTH_SECRET ?? "saptapadi-dev-secret-fallback";
}

/* ------------------------------- passwords ------------------------------- */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const digest = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${digest}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/* -------------------------------- sessions ------------------------------- */

export function createSessionToken(memberId: string): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${memberId}.${expires}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [memberId, expires, sig] = parts;
  const payload = `${memberId}.${expires}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) < Date.now()) return null;
  return memberId;
}

export interface PublicMember {
  id: string;
  name: string;
  email: string;
  city: string | null;
  profession: string | null;
  height: string | null;
  about: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export function toPublicMember(member: {
  id: string;
  name: string;
  email: string;
  city: string | null;
  profession?: string | null;
  height?: string | null;
  about?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
}): PublicMember {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    city: member.city,
    profession: member.profession ?? null,
    height: member.height ?? null,
    about: member.about ?? null,
    avatarUrl: member.avatarUrl ?? null,
    createdAt: member.createdAt.toISOString(),
  };
}

/**
 * Resolve the signed-in member from a request's session cookie, or null.
 * Also exposes the interest "owner" key used to scope interest records
 * (member email when signed in, "guest" otherwise).
 */
export async function getAuthedMember(cookieValue: string | undefined | null) {
  const memberId = verifySessionToken(cookieValue);
  if (!memberId) return null;
  try {
    const member = await db.member.findUnique({ where: { id: memberId } });
    return member ?? null;
  } catch {
    return null;
  }
}

/** Owner key used to scope interests for the current visitor. */
export function ownerKeyForMember(member: { email: string } | null): string {
  return member ? member.email : "guest";
}
