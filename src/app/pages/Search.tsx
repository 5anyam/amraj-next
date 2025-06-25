
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../../lib/woocommerceApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import React from "react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data, isLoading, error } = useQuery({
    queryKey: ["search-products", query],
    queryFn: () => fetchProducts(1, 12, query || undefined),
    enabled: !!query,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <Header />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-3 font-playfair animate-fade-in">
          Search Results <span className="text-blue-600 italic">{query && `"${query}"`}</span>
        </h1>
        {isLoading ? (
          <div className="text-center text-blue-600">Searching...</div>
        ) : error ? (
          <div className="text-center text-red-600">Search failed. Please try again.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {data && data.length > 0 ? (
                data.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center text-blue-700">
                  No products found.
                </div>
              )}
            </div>
            <div className="text-center mt-8">
              <Link to="/shop" className="inline-block text-blue-700 hover:underline text-lg">
                Browse our full shop &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
