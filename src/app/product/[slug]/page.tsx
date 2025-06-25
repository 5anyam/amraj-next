'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../../../lib/woocommerceApi';
import Header from '../../../../components/Header';
import { useCart } from '../../../../lib/cart';
import { toast } from '../../../../hooks/use-toast';
import ImageGallery from '../../../../components/ImageGallery';
import OfferTab, { SelectedOffer } from '../../../../components/OfferTab';
import { findProductBySlug } from '../../../../lib/slug';
import { Tab } from '@headlessui/react';

export interface ImageData {
  src: string;
}
export interface Attribute {
  option: string;
}
export interface Product {
  id: number;
  name: string;
  price: string;
  description?: string;
  short_description?: string;
  images?: ImageData[];
  attributes?: Attribute[];
}

function ClubBanner() {
  return (
    <div className="bg-[#E7F7EA] border border-[#168b3f] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
      <div className="flex items-center gap-3">
        <div className="bg-[#168b3f] rounded-full h-12 w-12 flex items-center justify-center text-white text-xl font-bold">Plix</div>
        <div>
          <div className="font-semibold text-[#168b3f]">Become a Plix Club Member & get instant 10% discount on all orders</div>
          <div className="text-sm mt-1 text-gray-500">₹299/year inclusive of all taxes</div>
        </div>
      </div>
      <a href="#" className="bg-[#168b3f] hover:bg-[#137633] text-white font-bold px-6 py-2 rounded-lg text-base shadow transition">
        JOIN NOW
      </a>
    </div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: async () => {
      const result = await fetchProducts();
      return result as Product[];
    },
    enabled: Boolean(slug),
  });

  const { addToCart } = useCart();
  const [offer, setOffer] = useState<SelectedOffer>({
    label: '1 Month',
    duration: '1 Month',
    qty: 1,
    discountPercent: 10,
  });

  if (isLoading) return <div className="text-center pt-24">Loading...</div>;
  if (error || !products) return <div className="text-center pt-24 text-red-600">Product not found</div>;

  const data = findProductBySlug(products, slug as string);
  if (!data) return <div className="text-center pt-24 text-red-600">Product not found</div>;

  const price = parseFloat(data.price || '0');
  const discountedPrice = price * offer.qty * (1 - offer.discountPercent / 100);
  const originalPrice = price * offer.qty;

  return (
    <div className="min-h-screen bg-[#F9FBFA] font-sans">
      <div className="sticky top-0 z-20">
        <Header />
      </div>
      <div className="max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-md">
            <ImageGallery images={data.images || []} />
          </div>
        </div>

        <div className="flex-1 max-w-xl">
          {Array.isArray(data.attributes) && data.attributes.length > 0 && (
            <div className="flex items-center mb-4 gap-2">
              <span className="font-semibold text-gray-600">Flavour:</span>
              <span className="font-bold text-green-700">{data.attributes?.[0]?.option || 'Default'}</span>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#168b3f] mb-3">{data.name}</h1>

          {data.short_description && (
            <div
              className="prose max-w-none text-gray-700 text-base"
              dangerouslySetInnerHTML={{ __html: data.short_description }}
            />
          )}

          <OfferTab price={price} onOfferChange={setOffer} />

          <div className="mb-4 flex gap-3 items-end mt-3">
            <span className="text-3xl text-[#168b3f] font-bold">₹{discountedPrice.toFixed(2)}</span>
            <span className="line-through text-gray-400 font-semibold text-lg">₹{originalPrice.toFixed(2)}</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
              {offer.discountPercent}% OFF
            </span>
          </div>

          <div className="font-medium text-green-900 mt-3">
            For Fastest delivery, order within <span className="font-bold">4 hrs 58 mins</span>
          </div>

          <button
            className="bg-[#168b3f] hover:bg-[#137633] w-full text-white font-bold mt-3 px-8 py-4 rounded-xl text-lg shadow transition"
            onClick={() => {
              for (let i = 0; i < offer.qty; i++) {
                addToCart({
                  ...data,
                  name: data.name + (offer.qty > 1 ? ` (${i + 1} of ${offer.qty})` : ''),
                  price: (price * (1 - offer.discountPercent / 100)).toString(),
                });
              }
              toast({
                title: 'Added to cart',
                description: `${offer.qty} x ${data.name} added with ${offer.discountPercent}% off.`,
              });
            }}
          >
            ADD TO CART — ₹{discountedPrice.toFixed(2)}
          </button>

          <ClubBanner />

          <div className="flex flex-wrap justify-around items-center mt-4 text-[#168b3f] text-base font-medium">
            <div className="flex flex-col items-center"><span className="text-2xl">🚚</span>Fast Delivery</div>
            <div className="flex flex-col items-center"><span className="text-2xl">🛡️</span>100% Authentic</div>
            <div className="flex flex-col items-center"><span className="text-2xl">↩️</span>Easy Returns</div>
            <div className="flex flex-col items-center"><span className="text-2xl">💸</span>COD Available</div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 p-4">
        <Tab.Group>
          <Tab.List className="flex justify-start space-x-4 border-b border-gray-300">
            <Tab
              className={({ selected }) =>
                `py-3 text-lg font-semibold ${selected ? 'text-[#168b3f] border-b-2 border-[#168b3f]' : 'text-gray-500'}`
              }
            >
              Description
            </Tab>
            <Tab
              className={({ selected }) =>
                `py-3 text-lg font-semibold ${selected ? 'text-[#168b3f] border-b-2 border-[#168b3f]' : 'text-gray-500'}`
              }
            >
              Additional Info
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div
                className="prose max-w-none text-gray-700 mt-6"
                dangerouslySetInnerHTML={{ __html: data.description || '' }}
              />
            </Tab.Panel>
            <Tab.Panel>
              <div className="prose max-w-none text-gray-700 mt-6">
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
