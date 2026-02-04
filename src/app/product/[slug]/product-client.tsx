// app/products/[slug]/product-client.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../../../lib/woocommerceApi';
import { useCart } from '../../../../lib/cart';
import { toast } from '../../../../hooks/use-toast';
import { useFacebookPixel } from '../../../../hooks/useFacebookPixel';
import { Tab } from '@headlessui/react';
import { 
  Star, ShieldCheck, Truck, CreditCard, Check,
  Minus, Plus
} from 'lucide-react';

// Dynamic imports with sleek skeletons
const ImageGallery = dynamic(() => import('../../../../components/ImageGallery'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-100 rounded-[2rem] h-[500px] w-full" />
});
const ProductCreatives = dynamic(() => import('../../../../components/CreativeGallery'), { ssr: false });
const ProductFAQ = dynamic(() => import('../../../../components/ProductFaq'), { ssr: false });
const ProductReviews = dynamic(() => import('../../../../components/ProductReviews'), { ssr: false });
const CustomerMedia = dynamic(() => import('../../../../components/CustomerMedia'), { ssr: false });
const RelatedProducts = dynamic(() => import('../../../../components/RelatedProducts'), { ssr: false });

export interface ImageData { src: string }
export interface Attribute { option: string }
export interface Product {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images: ImageData[]
  attributes?: Attribute[]
}

// ---------- Modern Skeleton ----------
function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="animate-pulse bg-gray-100 rounded-[2.5rem] h-[500px] lg:h-[700px]" />
        <div className="space-y-6 py-4">
           <div className="h-6 w-32 bg-gray-100 rounded-full" />
           <div className="h-12 w-3/4 bg-gray-100 rounded-xl" />
           <div className="h-4 w-full bg-gray-100 rounded-full" />
           <div className="h-20 w-full bg-gray-100 rounded-2xl" />
           <div className="grid grid-cols-4 gap-4 mt-8">
              {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
           </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Page Component ----------
export default function ProductClient({
  initialProduct,
  allProductsInitial,
  slug,
}: {
  initialProduct?: Product | undefined
  allProductsInitial?: Product[] | undefined
  slug: string
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { trackViewContent, trackAddToCart, trackInitiateCheckout } = useFacebookPixel();

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: async () => await fetchProducts() as Product[],
    initialData: allProductsInitial,
    placeholderData: allProductsInitial,
    staleTime: 60_000,
    enabled: Boolean(slug),
  });

  const product: Product | undefined =
    initialProduct ??
    products?.find((p) => p.slug === slug || p.id.toString() === slug);

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (product) {
      trackViewContent({ id: product.id, name: product.name, price: product.price });
    }
  }, [product, trackViewContent]);

  if (isLoading && !product) return <PageSkeleton />;
  if (error || (!products && !product)) return <div className="h-screen flex items-center justify-center text-gray-500">Product not found.</div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-gray-500">Product unavailable.</div>;

  const salePrice = parseFloat(product.price || '0');
  const regularPrice = parseFloat(product.regular_price || product.price || '0');
  const hasSiteSale = salePrice < regularPrice;
  const discountPercent = hasSiteSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          price: salePrice.toString(),
          images: product.images || [],
        });
      }
      trackAddToCart({ id: product.id, name: product.name, price: salePrice }, quantity);
      toast({ title: 'Added to Bag', description: `${quantity} x ${product.name} in cart.` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not add to cart', variant: 'destructive' });
    } finally {
      setTimeout(() => setIsAddingToCart(false), 600);
    }
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          price: salePrice.toString(),
          images: product.images || [],
        });
      }
      const cartItems = [{ id: product.id, name: product.name, price: salePrice, quantity }];
      trackInitiateCheckout(cartItems, salePrice * quantity);
      router.push('/checkout');
    } catch (error) {
      console.error(error);
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-32 lg:pb-0">
      
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-0 lg:px-6 pt-0 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* 1. Image Gallery */}
          <div className="lg:w-[55%] w-full">
            <div className="sticky top-24">
               <div className="lg:rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                  <ImageGallery images={product.images || []} />
               </div>
            </div>
          </div>

          {/* 2. Product Details */}
          <div className="lg:w-[45%] px-5 lg:px-0 pt-2 lg:pt-4">
             
             {/* Category Tag */}
             <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                   {product.attributes?.[0]?.option || 'Wellness'}
                </span>
                {hasSiteSale && (
                   <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse">
                      Sale
                   </span>
                )}
             </div>

             {/* ✅ FIXED: Smaller Title (Text-2xl/3xl instead of 5xl) */}
             <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                {product.name}
             </h1>

             {/* Rating */}
             <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-black text-black" />
                   ))}
                </div>
                <span className="text-sm font-medium border-b border-gray-300 pb-0.5">4.9 (1,240 Reviews)</span>
             </div>

             {/* Price */}
             <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-gray-100">
                <span className="text-3xl font-bold text-black">₹{salePrice.toLocaleString()}</span>
                {hasSiteSale && (
                   <span className="text-lg text-gray-400 line-through decoration-gray-300">
                      ₹{regularPrice.toLocaleString()}
                   </span>
                )}
                {hasSiteSale && (
                   <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                      Save {discountPercent}%
                   </span>
                )}
             </div>

             {/* Short Description */}
             <div 
               className="prose prose-sm text-gray-600 mb-8 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: product.short_description || '' }} 
             />

             {/* Desktop Actions */}
             <div className="hidden lg:block space-y-6">
                <div className="flex items-center gap-4">
                   <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Quantity</span>
                   <div className="flex items-center bg-gray-100 rounded-full p-1">
                      <button 
                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
                         className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-105 transition-transform"
                      >
                         <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                      <button 
                         onClick={() => setQuantity(Math.min(99, quantity + 1))}
                         className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-105 transition-transform"
                      >
                         <Plus className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-black py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all"
                   >
                      {isAddingToCart ? 'Adding...' : 'Add to Bag'}
                   </button>
                   <button
                      onClick={handleBuyNow}
                      disabled={isBuyingNow}
                      className="flex-1 bg-black hover:bg-gray-900 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-xl hover:shadow-2xl"
                   >
                      {isBuyingNow ? 'Processing...' : 'Buy Now'}
                   </button>
                </div>
             </div>

             {/* Trust Factors */}
             <div className="grid grid-cols-2 gap-4 mt-8 lg:mt-12">
                {[
                   { icon: Truck, title: "Free Shipping", sub: "On orders above ₹999" },
                   { icon: ShieldCheck, title: "Authentic", sub: "100% Genuine Products" },
                   { icon: CreditCard, title: "Secure Pay", sub: "Encrypted Payments" },
                   { icon: Check, title: "Easy Returns", sub: "7 Day Policy" },
                ].map((item, idx) => (
                   <div key={idx} className="flex gap-3 items-start p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                      <item.icon className="w-5 h-5 text-gray-900 shrink-0" />
                      <div>
                         <h4 className="font-bold text-xs uppercase tracking-wider text-black">{item.title}</h4>
                         <p className="text-[10px] text-gray-500 mt-0.5">{item.sub}</p>
                      </div>
                   </div>
                ))}
             </div>

             {/* Tabs */}
             <div className="mt-12 border-t border-gray-100">
                <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                   <Tab.List className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto">
                      {['Description', 'Ingredients', 'Shipping'].map((t, i) => (
                         <Tab key={i} className={({ selected }) => 
                            `pb-4 text-sm font-bold uppercase tracking-wider outline-none border-b-2 transition-colors whitespace-nowrap ${selected ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`
                         }>
                            {t}
                         </Tab>
                      ))}
                   </Tab.List>
                   <Tab.Panels className="min-h-[150px]">
                      <Tab.Panel>
                         <div className="prose prose-sm max-w-none text-gray-600 font-light" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                      </Tab.Panel>
                      <Tab.Panel>
                         <p className="text-gray-600 text-sm leading-relaxed">
                            Premium plant-based extracts including <strong>Ashwagandha, Shilajit, Gokshura</strong>, and essential minerals. No artificial fillers or preservatives.
                         </p>
                      </Tab.Panel>
                      <Tab.Panel>
                         <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                            <p className="text-sm text-gray-600"><strong>Dispatch:</strong> Within 24 hours</p>
                            <p className="text-sm text-gray-600"><strong>Delivery:</strong> 3-5 business days</p>
                         </div>
                      </Tab.Panel>
                   </Tab.Panels>
                </Tab.Group>
             </div>

          </div>
        </div>

        {/* --- Content Sections Below --- */}
        <div className="mt-20 lg:mt-32 space-y-20 lg:space-y-32">
           
           {/* ✅ FIXED: Props passed correctly */}
           <ProductCreatives productSlug={slug} />
           
           <CustomerMedia productSlug={slug} />
           
           <ProductReviews productId={product.id} productName={product.name} />
           
           <ProductFAQ productSlug={slug} productName={product.name} />
           
           <RelatedProducts currentProduct={product} allProducts={products || []} />
        </div>
      </div>

      {/* --- Mobile Sticky Action Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 px-4 lg:hidden z-50 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <div className="flex gap-3 items-center">
            <div className="flex items-center bg-gray-100 rounded-lg px-2 h-12">
               <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2"><Minus className="w-4 h-4" /></button>
               <span className="w-6 text-center font-bold text-sm">{quantity}</span>
               <button onClick={() => setQuantity(Math.min(99, quantity + 1))} className="p-2"><Plus className="w-4 h-4" /></button>
            </div>
            
            <button
               onClick={handleBuyNow}
               disabled={isBuyingNow}
               className="flex-1 bg-black text-white h-12 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg"
            >
               {isBuyingNow ? 'Processing...' : (
                  <>
                     <span>Buy Now</span>
                     <span className="w-1 h-1 bg-white/50 rounded-full mx-1" />
                     <span>₹{(salePrice * quantity).toLocaleString()}</span>
                  </>
               )}
            </button>
         </div>
      </div>

    </div>
  );
}
