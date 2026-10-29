// app/api/razorpay/verify/route.ts
// Verifies the Razorpay payment signature server-side (order_id | payment_id -> HMAC-SHA256).
// If the secret isn't configured, returns { valid: true, skipped: true } so the
// amount-only fallback flow still completes.
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    if (!KEY_SECRET) {
      return NextResponse.json({ valid: true, skipped: true });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ valid: false, error: "Missing payment fields" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid = expected === razorpay_signature;
    return NextResponse.json({ valid }, { status: valid ? 200 : 400 });
  } catch (error) {
    console.error("[RZP-API] Verify exception:", error);
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
