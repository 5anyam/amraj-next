
// app/api/woocommerce/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_CONFIG = {
  BASE_URL: process.env.API_BASE || 'https://cms.amraj.in',
  CONSUMER_KEY: process.env.CONSUMER_KEY || 'ck_7610f309972822bfa8e87304ea6c47e9e93b8ff6',
  CONSUMER_SECRET: process.env.CONSUMER_SECRET || 'cs_0f117bc7ec4611ca378adde03010f619c0af59b2',
};

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    console.log('[WC-API] Creating order:', orderData);

    const auth = Buffer.from(`${WOOCOMMERCE_CONFIG.CONSUMER_KEY}:${WOOCOMMERCE_CONFIG.CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(`${WOOCOMMERCE_CONFIG.BASE_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WC-API] Error response:', errorText);
      throw new Error(`WooCommerce API Error: ${response.status} - ${errorText}`);
    }

    const order = await response.json();
    console.log('[WC-API] Order created successfully:', { id: order.id, status: order.status });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[WC-API] Create order error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}
