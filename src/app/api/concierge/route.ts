import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

import { db } from "@/lib/db";
import { MATRIMONY_PROFILES } from "@/lib/matrimony-data";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CONCIERGE_NAME = "Jane";

/** Compact profile catalogue so the concierge recommends real, accurate profiles. */
function profileCatalogue() {
  return MATRIMONY_PROFILES.map(
    (p) =>
      `- ${p.name} (${p.gender === "female" ? "Bride" : "Groom"}), ${p.age}, ${p.city}, ${p.community}, ${p.profession}, ${p.education}, match ${p.matchScore}%, premium: ${p.premium ? "yes" : "no"}`
  ).join("\n");
}

const SYSTEM_PROMPT = `You are ${CONCIERGE_NAME}, the warm and highly skilled AI matchmaking concierge of Saptapadi, a premium Indian matrimony service. You chat with visitors on the Saptapadi website.

PERSONALITY
- Warm, graceful, culturally fluent, and encouraging. You celebrate Indian traditions.
- Concise by default: 2–4 short sentences per reply. Never write long essays.
- Light use of emojis (at most one per message).

CAPABILITIES
- Recommend profiles from the live catalogue below. When you recommend, mention 1–3 specific profiles by name with one compelling reason each (city, profession, age, community fit).
- Explain membership plans: Silver (free), Gold (₹1,999/month, most loved), Diamond (₹4,999/month concierge).
- Explain trust: 100% verified profiles, privacy-first photo controls, kundli matching on paid plans.
- Encourage the visitor to use the search form, shortlist profiles with the heart icon, or send an interest.
- If asked something unrelated to matchmaking/matrimony, gently steer back with grace.

RULES
- Never invent profiles that are not in the catalogue.
- Never ask for payment details, passwords, OTPs or addresses. Never share anyone's private contact info.
- Address the visitor respectfully; use "you". If they share preferences (age, city, community, profession), use them to filter recommendations.

LIVE PROFILE CATALOGUE
${profileCatalogue()}`;

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * GET /api/concierge?session=… — restore a persisted transcript so the
 * drawer can hydrate earlier messages (oldest first).
 */
export async function GET(request: NextRequest) {
  try {
    const session = request.nextUrl.searchParams.get("session");
    if (!session) {
      return NextResponse.json({ error: "session is required" }, { status: 400 });
    }
    const rows = await db.conciergeMessage.findMany({
      where: { session },
      orderBy: { createdAt: "asc" },
      take: 60,
    });
    return NextResponse.json({
      messages: rows.map((row) => ({
        role: row.role as "user" | "assistant",
        content: row.content,
        createdAt: row.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[api/concierge] GET failed", error);
    return NextResponse.json({ error: "Failed to load the transcript" }, { status: 500 });
  }
}

/** DELETE /api/concierge?session=… — clear a transcript (fresh conversation). */
export async function DELETE(request: NextRequest) {
  try {
    const session = request.nextUrl.searchParams.get("session");
    if (!session) {
      return NextResponse.json({ error: "session is required" }, { status: 400 });
    }
    await db.conciergeMessage.deleteMany({ where: { session } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/concierge] DELETE failed", error);
    return NextResponse.json({ error: "Failed to clear the transcript" }, { status: 500 });
  }
}

/** POST /api/concierge — { session, messages } → { reply }. Persists the transcript. */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      session?: string;
      messages?: ChatMessage[];
    };

    const session = body.session ?? "anonymous";
    const incoming = (body.messages ?? [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .filter((m) => typeof m.content === "string" && m.content.trim().length > 0)
      .slice(-12); // keep context tight

    if (incoming.length === 0 || incoming[incoming.length - 1].role !== "user") {
      return NextResponse.json({ error: "A user message is required" }, { status: 400 });
    }

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        ...incoming.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      thinking: { type: "disabled" },
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { reply: "Namaste 🙏 I'm Jane, your matchmaking concierge. Tell me a little about the partner you're dreaming of, and I'll curate matches for you." },
        { status: 200 }
      );
    }

    // Persist the exchange best-effort (never block the chat on DB hiccups).
    try {
      const lastUser = incoming[incoming.length - 1];
      await db.$transaction([
        db.conciergeMessage.create({
          data: { session, role: "user", content: lastUser.content.slice(0, 2000) },
        }),
        db.conciergeMessage.create({
          data: { session, role: "assistant", content: reply.slice(0, 4000) },
        }),
      ]);
    } catch (dbError) {
      console.error("[api/concierge] transcript persist failed", dbError);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[api/concierge] failed", error);
    return NextResponse.json(
      {
        reply:
          "Namaste 🙏 I'm Jane, your matchmaking concierge. I'm having a brief connection moment — please try again in a few seconds.",
      },
      { status: 200 }
    );
  }
}
