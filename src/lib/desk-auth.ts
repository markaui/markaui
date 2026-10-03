import { createHmac, timingSafeEqual } from "node:crypto";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Matchmaker desk gate (server-only).
 *
 * The desk is a demo operations surface, so it sits behind a light passcode
 * instead of a full staff account. Unlocking exchanges the passcode for an
 * HMAC-signed httpOnly cookie (same pattern as member sessions) with a 12h
 * TTL; every /api/admin/* route verifies it before touching data.
 */

export const DESK_COOKIE = "saptapadi_desk";
const DESK_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const DEFAULT_PASSCODE = "matchmaker2024";

export function deskPasscode(): string {
  return process.env.DESK_PASSCODE ?? DEFAULT_PASSCODE;
}

function secret(): string {
  return process.env.AUTH_SECRET ?? "saptapadi-dev-secret-fallback";
}

export function createDeskToken(): string {
  const expires = Date.now() + DESK_TTL_MS;
  const payload = `desk.${expires}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyDeskToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [scope, expires, sig] = parts;
  if (scope !== "desk") return false;
  const payload = `${scope}.${expires}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(expires) >= Date.now();
}

/** Constant-time passcode comparison. */
export function passcodeMatches(input: unknown): boolean {
  if (typeof input !== "string") return false;
  const expected = Buffer.from(deskPasscode());
  const candidate = Buffer.from(input);
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/**
 * Guard for /api/admin/* handlers — returns a 401 response when the desk
 * cookie is missing/expired, otherwise null (caller continues).
 */
export function guardDesk(request: NextRequest): NextResponse | null {
  const token = request.cookies.get(DESK_COOKIE)?.value;
  if (verifyDeskToken(token)) return null;
  return NextResponse.json(
    { error: "The matchmaker desk is locked. Unlock with the team passcode." },
    { status: 401 }
  );
}

export const DESK_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: DESK_TTL_MS / 1000,
};
