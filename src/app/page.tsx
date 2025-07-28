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
  slug: string;
  price: string;
  regular_price: string;
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
      
      {/* Bouncing Background Elements */}
      <div 
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-bounce" 
        style={{ animationDuration: '4s', animationDelay: '0s' }} 
      />
      <div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-3xl opacity-15 animate-bounce" 
        style={{ animationDuration: '6s', animationDelay: '1s' }} 
      />
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-3xl opacity-10 animate-bounce" 
        style={{ animationDuration: '5s', animationDelay: '2s' }} 
      />
      <div 
        className="absolute top-40 right-1/4 w-48 h-48 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-3xl opacity-12 animate-bounce" 
        style={{ animationDuration: '7s', animationDelay: '3s' }} 
      />
      <div 
        className="absolute bottom-40 left-1/4 w-56 h-56 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full blur-3xl opacity-18 animate-bounce" 
        style={{ animationDuration: '8s', animationDelay: '0.5s' }} 
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-3xl font-playfair text-orange-500 mb-3 text-center animate-fade-in">
          Best Sellers
        </h2>
        <p className="text-center text-black text-lg mb-10 max-w-xl mx-auto animate-fade-in">
          Shop our most-loved wellness essentials trusted by thousands.
        </p>
        
        {isLoading ? (
  <div className="text-center text-orange-500 animate-pulse">
    Loading products...
  </div>
) : error ? (
  <div className="text-center text-red-600">
    Failed to load products.
  </div>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
    {/* Only first 3 products */}
    {data?.slice(0, 3).map((prod) => (
      <ProductCard key={prod.id} product={prod} />
    ))}

    {/* 4th Column: Special Card with Image only */}
    <div className="flex items-center justify-center rounded-xl bg-white shadow-md p-4">
      <img
        src="/coming-soon.png" // <-- Yahan apni image ka path daalein
        alt="Special Card"
        className="w-full h-full object-contain"
      />
    </div>
  </div>
)}
      </div>
      </section>
      <AboutUsSection/>
      <Testimonials />
    </div>
  );
}
