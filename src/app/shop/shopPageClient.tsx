'use client';

import { useState, useMemo } from 'react';
import ProductCard from "../../../components/ProductCard";
import { Product } from "./page";

interface ShopPageClientProps {
  products: Product[];
}

// Extend the Product type to include slug for ProductCard
type ProductWithSlug = Product & {
  slug: string;
  regular_price: string;
};

export default function ShopPageClient({ products }: ShopPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(product => {
      product.categories?.forEach(cat => cats.add(cat.name));
    });
    return Array.from(cats);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory && !product.categories?.some(cat => cat.name === selectedCategory)) {
        return false;
      }

      // Price filter
      if (priceRange.min || priceRange.max) {
        const price = parseFloat(product.price.replace(/[^\d.]/g, ''));
        if (priceRange.min && price < parseFloat(priceRange.min)) return false;
        if (priceRange.max && price > parseFloat(priceRange.max)) return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, ''));
        case 'price-high':
          return parseFloat(b.price.replace(/[^\d.]/g, '')) - parseFloat(a.price.replace(/[^\d.]/g, ''));
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-teal-50 to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-teal-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop All Products
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover our premium collection of health and wellness products crafted for your well-being
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-full border-2 border-teal-200 focus:border-teal-500 focus:outline-none transition-colors bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.121A1 1 0 013 6.414V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedCategory || priceRange.min || priceRange.max) && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Active Filters:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Search: {searchTerm}
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                        {selectedCategory}
                      </span>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        Price: {priceRange.min || '0'} - {priceRange.max || '∞'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">
                {filteredProducts.length} Products Found
              </h2>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <span>Showing {filteredProducts.length} of {products.length} products</span>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 ">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-teal-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-yellow-600 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-4">
                      <ProductCard 
                        product={{
                          ...product,
                          slug: product.slug || `product-${product.id}`
                        } as ProductWithSlug} 
                      />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                          {product.price}
                        </span>
                        <button className="bg-gradient-to-r from-teal-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:from-teal-600 hover:to-yellow-600 transition-all">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}