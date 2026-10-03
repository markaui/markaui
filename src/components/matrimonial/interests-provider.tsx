"use client";

import * as React from "react";

import { useAuth } from "./auth-provider";

export interface InterestRecord {
  id: string;
  profileId: string;
  profileName: string;
  note: string | null;
  status: string;
  createdAt: string;
}

interface InterestsContextValue {
  /** Full records (server-backed, newest first). */
  records: InterestRecord[];
  /** Profile ids that already have a sent interest (server-backed). */
  profileIds: Set<string>;
  count: number;
  ready: boolean;
  sendingId: string | null;
  has: (profileId: string) => boolean;
  send: (profileId: string, profileName: string, note?: string) => Promise<boolean>;
  withdraw: (profileId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const InterestsContext = React.createContext<InterestsContextValue | null>(null);

export function InterestsProvider({ children }: { children: React.ReactNode }) {
  const { member } = useAuth();
  const ownerKey = member?.email ?? "guest";
  const [records, setRecords] = React.useState<InterestRecord[]>([]);
  const [ready, setReady] = React.useState(false);
  const [sendingId, setSendingId] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch("/api/interests", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { interests: InterestRecord[] };
      setRecords(data.interests);
    } catch {
      // offline / DB hiccup — keep current state
    } finally {
      setReady(true);
    }
  }, []);

  React.useEffect(() => {
    setRecords([]);
    setReady(false);
    void refresh();
  }, [ownerKey, refresh]);

  const send = React.useCallback(
    async (profileId: string, profileName: string, note?: string) => {
    setSendingId(profileId);
    try {
      const res = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          profileName,
          ...(note !== undefined ? { note } : {}),
        }),
      });
      if (!res.ok) return false;
      const data = (await res.json().catch(() => null)) as {
        interest?: { note?: string | null };
      } | null;
      const savedNote = data?.interest?.note ?? (note?.trim() ? note.trim() : null);
      setRecords((prev) => {
        const existing = prev.find((r) => r.profileId === profileId);
        if (existing) {
          return prev.map((r) =>
            r.profileId === profileId
              ? { ...r, profileName, note: savedNote }
              : r
          );
        }
        return [
          {
            id: `local-${profileId}`,
            profileId,
            profileName,
            note: savedNote,
            status: "sent",
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
      return true;
    } catch {
      return false;
    } finally {
      setSendingId(null);
    }
  },
  []);

  const withdraw = React.useCallback(async (profileId: string) => {
    try {
      await fetch(`/api/interests?profileId=${encodeURIComponent(profileId)}`, {
        method: "DELETE",
      });
      setRecords((prev) => prev.filter((r) => r.profileId !== profileId));
    } catch {
      // ignore
    }
  }, []);

  const profileIds = React.useMemo(
    () => new Set(records.map((r) => r.profileId)),
    [records]
  );

  const value = React.useMemo<InterestsContextValue>(
    () => ({
      records,
      profileIds,
      count: records.length,
      ready,
      sendingId,
      has: (profileId) => profileIds.has(profileId),
      send,
      withdraw,
      refresh,
    }),
    [records, profileIds, ready, sendingId, send, withdraw, refresh]
  );

  return <InterestsContext.Provider value={value}>{children}</InterestsContext.Provider>;
}

export function useInterests(): InterestsContextValue {
  const ctx = React.useContext(InterestsContext);
  if (!ctx) throw new Error("useInterests must be used within <InterestsProvider>");
  return ctx;
}

/** Same as useInterests but returns null outside a provider (optional consumption). */
export function useInterestsOptional(): InterestsContextValue | null {
  return React.useContext(InterestsContext);
}
