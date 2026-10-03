import { NextRequest, NextResponse } from "next/server";

import {
  DESK_COOKIE,
  DESK_COOKIE_OPTIONS,
  createDeskToken,
  passcodeMatches,
  verifyDeskToken,
} from "@/lib/desk-auth";

export const dynamic = "force-dynamic";

/** GET /api/admin/gate — is the desk unlocked for this browser? */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    unlocked: verifyDeskToken(request.cookies.get(DESK_COOKIE)?.value),
  });
}

/**
 * POST /api/admin/gate — exchange the team passcode for a signed desk cookie.
 * Body: { passcode }.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { passcode?: string };
    if (!passcodeMatches(body.passcode)) {
      return NextResponse.json({ error: "That passcode is not valid." }, { status: 401 });
    }
    const res = NextResponse.json({ unlocked: true });
    res.cookies.set(DESK_COOKIE, createDeskToken(), DESK_COOKIE_OPTIONS);
    return res;
  } catch {
    return NextResponse.json({ error: "Could not unlock the desk." }, { status: 400 });
  }
}

/** DELETE /api/admin/gate — lock the desk again on this browser. */
export async function DELETE() {
  const res = NextResponse.json({ unlocked: false });
  res.cookies.set(DESK_COOKIE, "", { ...DESK_COOKIE_OPTIONS, maxAge: 0 });
  return res;
}
