
/**
 * Utility functions for creating and handling product slugs in SEO URLs.
 */
export function productToSlug(product: { name: string }) {
  return product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Returns the slug directly from the url param
export function getProductSlugFromParam(slug: string | undefined) {
  if (!slug) return null;
  return slug;
}

// Helper to find a product from a list using the slug
export function findProductBySlug(products: any[], slug: string) {
  return products.find(
    (p) =>
      productToSlug(p) === slug
  );
}
