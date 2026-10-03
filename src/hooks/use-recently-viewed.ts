"use client";

import * as React from "react";

const STORAGE_KEY = "saptapadi-recent";
const MAX_ITEMS = 8;

/**
 * Recently-viewed profile ids, persisted per browser in localStorage.
 * - `record(id)` moves an id to the front (deduped, capped at MAX_ITEMS).
 * - `remove(id)` drops one entry ("clear from history" affordances).
 * - `clear()` empties the history.
 * SSR-safe: reads only in an effect, so hydration always renders empty first.
 */
export function useRecentlyViewed() {
  const [ids, setIds] = React.useState<string[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((v): v is string => typeof v === "string"));
        }
      }
    } catch {
      // corrupted storage — start fresh
    }
    setReady(true);
  }, []);

  const persist = React.useCallback((next: string[]) => {
    setIds(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage full/blocked — in-memory only
    }
  }, []);

  const record = React.useCallback(
    (id: string) => {
      setIds((prev) => {
        const next = [id, ...prev.filter((v) => v !== id)].slice(0, MAX_ITEMS);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const remove = React.useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((v) => v !== id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clear = React.useCallback(() => persist([]), [persist]);

  return { ids, ready, record, remove, clear };
}
