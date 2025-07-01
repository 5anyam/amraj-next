"use client";
import Testimonials from "../../components/TestimonialsSection";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../lib/woocommerceApi";
import ProductCard from "../../components/ProductCard";
import HeroCarousel from "../../components/HeroCarousel";
import MarqueeBanner from "../../components/MarqueeBanner";
import AnimatedBackground from "../../components/AnimatedBackground";
import AboutUsSection from "../../components/AboutUs";


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
    <div className="min-h-screen bg-white pb-24 overflow-x-hidden transition-colors">
      <HeroCarousel />
      <MarqueeBanner/>
      <section className="relative max-w-6xl mx-auto py-14 px-4">
        <AnimatedBackground/>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-100/10 via-teal-300/5 to-white pointer-events-none" />
        <h2 className="text-xl md:text-4xl font-playfair text-orange-500 mb-6 text-center animate-fade-in">
          Discover Our <span className="text-teal-500 italic">New Products</span>
        </h2>
        <p className="text-center text-black text-lg mb-10 max-w-xl mx-auto animate-fade-in">
          Shop our most-loved wellness essentials trusted by thousands.
        </p>
        {isLoading ? (
          <div className="text-center text-orange-500 animate-pulse">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600">Failed to load products.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {data?.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>
      <AboutUsSection/>
      <Testimonials />
    </div>
  );
}
