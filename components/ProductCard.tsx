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
    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-200 sm:duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 sm:hover:scale-[1.02] h-full flex flex-col">
      <Link href={productUrl} className="flex flex-col h-full">
        {/* Image Container with Gradient Overlay */}
        <div className="relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-br from-teal-50 to-orange-50 aspect-square flex-shrink-0">
          <img
            src={product.images?.[0]?.src || "/placeholder.png"}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300 sm:duration-700 ease-out"
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badge Container */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-start flex-wrap gap-2">
            {/* Discount Badge */}
            {isOnSale && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 animate-pulse rounded-full shadow-lg">
                <span className="flex items-center gap-1">
                  <span className="hidden sm:inline">🔥</span> {discountPercentage}% OFF
                </span>
              </div>
            )}
            
            {/* Product Badge */}
            {product.badge && (
              <div className={`text-white text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg ${
                product.badge === 'New' 
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600' 
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                <span className="flex items-center gap-1">
                  <span className="hidden sm:inline">{product.badge === 'New' ? '✨' : '🏷️'}</span> {product.badge}
                </span>
              </div>
            )}
          </div>

          {/* Quick View Button - Desktop Only */}
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 opacity-100 transition-all duration-200 transform translate-y-0 sm:block">
            <button className="bg-white/90 backdrop-blur-sm text-teal-600 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col">
          {/* Category Tag */}
          {product.category && (
            <div className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 bg-teal-50 px-2 sm:px-3 py-1 rounded-full border border-teal-100 self-start">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
              <span className="truncate">{product.category}</span>
            </div>
          )}

          {/* Product Name */}
<h3 className="text-sm sm:text-lg font-bold text-black line-clamp-2 leading-tight group-hover:text-teal-700 transition-colors duration-200 flex-shrink-0">
  {product.name}
</h3>

{/* Doctor Recommended */}
<div className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100 self-start">
  <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11h-2v-1H8a1 1 0 010-2h1V9H8a1 1 0 010-2h1V6h2v1h1a1 1 0 010 2h-1v1h1a1 1 0 010 2h-1v1z" />
  </svg>
  Doctor Recommended
</div>

{/* Rating */}
{Number.isFinite(rating) && rating > 0 && (
  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 sm:w-4 sm:h-4 ${
            i < Math.round(rating) ? "text-orange-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.92c.969 0 1.371 1.24.588 1.81l-3.977 2.89 1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674-3.977-2.89c-.784-.57-.38-1.81.588-1.81h4.92l1.518-4.674z" />
        </svg>
      ))}
    </div>
    <span className="text-xs sm:text-sm font-medium text-orange-500">
      {rating.toFixed(1)}
    </span>
    {product.rating_count && (
      <span className="text-xs text-gray-400 hidden sm:inline">
        ({product.rating_count})
      </span>
    )}
  </div>
)}

{/* Bought Count */}
<div className="text-xs text-gray-500">
  10,000+ bought
</div>


          {/* Price Section */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-2xl font-bold text-teal-600">
                ₹{salePrice.toLocaleString()}
              </span>
              {isOnSale && (
                <span className="text-xs sm:text-sm text-orange-400 line-through font-medium">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {isOnSale && (
              <div className="text-xs text-green-600 font-semibold bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                <span className="hidden sm:inline">Save </span>₹{(originalPrice - salePrice).toLocaleString()}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-black line-clamp-2 leading-relaxed opacity-80 flex-1">
              {product.short_description
                ?.replace(/<[^>]+>/g, "")
                .slice(0, 85)}{/* Limit to 120 characters */}
            </p>

          {/* Add to Cart Button - Always visible on mobile, hover on desktop */}
          <div className="pt-2 opacity-100 transition-all duration-200 transform translate-y-0 flex-shrink-0">
            <button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl text-sm sm:text-base">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                </svg>
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}