'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Star, ShieldCheck, Truck, Check, Leaf,
  ChevronRight, Package, Zap
} from 'lucide-react';
import { StaticProduct, PRODUCTS } from '../../../../lib/products-data';
import { useCart } from '../../../../lib/cart';
import { toast } from '../../../../hooks/use-toast';

const ProductReviews = dynamic(() => import('../../../../components/ProductReviews'), { ssr: false });
const ProductFAQ = dynamic(() => import('../../../../components/ProductFaq'), { ssr: false });

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <Star key={i} style={{ width: 14, height: 14, fill: i <= Math.round(rating) ? '#0D9488' : '#e2d9d0', color: i <= Math.round(rating) ? '#0D9488' : '#e2d9d0' }} />
      ))}
    </div>
  );
}

interface Bundle {
  packs: number; label: string; pricePerPack: number;
  totalPrice: number; savings: number; badge?: string;
}

function getBundles(price: number): Bundle[] {
  return [
    { packs: 1, label: '1 Pack', pricePerPack: price, totalPrice: price, savings: 0 },
    { packs: 2, label: '2 Packs', pricePerPack: Math.round(price * 0.93), totalPrice: Math.round(price * 2 * 0.93), savings: Math.round(price * 2 * 0.07), badge: 'Save 7%' },
    { packs: 3, label: '3 Packs', pricePerPack: Math.round(price * 0.87), totalPrice: Math.round(price * 3 * 0.87), savings: Math.round(price * 3 * 0.13), badge: 'Best Value' },
  ];
}

function ImageGallery({ images }: { images: string[] }) {
  const [main, setMain] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative', aspectRatio: '1', background: '#f3ede4', overflow: 'hidden', border: '3px solid #0f1117', boxShadow: '6px 6px 0 #0f1117' }}>
        <Image src={images[main]} alt="Product" fill style={{ objectFit: 'cover', transition: 'opacity 0.3s' }} sizes="(max-width: 1024px) 100vw, 55vw" priority />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setMain(i)}
              style={{
                position: 'relative', flexShrink: 0, width: 64, height: 64,
                border: `2.5px solid ${i === main ? '#0D9488' : '#0f1117'}`,
                boxShadow: i === main ? '2px 2px 0 #0D9488' : '2px 2px 0 rgba(15,17,23,0.2)',
                overflow: 'hidden', opacity: i === main ? 1 : 0.55,
                cursor: 'pointer', background: 'none', padding: 0,
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            >
              <Image src={src} alt="" fill style={{ objectFit: 'cover' }} sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const TABS = ['Benefits', 'Ingredients', 'How to Use', 'Shipping'];

function Tabs({ product }: { product: StaticProduct }) {
  const [active, setActive] = useState(0);
  return (
    <div style={{ marginTop: 40, borderTop: '3px solid #0f1117' }}>
      <div style={{ display: 'flex', borderBottom: '3px solid #0f1117', overflowX: 'auto' }}>
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '12px 20px', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: 'pointer',
              background: i === active ? '#0f1117' : 'transparent',
              color: i === active ? '#0D9488' : 'rgba(15,17,23,0.45)',
              border: 'none', borderRight: '2px solid rgba(15,17,23,0.1)',
              transition: 'background 0.2s, color 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ paddingTop: 24, paddingBottom: 8 }}>
        {active === 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {product.benefits.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 20, height: 20, background: '#0D9488', border: '2px solid #0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Check style={{ width: 10, height: 10, color: '#fff' }} />
                </span>
                <span style={{ fontSize: 13, color: '#0f1117', lineHeight: 1.65 }}>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {active === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {product.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 16px', background: '#faf7f2', border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117' }}>
                <div style={{ width: 56, textAlign: 'center', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#0D9488', lineHeight: 1, letterSpacing: '0.03em' }}>{ing.dose}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#0f1117', marginBottom: 3 }}>{ing.name}</p>
                  <p style={{ fontSize: 11, color: 'rgba(15,17,23,0.5)', letterSpacing: '0.03em' }}>{ing.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {active === 2 && (
          <div>
            <div style={{ background: '#faf7f2', border: '2px solid #0f1117', boxShadow: '3px 3px 0 #0f1117', padding: '16px 20px', marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#0f1117', lineHeight: 1.75 }}>{product.howToUse}</p>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(13,148,136,0.06)', border: '2px solid rgba(13,148,136,0.3)' }}>
              <p style={{ fontSize: 11, color: '#d95f1a', fontWeight: 600, letterSpacing: '0.04em' }}>
                Note: Results are best seen with consistent use for 4–6 weeks. Consult a healthcare provider if you have pre-existing conditions.
              </p>
            </div>
          </div>
        )}
        {active === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: Package, label: 'Dispatch', value: 'Within 24 hours of order confirmation' },
              { icon: Truck, label: 'Delivery', value: '3–5 business days, pan-India' },
              { icon: Leaf, label: 'Quality', value: '100% natural & FSSAI certified' },
              { icon: ShieldCheck, label: 'Packaging', value: 'Tamper-proof, eco-friendly packaging' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: '#faf7f2', border: '2px solid #0f1117' }}>
                <item.icon style={{ width: 16, height: 16, color: '#0D9488', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(15,17,23,0.4)', fontWeight: 600, marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: '#0f1117', fontWeight: 600 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedCard({ product }: { product: StaticProduct }) {
  const discount = Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100);
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', background: '#fff', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0f1117'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0f1117'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: '#f3ede4', overflow: 'hidden', borderBottom: '2px solid #0f1117' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="300px" />
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 10, right: 10, background: '#0D9488', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', border: '2px solid #0f1117' }}>
            {discount}% OFF
          </span>
        )}
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0D9488', fontWeight: 600, marginBottom: 4 }}>{product.category}</p>
        <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#0f1117', marginBottom: 8, lineHeight: 1.1 }}>{product.name}</h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#0f1117' }}>₹{product.price.toLocaleString()}</span>
          <span style={{ fontSize: 12, color: 'rgba(15,17,23,0.35)', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductClient({ product }: { product: StaticProduct }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [selectedBundle, setSelectedBundle] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const bundles = getBundles(product.price);
  const bundle = bundles[selectedBundle];
  const discount = Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100);
  const relatedProducts = PRODUCTS.filter((p) => p.slug !== product.slug);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    for (let i = 0; i < bundle.packs; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price.toString(), regular_price: product.regularPrice.toString(), images: product.images.map((src) => ({ src })) });
    }
    toast({ title: 'Added to Cart', description: `${bundle.packs} × ${product.shortName} added to your cart.` });
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  const handleBuyNow = () => {
    setIsBuyingNow(true);
    for (let i = 0; i < bundle.packs; i++) {
      addToCart({ id: product.id, name: product.name, price: product.price.toString(), regular_price: product.regularPrice.toString(), images: product.images.map((src) => ({ src })) });
    }
    router.push('/checkout');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f2', paddingBottom: 120 }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '2px solid rgba(15,17,23,0.1)', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '10px 32px' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(15,17,23,0.4)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#0D9488')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(15,17,23,0.4)')}>Home</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#0D9488')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(15,17,23,0.4)')}>Shop</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span style={{ color: '#0f1117' }}>{product.shortName}</span>
          </nav>
        </div>
      </div>

      {/* Main layout */}
      <div className="product-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px 64px' }}>

          {/* LEFT: Images */}
          <div className="product-image-sticky" style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <ImageGallery images={product.images} />
          </div>

          {/* RIGHT: Info */}
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              <span style={{ background: '#faf7f2', color: '#0f1117', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', border: '2px solid #0f1117' }}>
                {product.category}
              </span>
              {product.badge && (
                <span style={{ background: '#0f1117', color: '#0D9488', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', border: '2px solid #0f1117' }}>
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span style={{ background: '#0D9488', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px', border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117' }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,4vw,56px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.95, marginBottom: 14 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <button
              onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <StarRating rating={product.rating} />
              <span style={{ fontSize: 11, color: 'rgba(15,17,23,0.5)', letterSpacing: '0.05em', borderBottom: '1px solid rgba(15,17,23,0.2)' }}>
                {product.rating.toFixed(1)} ({product.reviewCount} Reviews)
              </span>
            </button>

            {/* Tagline */}
            <p style={{ fontSize: 13, color: 'rgba(15,17,23,0.55)', lineHeight: 1.75, marginBottom: 20 }}>{product.tagline}</p>

            {/* Benefits */}
            <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {product.benefits.slice(0, 4).map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 18, height: 18, background: 'rgba(13,148,136,0.1)', border: '2px solid #0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check style={{ width: 9, height: 9, color: '#0D9488' }} />
                  </span>
                  <span style={{ fontSize: 12, color: '#0f1117', lineHeight: 1.6 }}>{b}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24, paddingBottom: 24, borderBottom: '3px solid #0f1117' }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, color: '#0f1117', lineHeight: 1, letterSpacing: '0.02em' }}>
                ₹{bundle.totalPrice.toLocaleString()}
              </span>
              {product.regularPrice > product.price && bundle.packs === 1 && (
                <span style={{ fontSize: 16, color: 'rgba(15,17,23,0.35)', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString()}</span>
              )}
              {bundle.savings > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#ccff00', border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117', padding: '3px 8px', letterSpacing: '0.1em' }}>
                  SAVE ₹{bundle.savings.toLocaleString()}
                </span>
              )}
            </div>

            {/* Bundle Picker */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(15,17,23,0.4)', marginBottom: 12 }}>Choose Your Pack</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {bundles.map((b, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedBundle(i)}
                    style={{
                      position: 'relative', padding: '12px 8px', textAlign: 'center', cursor: 'pointer',
                      border: `2.5px solid ${i === selectedBundle ? '#0D9488' : '#0f1117'}`,
                      boxShadow: i === selectedBundle ? '3px 3px 0 #0D9488' : '2px 2px 0 #0f1117',
                      background: i === selectedBundle ? '#0f1117' : '#fff',
                      color: i === selectedBundle ? '#fff' : '#0f1117',
                      transition: 'all 0.15s', fontFamily: 'inherit',
                    }}
                  >
                    {b.badge && (
                      <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#0D9488', color: '#fff', fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', padding: '2px 8px', border: '2px solid #0f1117', whiteSpace: 'nowrap' }}>
                        {b.badge}
                      </span>
                    )}
                    <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.05em', marginBottom: 2 }}>{b.label}</p>
                    <p style={{ fontSize: 10, opacity: 0.6, letterSpacing: '0.05em' }}>₹{b.pricePerPack}/pack</p>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA — Desktop */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                style={{
                  flex: 1, padding: '14px 20px', background: '#fff', color: '#0f1117',
                  border: '2.5px solid #0f1117', boxShadow: '3px 3px 0 #0f1117',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  cursor: isAddingToCart ? 'not-allowed' : 'pointer', opacity: isAddingToCart ? 0.6 : 1,
                  transition: 'transform 0.15s, box-shadow 0.15s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (!isAddingToCart) { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 #0f1117'; }}}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #0f1117'; }}
              >
                {isAddingToCart ? 'ADDED ✓' : 'ADD TO CART'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                style={{
                  flex: 1, padding: '14px 20px', background: '#0D9488', color: '#fff',
                  border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  cursor: isBuyingNow ? 'not-allowed' : 'pointer', opacity: isBuyingNow ? 0.6 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'transform 0.15s, box-shadow 0.15s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (!isBuyingNow) { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0f1117'; }}}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0f1117'; }}
              >
                <Zap style={{ width: 14, height: 14 }} />
                {isBuyingNow ? 'PROCESSING...' : `BUY NOW — ₹${bundle.totalPrice.toLocaleString()}`}
              </button>
            </div>

            {/* Delivery */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#0f1117', marginBottom: 20, padding: '10px 14px', background: 'rgba(204,255,0,0.15)', border: '2px solid rgba(15,17,23,0.2)' }}>
              <Truck style={{ width: 14, height: 14, color: '#0f1117', flexShrink: 0 }} />
              <span><strong>Pan-India delivery</strong> · 3–5 business days</span>
            </div>

            {/* Trust Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { icon: ShieldCheck, title: '100% Authentic', sub: 'Genuine Products' },
                { icon: Leaf, title: '100% Natural', sub: 'No artificial additives' },
                { icon: Package, title: 'GMP Certified', sub: 'Lab tested quality' },
                { icon: Truck, title: 'Pan-India Delivery', sub: '3–5 business days' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: '#faf7f2', border: '2px solid rgba(15,17,23,0.12)' }}>
                  <item.icon style={{ width: 14, height: 14, color: '#0D9488', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#0f1117', marginBottom: 1 }}>{item.title}</p>
                    <p style={{ fontSize: 10, color: 'rgba(15,17,23,0.45)' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Tabs product={product} />
          </div>
        </div>

        {/* Reviews */}
        <div ref={reviewsRef} style={{ marginTop: 80, scrollMarginTop: 96 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#0D9488', fontWeight: 600, display: 'block', marginBottom: 12 }}>◆ Verified Reviews</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,4vw,64px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
              WHAT CUSTOMERS<br /><span style={{ color: '#0D9488' }}>ARE SAYING.</span>
            </h2>
          </div>
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#0D9488', fontWeight: 600, display: 'block', marginBottom: 12 }}>◆ Got Questions?</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,4vw,64px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
              FREQUENTLY ASKED<br /><span style={{ color: '#0D9488' }}>QUESTIONS.</span>
            </h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <ProductFAQ productSlug={product.slug} productName={product.name} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#0D9488', fontWeight: 600, display: 'block', marginBottom: 12 }}>◆ You May Also Like</span>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,4vw,64px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
                RELATED<br /><span style={{ color: '#0D9488' }}>PRODUCTS.</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 640, margin: '0 auto' }}>
              {relatedProducts.map((p) => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom — hidden on desktop via CSS */}
      <div className="mobile-cta-outer" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '3px solid #0f1117', padding: '12px 16px', zIndex: 500, boxShadow: '0 -4px 0 rgba(15,17,23,0.08)', display: 'none' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            style={{ background: '#fff', color: '#0f1117', padding: '14px 18px', border: '2.5px solid #0f1117', boxShadow: '3px 3px 0 #0f1117', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
          >
            {isAddingToCart ? '✓ ADDED' : 'ADD TO CART'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            style={{ flex: 1, background: '#0D9488', color: '#fff', padding: '14px 16px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
          >
            <Zap style={{ width: 14, height: 14 }} />
            {isBuyingNow ? 'PROCESSING...' : `BUY NOW — ₹${bundle.totalPrice.toLocaleString()}`}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-cta-outer { display: block !important; }
          .product-container { padding: 20px 16px !important; }
          .product-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .product-image-sticky { position: relative !important; top: auto !important; }
        }
      `}</style>
    </div>
  );
}
