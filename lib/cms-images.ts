import { PRODUCTS, StaticProduct } from './products-data';

/** Product photos and stock status are managed in WordPress: change them there and the
 *  site picks them up within a few minutes. Everything else (prices, copy, ingredients)
 *  still comes from products-data.ts. If WordPress is unreachable, the images in
 *  products-data.ts are used and products are treated as in stock. */

export const CMS_REVALIDATE = 300;

const STORE_API = 'https://cms.amraj.in/wp-json/wc/store/v1/products';

interface CmsProduct {
  images?: string[];
  inStock?: boolean;
}

async function fetchCmsProducts(): Promise<Map<number, CmsProduct>> {
  const ids = PRODUCTS.map((p) => p.id).join(',');
  try {
    const res = await fetch(`${STORE_API}?include=${ids}&per_page=${PRODUCTS.length}`, {
      next: { revalidate: CMS_REVALIDATE },
    });
    if (!res.ok) return new Map();
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return new Map();
    const map = new Map<number, CmsProduct>();
    for (const p of data as { id?: unknown; images?: { src?: unknown }[]; is_in_stock?: unknown }[]) {
      if (typeof p.id !== 'number') continue;
      const srcs = (p.images ?? []).map((i) => i.src).filter((s): s is string => typeof s === 'string' && s.length > 0);
      map.set(p.id, {
        images: srcs.length > 0 ? srcs : undefined,
        inStock: typeof p.is_in_stock === 'boolean' ? p.is_in_stock : undefined,
      });
    }
    return map;
  } catch {
    return new Map();
  }
}

/** The catalogue with each product's photos and stock status taken from WordPress. */
export async function getProducts(): Promise<StaticProduct[]> {
  const cms = await fetchCmsProducts();
  return PRODUCTS.map((p) => {
    const c = cms.get(p.id);
    return { ...p, images: c?.images ?? p.images, inStock: c?.inStock ?? true };
  });
}

export async function getProduct(slug: string): Promise<StaticProduct | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}
