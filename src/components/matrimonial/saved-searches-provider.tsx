"use client";

import * as React from "react";

import type { SearchQuery } from "@/lib/matrimony-data";
import { MATRIMONY_PROFILES, filterProfiles } from "@/lib/matrimony-data";
import { useAuth } from "./auth-provider";

export interface SavedSearchRecord {
  id: string;
  name: string;
  query: SearchQuery;
  notify: boolean;
  /** Live match count against the current catalogue. */
  matches: number;
  /** Matches gained since the last baseline (drives the bell notification). */
  newSinceSaved: number;
  createdAt: string;
}

interface SavedSearchesContextValue {
  records: SavedSearchRecord[];
  count: number;
  ready: boolean;
  /** Whether rows sync to the account (member) or stay on this device (guest). */
  synced: boolean;
  refresh: () => Promise<void>;
  saveSearch: (query: SearchQuery, name: string) => Promise<{ ok: boolean; error?: string }>;
  toggleNotify: (id: string) => Promise<void>;
  renameSearch: (id: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  removeSearch: (id: string) => Promise<void>;
}

const SavedSearchesContext = React.createContext<SavedSearchesContextValue | null>(null);

const GUEST_STORAGE_KEY = "saptapadi-saved-searches";
const MAX_SAVED_SEARCHES = 12;

/** localStorage helpers for guest visitors (rows stay on this device). */
function readGuestRows(): SavedSearchRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedSearchRecord[];
    if (!Array.isArray(parsed)) return [];
    // guests compute counts client-side: hydrate live matches on every read
    return parsed.slice(0, MAX_SAVED_SEARCHES).map((row) => ({
      ...row,
      matches: filterProfiles(MATRIMONY_PROFILES, row.query).length,
    }));
  } catch {
    return [];
  }
}

function writeGuestRows(rows: SavedSearchRecord[]) {
  try {
    window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(rows.slice(0, MAX_SAVED_SEARCHES)));
  } catch {
    // storage full / blocked — guests simply keep the in-memory list
  }
}

export function SavedSearchesProvider({ children }: { children: React.ReactNode }) {
  const { member } = useAuth();
  const synced = Boolean(member);
  const [records, setRecords] = React.useState<SavedSearchRecord[]>([]);
  const [ready, setReady] = React.useState(false);

  const refresh = React.useCallback(async () => {
    if (!member) {
      setRecords(readGuestRows());
      setReady(true);
      return;
    }
    try {
      const res = await fetch("/api/saved-searches", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { saved: SavedSearchRecord[] };
      setRecords(data.saved);
    } catch {
      // offline / DB hiccup — keep current state
    } finally {
      setReady(true);
    }
  }, [member]);

  React.useEffect(() => {
    setReady(false);
    void refresh();
  }, [member?.email, refresh]);

  const saveSearch = React.useCallback(
    async (query: SearchQuery, name: string) => {
      if (!member) {
        const rows = readGuestRows();
        const trimmed = name.trim().slice(0, 60);
        if (!trimmed) return { ok: false, error: "Give your search a name first." };
        const existingIndex = rows.findIndex((r) => r.name.toLowerCase() === trimmed.toLowerCase());
        const record: SavedSearchRecord = {
          id: `local-${Date.now().toString(36)}`,
          name: trimmed,
          query,
          notify: true,
          matches: filterProfiles(MATRIMONY_PROFILES, query).length,
          newSinceSaved: 0,
          createdAt: new Date().toISOString(),
        };
        if (existingIndex >= 0) {
          record.id = rows[existingIndex].id;
          record.notify = rows[existingIndex].notify;
          rows[existingIndex] = record;
        } else if (rows.length >= MAX_SAVED_SEARCHES) {
          return { ok: false, error: `You can keep up to ${MAX_SAVED_SEARCHES} saved searches — remove one first.` };
        } else {
          rows.unshift(record);
        }
        writeGuestRows(rows);
        setRecords(rows);
        return { ok: true };
      }
      try {
        const res = await fetch("/api/saved-searches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, query }),
        });
        const data = (await res.json()) as { savedSearch?: SavedSearchRecord; error?: string };
        if (!res.ok || !data.savedSearch) return { ok: false, error: data.error ?? "Failed to save" };
        setRecords((prev) => {
          const next = prev.filter((r) => r.id !== data.savedSearch!.id);
          next.unshift(data.savedSearch!);
          return next;
        });
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not reach the matchmaker — try again." };
      }
    },
    [member]
  );

  const toggleNotify = React.useCallback(
    async (id: string) => {
      const current = records.find((r) => r.id === id);
      if (!current) return;
      const notify = !current.notify;
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, notify } : r)));
      if (!member) {
        writeGuestRows(readGuestRows().map((r) => (r.id === id ? { ...r, notify } : r)));
        return;
      }
      try {
        await fetch("/api/saved-searches", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, notify }),
        });
      } catch {
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, notify: !notify } : r)));
      }
    },
    [member, records]
  );

  const renameSearch = React.useCallback(
    async (id: string, name: string) => {
      const trimmed = name.trim().slice(0, 60);
      if (!trimmed) return { ok: false, error: "Name cannot be empty." };
      if (!member) {
        const rows = readGuestRows();
        if (rows.some((r) => r.id !== id && r.name.toLowerCase() === trimmed.toLowerCase())) {
          return { ok: false, error: "You already have a search with that name." };
        }
        const next = rows.map((r) => (r.id === id ? { ...r, name: trimmed } : r));
        writeGuestRows(next);
        setRecords(next);
        return { ok: true };
      }
      try {
        const res = await fetch("/api/saved-searches", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name: trimmed }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) return { ok: false, error: data.error ?? "Failed to rename" };
        setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, name: trimmed } : r)));
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not reach the matchmaker — try again." };
      }
    },
    [member]
  );

  const removeSearch = React.useCallback(
    async (id: string) => {
      const prev = records;
      setRecords((rows) => rows.filter((r) => r.id !== id));
      if (!member) {
        writeGuestRows(readGuestRows().filter((r) => r.id !== id));
        return;
      }
      try {
        const res = await fetch(`/api/saved-searches?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error(String(res.status));
      } catch {
        setRecords(prev); // rollback on failure
      }
    },
    [member, records]
  );

  const value = React.useMemo<SavedSearchesContextValue>(
    () => ({
      records,
      count: records.length,
      ready,
      synced,
      refresh,
      saveSearch,
      toggleNotify,
      renameSearch,
      removeSearch,
    }),
    [records, ready, synced, refresh, saveSearch, toggleNotify, renameSearch, removeSearch]
  );

  return <SavedSearchesContext.Provider value={value}>{children}</SavedSearchesContext.Provider>;
}

export function useSavedSearches(): SavedSearchesContextValue {
  const ctx = React.useContext(SavedSearchesContext);
  if (!ctx) throw new Error("useSavedSearches must be used within <SavedSearchesProvider>");
  return ctx;
}

/** Same as useSavedSearches but returns null outside a provider. */
export function useSavedSearchesOptional(): SavedSearchesContextValue | null {
  return React.useContext(SavedSearchesContext);
}
