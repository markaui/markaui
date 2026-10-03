import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE, getAuthedMember, toPublicMember } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** GET /api/auth/me — the signed-in member (or null). */
export async function GET(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    return NextResponse.json({ member: member ? toPublicMember(member) : null });
  } catch (error) {
    console.error("[api/auth/me] failed", error);
    return NextResponse.json({ member: null });
  }
}
