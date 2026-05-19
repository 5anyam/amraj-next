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

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: {
    id: number;
    src: string;
    alt: string;
  } | null;
  menu_order: number;
  count: number;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
  };
}

export interface Review {
  id: number;
  date_created: string;
  date_created_gmt: string;
  product_id: number;
  status: string;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  verified: boolean;
  reviewer_avatar_urls: { [key: string]: string };
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up: Array<{ href: string }>;
  };
}

export interface ReviewPayload {
  product_id: number;
  review: string;
  reviewer: string;
  reviewer_email?: string;
  rating: number;
  status?: 'approved' | 'hold' | 'spam' | 'unspam' | 'trash' | 'untrash';
}

export interface LineItem {
  product_id: number;
  quantity: number;
  name?: string;
  price?: string;
}

// ✅ UPDATED OrderPayload interface with proper address and coupon support
export interface OrderPayload {
  lineItems: LineItem[];
  shipping_address: {
    name: string;
    address_1: string;
    city?: string;
    state?: string;
    postcode?: string;
    email?: string;
    phone?: string;
  };
  billing_address?: {
    name: string;
    address_1: string;
    city?: string;
    state?: string;
    postcode?: string;
    email?: string;
    phone?: string;
  };
  customer: {
    name: string;
    email: string;
  };
  payment_id?: string;
  payment_method?: string;
  payment_method_title?: string;
  status?: "pending" | "processing" | "completed" | "cancelled" | "on-hold" | "refunded" | "failed";
  notes?: string;
  fee_lines?: Array<{
    name: string;
    amount: string;
  }>;
  coupon_discount?: number;
  applied_coupon?: string;
}

// ✅ FETCH ALL PRODUCTS
export async function fetchProducts(page = 1, perPage = 12, search?: string): Promise<Product[]> {
  let url = `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${perPage}&page=${page}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// ✅ FETCH A SINGLE PRODUCT
export async function fetchProduct(id: string): Promise<Product> {
  const url = `${API_BASE}/products/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// ✅ FETCH REVIEWS FOR A PRODUCT
export async function fetchProductReviews(
  productId: number,
  page = 1,
  perPage = 100,
  status: 'approved' | 'hold' | 'all' = 'approved'
): Promise<Review[]> {
  try {
    const url =
      `${API_BASE}/products/reviews?product=${productId}` +
      `&consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}` +
      `&per_page=${perPage}&page=${page}&status=${status}`;

    console.log('Fetching reviews from:', url);

    const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

    if (!res.ok) {
      console.error('Reviews fetch failed:', res.status, res.statusText);
      return [];
    }

    const reviews = await res.json();
    console.log(`Fetched ${Array.isArray(reviews) ? reviews.length : 0} reviews for product ${productId}`);
    return Array.isArray(reviews) ? reviews : [];
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

// ✅ CREATE A PRODUCT REVIEW
export async function createProductReview(payload: ReviewPayload): Promise<Review> {
  try {
    const url =
      `${API_BASE}/products/reviews?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    console.log('Creating review for product:', payload.product_id);

    const reviewData = {
      product_id: payload.product_id,
      review: payload.review,
      reviewer: payload.reviewer,
      reviewer_email: payload.reviewer_email || '',
      rating: payload.rating,
      status: payload.status || 'approved',
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Review creation failed:', err);
      throw new Error("Review creation failed: " + (err?.message || res.statusText));
    }

    const newReview = await res.json();
    console.log('Review created successfully:', newReview?.id);
    return newReview;
  } catch (error) {
    console.error('Error creating product review:', error);
    throw error;
  }
}

// ✅ UPDATE A PRODUCT REVIEW
export async function updateProductReview(
  _productId: number,
  reviewId: number,
  updates: Partial<ReviewPayload>
): Promise<Review> {
  try {
    const url =
      `${API_BASE}/products/reviews/${reviewId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error("Review update failed: " + (err?.message || res.statusText));
    }

    return res.json();
  } catch (error) {
    console.error('Error updating product review:', error);
    throw error;
  }
}

// ✅ DELETE A PRODUCT REVIEW
export async function deleteProductReview(_productId: number, reviewId: number): Promise<Review> {
  try {
    const url =
      `${API_BASE}/products/reviews/${reviewId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&force=true`;

    const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" } });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error("Review deletion failed: " + (err?.message || res.statusText));
    }

    return res.json();
  } catch (error) {
    console.error('Error deleting product review:', error);
    throw error;
  }
}

// ✅ FETCH ALL REVIEWS
export async function fetchAllReviews(
  page = 1,
  perPage = 100,
  status: 'approved' | 'hold' | 'all' = 'approved'
): Promise<Review[]> {
  try {
    const url =
      `${API_BASE}/products/reviews?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}` +
      `&per_page=${perPage}&page=${page}&status=${status}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error('All reviews fetch failed:', res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }
}

// ✅ UPDATED CREATE ORDER with proper address and coupon support
export async function createOrder(payload: OrderPayload): Promise<unknown> {
  const url = `${API_BASE}/orders?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

  const orderData = {
    payment_method: payload.payment_method ?? "razorpay",
    payment_method_title: payload.payment_method_title ?? "Razorpay",
    set_paid: false,
    status: payload.status ?? "pending",
    
    // ✅ Proper billing address for Shiprocket
    billing: {
      first_name: payload.shipping_address.name,
      address_1: payload.shipping_address.address_1,
      city: payload.shipping_address.city || "",
      state: payload.shipping_address.state || "",
      postcode: payload.shipping_address.postcode || "",
      email: payload.shipping_address.email || payload.customer.email,
      phone: payload.shipping_address.phone || "",
      country: "IN", // India
    },
    
    // ✅ Proper shipping address for Shiprocket
    shipping: {
      first_name: payload.shipping_address.name,
      address_1: payload.shipping_address.address_1,
      city: payload.shipping_address.city || "",
      state: payload.shipping_address.state || "",
      postcode: payload.shipping_address.postcode || "",
      country: "IN", // India
    },
    
    line_items: payload.lineItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
    })),
    
    // ✅ Add fee lines for discounts and delivery charges
    fee_lines: payload.fee_lines || [],
    
    meta_data: [
      ...(payload.payment_id ? [{ key: "razorpay_payment_id", value: payload.payment_id }] : []),
      ...(payload.applied_coupon ? [
        { key: "coupon_code", value: payload.applied_coupon },
        { key: "coupon_discount", value: payload.coupon_discount }
      ] : []),
      { key: "shiprocket_address", value: payload.shipping_address.address_1 },
    ],
    
    customer_note: payload.notes ?? `Order placed via Amraj Wellness frontend`,
    customer: {
      email: payload.customer.email,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

// ✅ FETCH ALL PRODUCT CATEGORIES
export async function fetchProductCategories(perPage = 12, hideEmpty = true): Promise<Category[]> {
  let url = `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=${perPage}`;
  if (hideEmpty) url += `&hide_empty=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

// ✅ FETCH SINGLE CATEGORY
export async function fetchSingleCategory(categoryId: number): Promise<Category> {
  const url = `${API_BASE}/products/categories/${categoryId}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

// ✅ FETCH PRODUCTS BY CATEGORY
export async function fetchProductsByCategory(categoryId: number, page = 1, perPage = 12): Promise<Product[]> {
  const url =
    `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}` +
    `&category=${categoryId}&per_page=${perPage}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products by category");
  return res.json();
}
