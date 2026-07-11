'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Star, ShieldCheck, Truck, Check, Leaf, ChevronRight, Zap,
  CreditCard, Sparkles, FlaskConical, Sprout, BadgeCheck, Clock,
  Sun, Package, HeartHandshake, Lock,
} from 'lucide-react';
import { StaticProduct, PRODUCTS, HEALTH_DISCLAIMER } from '../../../../lib/products-data';
import { useCart } from '../../../../lib/cart';
import { toast } from '../../../../hooks/use-toast';

const ProductReviews = dynamic(() => import('../../../../components/ProductReviews'), { ssr: false });
const ProductFAQ = dynamic(() => import('../../../../components/ProductFaq'), { ssr: false });

/* ────────────────────────────────────────────────
   PREMIUM DESIGN TOKENS
──────────────────────────────────────────────── */
const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';
const ACCENT_SOFT = '#eef7f5';
const BG_SOFT = '#f6f8f7';
const CARD_SHADOW = '0 2px 16px rgba(16,24,40,0.05)';
const RADIUS = 20;

function StarRating({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} style={{ width: size, height: size, fill: i <= Math.round(rating) ? '#f5a623' : '#e4e6eb', color: i <= Math.round(rating) ? '#f5a623' : '#e4e6eb' }} />
      ))}
    </div>
  );
}

/* ── SECTION HEADING ── */
function SectionHeading({ eyebrow, title, sub, align = 'center' }: { eyebrow?: string; title: string; sub?: string; align?: 'center' | 'left' }) {
  return (
    <div style={{ textAlign: align, marginBottom: 40, maxWidth: 680, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>
      {eyebrow && (
        <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>{eyebrow}</span>
      )}
      <h2 style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: INK, lineHeight: 1.12 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15, color: INK_SOFT, lineHeight: 1.7, marginTop: 14 }}>{sub}</p>}
    </div>
  );
}

interface Bundle {
  packs: number; label: string; note: string; pricePerServe: number;
  totalPrice: number; savings: number; discountPct: number; badge?: string;
}

function getBundles(price: number, regular: number, capsules: number): Bundle[] {
  const servingsPerPack = Math.max(1, Math.floor(capsules / 2)); // 2 caps/day
  const mk = (packs: number, mult: number, badge?: string): Bundle => {
    const total = Math.round(price * packs * mult);
    const regularTotal = regular * packs;
    return {
      packs,
      label: `Pack of ${capsules * packs}`,
      note: `${packs * (capsules)} capsules · ${packs} bottle${packs > 1 ? 's' : ''}`,
      pricePerServe: Math.round(total / (servingsPerPack * packs)),
      totalPrice: total,
      savings: regularTotal - total,
      discountPct: Math.round(((regularTotal - total) / regularTotal) * 100),
      badge,
    };
  };
  return [mk(1, 1), mk(2, 0.93, 'Popular'), mk(3, 0.87, 'Best Value')];
}

/* ── IMAGE GALLERY (vertical thumbs + large main) ──
   `packImage` (from the selected pack size) becomes the main image; browsing a
   thumbnail temporarily overrides it until another pack is picked. */
function ImageGallery({ images, name, packImage }: { images: string[]; name: string; packImage?: string }) {
  const [main, setMain] = useState(0);
  const [showPack, setShowPack] = useState(true);
  // Whenever the selected pack changes, jump the big image back to the pack shot.
  useEffect(() => { setShowPack(true); }, [packImage]);

  const mainSrc = showPack && packImage ? packImage : images[main];

  return (
    <div className="gallery-wrap" style={{ display: 'flex', gap: 14 }}>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gallery-thumbs" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 74, flexShrink: 0 }}>
          {images.map((src, i) => {
            const active = !showPack && i === main;
            return (
              <button
                key={i}
                onClick={() => { setShowPack(false); setMain(i); }}
                style={{
                  position: 'relative', width: 74, height: 74, borderRadius: 12, overflow: 'hidden',
                  border: `2px solid ${active ? ACCENT : LINE}`, cursor: 'pointer', background: BG_SOFT,
                  padding: 0, transition: 'border-color 0.2s', flexShrink: 0,
                }}
              >
                <Image src={src} alt={`${name} ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="74px" />
              </button>
            );
          })}
        </div>
      )}
      {/* Main */}
      <div className="gallery-main" style={{ position: 'relative', flex: 1, width: '100%', aspectRatio: '1', borderRadius: RADIUS, overflow: 'hidden', background: BG_SOFT, boxShadow: CARD_SHADOW }}>
        <Image src={mainSrc} alt={name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 1024px) 100vw, 560px" priority />
      </div>
    </div>
  );
}

/* ── PAYMENT METHODS ── */
function PaymentMethods() {
  const chip: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 30, minWidth: 46,
    padding: '0 10px', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 8,
    fontSize: 12, fontWeight: 800, letterSpacing: '-0.01em',
  };
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Lock style={{ width: 14, height: 14, color: ACCENT }} />
        <span style={{ fontSize: 12.5, color: INK_SOFT, fontWeight: 500 }}>100% secure payments · UPI, cards & wallets</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {/* UPI */}
        <span style={chip} title="UPI"><span style={{ color: '#0B8A3D' }}>UP</span><span style={{ color: '#F26B21' }}>I</span></span>
        {/* Google Pay */}
        <span style={{ ...chip, gap: 3 }} title="Google Pay">
          <span style={{ color: '#4285F4' }}>G</span><span style={{ color: '#5F6368', fontWeight: 700 }}>Pay</span>
        </span>
        {/* Paytm */}
        <span style={chip} title="Paytm"><span style={{ color: '#002970' }}>Pay</span><span style={{ color: '#00BAF2' }}>tm</span></span>
        {/* PhonePe */}
        <span style={{ ...chip, color: '#5F259F' }} title="PhonePe">PhonePe</span>
        {/* Visa */}
        <span style={{ ...chip, fontStyle: 'italic', color: '#1A1F71' }} title="Visa">VISA</span>
        {/* Mastercard */}
        <span style={{ ...chip, gap: 0, padding: '0 12px' }} title="Mastercard">
          <svg width="30" height="19" viewBox="0 0 30 19" aria-hidden>
            <circle cx="11" cy="9.5" r="8" fill="#EB001B" />
            <circle cx="19" cy="9.5" r="8" fill="#F79E1B" fillOpacity="0.9" />
          </svg>
        </span>
        {/* RuPay */}
        <span style={chip} title="RuPay"><span style={{ color: '#0C3F7A' }}>Ru</span><span style={{ color: '#F58220' }}>Pay</span></span>
      </div>
    </div>
  );
}

/* ── RELATED CARD ── */
function RelatedCard({ product }: { product: StaticProduct }) {
  const discount = Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100);
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', overflow: 'hidden', boxShadow: CARD_SHADOW, transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(16,24,40,0.1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: BG_SOFT, overflow: 'hidden' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="300px" />
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: ACCENT, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>{discount}% OFF</span>
        )}
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, fontWeight: 600, marginBottom: 6 }}>{product.category}</p>
        <h4 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: INK, marginBottom: 10, lineHeight: 1.25 }}>{product.name}</h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: INK }}>₹{product.price.toLocaleString()}</span>
          <span style={{ fontSize: 13, color: '#9aa1ac', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductClient({ product }: { product: StaticProduct }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [selectedBundle, setSelectedBundle] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const bundles = getBundles(product.price, product.regularPrice, product.capsules);
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

  const benefitIcons = [Sparkles, HeartHandshake, ShieldCheck, Leaf, Zap, BadgeCheck];

  const qualityClaims = [
    { icon: Sprout, title: 'Naturally Sourced', desc: 'Standardised herbal extracts & pure nutraceuticals.' },
    { icon: FlaskConical, title: 'Lab Tested', desc: 'Every batch screened for purity & heavy metals.' },
    { icon: Leaf, title: 'Vegetarian Capsules', desc: 'Clean plant-based capsules, no gelatin.' },
    { icon: ShieldCheck, title: 'No Artificial Fillers', desc: 'No added sugar, colours or preservatives.' },
    { icon: BadgeCheck, title: 'FSSAI & GMP', desc: 'Made in licensed, GMP-certified facilities.' },
    { icon: Truck, title: 'Pan-India Delivery', desc: 'Delivered in 3–5 business days, securely packed.' },
  ];

  const trustRow = [
    { icon: CreditCard, label: 'Cash on Delivery' },
    { icon: Truck, label: 'Free Shipping ₹999+' },
    { icon: Zap, label: 'Fast Dispatch' },
    { icon: ShieldCheck, label: 'Secure Checkout' },
  ];

  return (
    <div className="product-page" style={{ minHeight: '100vh', background: '#fff', color: INK, paddingBottom: 100 }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: `1px solid ${LINE}`, background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: INK_SOFT }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <ChevronRight style={{ width: 14, height: 14, opacity: 0.5 }} />
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Shop</Link>
            <ChevronRight style={{ width: 14, height: 14, opacity: 0.5 }} />
            <span style={{ color: INK, fontWeight: 500 }}>{product.shortName}</span>
          </nav>
        </div>
      </div>

      {/* ── HERO / BUY ── */}
      <div className="product-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 56 }}>

          {/* LEFT: gallery */}
          <div className="product-image-sticky" style={{ position: 'sticky', top: 20, alignSelf: 'start' }}>
            <ImageGallery images={product.images} name={product.name} packImage={product.packImages?.[selectedBundle]} />
          </div>

          {/* RIGHT: buy box */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <span style={{ background: ACCENT_SOFT, color: ACCENT_DK, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999 }}>{product.category}</span>
              {product.badge && (
                <span style={{ background: '#fff4e6', color: '#c2791b', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999 }}>{product.badge}</span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(30px,3.6vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: 14 }}>{product.name}</h1>

            <button onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <StarRating rating={product.rating} />
              <span style={{ fontSize: 13, color: INK_SOFT }}>{product.rating.toFixed(1)} · {product.reviewCount} reviews</span>
            </button>

            <p style={{ fontSize: 15.5, color: INK_SOFT, lineHeight: 1.7, marginBottom: 22 }}>{product.tagline}</p>

            {/* Benefit bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 26 }}>
              {product.benefits.slice(0, 4).map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Check style={{ width: 13, height: 13, color: ACCENT_DK }} strokeWidth={3} />
                  </span>
                  <span style={{ fontSize: 14.5, color: INK, lineHeight: 1.55 }}>{b}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em' }}>₹{bundle.totalPrice.toLocaleString()}</span>
              <span style={{ fontSize: 18, color: '#9aa1ac', textDecoration: 'line-through' }}>₹{(product.regularPrice * bundle.packs).toLocaleString()}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: ACCENT, padding: '4px 10px', borderRadius: 999 }}>{bundle.discountPct}% OFF</span>
            </div>
            <p style={{ fontSize: 13, color: INK_SOFT, marginBottom: 22 }}>MRP incl. of all taxes · Just ₹{bundle.pricePerServe}/serving</p>

            {/* Pack selector */}
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK_SOFT, marginBottom: 12 }}>Choose your pack</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {bundles.map((b, i) => {
                const sel = i === selectedBundle;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedBundle(i)}
                    style={{
                      position: 'relative', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', cursor: 'pointer',
                      padding: '15px 18px', borderRadius: 16, background: sel ? ACCENT_SOFT : '#fff',
                      border: `2px solid ${sel ? ACCENT : LINE}`, transition: 'all 0.15s', fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${sel ? ACCENT : '#c7ccd4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {sel && <span style={{ width: 10, height: 10, borderRadius: 999, background: ACCENT }} />}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: INK }}>{b.label}</span>
                      <span style={{ display: 'block', fontSize: 12.5, color: INK_SOFT, marginTop: 2 }}>{b.note} · ₹{b.pricePerServe}/serving</span>
                    </span>
                    <span style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ display: 'block', fontSize: 17, fontWeight: 700, color: INK }}>₹{b.totalPrice.toLocaleString()}</span>
                      <span style={{ display: 'block', fontSize: 12, color: ACCENT_DK, fontWeight: 600 }}>Save ₹{b.savings.toLocaleString()}</span>
                    </span>
                    {b.badge && (
                      <span style={{ position: 'absolute', top: -10, right: 16, background: INK, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999 }}>{b.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="cta-row" style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                style={{ flex: 1, padding: '15px 20px', background: '#fff', color: INK, border: `2px solid ${INK}`, borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: isAddingToCart ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!isAddingToCart) (e.currentTarget as HTMLElement).style.background = BG_SOFT; }}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
              >
                {isAddingToCart ? 'Added ✓' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                style={{ flex: 1.4, padding: '15px 20px', background: ACCENT, color: '#fff', border: `2px solid ${ACCENT}`, borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: isBuyingNow ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 8px 20px rgba(13,148,136,0.28)', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!isBuyingNow) (e.currentTarget as HTMLElement).style.background = ACCENT_DK; }}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = ACCENT)}
              >
                <Zap style={{ width: 16, height: 16 }} />
                {isBuyingNow ? 'Processing…' : `Buy Now`}
              </button>
            </div>

            {/* Payment methods */}
            <PaymentMethods />

            {/* Trust row */}
            <div className="trust-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 8 }}>
              {trustRow.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: INK, padding: '10px 14px', background: BG_SOFT, borderRadius: 12 }}>
                  <t.icon style={{ width: 16, height: 16, color: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontWeight: 500 }}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BENEFIT CARDS ── */}
      <section style={{ background: BG_SOFT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '72px 24px', marginTop: 40 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <SectionHeading eyebrow="Why it works" title={`What ${product.shortName} does for you`} sub="A focused, science-led formula designed to support your everyday wellness goals." />
          <div className="benefit-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {product.benefits.map((b, i) => {
              const Icon = benefitIcons[i % benefitIcons.length];
              return (
                <div key={i} style={{ background: '#fff', borderRadius: RADIUS, border: `1px solid ${LINE}`, padding: '26px 24px', boxShadow: CARD_SHADOW }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon style={{ width: 22, height: 22, color: ACCENT_DK }} />
                  </div>
                  <p style={{ fontSize: 15, color: INK, lineHeight: 1.6, fontWeight: 500 }}>{b}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── KEY INGREDIENTS (image slots) ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <SectionHeading eyebrow="Inside every capsule" title="The active ingredients" sub="Each ingredient is included at a meaningful dose — no proprietary-blend guesswork." />
          <div className="ingredient-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(product.ingredients.length, 3)}, 1fr)`, gap: 22 }}>
            {product.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', overflow: 'hidden', boxShadow: CARD_SHADOW }}>
                {/* Image slot — fill product.ingredients[].image later */}
                <div style={{ position: 'relative', aspectRatio: '16 / 11', background: 'linear-gradient(150deg,#f0fdf9,#e6f3ef)', overflow: 'hidden' }}>
                  {ing.image ? (
                    <Image src={ing.image} alt={ing.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 340px" />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 999, background: 'rgba(13,148,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Leaf style={{ width: 26, height: 26, color: ACCENT }} />
                      </div>
                      <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(15,17,23,0.35)', fontWeight: 600 }}>Herbal Extract</span>
                    </div>
                  )}
                  <span style={{ position: 'absolute', top: 14, right: 14, background: '#fff', color: ACCENT_DK, fontSize: 13, fontWeight: 700, padding: '5px 12px', borderRadius: 999, boxShadow: '0 2px 8px rgba(16,24,40,0.12)' }}>{ing.dose}</span>
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: INK, marginBottom: 8, lineHeight: 1.25 }}>{ing.name}</h3>
                  <p style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.65 }}>{ing.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section style={{ background: BG_SOFT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '72px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SectionHeading eyebrow="Simple daily ritual" title="How to use it" />
          <div className="usage-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {[
              { icon: Package, title: 'How much', desc: 'Take 2 capsules daily with a glass of water.' },
              { icon: Sun, title: 'When', desc: 'Best taken with a meal, or as directed by your healthcare provider.' },
              { icon: Clock, title: 'How long', desc: 'Use consistently for 4–6 weeks as part of a balanced lifestyle.' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: RADIUS, border: `1px solid ${LINE}`, padding: '30px 26px', textAlign: 'center', boxShadow: CARD_SHADOW }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <s.icon style={{ width: 26, height: 26, color: ACCENT_DK }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUALITY CLAIMS ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <SectionHeading eyebrow="Made right" title="Quality you can trust" />
          <div className="quality-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {qualityClaims.map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '22px 22px', borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <q.icon style={{ width: 21, height: 21, color: ACCENT_DK }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 5 }}>{q.title}</h3>
                  <p style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.6 }}>{q.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section style={{ background: BG_SOFT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: INK_SOFT, marginBottom: 28 }}>Certified & Compliant</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '24px 40px' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} style={{ position: 'relative', width: 76, height: 76, opacity: 0.85 }}>
                <Image src={`/certificates/${n}.jpg`} alt="Certification" fill style={{ objectFit: 'contain' }} sizes="76px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section ref={reviewsRef} style={{ padding: '80px 24px', scrollMarginTop: 90 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <SectionHeading eyebrow="Verified reviews" title="What customers are saying" />
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: BG_SOFT, borderTop: `1px solid ${LINE}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <SectionHeading eyebrow="Good to know" title="Frequently asked questions" />
          <ProductFAQ productSlug={product.slug} productName={product.name} />
        </div>
      </section>

      {/* ── RELATED ── */}
      {relatedProducts.length > 0 && (
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <SectionHeading eyebrow="You may also like" title="Complete your routine" />
            <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 680, margin: '0 auto' }}>
              {relatedProducts.map((p) => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── DISCLAIMER ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '18px 20px', background: BG_SOFT, borderRadius: 14, border: `1px solid ${LINE}` }}>
          <FlaskConical style={{ width: 16, height: 16, color: '#9aa1ac', flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: INK_SOFT, lineHeight: 1.7 }}>{HEALTH_DISCLAIMER}</p>
        </div>
      </div>

      {/* ── MOBILE STICKY CTA ── */}
      <div className="mobile-cta-outer" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: `1px solid ${LINE}`, padding: '10px 16px', zIndex: 500, boxShadow: '0 -6px 24px rgba(16,24,40,0.08)', display: 'none' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flexShrink: 0 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: INK, lineHeight: 1 }}>₹{bundle.totalPrice.toLocaleString()}</p>
            <p style={{ fontSize: 11, color: INK_SOFT }}>{bundle.discountPct}% off</p>
          </div>
          <button
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            style={{ flex: 1, background: ACCENT, color: '#fff', padding: '14px 16px', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}
          >
            <Zap style={{ width: 15, height: 15 }} />
            {isBuyingNow ? 'Processing…' : 'Buy Now'}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 26px !important; }
          .product-image-sticky { position: relative !important; top: auto !important; }
          .benefit-grid, .usage-grid, .quality-grid { grid-template-columns: 1fr !important; }
          .ingredient-grid { grid-template-columns: 1fr !important; }
          .mobile-cta-outer { display: block !important; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .benefit-grid, .quality-grid, .ingredient-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        /* Tablet & down: tighten section spacing */
        @media (max-width: 768px) {
          .product-page section { padding-top: 52px !important; padding-bottom: 52px !important; padding-left: 18px !important; padding-right: 18px !important; }
          .product-container { padding: 20px 18px !important; }
          .product-page { padding-bottom: 92px !important; }
        }
        /* Phones: stack gallery, shrink everything a touch */
        @media (max-width: 600px) {
          .gallery-wrap { flex-direction: column !important; gap: 10px !important; }
          .gallery-main { flex: none !important; width: 100% !important; }
          .gallery-thumbs { flex-direction: row !important; width: 100% !important; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; }
          .gallery-thumbs > button { width: 62px !important; height: 62px !important; }
          .product-page section { padding-top: 44px !important; padding-bottom: 44px !important; padding-left: 16px !important; padding-right: 16px !important; }
          .product-container { padding: 16px !important; }
          .related-grid { grid-template-columns: 1fr !important; }
          .cta-row { flex-direction: column !important; }
          .cta-row > button { width: 100% !important; flex: none !important; }
          .trust-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
