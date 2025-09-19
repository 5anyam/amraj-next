import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt } = await request.json();

    console.log('Creating Razorpay order:', { amount, currency, receipt });

    // ✅ Fixed: Await the promise and use correct payment_capture type
    const order = await razorpay.orders.create({
      amount: Number(amount), // Amount should be in paise
      currency: currency || 'INR',
      receipt: receipt,
      payment_capture: true, // ✅ Fixed: boolean instead of number
    });

    console.log('Razorpay order created successfully:', order);

    // ✅ Fixed: Access properties correctly from awaited order
    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      status: order.status,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
