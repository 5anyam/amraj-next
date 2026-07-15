// app/api/razorpay/create-order/route.ts
// Creates a Razorpay Order server-side (the reliable, recommended integration).
// Needs RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET in .env.local.
// If the secret is not configured, returns { configured: false } so the checkout
// safely falls back to the amount-only flow (nothing breaks).
import { NextRequest, NextResponse } from "next/server";

const KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_live_RJVNEePx4007GD";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    if (!KEY_SECRET) {
      // Secret not set — tell the client to use the fallback flow.
      return NextResponse.json({ configured: false });
    }

    const { amount, receipt, notes } = await request.json();
    if (!amount || amount < 100) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount), // in paise
        currency: "INR",
        receipt: receipt || undefined,
        notes: notes || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[RZP-API] Order error:", data);
      return NextResponse.json(
        { error: data?.error?.description || `Razorpay order failed (${res.status})` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      configured: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: KEY_ID,
    });
  } catch (error) {
    console.error("[RZP-API] Create order exception:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
