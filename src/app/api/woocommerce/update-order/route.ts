
// app/api/woocommerce/update-order/route.ts
import { NextRequest, NextResponse } from "next/server";

const WOOCOMMERCE_CONFIG = {
  BASE_URL: process.env.API_BASE,
  CONSUMER_KEY: process.env.CONSUMER_KEY,
  CONSUMER_SECRET: process.env.CONSUMER_SECRET,
};

export async function PUT(request: NextRequest) {
  try {
    const { orderId, updateData } = await request.json();

    console.log('[WC-API] Updating order:', { orderId, updateData });

    const auth = Buffer.from(`${WOOCOMMERCE_CONFIG.CONSUMER_KEY}:${WOOCOMMERCE_CONFIG.CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(`${WOOCOMMERCE_CONFIG.BASE_URL}/wp-json/wc/v3/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WC-API] Update error response:', errorText);
      throw new Error(`WooCommerce API Error: ${response.status} - ${errorText}`);
    }

    const updatedOrder = await response.json();
    console.log('[WC-API] Order updated successfully:', { id: updatedOrder.id, status: updatedOrder.status });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('[WC-API] Update order error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update order' },
      { status: 500 }
    );
  }
}
