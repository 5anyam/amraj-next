'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface Product {
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

interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, allProducts }) => {
  const router = useRouter();

  const getRelatedProducts = (): Product[] => {
    const related = allProducts
      .filter(product => product.id !== currentProduct.id)
      .slice(0, 4);
    
    return related;
  };

  const relatedProducts = getRelatedProducts();

  if (relatedProducts.length === 0) {
    return null;
  }

  const handleProductClick = (productSlug: string) => {
    router.push(`/product/${productSlug}`);
  };

  const formatPrice = (price: string) => {
    return parseFloat(price || '0').toFixed(0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Modern Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            You Might Also Like
          </h2>
        </div>
        <p className="text-gray-600 text-center text-sm lg:text-base">
          Discover more premium wellness solutions
        </p>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => {
            const salePrice = parseFloat(product.price || '0');
            const regularPrice = parseFloat(product.regular_price || product.price || '0');
            const hasDiscount = salePrice < regularPrice;
            const discountPercent = hasDiscount 
              ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden"
                onClick={() => handleProductClick(product.slug)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-50">
                  {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                      {discountPercent}% OFF
                    </div>
                  )}
                  
                  <div className="aspect-square flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-300">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-5xl text-gray-300">📦</div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white font-semibold text-sm">View Product</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-2 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors duration-300 min-h-[40px]">
                    {product.name}
                  </h3>

                  {/* Price Section */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{formatPrice(product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm line-through text-gray-400">
                          ₹{formatPrice(product.regular_price)}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <div className="text-xs text-emerald-600 font-semibold mt-1">
                        Save ₹{formatPrice((regularPrice - salePrice).toString())}
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.slug);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional: View All CTA */}
        {allProducts.length > 5 && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold px-8 py-3 rounded-xl text-sm lg:text-base transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <SparklesIcon className="h-5 w-5" />
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
