// lib/slug.ts

/**
 * Utility functions for handling product slugs directly from WordPress backend.
 */

import { Product } from "./types";

/**
 * Returns the slug from the product directly (from WordPress).
 * This is mostly redundant if you're already using product.slug everywhere.
 */
export function productToSlug(product: Product): string {
  return product.slug;
}

/**
 * Finds a product by its slug (WordPress slug) from the list of products.
 * Slug comparison is case-insensitive.
 */
export function findProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find((product) => product.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Gets the product slug from the URL param.
 * Returns null if slug is undefined.
 */
export function getProductSlugFromParam(slug: string | undefined): string | null {
  return slug ?? null;
}
