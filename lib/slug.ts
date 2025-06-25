
/**
 * Utility functions for creating and handling product slugs in SEO URLs.
 */
export function productToSlug(product: { name: string }) {
  return product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// lib/slug.ts
import { Product } from "./types";

export function findProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find((p) =>
    p.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );
}


// Returns the slug directly from the url param
export function getProductSlugFromParam(slug: string | undefined) {
  if (!slug) return null;
  return slug;
}


