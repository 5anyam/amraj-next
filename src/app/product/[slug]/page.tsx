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

  // ✅ Loading and Error Handling
  if (isLoading) {
    return <div className="text-center pt-24">Loading...</div>;
  }

  if (error || !products) {
    return <div className="text-center pt-24 text-red-600">Product not found</div>;
  }

  const product = products.find(
    (p) => p.slug === slug || p.id.toString() === slug
  );

  if (!product) {
    return <div className="text-center pt-24 text-red-600">Product not found</div>;
  }

  const price = parseFloat(product.price || '0');
  const discountedPrice = price * offer.qty * (1 - offer.discountPercent / 100);
  const originalPrice = price * offer.qty;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4 lg:px-6 flex flex-col md:flex-row gap-10">
        {/* Image Section */}
        <div className="h-full bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-4">
        <ImageGallery images={product.images || []} />
      </div>
    </div>

        {/* Details Section */}
        <div className="flex-1 bg-white rounded-2xl shadow p-6">
          {product.attributes?.length ? (
            <div className="mb-4">
              <span className="text-gray-600 font-medium">Flavour:</span>
              <span className="ml-2 text-green-700 font-bold">{product.attributes[0]?.option || 'Default'}</span>
            </div>
          ) : null}

          <h1 className="text-2xl font-bold text-[#168b3f] mb-4">{product.name}</h1>

          {product.short_description && (
            <div
              className="prose max-w-none pb-6 text-gray-700 text-base"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          <OfferTab price={price} onOfferChange={setOffer} />

          <div className="flex items-end gap-3 my-5">
            <span className="text-3xl font-bold text-[#168b3f]">₹{discountedPrice.toFixed(2)}</span>
            <span className="line-through text-gray-400 font-semibold text-lg">₹{originalPrice.toFixed(2)}</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">{offer.discountPercent}% OFF</span>
          </div>

          <div className="text-green-900 mb-4">
            For Fastest delivery, order within <span className="font-bold">4 hrs 58 mins</span>
          </div>

          <button
            className="bg-[#168b3f] hover:bg-[#137633] w-full text-white font-bold px-8 py-4 rounded-xl text-lg shadow transition"
            onClick={() => {
              for (let i = 0; i < offer.qty; i++) {
                addToCart({
                  ...product,
                  name: product.name + (offer.qty > 1 ? ` (${i + 1} of ${offer.qty})` : ''),
                  price: (price * (1 - offer.discountPercent / 100)).toString(),
                  images: product.images || [],
                });
              }
              toast({
                title: 'Added to cart',
                description: `${offer.qty} x ${product.name} added with ${offer.discountPercent}% off.`,
              });
            }}
          >
            ADD TO CART — ₹{discountedPrice.toFixed(2)}
          </button>

          {/* Membership Banner */}
          <div className="bg-[#E7F7EA] border border-[#168b3f] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#168b3f] rounded-full h-12 w-12 flex items-center justify-center text-white text-xl font-bold">AW</div>
              <div>
                <div className="font-semibold text-[#168b3f]">Become a Amraj Wellness Member & get instant 10% discount on all orders</div>
                <div className="text-sm text-gray-500">₹299/year inclusive of all taxes</div>
              </div>
            </div>
            <a href="#" className="bg-teal-500 text-sm hover:bg-teal-600 text-white font-bold px-4 py-4 rounded-lg shadow transition">
              JOIN
            </a>
          </div>

          {/* Benefits Row */}
          <div className="flex flex-wrap justify-around text-[#168b3f] font-medium text-base mt-6">
            {[
              ['🚚', 'Fast Delivery'],
              ['🛡️', '100% Authentic'],
              ['↩️', 'No Returns'],
              ['💸', 'COD Available'],
            ].map(([icon, label], idx) => (
              <div key={idx} className="flex flex-col items-center px-2 py-3">
                <span className="text-2xl">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description Tabs */}
      <div className="max-w-5xl mx-auto mt-12 p-4 lg:p-6 bg-white rounded-2xl shadow">
        <Tab.Group>
          <Tab.List className="flex space-x-4 border-b border-gray-200">
            {['Description', 'Additional Info'].map((label, idx) => (
              <Tab key={idx} className={({ selected }) =>
                `py-3 text-lg font-semibold outline-none ${
                  selected ? 'text-[#168b3f] border-b-2 border-[#168b3f]' : 'text-gray-500'
                }`
              }>
                {label}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
            </Tab.Panel>
            <Tab.Panel>
              <div className="prose max-w-none text-gray-700">
                <h3 className="font-bold text-xl text-[#168b3f]">Additional Information</h3>
                <p>Here you can add any additional information about the product (size, storage instructions, FAQs, etc.).</p>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
