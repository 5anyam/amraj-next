import { PRODUCTS, StaticProduct } from './products-data';

/** Product photos are managed in WordPress: change them there and the site picks them up
 *  within an hour. Everything else (prices, copy, ingredients) still comes from
 *  products-data.ts. If WordPress is unreachable, the images in products-data.ts are used. */

export const CMS_IMAGES_REVALIDATE = 3600;

const STORE_API = 'https://cms.amraj.in/wp-json/wc/store/v1/products';

async function fetchCmsImages(): Promise<Map<number, string[]>> {
  const ids = PRODUCTS.map((p) => p.id).join(',');
  try {
    const res = await fetch(`${STORE_API}?include=${ids}&per_page=${PRODUCTS.length}`, {
      next: { revalidate: CMS_IMAGES_REVALIDATE },
    });
    if (!res.ok) return new Map();
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return new Map();
    const map = new Map<number, string[]>();
    for (const p of data as { id?: unknown; images?: { src?: unknown }[] }[]) {
      const srcs = (p.images ?? []).map((i) => i.src).filter((s): s is string => typeof s === 'string' && s.length > 0);
      if (typeof p.id === 'number' && srcs.length > 0) map.set(p.id, srcs);
    }
    return map;
  } catch {
    return new Map();
  }
}

/** The catalogue with each product's photos taken from WordPress. */
export async function getProducts(): Promise<StaticProduct[]> {
  const images = await fetchCmsImages();
  return PRODUCTS.map((p) => ({ ...p, images: images.get(p.id) ?? p.images }));
}

export async function getProduct(slug: string): Promise<StaticProduct | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}
