
import Testimonials from "../../components/TestimonialsSection";
import { fetchProducts } from "../../lib/woocommerceApi";
import ProductCard from "../../components/ProductCard";
import HeroCarousel from "../../components/HeroCarousel";
import MarqueeBanner from "../../components/MarqueeBanner";
import AnimatedBackground from "../../components/AnimatedBackground";
import AboutUsSection from "../../components/AboutUs";
import HorizontalCertificatesSlider from "../../components/certificates";
import HomeFAQ from "../../components/HomeFaq";
import Link from "next/link";
// app/page.tsx (Server Component - NO 'use client')

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

// Enable ISR (Incremental Static Regeneration) - revalidate every 60 seconds
export const revalidate = 60;

export default async function Homepage() {
  // ✅ FIXED: Just pass the count directly (no object)
  let products: Product[] = [];
  let error = false;

  try {
    const result = await fetchProducts();
    // Take only first 4 products
    products = (result as Product[]).slice(0, 4);
  } catch (e) {
    console.error('Failed to fetch products:', e);
    error = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 overflow-x-hidden font-sans">
      
      {/* 1. Header Stack */}
      <div className="bg-white shadow-sm relative z-20">
        <HeroCarousel />
        <MarqueeBanner />
        <div className="py-2 border-b border-gray-100">
           <HorizontalCertificatesSlider />
        </div>
      </div>

      {/* 2. Best Sellers Section */}
      <section className="relative w-full py-8 overflow-hidden">
        
        {/* Background */}
        <div className="absolute inset-0 z-0 opacity-40">
           <AnimatedBackground />
           <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-gray-50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          
          {/* Header */}
          <div className="flex items-end justify-between mb-6 px-1 max-w-6xl mx-auto">
             <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                  Best Sellers
                </h2>
                <p className="text-gray-500 text-xs md:text-sm mt-1">
                  Top picks for your wellness
                </p>
             </div>
             <Link 
                href="/shop" 
                className="text-xs font-semibold text-orange-600 uppercase tracking-wider hover:text-orange-700 transition-colors"
             >
                View All →
             </Link>
          </div>
          
          {/* Product Grid */}
          {error ? (
            <div className="p-6 bg-red-50 text-red-600 text-sm rounded-2xl text-center max-w-md mx-auto">
              <p className="font-medium">Unable to load products</p>
              <p className="text-xs mt-1 text-red-500">Please try refreshing the page</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-6 bg-gray-100 text-gray-500 text-sm rounded-2xl text-center max-w-md mx-auto">
              No products available at the moment
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 justify-center mx-auto max-w-6xl">
              {products.map((product) => (
                <div key={product.id} className="h-full w-full max-w-[280px] mx-auto">
                   <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Additional Sections */}
      <div className="space-y-4 md:space-y-8">
        
        {/* About Section */}
        <div className="bg-white py-8 border-y border-gray-100">
           <AboutUsSection />
        </div>

        {/* Testimonials */}
        <div className="max-w-7xl mx-auto px-3">
           <Testimonials />
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-3 pb-8">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <HomeFAQ />
           </div>
        </div>

      </div>
    </div>
  );
}
