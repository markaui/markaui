import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getAuthedMember, SESSION_COOKIE, toPublicMember } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/auth/profile — update the signed-in member's display details
 * (name, city, avatar, profession, height and/or about). Returns the
 * refreshed public member.
 */
export async function PATCH(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    if (!member) {
      return NextResponse.json({ error: "Sign in to edit your profile." }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      city?: string;
      profession?: string;
      height?: string;
      about?: string;
      avatarUrl?: string | null;
    };

    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const city = typeof body.city === "string" ? body.city.trim() : undefined;
    const profession =
      typeof body.profession === "string" ? body.profession.trim() : undefined;
    const height = typeof body.height === "string" ? body.height.trim() : undefined;
    const about = typeof body.about === "string" ? body.about.trim() : undefined;
    const avatar = body.avatarUrl;

    if (name !== undefined && (name.length < 2 || name.length > 60)) {
      return NextResponse.json(
        { error: "Name must be between 2 and 60 characters." },
        { status: 400 }
      );
    }
    if (city !== undefined && city.length > 60) {
      return NextResponse.json(
        { error: "City must be 60 characters or fewer." },
        { status: 400 }
      );
    }
    if (profession !== undefined && profession.length > 80) {
      return NextResponse.json(
        { error: "Profession must be 80 characters or fewer." },
        { status: 400 }
      );
    }
    if (height !== undefined && height.length > 20) {
      return NextResponse.json(
        { error: "Height must be 20 characters or fewer." },
        { status: 400 }
      );
    }
    if (about !== undefined && about.length > 500) {
      return NextResponse.json(
        { error: "Your about section is limited to 500 characters." },
        { status: 400 }
      );
    }

    // Avatars are client-resized data URLs (JPEG/PNG/WebP, ≤ 300 KB).
    const AVATAR_PATTERN = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    const AVATAR_MAX_LENGTH = 300_000;
    let avatarValue: string | null | undefined;
    if (avatar === null) {
      avatarValue = null;
    } else if (typeof avatar === "string") {
      if (!AVATAR_PATTERN.test(avatar) || avatar.length > AVATAR_MAX_LENGTH) {
        return NextResponse.json(
          { error: "Avatar must be an image under 300 KB (JPEG, PNG or WebP)." },
          { status: 400 }
        );
      }
      avatarValue = avatar;
    }

    if (
      name === undefined &&
      city === undefined &&
      profession === undefined &&
      height === undefined &&
      about === undefined &&
      avatarValue === undefined
    ) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const updated = await db.member.update({
      where: { id: member.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(city !== undefined ? { city: city.length > 0 ? city : null } : {}),
        ...(profession !== undefined
          ? { profession: profession.length > 0 ? profession : null }
          : {}),
        ...(height !== undefined ? { height: height.length > 0 ? height : null } : {}),
        ...(about !== undefined ? { about: about.length > 0 ? about : null } : {}),
        ...(avatarValue !== undefined ? { avatarUrl: avatarValue } : {}),
      },
    });

    return NextResponse.json({ member: toPublicMember(updated) });
  } catch (error) {
    console.error("[api/auth/profile] PATCH failed", error);
    return NextResponse.json({ error: "Failed to update your profile." }, { status: 500 });
  }
}
