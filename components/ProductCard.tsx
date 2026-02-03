'use client';

import Link from "next/link";
import { productToSlug } from "../lib/slug";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface Product {
  id: number | string;
  slug: string;
  name: string;
  price: string | number;
  regular_price: string;
  images?: { src: string }[];
  short_description?: string;
  category?: string;
  average_rating?: string;
  rating_count?: number;
  badge?: "New" | "Sale";
}

// Stable bought count helper
function getStableBoughtCount(product: Product): string {
  if (typeof window === "undefined") return "";
  const key = `boughtCount:${product.id || product.slug}`;
  const stored = window.localStorage.getItem(key);
  if (stored) return `${stored}`;
  const anchors = ["1.2k", "850", "2.5k", "500+"];
  const pick = anchors[Math.floor(Math.random() * anchors.length)];
  window.localStorage.setItem(key, pick);
  return pick;
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

  const boughtCount = getStableBoughtCount(product);

  return (
    <div className="group relative w-full h-full flex flex-col">
      <Link href={productUrl} className="block relative overflow-hidden rounded-[2rem] bg-gray-100 aspect-[0.85]">
        
        {/* Product Image */}
        <img
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 mix-blend-multiply"
        />

        {/* Unique Gradient Overlay (Only visible on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {isOnSale && (
             <span className="backdrop-blur-md bg-white/90 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
               -{discountPercentage}%
             </span>
           )}
           {product.badge === "New" && (
             <span className="backdrop-blur-md bg-black/80 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
               New Drop
             </span>
           )}
        </div>

        {/* UNIQUE INTERACTION: The Floating 'Add' Pill */}
        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
           <button className="flex items-center gap-2 bg-white text-black px-4 py-3 rounded-full shadow-xl hover:bg-black hover:text-white transition-colors">
              <ShoppingBagIcon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider pr-1">Add</span>
           </button>
        </div>

      </Link>

      {/* Minimalist Info Section */}
      <div className="pt-4 px-1 flex flex-col gap-1">
        
        {/* Top Row: Rating & Bought Count (Social Proof) */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
           <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <StarIconSolid className="w-3 h-3 text-orange-400" />
              <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
              <span className="text-gray-300">/</span>
              <span>{product.rating_count || 42} reviews</span>
           </div>
           {boughtCount && (
             <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
               {boughtCount} Sold
             </span>
           )}
        </div>

        {/* Product Name */}
        <Link href={productUrl} className="group-hover:text-orange-600 transition-colors">
           <h3 className="font-serif text-lg text-gray-900 leading-tight line-clamp-2">
             {product.name}
           </h3>
        </Link>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-1">
           <span className="text-base font-bold text-black">
             ₹{salePrice.toLocaleString()}
           </span>
           {isOnSale && (
             <span className="text-sm text-gray-400 line-through decoration-gray-300 font-light">
               ₹{originalPrice.toLocaleString()}
             </span>
           )}
        </div>

      </div>
    </div>
  );
}
