"use client";

import * as React from "react";

import { useAuth } from "./auth-provider";

export interface NotificationRecord {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  refId: string | null;
  createdAt: string;
}

interface NotificationsContextValue {
  /** Full records (server-backed, newest first). */
  records: NotificationRecord[];
  /** Number of unread notifications. */
  unread: number;
  /** True once the first load has settled (used to gate skeletons). */
  ready: boolean;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationsContext = React.createContext<NotificationsContextValue | null>(null);

const POLL_INTERVAL_MS = 30_000;

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { member } = useAuth();
  const ownerKey = member?.email ?? "guest";
  const [records, setRecords] = React.useState<NotificationRecord[]>([]);
  const [unread, setUnread] = React.useState(0);
  const [ready, setReady] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as {
        notifications: NotificationRecord[];
        unread: number;
      };
      setRecords(data.notifications);
      setUnread(data.unread);
    } catch {
      // offline / DB hiccup — keep current state
    } finally {
      setReady(true);
    }
  }, []);

  React.useEffect(() => {
    setRecords([]);
    setUnread(0);
    setReady(false);
    if (ownerKey === "guest") {
      // Guests have no feed — mark ready so the bell never stalls.
      setReady(true);
      return;
    }
    void refresh();
    // Gentle polling keeps the feed alive (matches the stateless lifecycle).
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [ownerKey, refresh]);

  const markRead = React.useCallback(async (id: string) => {
    setRecords((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((u) => Math.max(0, u - 1));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // optimistic — next refresh reconciles
    }
  }, []);

  const markAllRead = React.useCallback(async () => {
    setRecords((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
    } catch {
      // optimistic — next refresh reconciles
    }
  }, []);

  const remove = React.useCallback(async (id: string) => {
    const target = records.find((n) => n.id === id);
    setRecords((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.read) setUnread((u) => Math.max(0, u - 1));
    try {
      await fetch(`/api/notifications?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      // optimistic — next refresh reconciles
    }
  }, [records]);

  const clearAll = React.useCallback(async () => {
    setRecords([]);
    setUnread(0);
    try {
      await fetch("/api/notifications?all=1", { method: "DELETE" });
    } catch {
      // optimistic — next refresh reconciles
    }
  }, []);

  const value = React.useMemo<NotificationsContextValue>(
    () => ({
      records,
      unread,
      ready,
      refresh,
      markRead,
      markAllRead,
      remove,
      clearAll,
    }),
    [records, unread, ready, refresh, markRead, markAllRead, remove, clearAll]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

/** Access the notifications feed. Throws outside the provider. */
export function useNotifications(): NotificationsContextValue {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

/** Optional variant for doc demos that may render without the provider. */
export function useNotificationsOptional(): NotificationsContextValue | null {
  return React.useContext(NotificationsContext);
}
