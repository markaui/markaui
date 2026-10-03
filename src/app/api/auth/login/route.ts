import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { SESSION_COOKIE, createSessionToken, toPublicMember, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST /api/auth/login — verify credentials and start a session. */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const member = await db.member.findUnique({ where: { email } });
    if (!member || !verifyPassword(password, member.passwordHash)) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const res = NextResponse.json({ member: toPublicMember(member) });
    res.cookies.set(SESSION_COOKIE, createSessionToken(member.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (error) {
    console.error("[api/auth/login] failed", error);
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
