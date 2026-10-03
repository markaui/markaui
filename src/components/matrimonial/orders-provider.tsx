"use client";

import * as React from "react";

import { useAuth } from "./auth-provider";

export interface OrderRecord {
  id: string;
  plan: string;
  fullName: string;
  email: string;
  city: string;
  amount: string;
  status: string;
  createdAt: string;
}

interface OrdersContextValue {
  /** Full records (server-backed, newest first). */
  records: OrderRecord[];
  count: number;
  ready: boolean;
  /** Current plan tier inferred from the most recent active paid order, else null. */
  currentPlan: string | null;
  /** Highest plan tier ever purchased (Free < Silver < Gold < Diamond). */
  bestPlan: string | null;
  refresh: () => Promise<void>;
}

const PLAN_RANK: Record<string, number> = { Free: 0, Silver: 1, Gold: 2, Diamond: 3 };

const OrdersContext = React.createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { member } = useAuth();
  const ownerKey = member?.email ?? "guest";
  const [records, setRecords] = React.useState<OrderRecord[]>([]);
  const [ready, setReady] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { orders: OrderRecord[] };
      setRecords(data.orders);
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

  const currentPlan = React.useMemo(() => {
    const active = records.find((r) => r.status === "active" && r.plan !== "Free");
    return active?.plan ?? null;
  }, [records]);

  const bestPlan = React.useMemo(() => {
    let best: string | null = null;
    for (const r of records) {
      if ((PLAN_RANK[r.plan] ?? 0) > (PLAN_RANK[best ?? "Free"] ?? 0)) best = r.plan;
    }
    return best;
  }, [records]);

  const value = React.useMemo<OrdersContextValue>(
    () => ({
      records,
      count: records.length,
      ready,
      currentPlan,
      bestPlan,
      refresh,
    }),
    [records, ready, currentPlan, bestPlan, refresh]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = React.useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within <OrdersProvider>");
  return ctx;
}

/** Same as useOrders but returns null outside a provider (optional consumption). */
export function useOrdersOptional(): OrdersContextValue | null {
  return React.useContext(OrdersContext);
}

/** Shared POST used by PlanCheckout — returns the public order id. */
export async function postOrder(payload: {
  plan: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  amount: string;
}): Promise<{ ok: boolean; orderId: string }> {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, orderId: "SAP-OFFLINE" };
    const data = (await res.json()) as { orderId?: string };
    return { ok: true, orderId: data.orderId ?? "SAP-000000" };
  } catch {
    return { ok: false, orderId: "SAP-OFFLINE" };
  }
}
