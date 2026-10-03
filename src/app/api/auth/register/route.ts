import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { SESSION_COOKIE, createSessionToken, hashPassword, toPublicMember } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST /api/auth/register — create a member account and start a session. */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      city?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid name and email are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const existing = await db.member.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists — sign in instead." },
        { status: 409 }
      );
    }

    const member = await db.member.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        city: body.city?.trim() || null,
      },
    });

    const res = NextResponse.json({ member: toPublicMember(member) }, { status: 201 });
    res.cookies.set(SESSION_COOKIE, createSessionToken(member.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (error) {
    console.error("[api/auth/register] failed", error);
    return NextResponse.json({ error: "Could not create the account." }, { status: 500 });
  }
}
