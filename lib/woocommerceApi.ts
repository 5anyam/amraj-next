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

// Reviews (output for app)
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
  images?: string[];
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    up: Array<{ href: string }>;
  };
}

// WooCommerce API shapes (strict)
interface ApiMetaItem {
  key: string;
  value: unknown;
}
interface ApiLinks {
  self?: Array<{ href: string }>;
  collection?: Array<{ href: string }>;
  up?: Array<{ href: string }>;
}
interface ApiReview {
  id: number;
  date_created?: string;
  date_created_gmt?: string;
  product_id?: number;
  status?: string;
  reviewer?: string;
  reviewer_email?: string;
  review?: string;
  rating?: number;
  verified?: boolean;
  reviewer_avatar_urls?: { [key: string]: string };
  meta_data?: ApiMetaItem[];
  _links?: ApiLinks;
}

// Guards
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const isApiMetaItem = (m: unknown): m is ApiMetaItem =>
  isRecord(m) && typeof m.key === 'string' && 'value' in m;

const isApiReview = (r: unknown): r is ApiReview =>
  isRecord(r) && typeof r.id === 'number';

// Payloads
export interface ReviewPayload {
  product_id: number;
  review: string;
  reviewer: string;
  reviewer_email?: string;
  rating: number;
  status?: 'approved' | 'hold' | 'spam' | 'unspam' | 'trash' | 'untrash';
  image_ids?: number[];
  image_urls?: string[];
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

// Helpers
const withKeys = (url: string) =>
  `${url}${url.includes("?") ? "&" : "?"}consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

// Products
export async function fetchProducts(page = 1, perPage = 12, search?: string): Promise<Product[]> {
  let url = `${API_BASE}/products?per_page=${perPage}&page=${page}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const res = await fetch(withKeys(url));
  if (!res.ok) throw new Error("Failed to fetch products");
  return (await res.json()) as Product[];
}

export async function fetchProduct(id: string): Promise<Product> {
  const url = withKeys(`${API_BASE}/products/${id}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch product");
  return (await res.json()) as Product;
}

// Resolve media IDs -> URLs
async function resolveMediaUrls(mediaIds: number[]): Promise<string[]> {
  const urls: string[] = [];
  for (const id of mediaIds) {
    try {
      const r = await fetch(`https://cms.amraj.in/wp-json/wp/v2/media/${id}`);
      if (!r.ok) continue;
      const m: unknown = await r.json();
      if (isRecord(m) && typeof m.source_url === 'string') {
        urls.push(m.source_url);
      }
    } catch {
      // ignore
    }
  }
  return urls;
}

// Extract image urls from meta_data safely
function extractImageUrlsFromMeta(meta?: ApiMetaItem[]): string[] | undefined {
  if (!Array.isArray(meta)) return undefined;
  const urlItem = meta.find((m) => isApiMetaItem(m) && m.key === 'amraj_review_image_urls');
  if (urlItem && Array.isArray(urlItem.value) && urlItem.value.every((x) => typeof x === 'string')) {
    return urlItem.value as string[];
  }
  const idItem = meta.find((m) => isApiMetaItem(m) && m.key === 'amraj_review_media');
  if (idItem && Array.isArray(idItem.value) && idItem.value.every((x) => typeof x === 'number')) {
    // Will be resolved by caller when needed
    return undefined;
  }
  return undefined;
}

function extractImageIdsFromMeta(meta?: ApiMetaItem[]): number[] | undefined {
  if (!Array.isArray(meta)) return undefined;
  const idItem = meta.find((m) => isApiMetaItem(m) && m.key === 'amraj_review_media');
  if (idItem && Array.isArray(idItem.value) && idItem.value.every((x) => typeof x === 'number')) {
    return idItem.value as number[];
  }
  return undefined;
}

// Map ApiReview -> Review (optionally inject images)
async function mapApiReviewToReview(rev: ApiReview): Promise<Review> {
  const imagesFromUrls = extractImageUrlsFromMeta(rev.meta_data);
  let images: string[] | undefined = imagesFromUrls;

  if (!imagesFromUrls) {
    const ids = extractImageIdsFromMeta(rev.meta_data);
    if (Array.isArray(ids) && ids.length) {
      images = await resolveMediaUrls(ids);
    }
  }

  return {
    id: rev.id,
    date_created: rev.date_created ?? '',
    date_created_gmt: rev.date_created_gmt ?? '',
    product_id: typeof rev.product_id === 'number' ? rev.product_id : 0,
    status: rev.status ?? 'approved',
    reviewer: rev.reviewer ?? 'Anonymous',
    reviewer_email: rev.reviewer_email ?? '',
    review: rev.review ?? '',
    rating: typeof rev.rating === 'number' ? rev.rating : 0,
    verified: Boolean(rev.verified),
    reviewer_avatar_urls: isRecord(rev.reviewer_avatar_urls) ? (rev.reviewer_avatar_urls as { [k: string]: string }) : {},
    images,
    _links: {
      self: (rev._links?.self as Array<{ href: string }>) || [],
      collection: (rev._links?.collection as Array<{ href: string }>) || [],
      up: (rev._links?.up as Array<{ href: string }>) || [],
    },
  };
}

// FETCH REVIEWS
export async function fetchProductReviews(
  productId: number,
  page = 1,
  perPage = 100,
  status: 'approved' | 'hold' | 'all' = 'approved'
): Promise<Review[]> {
  try {
    const url = withKeys(`${API_BASE}/products/reviews?product=${productId}&per_page=${perPage}&page=${page}&status=${status}`);
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return [];

    const data: unknown = await res.json();
    const list: ApiReview[] = Array.isArray(data) ? data.filter(isApiReview) : [];
    const mapped = await Promise.all(list.map(mapApiReviewToReview));
    return mapped;
  } catch {
    return [];
  }
}

// CREATE REVIEW
export async function createProductReview(payload: ReviewPayload): Promise<Review> {
  const url = withKeys(`${API_BASE}/products/reviews`);

  const meta_data: Array<{ key: string; value: unknown }> = [];
  if (payload.image_ids?.length) meta_data.push({ key: 'amraj_review_media', value: payload.image_ids });
  if (payload.image_urls?.length) meta_data.push({ key: 'amraj_review_image_urls', value: payload.image_urls });

  const body = {
    product_id: payload.product_id,
    review: payload.review,
    reviewer: payload.reviewer,
    reviewer_email: payload.reviewer_email || '',
    rating: payload.rating,
    status: payload.status || 'approved',
    ...(meta_data.length ? { meta_data } : {})
  };

  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    const err: unknown = await res.json().catch(() => undefined);
    const msg = isRecord(err) && typeof err.message === 'string' ? err.message : res.statusText;
    throw new Error("Review creation failed: " + msg);
  }

  const createdUnknown: unknown = await res.json();
  // Narrow and map back to Review
  if (isApiReview(createdUnknown)) {
    return await mapApiReviewToReview(createdUnknown);
  }
  // Fallback minimal review
  return {
    id: Date.now(),
    date_created: new Date().toISOString(),
    date_created_gmt: new Date().toISOString(),
    product_id: payload.product_id,
    status: payload.status || 'approved',
    reviewer: payload.reviewer,
    reviewer_email: payload.reviewer_email || '',
    review: payload.review,
    rating: payload.rating,
    verified: false,
    reviewer_avatar_urls: {},
    images: payload.image_urls,
    _links: { self: [], collection: [], up: [] },
  };
}

// UPDATE REVIEW
export async function updateProductReview(
  _productId: number,
  reviewId: number,
  updates: Partial<ReviewPayload>
): Promise<Review> {
  const url = withKeys(`${API_BASE}/products/reviews/${reviewId}`);

  const meta_data: Array<{ key: string; value: unknown }> = [];
  if (updates.image_ids?.length) meta_data.push({ key: 'amraj_review_media', value: updates.image_ids });
  if (updates.image_urls?.length) meta_data.push({ key: 'amraj_review_image_urls', value: updates.image_urls });

  const body: Record<string, unknown> = {};
  if (typeof updates.review === 'string') body.review = updates.review;
  if (typeof updates.reviewer === 'string') body.reviewer = updates.reviewer;
  if (typeof updates.reviewer_email === 'string') body.reviewer_email = updates.reviewer_email;
  if (typeof updates.rating === 'number') body.rating = updates.rating;
  if (typeof updates.status === 'string') body.status = updates.status;
  if (meta_data.length) body.meta_data = meta_data;

  const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    const err: unknown = await res.json().catch(() => undefined);
    const msg = isRecord(err) && typeof err.message === 'string' ? err.message : res.statusText;
    throw new Error("Review update failed: " + msg);
  }

  const updatedUnknown: unknown = await res.json();
  if (isApiReview(updatedUnknown)) {
    return await mapApiReviewToReview(updatedUnknown);
  }
  // Minimal fallback (should not happen)
  return {
    id: reviewId,
    date_created: new Date().toISOString(),
    date_created_gmt: new Date().toISOString(),
    product_id: 0,
    status: 'approved',
    reviewer: updates.reviewer || 'Anonymous',
    reviewer_email: updates.reviewer_email || '',
    review: updates.review || '',
    rating: updates.rating || 0,
    verified: false,
    reviewer_avatar_urls: {},
    images: updates.image_urls,
    _links: { self: [], collection: [], up: [] },
  };
}

// DELETE REVIEW
export async function deleteProductReview(_productId: number, reviewId: number): Promise<Review> {
  const url = withKeys(`${API_BASE}/products/reviews/${reviewId}?force=true`);
  const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    const err: unknown = await res.json().catch(() => undefined);
    const msg = isRecord(err) && typeof err.message === 'string' ? err.message : res.statusText;
    throw new Error("Review deletion failed: " + msg);
  }
  const deletedUnknown: unknown = await res.json();
  if (isApiReview(deletedUnknown)) {
    return await mapApiReviewToReview(deletedUnknown);
  }
  // Minimal fallback
  return {
    id: reviewId,
    date_created: new Date().toISOString(),
    date_created_gmt: new Date().toISOString(),
    product_id: 0,
    status: 'trash',
    reviewer: 'Anonymous',
    reviewer_email: '',
    review: '',
    rating: 0,
    verified: false,
    reviewer_avatar_urls: {},
    _links: { self: [], collection: [], up: [] },
  };
}

// ALL REVIEWS
export async function fetchAllReviews(
  page = 1,
  perPage = 100,
  status: 'approved' | 'hold' | 'all' = 'approved'
): Promise<Review[]> {
  const url = withKeys(`${API_BASE}/products/reviews?per_page=${perPage}&page=${page}&status=${status}`);
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: unknown = await res.json();
  const list: ApiReview[] = Array.isArray(data) ? data.filter(isApiReview) : [];
  const mapped = await Promise.all(list.map(mapApiReviewToReview));
  return mapped;
}

// Orders & Categories (unchanged)
export async function createOrder(payload: OrderPayload): Promise<unknown> {
  const url = withKeys(`${API_BASE}/orders`);
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
    meta_data: payload.payment_id ? [{ key: "razorpay_payment_id", value: payload.payment_id }] : [],
    customer_note: payload.notes ?? `Order placed via PlixBlue frontend`,
    email: payload.customer.email,
  };

  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) });
  if (!res.ok) {
    const err: unknown = await res.json().catch(() => undefined);
    const msg = isRecord(err) && typeof err.message === 'string' ? err.message : res.statusText;
    throw new Error("Order creation failed: " + msg);
  }
  return res.json() as Promise<unknown>;
}

export async function updateOrderStatus(
  orderId: number,
  status: "pending" | "processing" | "completed" | "cancelled" | "on-hold" | "refunded" | "failed"
): Promise<unknown> {
  const url = withKeys(`${API_BASE}/orders/${orderId}`);
  const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  if (!res.ok) {
    const err: unknown = await res.json().catch(() => undefined);
    const msg = isRecord(err) && typeof err.message === 'string' ? err.message : res.statusText;
    throw new Error(msg || "Failed to update order status");
  }
  return res.json() as Promise<unknown>;
}

export async function fetchProductCategories(perPage = 12, hideEmpty = true): Promise<Category[]> {
  let url = `${API_BASE}/products/categories?per_page=${perPage}`;
  if (hideEmpty) url += `&hide_empty=true`;
  const res = await fetch(withKeys(url));
  if (!res.ok) throw new Error("Failed to fetch categories");
  return (await res.json()) as Category[];
}

export async function fetchSingleCategory(categoryId: number): Promise<Category> {
  const url = withKeys(`${API_BASE}/products/categories/${categoryId}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch category");
  return (await res.json()) as Category;
}

export async function fetchProductsByCategory(categoryId: number, page = 1, perPage = 12): Promise<Product[]> {
  const url = withKeys(`${API_BASE}/products?category=${categoryId}&per_page=${perPage}&page=${page}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products by category");
  return (await res.json()) as Product[];
}
