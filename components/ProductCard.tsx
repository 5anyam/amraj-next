// components/ProductCard.tsx (Server Component)

import Link from "next/link";
import Image from "next/image";
import { productToSlug } from "../lib/slug";
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

export default function ProductCard({ product }: { product: Product }) {
  const productUrl = `/product/${productToSlug(product)}`;
  const rating = Number(product.average_rating) || 4.5;
  const salePrice = Number(product.price);
  const originalPrice = Number(product.regular_price);
  const isOnSale = originalPrice > salePrice;
  const reviewCount = product.rating_count || 42;

  const discountPercentage = isOnSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative w-full h-full flex flex-col">
      <Link 
        href={productUrl} 
        className="block relative overflow-hidden rounded-2xl lg:rounded-[2rem] bg-gray-50 aspect-[0.85] border border-gray-100 hover:shadow-lg transition-shadow"
      >
        
        {/* Optimized Image */}
        <Image
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
          quality={75}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
           {isOnSale && (
             <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
               -{discountPercentage}%
             </span>
           )}
           {product.badge === "New" && (
             <span className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
               New
             </span>
           )}
        </div>

      </Link>

      {/* Product Info */}
      <div className="pt-3 px-1 flex flex-col gap-2">
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs">
           <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
              <StarIconSolid className="w-3 h-3 text-yellow-400" />
              <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
           </div>
           <span className="text-gray-400">({reviewCount})</span>
        </div>

        {/* Product Name */}
        <Link href={productUrl} className="hover:text-gray-600 transition-colors">
           <h3 className="font-semibold text-sm lg:text-base text-gray-900 leading-snug line-clamp-2">
             {product.name}
           </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
           <span className="text-lg font-bold text-black">
             ₹{salePrice.toLocaleString()}
           </span>
           {isOnSale && (
             <span className="text-sm text-gray-400 line-through">
               ₹{originalPrice.toLocaleString()}
             </span>
           )}
        </div>

        {/* Buy Now Button with Link */}
        <Link 
           href={productUrl}
           className="w-full bg-black hover:bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all text-center block"
        >
           Buy Now
        </Link>

      </div>
    </div>
  );
}
