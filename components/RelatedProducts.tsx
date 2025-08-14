'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// ✅ Using the same Product interface as your home page
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

  // Get related products (exclude current product)
  const getRelatedProducts = (): Product[] => {
    const related = allProducts
      .filter(product => product.id !== currentProduct.id)
      .slice(0, 4); // Show max 4 related products
    
    return related;
  };

  const relatedProducts = getRelatedProducts();

  // Don't show section if no related products
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
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-white text-center">
          You Might Also Like
        </h2>
        <p className="text-teal-100 text-center mt-2">
          Discover more premium wellness solutions
        </p>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer overflow-hidden"
                onClick={() => handleProductClick(product.slug)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl bg-white">
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                      {discountPercent}% OFF
                    </div>
                  )}
                  
                  <div className="aspect-square bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-4xl text-gray-400">📦</div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-sm lg:text-base mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Short Description */}
                  {product.short_description && (
                    <div 
                      className="text-xs text-gray-600 mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ 
                        __html: product.short_description.replace(/<[^>]*>/g, '').substring(0, 60) + '...'
                      }}
                    />
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-end gap-2">
                      <span className="text-lg font-bold text-teal-600">
                        ₹{formatPrice(product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm line-through text-gray-500">
                          ₹{formatPrice(product.regular_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl"
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

        {/* View All Products Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/products')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-full text-sm lg:text-base transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
          >
            🛍️ View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
