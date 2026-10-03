"use client";

import * as React from "react";

const STORAGE_KEY = "saptapadi-shortlist";

interface ShortlistContextValue {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const ShortlistContext = React.createContext<ShortlistContextValue | null>(null);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setIds(parsed.filter((x) => typeof x === "string"));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = React.useCallback((next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo<ShortlistContextValue>(
    () => ({
      ids,
      count: ids.length,
      has: (id) => ids.includes(id),
      toggle: (id) => persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
      add: (id) => persist(ids.includes(id) ? ids : [...ids, id]),
      remove: (id) => persist(ids.filter((x) => x !== id)),
      clear: () => persist([]),
    }),
    [ids, persist]
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist(): ShortlistContextValue {
  const ctx = React.useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used within <ShortlistProvider>");
  return ctx;
}
