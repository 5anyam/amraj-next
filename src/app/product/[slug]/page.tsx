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

// --- Product Type Definitions ---
export interface ImageData { src: string; }
export interface Attribute { option: string; }
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;                // sale price, or reg price if no sale
  regular_price: string;        // always MRP
  description?: string;
  short_description?: string;
  images: ImageData[];
  attributes?: Attribute[];
}

export default function ProductPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam || '';

  // Fetch products where slug match
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: async () => await fetchProducts() as Product[],
    enabled: Boolean(slug),
  });

  const { addToCart } = useCart();
  const [offer, setOffer] = useState<SelectedOffer>(undefined);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // --- Loading and Error Handling ---
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

  // --- Prices and Discount Logic ---
  const salePrice = parseFloat(product.price || '0');              // May be sale or reg
  const regularPrice = parseFloat(product.regular_price || product.price || '0');    // Fallback to price if missing
  const hasSiteSale = salePrice < regularPrice;

  const qty = offer?.qty || 0;

  // Final price for one unit after offer (if selected)
  const finalUnitPrice = offer
    ? salePrice * (1 - offer.discountPercent / 100)
    : salePrice;

  // total price = per unit × qty
  const discountedPrice = offer
    ? finalUnitPrice * qty
    : salePrice * qty;

  const crossedPrice = regularPrice * (offer ? qty : 1);
  const siteSaleSave = hasSiteSale ? (regularPrice - salePrice) * (offer ? qty : 1) : 0;
  const totalSave = crossedPrice - discountedPrice;

  // --- Add To Cart ---
  const handleAddToCart = async () => {
    if (!offer) return;
    setIsAddingToCart(true);
    for (let i = 0; i < offer.qty; i++) {
      addToCart({
        ...product,
        name: product.name + (offer.qty > 1 ? ` (${i + 1} of ${offer.qty})` : ''),
        price: finalUnitPrice.toString(),
        images: product.images || [],
      });
    }
    toast({
      title: 'Added to cart',
      description: `${offer.qty} x ${product.name} added with ${offer.discountPercent}% off.`,
    });
    setTimeout(() => setIsAddingToCart(false), 1000);
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
        {/* Image Section */}
        <div className="lg:w-1/2 hidden lg:block">
          <div className="bg-white rounded-3xl mx-3 shadow-xl lg:p-2 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <ImageGallery images={product.images || []} />
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-3xl shadow-xl p-2 md:p-6 border border-gray-100">
            {product.attributes?.length ? (
              <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-2xl border border-teal-200">
                <span className="text-teal-700 font-semibold text-xs uppercase tracking-wide">Flavour:</span>
                <span className="ml-2 text-teal-800 font-bold text-sm">{product.attributes[0]?.option || 'Default'}</span>
              </div>
            ) : null}

            <h1 className="text-xl lg:text-2xl font-bold text-black mb-4 leading-tight">
              {product.name}
            </h1>

            <SmoothMarquee/>

            {product.short_description && (
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Mobile Image Gallery */}
            <div className="bg-white block lg:hidden mt-3 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <ImageGallery images={product.images || []} />
            </div>

            {/* OfferTab - always pass salePrice as base price */}
            <div className="mb-4">
            <OfferTab salePrice={parseFloat(product.price)} regularPrice={parseFloat(product.regular_price)} onOfferChange={setOffer} />
            </div>

            {/* PRICING SECTION */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-end gap-2">
                  <span className="text-2xl lg:text-3xl font-bold text-teal-600">
                    {offer
                      ? `₹${discountedPrice.toFixed(2)}`
                      : hasSiteSale
                        ? `₹${salePrice.toFixed(2)}`
                        : `₹${regularPrice.toFixed(2)}`
                    }
                  </span>
                  {/* show cross only if site sale or offer present */}
                  {(hasSiteSale || offer) && (
                    <span className="line-through text-gray-500 font-semibold text-base lg:text-lg">
                      ₹{crossedPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                  {offer
                    ? `SAVE ₹${totalSave.toFixed(2)}`
                    : (hasSiteSale
                        ? `SAVE ₹${siteSaleSave.toFixed(2)}`
                        : '—')}
                </div>
              </div>
              {hasSiteSale && !offer && (
                <div className="text-xs mt-1 text-orange-600 font-semibold">
                  (MRP: ₹{regularPrice.toFixed(2)})
                </div>
              )}
            </div>

            {/* CTA BUTTON */}
            <button
              className={`w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-6 py-3 lg:py-4 rounded-2xl text-sm lg:text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mb-6 relative overflow-hidden group ${
                isAddingToCart ? 'scale-95 shadow-inner' : ''
              }`}
              onClick={handleAddToCart}
              disabled={isAddingToCart || !offer}
            >
              <span className={`relative z-10 flex items-center justify-center transition-all duration-300 ${isAddingToCart ? 'scale-90' : ''}`}>
                <span className={`mr-2 transition-all duration-300 ${isAddingToCart ? 'animate-bounce' : ''}`}>
                  {isAddingToCart ? '✓' : '🛒'}
                </span>
                {isAddingToCart
                  ? 'ADDED TO CART!'
                  : offer
                    ? `ADD TO CART — ₹${discountedPrice.toFixed(2)}`
                    : 'SELECT AN OFFER FIRST'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isAddingToCart && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 animate-pulse"></div>
              )}
            </button>

            {/* BENEFITS grid */}
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

      {/* MOBILE BOTTOM ADD TO CART */}
      <div className="lg:hidden fixed bottom-0 z-10 left-0 w-full bg-white border-t border-gray-200 p-3">
        <button
          className={`w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-xl hover:shadow-2xl transition-all duration-300 ${
            isAddingToCart ? 'scale-95 shadow-inner' : ''
          }`}
          onClick={handleAddToCart}
          disabled={isAddingToCart || !offer}
        >
          <span className={`relative z-10 flex items-center justify-center transition-all duration-300 ${
            isAddingToCart ? 'scale-90' : ''
          }`}>
            <span className={`mr-2 transition-all duration-300 ${
              isAddingToCart ? 'animate-bounce' : ''
            }`}>
              {isAddingToCart ? '✓' : '🛒'}
            </span>
            {isAddingToCart
              ? 'ADDED TO CART!'
              : offer
                ? `ADD TO CART — ₹${discountedPrice.toFixed(2)}`
                : 'SELECT AN OFFER FIRST'}
          </span>
          {isAddingToCart && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 animate-pulse rounded-2xl"></div>
          )}
        </button>
      </div>

      {/* DESCRIPTION TABS */}
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
