// app/products/[slug]/product-client.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../../../../lib/woocommerceApi'
import { useCart } from '../../../../lib/cart'
import { toast } from '../../../../hooks/use-toast'
import { useFacebookPixel } from '../../../../hooks/useFacebookPixel'
import ImageGallery from '../../../../components/ImageGallery'
import { Tab } from '@headlessui/react'
import ProductFAQ from '../../../../components/ProductFaq'
import RelatedProducts from '../../../../components/RelatedProducts'
import CustomerMedia from '../../../../components/CustomerMedia'
import ProductReviews from '../../../../components/ProductReviews'
import ProductCreatives from '../../../../components/CreativeGallery'

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

// ✨ Animated Counter Hook
function useCounterAnimation(targetValue: number, duration: number = 2000, shouldStart: boolean = true) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!shouldStart) return
    
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * targetValue))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [targetValue, duration, shouldStart])
  
  return count
}

// ✨ Stats Component with Clean Design
function AnimatedStatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )
    
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])
  
  const bottlesSold = useCounterAnimation(1000, 2000, isVisible)
  const menTreated = useCounterAnimation(20000, 2500, isVisible)
  const rating = useCounterAnimation(45, 2000, isVisible)
  
  return (
    <div 
      ref={statsRef}
      className="w-full bg-white border-y border-gray-200 py-8 md:py-12 my-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Trusted by Thousands
        </h2>
        <div className="grid grid-cols-3 gap-6 md:gap-12">
          {/* Bottles Sold */}
          <div className="text-center group">
            <div className="bg-teal-50 rounded-2xl p-6 md:p-8 border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-lg">
              <div className="text-teal-600">
                <div className="text-3xl md:text-5xl font-bold mb-2">
                  {bottlesSold}+
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-700">
                  Bottles Sold
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">
                  Per Month
                </div>
              </div>
            </div>
          </div>
          
          {/* Men Treated */}
          <div className="text-center group">
            <div className="bg-orange-50 rounded-2xl p-6 md:p-8 border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
              <div className="text-orange-600">
                <div className="text-3xl md:text-5xl font-bold mb-2">
                  {(menTreated / 1000).toFixed(0)}K+
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-700">
                  People Treated
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">
                  Successfully
                </div>
              </div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="text-center group">
            <div className="bg-yellow-50 rounded-2xl p-6 md:p-8 border-2 border-yellow-100 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg">
              <div className="text-yellow-600">
                <div className="text-3xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-2">
                  {(rating / 10).toFixed(1)}
                  <span className="text-yellow-500">★</span>
                </div>
                <div className="text-sm md:text-base font-semibold text-gray-700">
                  Average Rating
                </div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">
                  From Reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductClient({
  initialProduct,
  allProductsInitial,
  slug,
}: {
  initialProduct?: Product | undefined
  allProductsInitial?: Product[] | undefined
  slug: string
}) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { trackViewContent, trackAddToCart, trackInitiateCheckout } = useFacebookPixel()

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: async () => await fetchProducts() as Product[],
    initialData: allProductsInitial,
    staleTime: 60_000,
    enabled: Boolean(slug),
  })

  const product: Product | undefined =
    initialProduct ??
    products?.find((p) => p.slug === slug || p.id.toString() === slug)

  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [isCouponCopied, setIsCouponCopied] = useState(false)

  useEffect(() => {
    if (product) {
      trackViewContent({
        id: product.id,
        name: product.name,
        price: product.price,
      })
    }
  }, [product, trackViewContent])

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('WELCOME100')
    setIsCouponCopied(true)
    toast({
      title: '🎉 Coupon Copied!',
      description: 'WELCOME100 has been copied to clipboard. Apply it at checkout!',
    })
    setTimeout(() => setIsCouponCopied(false), 3000)
  }

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= 99) {
      setQuantity(newQty)
    }
  }

  if (isLoading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-base font-medium">Loading product information...</p>
        </div>
      </div>
    )
  }

  if (error || (!products && !product)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md border border-gray-200">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Product</h2>
          <p className="text-sm text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md border border-gray-200">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-600 text-2xl">🔍</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-sm text-gray-600">This product may have been removed or is unavailable.</p>
        </div>
      </div>
    )
  }

  const salePrice = parseFloat(product.price || '0')
  const regularPrice = parseFloat(product.regular_price || product.price || '0')
  const hasSiteSale = salePrice < regularPrice
  const totalPrice = salePrice * quantity
  const totalRegularPrice = regularPrice * quantity
  const totalSave = totalRegularPrice - totalPrice
  const discountPercent = hasSiteSale ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          name: product.name + (quantity > 1 ? ` (${i + 1} of ${quantity})` : ''),
          price: salePrice.toString(),
          images: product.images || [],
        })
      }
      trackAddToCart({ id: product.id, name: product.name, price: salePrice }, quantity)
      toast({
        title: '✓ Added to cart',
        description: `${quantity} x ${product.name} added successfully.`,
      })
    } catch (error) {
      console.error('Add to cart failed:', error)
      toast({ title: 'Error', description: 'Failed to add item to cart', variant: 'destructive' })
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1000)
    }
  }

  const handleBuyNow = async () => {
    setIsBuyingNow(true)
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          name: product.name + (quantity > 1 ? ` (${i + 1} of ${quantity})` : ''),
          price: salePrice.toString(),
          images: product.images || [],
        })
      }
      trackAddToCart({ id: product.id, name: product.name, price: salePrice }, quantity)
      const cartItems = [{ id: product.id, name: product.name, price: salePrice, quantity: quantity }]
      const total = salePrice * quantity
      trackInitiateCheckout(cartItems, total)
      toast({
        title: 'Proceeding to checkout',
        description: `${quantity} x ${product.name} added to cart.`,
        duration: 1200,
      })
      setTimeout(() => {
        router.push('/checkout')
        setIsBuyingNow(false)
      }, 1200)
    } catch (error) {
      console.error('Buy now failed:', error)
      toast({ title: 'Error', description: 'Failed to process order', variant: 'destructive' })
      setIsBuyingNow(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-24 sm:pb-0">
        <div className="max-w-7xl mx-auto mt-6 md:py-8 md:px-4 flex flex-col lg:flex-row gap-8">
          {/* Image Section - Desktop */}
          <div className="lg:w-1/2 hidden lg:block">
            <div className="bg-white rounded-2xl mx-3 shadow-sm lg:p-6 border border-gray-200 sticky top-4">
              <ImageGallery images={product.images || []} />
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-7 border border-gray-200">
              {product.attributes?.length ? (
                <div className="mb-4 inline-block">
                  <span className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {product.attributes[0]?.option || 'Default'}
                  </span>
                </div>
              ) : null}

              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Mobile Image Gallery */}
              <div className="bg-white block lg:hidden mt-4 rounded-2xl shadow-sm border border-gray-200">
                <ImageGallery images={product.images || []} />
              </div>

              {product.short_description && (
                <div
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-3 mt-3"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* Price Section - Clean & Modern */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-3 mt-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                    {hasSiteSale && (
                      <span className="line-through text-gray-400 font-semibold text-xl lg:text-2xl mb-2">
                        ₹{totalRegularPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {hasSiteSale && (
                    <div className="bg-red-600 text-white px-5 py-2 rounded-full font-bold text-base shadow-md">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>
                {quantity > 1 && (
                  <div className="text-sm text-gray-600 font-medium mt-2 flex items-center gap-1">
                    <span className="text-teal-600">•</span>
                    ₹{salePrice.toFixed(2)} per unit × {quantity} items
                  </div>
                )}
                {hasSiteSale && (
                  <div className="text-base text-green-700 font-bold mt-3 bg-green-50 px-4 py-2 rounded-lg inline-block">
                    💰 You save ₹{totalSave.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Quantity Selector - Interactive Design */}
              <div className="mb-6">
                <label className="block text-gray-900 font-bold text-base mb-4">Select Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 font-bold w-14 h-14 rounded-xl border-2 border-gray-300 hover:border-teal-500 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 text-2xl"
                  >
                    −
                  </button>
                  <div className="bg-teal-50 border-2 border-teal-500 rounded-xl px-8 py-4 min-w-[100px] text-center">
                    <span className="text-3xl font-bold text-teal-700">{quantity}</span>
                  </div>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99}
                    className="bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 font-bold w-14 h-14 rounded-xl border-2 border-gray-300 hover:border-orange-500 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 text-2xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Offer Section - Eye-catching */}
              <div className="mb-7 bg-orange-50 border-2 border-orange-400 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 opacity-30"></div>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🎁</span>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">Limited Time</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">Get ₹100 OFF on your first order</h3>
                      <p className="text-gray-700 text-sm font-medium">Use coupon code at checkout</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 ml-4">
                      <div className="bg-white border-2 border-orange-500 rounded-xl px-4 py-3 font-mono font-bold text-orange-600 text-lg shadow-md">
                        WELCOME100
                      </div>
                      <button
                        onClick={handleCopyCoupon}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow-md ${
                          isCouponCopied ? 'bg-green-600 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        {isCouponCopied ? '✓ Copied!' : 'Copy Code'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden sm:flex flex-col sm:flex-row gap-4 mb-7">
                <button
                  className={`flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${isAddingToCart ? 'scale-95' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isAddingToCart ? '✓ Added to Cart' : <>🛒 Add to Cart</>}
                  </span>
                </button>
                <button
                  className={`flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${isBuyingNow ? 'scale-95' : ''}`}
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isBuyingNow ? 'Processing...' : <>⚡ Buy Now</>}
                  </span>
                </button>
              </div>

              {/* Trust Badges - Card Style */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  ['🚚', 'Fast Delivery', 'Express shipping'],
                  ['🛡️', 'Authentic', 'Quality assured'],
                  ['🌿', 'Natural', 'Ayurvedic blend'],
                  ['💳', 'Prepaid Only', 'Secure payment'],
                ].map(([icon, label, subtitle], idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-all duration-200 border-2 border-gray-200 hover:border-teal-400">
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-bold text-gray-900 text-sm mb-1">{label}</div>
                    <div className="text-xs text-gray-600">{subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✨ ANIMATED STATS SECTION */}
        <AnimatedStatsSection />

        {/* Description Tabs */}
        <div className="max-w-7xl mx-auto mt-4 p-4 lg:p-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <Tab.Group>
              <Tab.List className="flex bg-gray-100 border-b-2 border-gray-200">
                {['Description', 'Additional Info'].map((label, idx) => (
                  <Tab key={idx} className={({ selected }) =>
                    `flex-1 py-5 px-4 text-base lg:text-lg font-bold outline-none transition-all duration-200 ${
                      selected 
                        ? 'text-teal-600 bg-white border-b-4 border-teal-600' 
                        : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
                    }`
                  }>
                    {label}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="p-6 lg:p-8">
                <Tab.Panel>
                  <div className="prose prose-base max-w-none text-gray-700 leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                </Tab.Panel>
                <Tab.Panel>
                  <div className="prose max-w-none text-gray-700">
                    <h3 className="font-bold text-2xl text-gray-900 mb-5">
                      Shipping & Delivery Information
                    </h3>
                    <div className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-200 space-y-4">
                      <p className="text-gray-800 leading-relaxed text-base font-medium">
                        📦 Your tracking ID and order details will be sent to your WhatsApp once the order is confirmed.
                      </p>
                      <p className="text-gray-800 leading-relaxed text-base font-medium">
                        <strong className="text-gray-900">Delivery Timeline:</strong> Orders are typically delivered within 2-3 business days after placement.
                      </p>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-4 p-4 lg:p-6">
          <ProductCreatives productSlug={slug} />
        </div>
        <div className="max-w-7xl mx-auto mt-4 p-4 lg:p-6">
          <ProductFAQ productSlug={slug} productName={product.name} />
        </div>
        <div className="max-w-7xl mx-auto mt-4 p-4 lg:p-6">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
        <div className="max-w-7xl mx-auto mt-4 p-4 lg:p-6">
          <CustomerMedia productSlug={slug} />
        </div>
        <RelatedProducts currentProduct={product} allProducts={products || []} />
      </div>

      {/* Mobile Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-2xl z-50 sm:hidden">
        <div className="flex gap-3">
          <button
            className={`flex-1 bg-teal-600 text-white font-bold px-4 py-4 rounded-xl text-base shadow-lg transition-all duration-200 ${isAddingToCart ? 'scale-95' : ''}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <span className="flex items-center justify-center gap-2">
              {isAddingToCart ? '✓ Added' : <>🛒 Add to Cart</>}
            </span>
          </button>
          <button
            className={`flex-1 bg-orange-600 text-white font-bold px-4 py-4 rounded-xl text-base shadow-lg transition-all duration-200 ${isBuyingNow ? 'scale-95' : ''}`}
            onClick={handleBuyNow}
            disabled={isBuyingNow}
          >
            <span className="flex items-center justify-center gap-2">
              {isBuyingNow ? 'Processing...' : <>⚡ Buy Now</>}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
