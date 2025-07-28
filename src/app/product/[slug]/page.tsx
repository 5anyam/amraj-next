'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../../../lib/woocommerceApi';
import { useCart } from '../../../../lib/cart';
import { toast } from '../../../../hooks/use-toast';
import ImageGallery from '../../../../components/ImageGallery';
import OfferTab, { SelectedOffer } from '../../../../components/OfferTab';
import { Tab } from '@headlessui/react';
import SmoothMarquee from '../../../../components/ProductSlide';

// Product Type Definitions
export interface ImageData {
  src: string;
}
export interface Attribute {
  option: string;
}
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  description?: string;
  short_description?: string;
  images: ImageData[];
  attributes?: Attribute[];
}

export default function ProductPage() {
  // ✅ Fix slug extraction
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam || '';

  // ✅ Fetch products safely
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: async () => await fetchProducts() as Product[],
    enabled: Boolean(slug),
  });

  const { addToCart } = useCart();
  const [offer, setOffer] = useState<SelectedOffer>({
    label: '1 Month',
    duration: '1 Month',
    qty: 1,
    discountPercent: 10,
  });

  // Add state for button animation
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // ✅ Loading and Error Handling
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mx-auto mb-3"></div>
          <p className="text-teal-700 text-sm font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !products) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-6 max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-500 text-lg">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-sm text-gray-600">Sorry, we could not load this product. Please try again later.</p>
        </div>
      </div>
    );
  }

  const product = products.find(
    (p) => p.slug === slug || p.id.toString() === slug
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-6 max-w-md">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-orange-500 text-lg">🔍</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-sm text-gray-600">The product you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price || '0');
  const discountedPrice = price * offer.qty * (1 - offer.discountPercent / 100);
  const originalPrice = price * offer.qty;

  // Enhanced add to cart function with animation
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    // Add items to cart
    for (let i = 0; i < offer.qty; i++) {
      addToCart({
        ...product,
        name: product.name + (offer.qty > 1 ? ` (${i + 1} of ${offer.qty})` : ''),
        price: (price * (1 - offer.discountPercent / 100)).toString(),
        images: product.images || [],
      });
    }

    // Show success toast
    toast({
      title: 'Added to cart',
      description: `${offer.qty} x ${product.name} added with ${offer.discountPercent}% off.`,
    });

    // Reset animation after delay
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      {/* Header with breadcrumb-style design */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>Products</span>
            <span className="text-teal-500">›</span>
            <span className="text-teal-600 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-5 md:py-6 md:px-4 flex flex-col lg:flex-row">
        {/* Image Section with enhanced styling */}
        <div className="lg:w-1/2 hidden lg:block">
          <div className="bg-white rounded-3xl mx-3 shadow-xl lg:p-2 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">          
              <ImageGallery images={product.images || []} />
          </div>
        </div>

        {/* Details Section with modern card design */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-3xl shadow-xl p-2 md:p-6 border border-gray-100">
            {/* Product attributes */}
            {product.attributes?.length ? (
              <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl border border-teal-200">
                <span className="text-teal-700 font-semibold text-xs uppercase tracking-wide">Flavour:</span>
                <span className="ml-2 text-teal-800 font-bold text-sm">{product.attributes[0]?.option || 'Default'}</span>
              </div>
            ) : null}

            {/* Product title with gradient text */}
<h1 className="text-xl lg:text-2xl font-bold text-black mb-4 leading-tight">
  {product.name}
</h1>

<SmoothMarquee/>

            {/* Short description */}
            {product.short_description && (
              <div
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
            )}

          <div className="bg-white block lg:hidden mt-3 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">          
                        <ImageGallery images={product.images || []} />
                    </div>

            {/* Offer tab with enhanced styling */}
            <div className="mb-4">
              <OfferTab price={price} onOfferChange={setOffer} />
            </div>

            {/* Pricing section with better visual hierarchy */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-end gap-2">
                  <span className="text-2xl lg:text-3xl font-bold text-teal-600">₹{discountedPrice.toFixed(2)}</span>
                  <span className="line-through text-gray-500 font-semibold text-base lg:text-lg">₹{originalPrice.toFixed(2)}</span>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                  SAVE ₹{(originalPrice - discountedPrice).toFixed(2)}
                </div>
              </div>
              
              {/* Delivery info with icon
              <div className="flex items-center text-teal-700 bg-teal-50 rounded-xl p-2 border border-teal-200">
                <span className="text-base mr-2">⚡</span>
                <span className="font-medium text-xs lg:text-sm">
                  For Fastest delivery, order within <span className="font-bold text-orange-600">4 hrs 58 mins</span>
                </span>
              </div> */}
            </div>

            {/* Enhanced CTA button with animation */}
            <button
              className={`w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-6 py-3 lg:py-4 rounded-2xl text-sm lg:text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-6 relative overflow-hidden group ${
                isAddingToCart ? 'scale-95 shadow-inner' : ''
              }`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <span className={`relative z-10 flex items-center justify-center transition-all duration-300 ${
                isAddingToCart ? 'scale-90' : ''
              }`}>
                <span className={`mr-2 transition-all duration-300 ${
                  isAddingToCart ? 'animate-bounce' : ''
                }`}>
                  {isAddingToCart ? '✓' : '🛒'}
                </span>
                {isAddingToCart ? 'ADDED TO CART!' : `ADD TO CART — ₹${discountedPrice.toFixed(2)}`}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Success animation overlay */}
              {isAddingToCart && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 animate-pulse"></div>
              )}
            </button>

            {/* Enhanced membership banner
            <div className="bg-gradient-to-r from-orange-50 to-teal-50 border-2 border-dashed border-orange-300 rounded-2xl p-4 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-orange-600 text-white px-2 py-1 rounded-bl-2xl text-xs font-bold">
                SPECIAL OFFER
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl h-12 w-12 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    AW
                  </div>
                  <div>
                    <div className="font-bold text-teal-700 text-sm mb-1">
                      Become a Amraj Member
                    </div>
                    <div className="text-teal-600 font-medium mb-1 text-xs">
                      Get instant 10% discount on all orders
                    </div>
                    <div className="text-xs text-gray-600">₹299/year inclusive of all taxes</div>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-xs">
                  JOIN NOW
                </button>
              </div>
            </div> */}

            {/* Enhanced benefits grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ['🚚', 'Fast Delivery', 'Express shipping'],
                ['🛡️', '100% Authentic', 'Guaranteed quality'],
                ['🧬', 'Non GMO', 'Gluten Free'],
                ['💸', 'COD Available', 'Pay on delivery'],
              ].map(([icon, label, subtitle], idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-3 text-center hover:from-teal-50 hover:to-teal-100 transition-all duration-300 group border border-gray-200 hover:border-teal-200">
                  <div className="text-xl mb-1 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                  <div className="font-bold text-teal-700 text-xs mb-1">{label}</div>
                  <div className="text-xs text-gray-600">{subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Extra "Add to Cart" button - Only on Mobile */}
      <div className="lg:hidden fixed bottom-0 z-10 left-0 w-full bg-white border-t border-gray-200 p-3">
        <button
          className={`w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-xl hover:shadow-2xl transition-all duration-300 ${
            isAddingToCart ? 'scale-95 shadow-inner' : ''
          }`}
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          <span className={`relative z-10 flex items-center justify-center transition-all duration-300 ${
            isAddingToCart ? 'scale-90' : ''
          }`}>
            <span className={`mr-2 transition-all duration-300 ${
              isAddingToCart ? 'animate-bounce' : ''
            }`}>
              {isAddingToCart ? '✓' : '🛒'}
            </span>
            {isAddingToCart ? 'ADDED TO CART!' : `ADD TO CART — ₹${discountedPrice.toFixed(2)}`}
          </span>
          
          {/* Success animation overlay */}
          {isAddingToCart && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 animate-pulse rounded-2xl"></div>
          )}
        </button>
      </div>

      {/* Enhanced description tabs */}
      <div className="max-w-7xl mx-auto mt-8 p-4 lg:p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <Tab.Group>
            <Tab.List className="flex bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {['Description', 'Additional Info'].map((label, idx) => (
                <Tab key={idx} className={({ selected }) =>
                  `flex-1 py-3 px-4 text-sm lg:text-base font-semibold outline-none transition-all duration-300 relative ${
                    selected 
                      ? 'text-teal-600 bg-white border-b-4 border-teal-500' 
                      : 'text-gray-600 hover:text-teal-500 hover:bg-gray-50'
                  }`
                }>
                  {label}
                  {idx === 0 && (
                    <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                  )}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="p-4 lg:p-6">
              <Tab.Panel>
                <div className="prose max-w-none text-gray-700 leading-relaxed text-sm" 
                     dangerouslySetInnerHTML={{ __html: product.description || '' }} />
              </Tab.Panel>
              <Tab.Panel>
                <div className="prose max-w-none text-gray-700">
                  <h3 className="font-bold text-lg lg:text-xl bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-3">
                    Additional Information
                  </h3>
                  <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-2xl p-4 border border-teal-200">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      Here you can add any additional information about the product (size, storage instructions, FAQs, etc.).
                    </p>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}