import { NextResponse } from "next/server";

/**
 * Public GitHub repo stats for the navbar star button.
 *
 * Two-source fallback with a memory cache:
 *   1. GitHub REST API (60 req/hr unauthenticated per IP — often exhausted
 *      on shared egress IPs)
 *   2. shields.io JSON endpoint (heavily edge-cached GitHub data)
 *
 * The last successful value is kept in memory indefinitely and served (with
 * `stale: true`) if every source fails, so the navbar pill keeps a number.
 */
const REPO = "markaui/markaui";
const TTL_MS = 30 * 60 * 1000;

type Stats = { stars: number; forks: number; at: number };

let memory: Stats | null = null;

function serve(stars: number, forks: number, source: string, stale = false) {
  return NextResponse.json({ ok: true, stars, forks, source, stale });
}

async function fromGitHubApi(): Promise<Stats | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "markaui-site",
      },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      stargazers_count?: number;
      forks_count?: number;
    };
    return {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      at: Date.now(),
    };
  } catch {
    return null;
  }
}

async function fromShields(): Promise<Stats | null> {
  try {
    const res = await fetch(
      `https://img.shields.io/github/stars/${REPO}.json`,
      {
        headers: { "User-Agent": "markaui-site" },
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { value?: string };
    const stars = Number.parseInt(data.value ?? "", 10);
    if (Number.isNaN(stars)) return null;
    return { stars, forks: memory?.forks ?? 0, at: Date.now() };
  } catch {
    return null;
  }
}

export async function GET() {
  // Fresh memory cache — no upstream call
  if (memory && Date.now() - memory.at < TTL_MS) {
    return serve(memory.stars, memory.forks, "memory");
  }

  const fromGitHub = await fromGitHubApi();
  const stats = fromGitHub ?? (await fromShields());

  if (stats) {
    memory = stats;
    return serve(stats.stars, stats.forks, fromGitHub ? "github" : "shields");
  }

  // Every source failed — serve the last known value if we have one
  if (memory) {
    return serve(memory.stars, memory.forks, "memory", true);
  }

  // Never succeeded — degrade gracefully, the button renders without a count
  return NextResponse.json(
    { ok: false, stars: null, forks: null, source: null },
    { status: 200 }
  );
}
