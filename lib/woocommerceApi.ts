const API_BASE = "https://cms.amraj.in/wp-json/wc/v3";
const CONSUMER_KEY = process.env.CONSUMER_KEY || "ck_7610f309972822bfa8e87304ea6c47e9e93b8ff6";
const CONSUMER_SECRET = process.env.CONSUMER_SECRET || "cs_0f117bc7ec4611ca378adde03010f619c0af59b2";

// Fetch all products (with pagination and search)
export async function fetchProducts(
  page = 1,
  perPage = 12,
  search?: string
) {
  let url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${perPage}&page=${page}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: string) {
  const url = `${API_BASE}/products/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// Create a WooCommerce order
export async function createOrder({
  lineItems,
  shipping_address,
  customer,
  payment_id,
  payment_method = "razorpay",
  status = "pending",
  notes = ""
}: {
  lineItems: Array<{ product_id: number; quantity: number; name?: string; price?: string }>;
  shipping_address: { name: string; address_1: string; email?: string; phone?: string };
  customer: { name: string; email: string };
  payment_id?: string;
  payment_method?: string;
  status?: "pending" | "processing" | "completed" | "cancelled" | "on-hold" | "refunded" | "failed";
  notes?: string;
}) {
  const url = `${API_BASE}/orders?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

  const orderPayload: any = {
    payment_method,
    payment_method_title: "Razorpay",
    set_paid: false,
    status,
    billing: {
      first_name: shipping_address.name,
      address_1: shipping_address.address_1,
      email: shipping_address.email || customer.email,
      phone: shipping_address.phone || "",
    },
    shipping: {
      first_name: shipping_address.name,
      address_1: shipping_address.address_1,
    },
    line_items: lineItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
    })),
    meta_data: [],
    customer_note: notes ? notes : `Order placed via PlixBlue frontend`,
    email: customer.email,
  };

  if (payment_id) {
    orderPayload.meta_data.push({ key: "razorpay_payment_id", value: payment_id });
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error("Order creation failed: " + (err?.message || res.statusText));
  }

  return res.json();
}

// Update order status ('processing', 'completed', etc)
export async function updateOrderStatus(orderId: number, status: "pending" | "processing" | "completed" | "cancelled" | "on-hold" | "refunded" | "failed") {
  const url = `${API_BASE}/orders/${orderId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update order status");
  }
  return res.json();
}
