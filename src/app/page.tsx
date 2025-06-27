"use client";


import BenefitSection from "../../components/BenefitSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../lib/woocommerceApi";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";
import HeroCarousel from "../../components/HeroCarousel";


export interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  short_description?: string;
  images?: { src: string }[];
  attributes?: { option: string }[];
}

export default function Homepage() {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const result = await fetchProducts();
      return result as Product[];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-orange-50 to-white dark:from-[#232144] dark:to-[#18172b] pb-24 overflow-x-hidden transition-colors">
      <HeroCarousel />
      <section className="relative max-w-6xl mx-auto py-14 px-4">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-100/10 via-teal-300/5 to-white dark:from-orange-800/10 dark:via-blue-900/5 dark:to-[#18172b] pointer-events-none" />
        <h2 className="text-xl md:text-4xl font-playfair font-bold text-orange-500 mb-6 text-center animate-fade-in">
          Discover Our <span className="text-teal-500 italic">New Products</span>
        </h2>
        <p className="text-center text-black text-lg mb-10 max-w-xl mx-auto animate-fade-in">
          Shop our most-loved wellness essentials trusted by thousands.
        </p>
        {isLoading ? (
          <div className="text-center text-orange-500 dark:text-blue-300 animate-pulse">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">Failed to load products.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {data?.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
        {/* <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="bg-orange-600 hover:bg-orange-800 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg hover:scale-105 transition-transform"
          >
            View All Products
          </Link>
        </div> */}
      </section>
      <BenefitSection />
      <div className="my-12" />
      <TestimonialsSection />
    </div>
  );
}
