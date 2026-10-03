import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getAuthedMember, SESSION_COOKIE } from "@/lib/auth";
import { filterProfiles, MATRIMONY_PROFILES, type SearchQuery } from "@/lib/matrimony-data";

export const dynamic = "force-dynamic";

/** Guests never hit this API — they keep saved searches in localStorage. */
const UNAUTHORIZED = NextResponse.json({ error: "Sign in to sync saved searches" }, { status: 401 });

const MAX_SAVED_SEARCHES = 12;
const NAME_MAX = 60;

const QUERY_KEYS = ["seeking", "age", "community", "city", "term", "sort"] as const;

/** Parse + sanitize a stored SearchQuery (defensive against older shapes). */
function parseQuery(raw: string): SearchQuery | null {
  try {
    const parsed = JSON.parse(raw) as Partial<SearchQuery>;
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.seeking !== "male" && parsed.seeking !== "female") return null;
    return {
      seeking: parsed.seeking,
      age: typeof parsed.age === "string" ? parsed.age : "Any",
      community: typeof parsed.community === "string" ? parsed.community : "Any",
      city: typeof parsed.city === "string" ? parsed.city : "Any",
      term: typeof parsed.term === "string" ? parsed.term : "",
      sort:
        parsed.sort === "age-asc" || parsed.sort === "age-desc" || parsed.sort === "name"
          ? parsed.sort
          : "match",
    };
  } catch {
    return null;
  }
}

function sanitizeQueryInput(input: unknown): SearchQuery | null {
  if (!input || typeof input !== "object") return null;
  const q = input as Record<string, unknown>;
  if (q.seeking !== "male" && q.seeking !== "female") return null;
  const out: Record<string, unknown> = {};
  for (const key of QUERY_KEYS) {
    if (typeof q[key] === "string") out[key] = (q[key] as string).slice(0, 120);
  }
  return parseQuery(JSON.stringify(out));
}

/** Live match count for a stored query against the current catalogue. */
function matchesFor(query: SearchQuery): number {
  return filterProfiles(MATRIMONY_PROFILES, query).length;
}

/** GET /api/saved-searches — member-scoped list, enriched with live match counts.
 *  When `notify` is on and the catalogue grew past `lastCount`, a one-shot
 *  "saved_search_matches" notification is created and the baseline advances. */
export async function GET(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    if (!member) return UNAUTHORIZED;

    const rows = await db.savedSearch.findMany({
      where: { owner: member.email },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const saved: Array<{
      id: string;
      name: string;
      query: SearchQuery;
      notify: boolean;
      matches: number;
      newSinceSaved: number;
      createdAt: string;
    }> = [];
    for (const row of rows) {
      const query = parseQuery(row.queryJson);
      if (!query) continue; // skip corrupt rows rather than failing the list
      const matches = matchesFor(query);

      let newSinceSaved = 0;
      if (row.notify && matches > row.lastCount) {
        newSinceSaved = matches - row.lastCount;
        await db.notification.create({
          data: {
            owner: member.email,
            type: "saved_search_matches",
            title: `${matches} profiles now match “${row.name}”`,
            body: `Your saved search found ${newSinceSaved} new ${newSinceSaved === 1 ? "profile" : "profiles"} since you last looked. Take a peek before they're gone.`,
            refId: row.id,
          },
        });
      }
      if (matches !== row.lastCount) {
        await db.savedSearch.update({ where: { id: row.id }, data: { lastCount: matches } });
      }

      saved.push({
        id: row.id,
        name: row.name,
        query,
        notify: row.notify,
        matches,
        newSinceSaved,
        createdAt: row.createdAt.toISOString(),
      });
    }

    return NextResponse.json({ owner: member.email, saved });
  } catch (error) {
    console.error("[api/saved-searches] GET failed", error);
    return NextResponse.json({ error: "Failed to load saved searches" }, { status: 500 });
  }
}

/** POST /api/saved-searches — create (or refresh) a named filter set. */
export async function POST(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    if (!member) return UNAUTHORIZED;

    const body = (await request.json()) as { name?: string; query?: unknown };
    const name = (body.name ?? "").trim().slice(0, NAME_MAX);
    if (name.length < 1) {
      return NextResponse.json({ error: "Give your search a name first." }, { status: 400 });
    }
    const query = sanitizeQueryInput(body.query);
    if (!query) {
      return NextResponse.json({ error: "That search could not be saved." }, { status: 400 });
    }

    const existingCount = await db.savedSearch.count({ where: { owner: member.email } });
    if (existingCount >= MAX_SAVED_SEARCHES) {
      return NextResponse.json(
        { error: `You can keep up to ${MAX_SAVED_SEARCHES} saved searches — remove one first.` },
        { status: 400 }
      );
    }

    const matches = matchesFor(query);
    const saved = await db.savedSearch.upsert({
      where: { owner_name: { owner: member.email, name } },
      // Re-saving refreshes the filters + rebaselines the match count.
      update: { queryJson: JSON.stringify(query), lastCount: matches },
      create: {
        owner: member.email,
        name,
        queryJson: JSON.stringify(query),
        lastCount: matches,
      },
    });

    return NextResponse.json({
      savedSearch: {
        id: saved.id,
        name: saved.name,
        query,
        notify: saved.notify,
        matches,
        newSinceSaved: 0,
        createdAt: saved.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[api/saved-searches] POST failed", error);
    return NextResponse.json({ error: "Failed to save this search" }, { status: 500 });
  }
}

/** PATCH /api/saved-searches — toggle notify or rename. */
export async function PATCH(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    if (!member) return UNAUTHORIZED;

    const body = (await request.json()) as { id?: string; notify?: boolean; name?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing saved search id" }, { status: 400 });
    }

    const row = await db.savedSearch.findUnique({ where: { id: body.id } });
    if (!row || row.owner !== member.email) {
      return NextResponse.json({ error: "Saved search not found" }, { status: 404 });
    }

    const data: { notify?: boolean; name?: string } = {};
    if (typeof body.notify === "boolean") data.notify = body.notify;
    if (typeof body.name === "string") {
      const name = body.name.trim().slice(0, NAME_MAX);
      if (name.length < 1) {
        return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
      }
      data.name = name;
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    try {
      const updated = await db.savedSearch.update({ where: { id: row.id }, data });
      return NextResponse.json({
        savedSearch: { id: updated.id, name: updated.name, notify: updated.notify },
      });
    } catch {
      // unique(owner+name) violation on rename
      return NextResponse.json(
        { error: "You already have a search with that name." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[api/saved-searches] PATCH failed", error);
    return NextResponse.json({ error: "Failed to update saved search" }, { status: 500 });
  }
}

/** DELETE /api/saved-searches?id= — remove a saved search (and its notifications). */
export async function DELETE(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    if (!member) return UNAUTHORIZED;

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const row = await db.savedSearch.findUnique({ where: { id } });
    if (!row || row.owner !== member.email) {
      return NextResponse.json({ error: "Saved search not found" }, { status: 404 });
    }

    await db.savedSearch.delete({ where: { id } });
    await db.notification.deleteMany({
      where: { owner: member.email, type: "saved_search_matches", refId: id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/saved-searches] DELETE failed", error);
    return NextResponse.json({ error: "Failed to remove saved search" }, { status: 500 });
  }
}
