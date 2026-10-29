'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  slug: string;
  url: string;
  image?: string;
  price?: string;
};

const CATALOG: Product[] = [
  {
    id: 85,
    name: 'Advanced Liver Detox',
    slug: 'advanced-liver-detox',
    url: 'https://www.amraj.in/product/advanced-liver-detox',
    image: 'https://cms.amraj.in/wp-content/uploads/2025/07/IMG_6762-scaled.jpg',
    price: '₹1,499'
  },
  {
    id: 86,
    name: 'Advanced Prostate Care',
    slug: 'advanced-prostate-care',
    url: 'https://www.amraj.in/product/advanced-prostate-care',
    image: 'https://cms.amraj.in/wp-content/uploads/2025/06/IMG_6765-1-scaled.jpg',
    price: '₹1,799'
  },
  {
    id: 87,
    name: 'Weight Management Pro',
    slug: 'weight-management-pro',
    url: 'https://www.amraj.in/product/weight-management-pro',
    image: 'https://cms.amraj.in/wp-content/uploads/2025/06/IMG_6768-1-scaled.jpg',
    price: '₹1,599'
  }
];

function getQuery(): string {
  if (typeof window === 'undefined') return '';
  const p = new URLSearchParams(window.location.search);
  return p.get('q')?.trim() || '';
}

export default function SearchPage() {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setQuery(getQuery());
    const onPop = () => setQuery(getQuery());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const results = useMemo(() => {
    if (!query) return CATALOG;
    const q = query.toLowerCase();
    return CATALOG.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <p className="text-gray-600 mb-6">
        Showing results for: <span className="font-semibold">{query || 'All products'}</span>
      </p>

      {results.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map(p => (
            <article key={p.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition">
              <Link href={p.url} target="_blank" className="block">
                <div className="aspect-[4/3] bg-gray-100">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{p.name}</h3>
                  {p.price && <div className="text-teal-600 font-semibold text-sm mt-1">{p.price}</div>}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
