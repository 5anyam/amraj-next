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
import SmoothMarquee from '../../../../components/ProductSlide'
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
      
      // Easing function for smooth animation
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

// ✨ Stats Component with Intersection Observer
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
  const rating = useCounterAnimation(47, 2000, isVisible)
  
  return (
    <div 
      ref={statsRef}
      className="w-full bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 py-4 md:py-6 my-4 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {/* Bottles Sold */}
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-white">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
                {bottlesSold}+
              </div>
              <div className="text-xs md:text-base lg:text-lg font-medium opacity-90">
                Bottles Sold Per Day
              </div>
            </div>
          </div>
          
          {/* Men Treated */}
          <div className="text-center transform hover:scale-105 transition-transform duration-300 border-x border-teal-400/30">
            <div className="text-white">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
                {(menTreated / 1000).toFixed(0)}K+
              </div>
              <div className="text-xs md:text-base lg:text-lg font-medium opacity-90">
                Men Treated
              </div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-white">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg flex items-center justify-center gap-2">
                {(rating / 10).toFixed(1)}
                <span className="text-yellow-300">★</span>
              </div>
              <div className="text-xs md:text-base lg:text-lg font-medium opacity-90">
                Rating
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-teal-700 text-base font-medium">Loading product information...</p>
        </div>
      </div>
    )
  }

  if (error || (!products && !product)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-orange-50">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Product</h2>
          <p className="text-sm text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-orange-50">
        <div className="text-center bg-white rounded-3xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-orange-500 text-2xl">🔍</span>
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
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="hover:text-teal-600 cursor-pointer transition-colors">Products</span>
            <span className="text-gray-400">›</span>
            <span className="text-teal-600 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="pb-24 sm:pb-0">
        <div className="max-w-7xl mx-auto mt-6 md:py-8 md:px-4 flex flex-col lg:flex-row gap-8">
          {/* Image Section - Desktop */}
          <div className="lg:w-1/2 hidden lg:block">
            <div className="bg-white rounded-2xl mx-3 shadow-lg lg:p-4 border border-gray-200 sticky top-4">
              <ImageGallery images={product.images || []} />
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200">
              {product.attributes?.length ? (
                <div className="mb-4 inline-block px-4 py-2 bg-teal-50 rounded-full border border-teal-200">
                  <span className="text-teal-700 font-semibold text-xs uppercase tracking-wide">
                    {product.attributes[0]?.option || 'Default'}
                  </span>
                </div>
              ) : null}

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>

              <SmoothMarquee />

              {product.short_description && (
                <div
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-6 mt-4"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* Mobile Image Gallery */}
              <div className="bg-white block lg:hidden mt-4 rounded-2xl shadow-lg border border-gray-200">
                <ImageGallery images={product.images || []} />
              </div>

              {/* Price Section - Professional Look */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 mb-6 border border-gray-200 mt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-end gap-3">
                    <span className="text-3xl lg:text-4xl font-bold text-teal-600">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                    {hasSiteSale && (
                      <span className="line-through text-gray-400 font-semibold text-lg lg:text-xl mb-1">
                        ₹{totalRegularPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {hasSiteSale && (
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>
                {quantity > 1 && (
                  <div className="text-xs text-gray-600 font-medium mt-2 flex items-center gap-1">
                    <span className="text-teal-600">•</span>
                    ₹{salePrice.toFixed(2)} per unit × {quantity} items
                  </div>
                )}
                {hasSiteSale && (
                  <div className="text-sm text-green-600 font-semibold mt-2 flex items-center gap-1">
                    <span>✓</span>
                    You save ₹{totalSave.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Quantity Selector - Clean Design */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold text-sm mb-3">Select Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold w-12 h-12 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xl"
                  >
                    −
                  </button>
                  <div className="bg-white border-2 border-teal-300 rounded-xl px-6 py-3 min-w-[80px] text-center">
                    <span className="text-2xl font-bold text-teal-700">{quantity}</span>
                  </div>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 99}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold w-12 h-12 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Offer Section - Subtle Design */}
              <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🎁</span>
                      <span className="text-orange-600 font-bold text-xs uppercase tracking-wide">Limited Offer</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">Get ₹100 OFF on your first order</h3>
                    <p className="text-gray-600 text-xs mt-1">Use code at checkout</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-white border-2 border-orange-300 rounded-lg px-3 py-1.5 font-mono font-bold text-orange-600 text-base">
                      WELCOME100
                    </div>
                    <button
                      onClick={handleCopyCoupon}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-300 ${
                        isCouponCopied ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      {isCouponCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden sm:flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  className={`flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden ${isAddingToCart ? 'scale-95' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isAddingToCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
                  </span>
                  {isAddingToCart && (
                    <div className="absolute inset-0 bg-green-500 animate-pulse"></div>
                  )}
                </button>
                <button
                  className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden ${isBuyingNow ? 'scale-95' : ''}`}
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isBuyingNow ? 'Processing...' : 'Buy Now'}
                  </span>
                  {isBuyingNow && (
                    <div className="absolute inset-0 bg-green-500 animate-pulse"></div>
                  )}
                </button>
              </div>

              {/* Trust Badges - Clean Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  ['🚚', 'Fast Delivery', 'Express shipping'],
                  ['🛡️', 'Authentic', 'Quality assured'],
                  ['🌿', 'Natural', 'Ayurvedic'],
                  ['💸', 'COD Available', 'Pay on delivery'],
                ].map(([icon, label, subtitle], idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-3 text-center hover:bg-teal-50 transition-all duration-200 border border-gray-200 hover:border-teal-300">
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="font-semibold text-gray-800 text-xs mb-0.5">{label}</div>
                    <div className="text-[10px] text-gray-600">{subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✨ ANIMATED STATS SECTION */}
        <AnimatedStatsSection />

        {/* Description Tabs */}
        <div className="max-w-7xl mx-auto mt-8 p-4 lg:p-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <Tab.Group>
              <Tab.List className="flex bg-gray-50 border-b border-gray-200">
                {['Description', 'Additional Info'].map((label, idx) => (
                  <Tab key={idx} className={({ selected }) =>
                    `flex-1 py-4 px-4 text-sm lg:text-base font-semibold outline-none transition-all duration-200 ${
                      selected 
                        ? 'text-teal-600 bg-white border-b-3 border-teal-500' 
                        : 'text-gray-600 hover:text-teal-500 hover:bg-gray-100'
                    }`
                  }>
                    {label}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="p-6 lg:p-8">
                <Tab.Panel>
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" 
                       dangerouslySetInnerHTML={{ __html: product.description || '' }} />
                </Tab.Panel>
                <Tab.Panel>
                  <div className="prose max-w-none text-gray-700">
                    <h3 className="font-bold text-lg lg:text-xl text-teal-600 mb-4">
                      Shipping & Delivery Information
                    </h3>
                    <div className="bg-teal-50 rounded-xl p-5 border border-teal-200 space-y-3">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        📦 Your tracking ID and order details will be sent to your WhatsApp once the order is confirmed.
                      </p>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        <strong>Delivery Timeline:</strong> Orders are typically delivered within 2-3 business days after placement.
                      </p>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 p-4 lg:p-6">
          <ProductCreatives productSlug={slug} />
        </div>
        <div className="max-w-7xl mx-auto mt-8 p-4 lg:p-6">
          <ProductFAQ productSlug={slug} productName={product.name} />
        </div>
        <div className="max-w-7xl mx-auto mt-8 p-4 lg:p-6">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
        <div className="max-w-7xl mx-auto mt-8 p-4 lg:p-6">
          <CustomerMedia productSlug={slug} />
        </div>
        <RelatedProducts currentProduct={product} allProducts={products || []} />
      </div>

      {/* Mobile Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50 sm:hidden">
        <div className="flex gap-3">
          <button
            className={`flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-4 py-3.5 rounded-xl text-sm shadow-lg transition-all duration-200 ${isAddingToCart ? 'scale-95' : ''}`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <span className="flex items-center justify-center">
              {isAddingToCart ? '✓ Added' : '🛒 Add to Cart'}
            </span>
          </button>
          <button
            className={`flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-4 py-3.5 rounded-xl text-sm shadow-lg transition-all duration-200 ${isBuyingNow ? 'scale-95' : ''}`}
            onClick={handleBuyNow}
            disabled={isBuyingNow}
          >
            <span className="flex items-center justify-center">
              {isBuyingNow ? 'Processing...' : 'Buy Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
