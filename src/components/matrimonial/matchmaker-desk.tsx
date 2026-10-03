"use client";

import * as React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  BadgeCheck,
  BellRing,
  BookUser,
  Check,
  CheckCheck,
  Eye,
  HeartHandshake,
  KeyRound,
  ListFilter,
  Loader2,
  Lock,
  LockKeyhole,
  MessageSquareQuote,
  NotebookPen,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  SquareStack,
  Star,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import type { MatrimonyProfile } from "@/lib/matrimony-data";
import { MATRIMONY_PROFILES } from "@/lib/matrimony-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatGroup, Stat } from "@/components/ui/stat";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface DeskInterest {
  id: string;
  profileId: string;
  profileName: string;
  note: string | null;
  owner: string;
  status: string;
  decided: boolean;
  createdAt: string;
}

interface DeskStats {
  total: number;
  pending: number;
  accepted: number;
  declined: number;
}

interface CatalogueRow {
  profileId: string;
  name: string;
  city: string;
  profession: string;
  age: number;
  image: string;
  baseVerified: boolean;
  premium: boolean;
  interestCount: number;
  featured: boolean;
  verified: boolean;
  note: string;
  updatedAt: string | null;
}

type StatusFilter = "all" | "pending" | "accepted" | "declined";
type DeskTab = "queue" | "catalogue";
type GateState = "checking" | "locked" | "unlocked";

const STATUS_META: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  sent: {
    label: "Pending",
    className: "border-warning/30 bg-warning/10 text-warning",
    dot: "bg-warning",
  },
  seen: {
    label: "Seen",
    className: "border-info/30 bg-info/10 text-info",
    dot: "bg-info",
  },
  accepted: {
    label: "Accepted",
    className: "border-success/30 bg-success/15 text-success",
    dot: "bg-success",
  },
  declined: {
    label: "Declined",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
};

const NOTE_LIMIT = 280;

function profileById(id: string): MatrimonyProfile | undefined {
  return MATRIMONY_PROFILES.find((p) => p.id === id);
}

/* ── Lock screen ───────────────────────────────────────────────────────── */

function DeskGate({
  onUnlock,
  onBack,
}: {
  onUnlock: (passcode: string) => Promise<boolean>;
  onBack: () => void;
}) {
  const [passcode, setPasscode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || !passcode) return;
    setBusy(true);
    setError(null);
    const ok = await onUnlock(passcode);
    setBusy(false);
    if (!ok) setError("That passcode is not valid — check the hint and try again.");
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-16">
      <Card className="w-full overflow-hidden p-0 shadow-xl">
        <div className="relative flex flex-col items-center gap-3 bg-[linear-gradient(130deg,var(--primary),color-mix(in_srgb,var(--primary)_70%,var(--gold)_55%))] px-6 py-8 text-center text-primary-foreground">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-14 right-0 size-44 rounded-full bg-[radial-gradient(circle,white_0%,transparent_60%)] opacity-10"
          />
          <span className="relative flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur">
            <LockKeyhole className="size-7" />
          </span>
          <h1 className="relative font-serif text-2xl font-bold">Matchmaker Desk</h1>
          <p className="relative max-w-xs text-sm text-primary-foreground/85">
            This is an internal operations surface. Enter the team passcode to review
            interests and curate the catalogue.
          </p>
        </div>

        <form className="space-y-4 p-6" onSubmit={submit}>
          <div className="space-y-2">
            <label
              htmlFor="desk-passcode"
              className="text-sm font-medium text-foreground"
            >
              Team passcode
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="desk-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter the desk passcode"
                autoComplete="off"
                className="pl-9 tracking-widest"
                autoFocus
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "desk-passcode-error" : "desk-passcode-hint"}
              />
            </div>
            <p id="desk-passcode-hint" className="text-xs text-muted-foreground">
              Demo hint — the passcode is{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                matchmaker2024
              </code>
            </p>
            {error && (
              <p
                id="desk-passcode-error"
                role="alert"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back to site
            </Button>
            <Button type="submit" variant="gold" disabled={busy || !passcode} className="flex-1">
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Unlocking…
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  Unlock desk
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
      <p className="mt-4 flex items-center gap-1.5 text-center text-xs text-muted-foreground">
        <Lock className="size-3.5" />
        Sessions last 12 hours, then the desk locks itself again.
      </p>
    </div>
  );
}

/* ── Catalogue card ────────────────────────────────────────────────────── */

function CatalogueCard({
  row,
  busy,
  onToggle,
  onSaveNote,
}: {
  row: CatalogueRow;
  busy: boolean;
  onToggle: (row: CatalogueRow, field: "featured" | "verified", next: boolean) => void;
  onSaveNote: (row: CatalogueRow, note: string) => void;
}) {
  const [draft, setDraft] = React.useState(row.note);
  const dirty = draft !== row.note;

  return (
    <Card className="group flex flex-col overflow-hidden p-0 transition-all hover:border-gold/40 hover:shadow-md">
      <div className="flex items-center gap-3 p-4">
        <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image
            src={row.image}
            alt=""
            fill
            sizes="56px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-base font-semibold text-foreground">
            {row.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {row.age} yrs · {row.city} · {row.profession}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="soft" className="gap-1 text-[10px]">
              <HeartHandshake className="size-3" />
              {row.interestCount} interest{row.interestCount === 1 ? "" : "s"}
            </Badge>
            {row.premium && (
              <Badge variant="gold" className="text-[10px]">
                Premium
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-border bg-muted/20 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/90">
            <Switch
              checked={row.featured}
              disabled={busy}
              onCheckedChange={(next) => onToggle(row, "featured", next)}
              aria-label={`Feature ${row.name} on the landing page`}
            />
            <Star className={cn("size-3.5", row.featured ? "fill-gold text-gold" : "text-muted-foreground")} />
            Featured
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground/90">
            <Switch
              checked={row.verified}
              disabled={busy}
              onCheckedChange={(next) => onToggle(row, "verified", next)}
              aria-label={`Show ${row.name} as matchmaker verified`}
            />
            <BadgeCheck
              className={cn("size-3.5", row.verified ? "text-success" : "text-muted-foreground")}
            />
            Verified
          </label>
        </div>

        <div className="space-y-1.5">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, NOTE_LIMIT))}
            placeholder="Internal note — e.g. “family verified on call, strong match for Mumbai members”…"
            rows={2}
            className="resize-none text-xs"
            aria-label={`Internal note for ${row.name}`}
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {draft.length}/{NOTE_LIMIT}
            </span>
            <Button
              size="sm"
              variant={dirty ? "gold" : "ghost"}
              disabled={!dirty || busy}
              onClick={() => onSaveNote(row, draft)}
              className="h-7 gap-1.5 text-xs"
            >
              {dirty ? <NotebookPen className="size-3" /> : <Check className="size-3" />}
              {dirty ? "Save note" : "Saved"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ── Desk ──────────────────────────────────────────────────────────────── */

export interface MatchmakerDeskProps {
  onBack: () => void;
  /**
   * Docs-demo escape hatch — skips the passcode gate and falls back to
   * representative demo data when the live desk APIs are gated.
   */
  startUnlocked?: boolean;
  /**
   * Docs-demo mode — render representative demo data WITHOUT calling the
   * gated admin APIs at all (keeps the browser console free of 401 noise
   * on the /components showcase pages).
   */
  forceDemo?: boolean;
}

/**
 * Matchmaker Desk — admin-lite operations view. Behind a light passcode gate:
 * lists every interest sent by every visitor (member or guest) with live
 * stats and accept / decline / reset decisions, plus a profile catalogue
 * curator (featured pin, verified override, internal notes) that persists to
 * SQLite and flows back into the member-facing landing page.
 */
export function MatchmakerDesk({ onBack, startUnlocked = false, forceDemo = false }: MatchmakerDeskProps) {
  const { toast } = useToast();
  const [gate, setGate] = React.useState<GateState>(startUnlocked ? "unlocked" : "checking");
  const [tab, setTab] = React.useState<DeskTab>("queue");
  const [interests, setInterests] = React.useState<DeskInterest[]>([]);
  const [catalogue, setCatalogue] = React.useState<CatalogueRow[]>([]);
  const [ready, setReady] = React.useState(false);
  const [demoData, setDemoData] = React.useState(false);
  const [filter, setFilter] = React.useState<StatusFilter>("all");
  const [term, setTerm] = React.useState("");
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [busyRow, setBusyRow] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<React.Key[]>([]);
  const [bulkBusy, setBulkBusy] = React.useState<"accepted" | "declined" | null>(null);

  // Gate probe — a desk cookie from an earlier unlock keeps the view open.
  React.useEffect(() => {
    if (startUnlocked || forceDemo) {
      setGate("unlocked");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/gate", { cache: "no-store" });
        const data = (await res.json()) as { unlocked: boolean };
        if (!cancelled) setGate(data.unlocked ? "unlocked" : "locked");
      } catch {
        if (!cancelled) setGate("locked");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [forceDemo, startUnlocked]);

  const stats = React.useMemo<DeskStats>(
    () => ({
      total: interests.length,
      pending: interests.filter((i) => i.status === "sent" || i.status === "seen").length,
      accepted: interests.filter((i) => i.status === "accepted").length,
      declined: interests.filter((i) => i.status === "declined").length,
    }),
    [interests]
  );

  /** Docs-demo fallback when the gated APIs return 401. */
  const applyDemoData = React.useCallback(() => {
    const demoInterests: DeskInterest[] = [
      {
        id: "demo-1",
        profileId: MATRIMONY_PROFILES[0]?.id ?? "p1",
        profileName: MATRIMONY_PROFILES[0]?.name ?? "Emma Wilson",
        note: "Family verified on call — strong match for Jaipur members.",
        owner: "nadia@example.com",
        status: "accepted",
        decided: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      },
      {
        id: "demo-2",
        profileId: MATRIMONY_PROFILES[1]?.id ?? "p2",
        profileName: MATRIMONY_PROFILES[1]?.name ?? "John Doe",
        note: null,
        owner: "guest",
        status: "seen",
        decided: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        id: "demo-3",
        profileId: MATRIMONY_PROFILES[2]?.id ?? "p3",
        profileName: MATRIMONY_PROFILES[2]?.name ?? "Jane Smith",
        note: "Loved her work with the community kitchen — please prioritise.",
        owner: "noah@example.com",
        status: "sent",
        decided: false,
        createdAt: new Date().toISOString(),
      },
    ];
    const demoCatalogue: CatalogueRow[] = MATRIMONY_PROFILES.slice(0, 6).map((p, i) => ({
      profileId: p.id,
      name: p.name,
      city: p.city,
      profession: p.profession,
      age: p.age,
      image: p.image,
      baseVerified: p.verified,
      premium: p.premium,
      interestCount: (i * 3 + 1) % 7,
      featured: i === 0,
      verified: p.verified,
      note: i === 0 ? "Family verified on call — strong match for Jaipur members." : "",
      updatedAt: null,
    }));
    setInterests(demoInterests);
    setCatalogue(demoCatalogue);
    setDemoData(true);
    setReady(true);
  }, []);

  const refresh = React.useCallback(async () => {
    if (forceDemo) {
      applyDemoData();
      return;
    }
    try {
      const [intRes, catRes] = await Promise.all([
        fetch("/api/admin/interests", { cache: "no-store" }),
        fetch("/api/admin/catalogue", { cache: "no-store" }),
      ]);
      if (intRes.status === 401 || catRes.status === 401) {
        if (startUnlocked) {
          applyDemoData();
          return;
        }
        setGate("locked");
        return;
      }
      if (!intRes.ok || !catRes.ok) throw new Error("desk fetch failed");
      const intData = (await intRes.json()) as { interests: DeskInterest[] };
      const catData = (await catRes.json()) as { catalogue: CatalogueRow[] };
      setInterests(intData.interests);
      setCatalogue(catData.catalogue);
      setDemoData(false);
    } catch {
      // keep current state on hiccup
    } finally {
      setReady(true);
    }
  }, [applyDemoData, forceDemo, startUnlocked]);

  React.useEffect(() => {
    if (gate === "unlocked") void refresh();
  }, [gate, refresh]);

  const unlock = React.useCallback(
    async (passcode: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/admin/gate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode }),
        });
        if (!res.ok) return false;
        setGate("unlocked");
        toast({
          title: "Desk unlocked",
          description: "Welcome back — the queue and catalogue are live for 12 hours.",
        });
        return true;
      } catch {
        return false;
      }
    },
    [toast]
  );

  const lock = React.useCallback(async () => {
    try {
      await fetch("/api/admin/gate", { method: "DELETE" });
    } catch {
      // ignore — state flips regardless
    }
    setGate("locked");
    setInterests([]);
    setCatalogue([]);
    setReady(false);
    toast({ title: "Desk locked", description: "See you next shift." });
  }, [toast]);

  const decide = async (record: DeskInterest, status: "accepted" | "declined" | "sent") => {
    setPendingId(record.id);
    // optimistic update — stats re-derive from the records automatically
    setInterests((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? {
              ...r,
              status,
              decided: status !== "sent",
            }
          : r
      )
    );
    try {
      const res = await fetch("/api/admin/interests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: record.id, status }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { interest: DeskInterest };
      setInterests((prev) => prev.map((r) => (r.id === data.interest.id ? data.interest : r)));
      toast({
        title:
          status === "accepted"
            ? `Interest accepted — ${record.profileName}`
            : status === "declined"
              ? `Interest declined — ${record.profileName}`
              : `Reset to automatic lifecycle — ${record.profileName}`,
        description:
          status === "accepted"
            ? `${record.owner === "guest" ? "The member" : record.owner} will see "Accepted" instantly.`
            : status === "declined"
              ? "The member sees a polite declined status."
              : "The record returns to the pending → seen → accepted flow.",
      });
    } catch {
      toast({
        title: "Could not save the decision",
        description: "Please try again in a moment.",
      });
      void refresh();
    } finally {
      setPendingId(null);
    }
  };

  const toggleCuration = async (
    row: CatalogueRow,
    field: "featured" | "verified",
    next: boolean
  ) => {
    setBusyRow(row.profileId);
    setCatalogue((prev) => prev.map((r) => (r.profileId === row.profileId ? { ...r, [field]: next } : r)));
    try {
      const res = await fetch("/api/admin/catalogue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: row.profileId, [field]: next }),
      });
      if (!res.ok) throw new Error(String(res.status));
      toast({
        title: next
          ? `${row.name} ${field === "featured" ? "pinned to featured" : "marked verified"}`
          : `${row.name} ${field === "featured" ? "removed from featured" : "verification removed"}`,
        description:
          field === "featured"
            ? next
              ? "The profile now leads the landing page's featured rail."
              : "The profile returns to its standard position."
            : next
              ? "A matchmaker-verified chip shows on the profile."
              : "The verification chip hides from the profile.",
      });
    } catch {
      setCatalogue((prev) => prev.map((r) => (r.profileId === row.profileId ? { ...r, [field]: !next } : r)));
      toast({ title: "Could not save the curation", description: "Please try again." });
    } finally {
      setBusyRow(null);
    }
  };

  const saveNote = async (row: CatalogueRow, note: string) => {
    setBusyRow(row.profileId);
    const previous = row.note;
    setCatalogue((prev) => prev.map((r) => (r.profileId === row.profileId ? { ...r, note } : r)));
    try {
      const res = await fetch("/api/admin/catalogue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: row.profileId, note }),
      });
      if (!res.ok) throw new Error(String(res.status));
      toast({ title: "Note saved", description: `Internal note updated for ${row.name}.` });
    } catch {
      setCatalogue((prev) => prev.map((r) => (r.profileId === row.profileId ? { ...r, note: previous } : r)));
      toast({ title: "Could not save the note", description: "Please try again." });
    } finally {
      setBusyRow(null);
    }
  };

  const filtered = React.useMemo(() => {
    const q = term.trim().toLowerCase();
    return interests.filter((record) => {
      if (filter === "pending" && !(record.status === "sent" || record.status === "seen"))
        return false;
      if (filter === "accepted" && record.status !== "accepted") return false;
      if (filter === "declined" && record.status !== "declined") return false;
      if (
        q &&
        !record.profileName.toLowerCase().includes(q) &&
        !record.owner.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [interests, filter, term]);

  const catalogueFiltered = React.useMemo(() => {
    const q = term.trim().toLowerCase();
    return catalogue.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.profession.toLowerCase().includes(q)
    );
  }, [catalogue, term]);

  // ---- bulk decisions -----------------------------------------------------
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);
  const queueIds = React.useMemo(() => filtered.map((r) => r.id), [filtered]);
  const allQueueSelected = queueIds.length > 0 && queueIds.every((id) => selectedSet.has(id));
  const someQueueSelected = queueIds.some((id) => selectedSet.has(id));

  const toggleSelect = (id: string, checked: boolean | "indeterminate") => {
    setSelected((prev) => (checked === true ? [...new Set([...prev, id])] : prev.filter((s) => s !== id)));
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const set = new Set(prev);
      if (queueIds.every((id) => set.has(id))) {
        queueIds.forEach((id) => set.delete(id));
      } else {
        queueIds.forEach((id) => set.add(id));
      }
      return [...set];
    });
  };

  const bulkDecide = async (status: "accepted" | "declined") => {
    const targets = interests.filter((r) => selectedSet.has(r.id) && r.status !== status);
    if (bulkBusy) return;
    if (targets.length === 0) {
      setSelected([]);
      toast({
        title: "Nothing to change",
        description: "Every selected interest already has that status.",
      });
      return;
    }
    setBulkBusy(status);
    // optimistic flip for every target — stats re-derive automatically
    setInterests((prev) =>
      prev.map((r) => (selectedSet.has(r.id) ? { ...r, status, decided: true } : r))
    );
    let failed = 0;
    for (const record of targets) {
      try {
        const res = await fetch("/api/admin/interests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: record.id, status }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { interest: DeskInterest };
        setInterests((prev) => prev.map((r) => (r.id === data.interest.id ? data.interest : r)));
      } catch {
        failed += 1;
      }
    }
    setBulkBusy(null);
    setSelected([]);
    if (failed === 0) {
      toast({
        title: `${targets.length} interest${targets.length === 1 ? "" : "s"} ${status}`,
        description:
          status === "accepted"
            ? "Every selected member sees “Accepted” — notifications went out instantly."
            : "Every selected interest was politely closed.",
      });
    } else {
      toast({
        title: "Finished with errors",
        description: `${failed} of ${targets.length} decisions could not be saved — the queue was refreshed.`,
        variant: "destructive",
      });
      void refresh();
    }
  };

  if (gate !== "unlocked") {
    if (gate === "checking") {
      return (
        <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Checking desk access">
          <Skeleton className="h-64 w-full max-w-md rounded-3xl" />
        </div>
      );
    }
    return <DeskGate onUnlock={unlock} onBack={onBack} />;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-[linear-gradient(125deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,var(--gold)_55%))] p-6 text-primary-foreground shadow-xl sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-10 size-56 rounded-full bg-[radial-gradient(circle,white_0%,transparent_60%)] opacity-10"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur">
            <ShieldCheck className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-2xl font-bold sm:text-3xl">Matchmaker Desk</h1>
              <Badge className="border-white/25 bg-white/15 text-primary-foreground" variant="outline">
                Internal · demo
              </Badge>
              {demoData && (
                <Badge className="gap-1 border-white/25 bg-white/15 text-primary-foreground" variant="outline">
                  <Eye className="size-3" />
                  Demo data
                </Badge>
              )}
            </div>
            <p className="mt-1 max-w-2xl text-sm text-primary-foreground/85">
              Every interest sent across Saptapadi, in one place. Accept the matches you
              believe in, curate the catalogue — decisions are saved and reflected on the
              site instantly.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconButton
                    variant="outline"
                    aria-label="Lock the desk"
                    onClick={() => void lock()}
                    className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
                  >
                    <Lock className="size-4" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>Lock the desk on this browser.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              onClick={onBack}
              className="shrink-0 gap-2 border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground"
            >
              <Sparkles className="size-4" />
              Back to site
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <StatGroup className="mt-6">
        <Stat label="Total interests" value={stats.total} icon={<HeartHandshake className="text-primary" />} />
        <Stat label="Awaiting decision" value={stats.pending} icon={<BellRing className="text-warning" />} />
        <Stat
          label="Accepted"
          value={stats.accepted}
          icon={<BadgeCheck className="text-success" />}
          delta={stats.total > 0 ? { value: `${Math.round((stats.accepted / stats.total) * 100)}% rate`, trend: "up" } : undefined}
        />
        <Stat
          label="Featured profiles"
          value={catalogue.filter((r) => r.featured).length}
          icon={<Star className="text-gold" />}
        />
      </StatGroup>

      {/* ── Desk tabs + search ─────────────────────────────────── */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as DeskTab)} className="w-full lg:w-auto">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 lg:w-fit">
            <TabsTrigger value="queue" className="gap-1.5">
              <ListFilter className="size-4" />
              Interest queue
              {stats.pending > 0 && (
                <Badge variant="soft" className="text-[10px]">
                  {stats.pending} new
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="catalogue" className="gap-1.5">
              <BookUser className="size-4" />
              Profile catalogue
              {catalogue.some((r) => r.featured) && (
                <Badge variant="soft" className="gap-1 text-[10px]">
                  <Star className="size-2.5 fill-gold text-gold" />
                  {catalogue.filter((r) => r.featured).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={tab === "queue" ? "Search profile or member…" : "Search the catalogue…"}
            aria-label={tab === "queue" ? "Search interests by profile or member" : "Search the profile catalogue"}
            className="pl-9"
          />
        </div>
      </div>

      {/* ── Queue tab ──────────────────────────────────────────── */}
      {tab === "queue" && (
        <>
          <div className="mt-4">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
              <TabsList className="h-auto w-full flex-wrap justify-start sm:w-fit">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending" className="gap-1.5">
                  Pending
                  {stats.pending > 0 && (
                    <Badge variant="soft" className="text-[10px]">
                      {stats.pending}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="accepted" className="gap-1.5">
                  Accepted
                  {stats.accepted > 0 && (
                    <Badge variant="soft" className="text-[10px]">
                      {stats.accepted}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="declined" className="gap-1.5">
                  Declined
                  {stats.declined > 0 && (
                    <Badge variant="soft" className="text-[10px]">
                      {stats.declined}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Bulk decision bar — select + act on many interests at once */}
          {ready && filtered.length > 0 && (
            <div
              className={cn(
                "mt-4 flex flex-wrap items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors",
                selected.length > 0 ? "border-gold/40 bg-gold/5" : "border-border bg-card"
              )}
            >
              <Checkbox
                checked={allQueueSelected ? true : someQueueSelected ? "indeterminate" : false}
                onCheckedChange={() => toggleSelectAll()}
                aria-label="Select all visible interests"
              />
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <SquareStack className="size-3.5" aria-hidden="true" />
                {selected.length > 0 ? `${selected.length} selected` : "Select all"}
              </span>
              {selected.length > 0 && (
                <div className="ml-auto flex flex-wrap items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!bulkBusy}
                    onClick={() => void bulkDecide("accepted")}
                    className="gap-1.5 border-success/40 text-success hover:bg-success/10"
                  >
                    {bulkBusy === "accepted" ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <CheckCheck className="size-3.5" aria-hidden="true" />
                    )}
                    Accept all
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!!bulkBusy}
                    onClick={() => void bulkDecide("declined")}
                    className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
                  >
                    {bulkBusy === "declined" ? (
                      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <XCircle className="size-3.5" aria-hidden="true" />
                    )}
                    Decline all
                  </Button>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Clear selection"
                    onClick={() => setSelected([])}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </IconButton>
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            {!ready ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <Card className="p-2">
                <EmptyState
                  icon={<HeartHandshake className="size-8" />}
                  title={interests.length === 0 ? "The queue is clear" : "Nothing matches this view"}
                  description={
                    interests.length === 0
                      ? "When visitors send interests from the site, they land here for a matchmaker's decision."
                      : "Try a different status tab or clear your search."
                  }
                  size="sm"
                />
              </Card>
            ) : (
              <ul className="space-y-3">
                {filtered.map((record) => {
                  const profile = profileById(record.profileId);
                  const meta = STATUS_META[record.status] ?? STATUS_META.sent;
                  const busy = pendingId === record.id;
                  return (
                    <li key={record.id}>
                      <Card
                        className={cn(
                          "flex-row flex-wrap items-center gap-4 p-3.5 transition-all hover:border-gold/40 hover:shadow-md sm:p-4",
                          busy && "opacity-70",
                          selectedSet.has(record.id) && "border-gold/50 bg-gold/5"
                        )}
                      >
                        <Checkbox
                          checked={selectedSet.has(record.id)}
                          onCheckedChange={(checked) => toggleSelect(record.id, checked)}
                          aria-label={`Select ${record.profileName}'s interest`}
                          className="shrink-0"
                        />
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-16">
                          {profile ? (
                            <Image src={profile.image} alt="" fill sizes="64px" className="object-cover" />
                          ) : (
                            <span className="flex size-full items-center justify-center text-muted-foreground">
                              <HeartHandshake className="size-5" />
                            </span>
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-base font-semibold text-foreground">
                            {record.profileName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {profile
                              ? `${profile.age} yrs · ${profile.city} · ${profile.profession}`
                              : "Profile details unavailable"}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className={cn("gap-1.5 text-[11px]", meta.className)}>
                              <span className={cn("size-1.5 rounded-full", meta.dot)} />
                              {meta.label}
                            </Badge>
                            <Badge variant="soft" className="gap-1 text-[11px]">
                              <UserRound className="size-3" />
                              {record.owner === "guest" ? "Guest visitor" : record.owner}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">
                              sent{" "}
                              {formatDistanceToNow(new Date(record.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          {record.note && (
                            <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-gold/20 bg-gold/5 px-2.5 py-1.5 text-[11px] italic leading-relaxed text-foreground/80">
                              <MessageSquareQuote className="mt-0.5 size-3 shrink-0 text-gold" aria-hidden="true" />
                              <span className="line-clamp-2">“{record.note}”</span>
                            </p>
                          )}
                        </div>
                        <TooltipProvider delayDuration={200}>
                          <div className="flex w-full shrink-0 items-center justify-end gap-1.5 sm:w-auto">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={busy}
                                  onClick={() => void decide(record, "accepted")}
                                  className={cn(
                                    "gap-1.5",
                                    record.status !== "accepted" &&
                                      "border-success/40 text-success hover:bg-success/10"
                                  )}
                                >
                                  <Check className="size-3.5" />
                                  Accept
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Bless this match — member sees “Accepted”.</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={busy}
                                  onClick={() => void decide(record, "declined")}
                                  className={cn(
                                    "gap-1.5",
                                    record.status !== "declined" &&
                                      "border-destructive/40 text-destructive hover:bg-destructive/10"
                                  )}
                                >
                                  <X className="size-3.5" />
                                  Decline
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Politely close this interest.</TooltipContent>
                            </Tooltip>
                            {record.decided && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <IconButton
                                    size="sm"
                                    variant="ghost"
                                    aria-label={`Reset ${record.profileName} to the automatic lifecycle`}
                                    disabled={busy}
                                    onClick={() => void decide(record, "sent")}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <RotateCcw className="size-4" />
                                  </IconButton>
                                </TooltipTrigger>
                                <TooltipContent>Reset to the automatic lifecycle.</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TooltipProvider>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {/* ── Catalogue tab ──────────────────────────────────────── */}
      {tab === "catalogue" && (
        <div className="mt-4">
          {!ready ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-56 w-full rounded-2xl" />
              ))}
            </div>
          ) : catalogueFiltered.length === 0 ? (
            <Card className="p-2">
              <EmptyState
                icon={<BookUser className="size-8" />}
                title="No profiles match your search"
                description="Try a different name, city or profession."
                size="sm"
              />
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {catalogueFiltered.map((row) => (
                <CatalogueCard
                  key={row.profileId}
                  row={row}
                  busy={busyRow === row.profileId}
                  onToggle={(r, field, next) => void toggleCuration(r, field, next)}
                  onSaveNote={(r, note) => void saveNote(r, note)}
                />
              ))}
            </div>
          )}
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Star className="size-3.5" />
            Featured profiles lead the landing page rail — verified chips show on their cards.
          </p>
        </div>
      )}

      {/* ── Footer note ────────────────────────────────────────── */}
      <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Lock className="size-3.5" />
        Demo operations view — decisions persist to SQLite and appear in member dashboards.
      </p>
    </div>
  );
}
