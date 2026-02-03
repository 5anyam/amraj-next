"use client";
import Testimonials from "../../components/TestimonialsSection";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../lib/woocommerceApi";
import ProductCard from "../../components/ProductCard";
import HeroCarousel from "../../components/HeroCarousel";
import MarqueeBanner from "../../components/MarqueeBanner";
import AnimatedBackground from "../../components/AnimatedBackground";
import AboutUsSection from "../../components/AboutUs";
import HorizontalCertificatesSlider from "../../components/certificates";
import HomeFAQ from "../../components/HomeFaq";

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
    <div className="min-h-screen bg-gray-50 pb-12 overflow-x-hidden font-sans">
      
      {/* 1. Header Stack - No Gaps */}
      <div className="bg-white shadow-sm relative z-20">
        <HeroCarousel />
        <MarqueeBanner/>
        <div className="py-2 border-b border-gray-100">
           <HorizontalCertificatesSlider/>
        </div>
      </div>

      {/* 2. Main "Best Sellers" Section - Compact & App-Like */}
      <section className="relative w-full py-8 overflow-hidden">
        
        {/* --- Background (Subtle) --- */}
        <div className="absolute inset-0 z-0 opacity-40">
           <AnimatedBackground/>
           <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-gray-50" />
        </div>

        {/* --- Content --- */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          
          {/* Header - Compact */}
          <div className="flex items-end justify-between mb-6 px-1 max-w-6xl mx-auto">
             <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                  Best Sellers
                </h2>
                <p className="text-gray-500 text-xs md:text-sm mt-1">
                  Top picks for your wellness.
                </p>
             </div>
             <a href="/shop" className="text-xs font-semibold text-orange-600 uppercase tracking-wider hover:text-orange-700">
                View All
             </a>
          </div>
          
          {/* Product Grid - Center Aligned */}
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              <span className="animate-pulse">Loading products...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl text-center">
              Unable to load.
            </div>
          ) : (
            // Changed: Added 'justify-center' and 'mx-auto' to ensure centering
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 justify-center mx-auto max-w-6xl">
              {data?.slice(0, 4).map((prod) => (
                <div key={prod.id} className="h-full w-full max-w-[280px] mx-auto">
                   <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Sections Stack - Reduced Spacing */}
      <div className="space-y-4 md:space-y-8">
        
        {/* About Widget */}
        <div className="bg-white py-8 border-y border-gray-100">
           <AboutUsSection/>
        </div>

        {/* Reviews Widget */}
        <div className="max-w-7xl mx-auto px-3">
           <Testimonials />
        </div>

        {/* FAQ Widget */}
        <div className="max-w-3xl mx-auto px-3 pb-8">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <HomeFAQ/>
           </div>
        </div>

      </div>
    </div>
  );
}
