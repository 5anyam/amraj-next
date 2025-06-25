"use client"

import HeroBanner from "../../components/HeroBanner";
import BenefitSection from "../../components/BenefitSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../lib/woocommerceApi";
import ProductCard from "../../components/ProductCard";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";


export default function Homepage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => fetchProducts(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-[#232144] dark:to-[#18172b] pb-24 overflow-x-hidden transition-colors">
      <Header />
      <HeroBanner />
      <section className="relative max-w-6xl mx-auto py-14 px-4">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100/10 via-blue-300/5 to-white dark:from-blue-900/10 dark:via-blue-900/5 dark:to-[#18172b] pointer-events-none" />
        <h2 className="text-4xl font-playfair font-bold text-blue-900 dark:text-blue-100 mb-6 text-center animate-fade-in">
          Discover Our <span className="text-blue-600 dark:text-blue-400 italic">Bestsellers</span>
        </h2>
        <p className="text-center text-blue-800 dark:text-blue-200 text-lg mb-10 max-w-xl mx-auto animate-fade-in">
          Shop our most-loved wellness essentials trusted by thousands.
        </p>
        {isLoading ? (
          <div className="text-center text-blue-600 dark:text-blue-300 animate-pulse">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">Failed to load products.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {data?.slice(0, 4).map((prod: any) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/shop" className="bg-blue-700 hover:bg-blue-900 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow hover:scale-105 transition-transform">
            View All Products
          </Link>
        </div>
      </section>
      <BenefitSection />
      <div className="my-12" />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
