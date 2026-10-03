import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getAuthedMember, ownerKeyForMember, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Demo-facing order lifecycle: "confirmed" → "activating" → "active", derived
 * statelessly from the record age so the dashboard feels alive without a worker.
 */
function displayStatus(createdAt: Date): string {
  const ageMs = Date.now() - createdAt.getTime();
  if (ageMs > 1000 * 60 * 5) return "active";
  if (ageMs > 1000 * 60) return "activating";
  return "confirmed";
}

/** Short public id, e.g. "ST7ULHCV" — last 8 chars of the cuid, uppercased. */
function publicId(id: string): string {
  return id.slice(-8).toUpperCase();
}

/** GET /api/orders — list the visitor's membership orders (member-scoped or guest). */
export async function GET(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    const owner = ownerKeyForMember(member);

    const orders = await db.membershipOrder.findMany({
      where: { owner },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      owner,
      orders: orders.map((o) => ({
        id: publicId(o.id),
        plan: o.plan,
        fullName: o.fullName,
        email: o.email,
        city: o.city,
        amount: o.amount,
        status: displayStatus(o.createdAt),
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    console.error("[api/orders] GET failed", error);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

/** POST /api/orders — persist a membership plan order from the checkout flow. */
export async function POST(request: NextRequest) {
  try {
    const member = await getAuthedMember(request.cookies.get(SESSION_COOKIE)?.value);
    const owner = ownerKeyForMember(member);

    const body = (await request.json()) as {
      plan?: string;
      fullName?: string;
      email?: string;
      phone?: string;
      city?: string;
      amount?: string;
    };

    if (!body.plan || !body.fullName || !body.email) {
      return NextResponse.json(
        { error: "plan, fullName and email are required" },
        { status: 400 }
      );
    }

    const order = await db.membershipOrder.create({
      data: {
        plan: body.plan,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone ?? "",
        city: body.city ?? "",
        amount: body.amount ?? "",
        owner,
      },
    });

    return NextResponse.json(
      {
        orderId: publicId(order.id),
        plan: order.plan,
        amount: order.amount,
        status: displayStatus(order.createdAt),
        createdAt: order.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/orders] POST failed", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
