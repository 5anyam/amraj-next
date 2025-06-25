const API_BASE = "https://cms.amraj.in/wp-json/wc/v3";
const CONSUMER_KEY = process.env.CONSUMER_KEY || "ck_7610f309972822bfa8e87304ea6c47e9e93b8ff6";
const CONSUMER_SECRET = process.env.CONSUMER_SECRET || "cs_0f117bc7ec4611ca378adde03010f619c0af59b2";

export interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  short_description?: string;
  images?: { src: string }[];
  attributes?: { option: string }[];
}

export interface LineItem {
  product_id: number;
  quantity: number;
  name?: string;
  price?: string;
}

export interface OrderPayload {
  lineItems: LineItem[];
  shipping_address: {
    name: string;
    address_1: string;
    email?: string;
    phone?: string;
  };
  customer: {
    name: string;
    email: string;
  };
  payment_id?: string;
  payment_method?: string;
  status?: "pending" | "processing" | "completed" | "cancelled" | "on-hold" | "refunded" | "failed";
  notes?: string;
}

// ✅ FETCH ALL PRODUCTS
export async function fetchProducts(page = 1, perPage = 12, search?: string): Promise<Product[]> {
  let url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${perPage}&page=${page}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

// ✅ FETCH A SINGLE PRODUCT
export async function fetchProduct(id: string): Promise<Product> {
  const url = `${API_BASE}/products/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

// ✅ CREATE AN ORDER
export async function createOrder(payload: OrderPayload): Promise<unknown> {
  const url = `${API_BASE}/orders?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

  const orderData = {
    payment_method: payload.payment_method ?? "razorpay",
    payment_method_title: "Razorpay",
    set_paid: false,
    status: payload.status ?? "pending",
    billing: {
      first_name: payload.shipping_address.name,
      address_1: payload.shipping_address.address_1,
      email: payload.shipping_address.email || payload.customer.email,
      phone: payload.shipping_address.phone || "",
    },
    shipping: {
      first_name: payload.shipping_address.name,
      address_1: payload.shipping_address.address_1,
    },
    line_items: payload.lineItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
    })),
    meta_data: payload.payment_id
      ? [{ key: "razorpay_payment_id", value: payload.payment_id }]
      : [],
    customer_note:
      payload.notes ?? `Order placed via PlixBlue frontend`,
    email: payload.customer.email,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error("Order creation failed: " + (err?.message || res.statusText));
  }

  return res.json();
}

// ✅ UPDATE ORDER STATUS
export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "processing" | "completed" | "cancelled" | "on-hold" | "refunded" | "failed"
): Promise<unknown> {
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
