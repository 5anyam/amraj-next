import Link from "next/link";
import { productToSlug } from "../lib/slug";

interface Product {
  id: number | string;
  name: string;
  price: string | number; // Sale price
  regular_price?: string | number; // Original price
  images?: { src: string }[];
  short_description?: string;
  category?: string;
  average_rating?: string; // WooCommerce gives rating as string
  rating_count?: number;
  badge?: "New" | "Sale";
}

export default function ProductCard({ product }: { product: Product }) {
  const productUrl = `/product/${productToSlug(product)}`;
  const rating = Number(product.average_rating);
  const salePrice = Number(product.price);
  const originalPrice = Number(product.regular_price);
  const isOnSale = originalPrice > salePrice;

  const discountPercentage = isOnSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#1e1b3a] shadow-md border border-gray-200 dark:border-blue-800 transition-transform hover:-translate-y-1 hover:shadow-lg duration-300">
      <Link href={productUrl}>
        <div className="relative overflow-hidden border border-teal-500 rounded-t-2xl bg-blue-50 dark:bg-blue-900/20 aspect-square">
          <img
            src={product.images?.[0]?.src || "/placeholder.png"}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />

          {/* Optional Badge */}
          {product.badge && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md uppercase">
              {product.badge}
            </span>
          )}

          {/* Discount Badge */}
          {isOnSale && (
            <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        <div className="p-4">
          {/* Category */}
          {product.category && (
            <div className="mb-1 text-xs text-teal-500 bg-green-100 dark:bg-green-900 inline-block px-2 py-0.5 rounded-full capitalize">
              {product.category}
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-blue-100 line-clamp-1">
            {product.name}
          </h3>

          {/* Prices */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xl font-bold text-teal-500">
              ₹{salePrice}
            </span>
            {isOnSale && (
              <span className="text-sm text-orange-400 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
            {product.short_description?.replace(/<[^>]+>/g, "")}
          </p>

          {/* Ratings */}
          {Number.isFinite(rating) && rating > 0 && (
            <div className="mt-2 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={
                    i < Math.round(rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  width={16}
                  height={16}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.92c.969 0 1.371 1.24.588 1.81l-3.977 2.89 1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674-3.977-2.89c-.784-.57-.38-1.81.588-1.81h4.92l1.518-4.674z" />
                </svg>
              ))}
              {product.rating_count && (
                <span className="text-xs text-gray-500 dark:text-gray-300 ml-2">
                  ({product.rating_count})
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
