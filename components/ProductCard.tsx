import Link from "next/link";
import { productToSlug } from "../lib/slug";

interface Product {
  id: number | string;
  name: string;
  price: string | number;
  images?: { src: string }[];
  short_description?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const productUrl = `/product/${productToSlug(product)}`;

  return (
    <div className="shadow rounded-xl bg-white border border-blue-50 dark:bg-[#232144] dark:border-blue-800 p-3 transition-transform hover:scale-105 flex flex-col">
      <Link href={productUrl}>
        <img
          src={product.images?.[0]?.src || "/placeholder.png"}
          alt={product.name}
          className="object-contain w-full aspect-[1/1] rounded-lg bg-blue-50 dark:bg-blue-900/30"
        />
        <div className="mt-3 font-semibold text-blue-800 dark:text-blue-100 text-lg line-clamp-1">
          {product.name}
        </div>
        <div className="font-bold text-xl text-blue-600 dark:text-blue-200 mt-1">
          ₹{product.price}
        </div>
        <div className="text-gray-500 dark:text-gray-300 text-xs mt-1 line-clamp-2">
          {product.short_description?.replace(/<[^>]+>/g, "")}
        </div>
      </Link>
    </div>
  );
}
