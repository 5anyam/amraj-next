'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS, StaticProduct } from '../../lib/products-data';
import Testimonials from '../../components/TestimonialsSection';
import HomeFAQ from '../../components/HomeFaq';
import { Star, ShieldCheck, Truck, RotateCcw, Award, Check, ChevronRight, Leaf, FlaskConical, BadgeCheck } from 'lucide-react';

/* ── SCROLL REVEAL HOOK ── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('visible'); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ── STAR RATING ── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <Star key={i} style={{ width: 14, height: 14, fill: i <= Math.round(rating) ? '#F07B32' : '#e2d9d0', color: i <= Math.round(rating) ? '#F07B32' : '#e2d9d0' }} />
      ))}
    </div>
  );
}

/* ── PRODUCT CARD ── */
function ProductCard({ product }: { product: StaticProduct }) {
  const discount = Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100);
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', background: '#fff', transition: 'transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s', overflow: 'hidden' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0f1117'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0f1117'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', background: '#f3ede4', overflow: 'hidden', borderBottom: '2.5px solid #0f1117' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover', transition: 'transform 0.5s' }} sizes="(max-width: 768px) 100vw, 33vw" />
        {product.badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: '#0f1117', color: '#F07B32', fontSize: 9, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.2em', padding: '4px 10px', border: '2px solid #F07B32' }}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#F07B32', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 8px', border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117' }}>
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F07B32', marginBottom: 6, fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.03em', color: '#0f1117', marginBottom: 6, lineHeight: 1.1 }}>{product.name}</h3>
        <p style={{ fontSize: 12, color: 'rgba(15,17,23,0.5)', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.tagline}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: 11, color: 'rgba(15,17,23,0.45)' }}>({product.reviewCount})</span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#0f1117', letterSpacing: '0.02em' }}>₹{product.price.toLocaleString()}</span>
            <span style={{ fontSize: 13, color: 'rgba(15,17,23,0.35)', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString()}</span>
          </div>
          <div style={{ background: '#0f1117', color: '#fff', textAlign: 'center', padding: '11px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', border: '2px solid #0f1117', transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F07B32')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0f1117')}
          >
            SHOP NOW →
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── HERO ── */
function HeroSection() {
  const [active, setActive] = useState(0);
  const images = PRODUCTS.map(p => p.images[0]);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <section style={{ background: '#0f1117', position: 'relative', overflow: 'hidden', borderBottom: '4px solid #F07B32' }}>
      {/* stripe bg */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(240,123,50,0.03) 40px, rgba(240,123,50,0.03) 41px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 32px 70px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        {/* Left */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(240,123,50,0.12)', border: '2px solid rgba(240,123,50,0.4)', color: '#F07B32', fontSize: 9, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', padding: '5px 14px', marginBottom: 28 }}>
            ◆ New Season Drop 2026 ◆
          </div>

          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(72px, 10vw, 140px)', lineHeight: 0.88, letterSpacing: '0.01em', marginBottom: 8 }}>
            <span style={{ display: 'block', color: '#fff' }}>SCIENCE</span>
            <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '3px #F07B32' }}>BACKED.</span>
            <span style={{ display: 'block', color: '#F07B32', textShadow: '4px 4px 0 rgba(240,123,50,0.3)' }}>RESULTS</span>
          </h1>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px, 7vw, 100px)', lineHeight: 0.88, letterSpacing: '0.01em', marginBottom: 24 }}>
            <span style={{ display: 'block', color: '#fff', opacity: 0.85, fontSize: '0.55em', letterSpacing: '0.03em' }}>YOU CAN FEEL.</span>
          </h1>

          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, maxWidth: 380, marginBottom: 36 }}>
            Precision-formulated supplements rooted in traditional wisdom and modern clinical research. Real ingredients, real results.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
            <Link href="/shop" style={{ background: '#F07B32', color: '#fff', padding: '13px 28px', border: '2.5px solid #F07B32', boxShadow: '4px 4px 0 rgba(240,123,50,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              SHOP NOW <ChevronRight size={14} />
            </Link>
            <Link href="/about" style={{ color: '#fff', padding: '13px 28px', border: '2.5px solid rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              OUR STORY
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex' }}>
              {['👨','👩','👴','👱'].map((e, i) => (
                <div key={i} style={{ width: 32, height: 32, background: 'rgba(240,123,50,0.15)', border: '2px solid rgba(240,123,50,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginLeft: i > 0 ? -8 : 0 }}>
                  {e}
                </div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => <Star key={i} style={{ width: 12, height: 12, fill: '#F07B32', color: '#F07B32' }} />)}
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: '0.05em' }}>
                Trusted by <strong style={{ color: '#F07B32' }}>10,000+</strong> customers
              </p>
            </div>
          </div>
        </div>

        {/* Right — Product Image Stack */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 320, height: 380 }}>
            {/* Offset shadow layer */}
            <div style={{ position: 'absolute', inset: 0, border: '3px solid #F07B32', transform: 'translate(8px, 8px)', opacity: 0.4 }} />
            <div style={{ position: 'relative', width: '100%', height: '100%', border: '3px solid rgba(255,255,255,0.15)', overflow: 'hidden' }}>
              {images.map((src, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute', inset: 0,
                    opacity: i === active ? 1 : 0,
                    transition: 'opacity 0.7s ease',
                  }}
                >
                  <Image src={src} alt={PRODUCTS[i].name} fill style={{ objectFit: 'cover' }} sizes="360px" priority={i === 0} />
                </div>
              ))}
              {/* Sticker */}
              <div style={{ position: 'absolute', top: 16, right: 16, background: '#ccff00', border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117', padding: '4px 10px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 12, letterSpacing: '0.1em', color: '#0f1117', transform: 'rotate(8deg)' }}>
                NEW DROP ◆
              </div>
            </div>
            {/* Dots */}
            <div style={{ position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{ width: i === active ? 24 : 8, height: 8, background: i === active ? '#F07B32' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* mobile override */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img-wrap { width: 260px !important; height: 300px !important; }
        }
      `}</style>
    </section>
  );
}

/* ── MARQUEE BELT ── */
function MarqueeBelt() {
  const row1 = ['CARRY BETTER', 'LIVE BETTER', 'OWN BETTER', 'FEEL BETTER', 'LOOK BETTER'];
  const row2 = ['PROSTATE CARE', 'LIVER DETOX', 'WEIGHT MANAGEMENT', 'NUTRACEUTICALS', 'AYURVEDIC SCIENCE'];
  return (
    <div style={{ borderTop: '3px solid #0f1117', borderBottom: '3px solid #0f1117' }}>
      {/* Row 1 */}
      <div style={{ overflow: 'hidden', borderBottom: '2px solid #0f1117', background: '#F07B32', padding: '10px 0' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'mq-fwd 18s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'inline-flex' }}>
              {row1.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '0 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff' }}>
                  {t} <span style={{ fontSize: 14 }}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      {/* Row 2 */}
      <div style={{ overflow: 'hidden', background: '#0f1117', padding: '10px 0' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'mq-rev 14s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'inline-flex' }}>
              {row2.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '0 20px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 15, letterSpacing: '0.2em', color: '#F07B32' }}>
                  {t} <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>▶</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── CHROME STATS ── */
function ChromeStats() {
  const ref = useReveal(0.15);
  const stats = [
    { num: '10,000+', label: 'Happy Customers' },
    { num: '4.8★', label: 'Average Rating' },
    { num: '100%', label: 'Natural Ingredients' },
    { num: '30 Days', label: 'Money-Back Guarantee' },
  ];
  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        position: 'relative', background: 'linear-gradient(180deg,#ffffff 0%,#e8f0f8 15%,#b8d0e8 35%,#7090a8 50%,#b8d0e8 65%,#e8f0f8 85%,#ffffff 100%)',
        border: '3px solid #0f1117', borderLeft: 'none', borderRight: 'none',
        padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.4) 60px, rgba(255,255,255,0.4) 61px)', pointerEvents: 'none' }} />
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <div style={{ width: 1, height: 56, background: 'rgba(15,17,23,0.15)', position: 'relative', zIndex: 1, flexShrink: 0 }} />}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <span style={{
              fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(44px,5vw,72px)',
              background: 'linear-gradient(180deg,#fff 0%,#8090a0 50%,#fff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              WebkitTextStroke: '1px rgba(15,17,23,0.2)', display: 'block', lineHeight: 1,
            }}>{s.num}</span>
            <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0f1117', marginTop: 4 }}>{s.label}</p>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── WHY AMRAJ ── */
const whyItems = [
  { icon: FlaskConical, title: 'Clinically Researched', desc: 'Every ingredient chosen based on peer-reviewed clinical studies at therapeutic dosages.', num: '01' },
  { icon: Leaf, title: 'Pure & Natural', desc: 'No artificial fillers, no GMOs. Only standardised herbal extracts and pure nutraceuticals.', num: '02' },
  { icon: BadgeCheck, title: 'GMP Certified', desc: 'Manufactured in ISO-approved, GMP-certified facilities with strict quality controls.', num: '03' },
  { icon: ShieldCheck, title: 'Heavy Metal Tested', desc: 'Every batch tested for purity, potency, and freedom from contaminants.', num: '04' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Dispatched within 24 hours, delivered pan-India in 3–5 days. Easy returns.', num: '05' },
  { icon: Award, title: 'FSSAI Certified', desc: 'FSSAI & GMP certified. Manufactured to the highest Indian quality standards.', num: '06' },
];

export default function Homepage() {
  const productsRef = useReveal(0.1);
  const manifestoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = manifestoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.classList.add('manifesto-visible');
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f2', overflow: 'hidden' }}>

      <HeroSection />
      <MarqueeBelt />

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#fff', borderBottom: '3px solid #0f1117' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 32px', alignItems: 'center' }}>
            {[
              { icon: Award, label: 'FSSAI Certified' },
              { icon: ShieldCheck, label: 'GMP Lab Tested' },
              { emoji: '🇮🇳', label: 'Made in India' },
              { icon: RotateCcw, label: '30-Day Guarantee' },
              { icon: Truck, label: 'Free Delivery' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f1117' }}>
                {item.emoji ? <span style={{ fontSize: 16 }}>{item.emoji}</span> : item.icon && <item.icon style={{ width: 14, height: 14, color: '#F07B32' }} />}
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section style={{ padding: '80px 0', background: '#faf7f2' }} id="products">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

          <div className="reveal" ref={productsRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 40, marginBottom: 0, borderBottom: '3px solid #0f1117' }}>
            <div>
              <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', fontWeight: 600, display: 'block', marginBottom: 10 }}>◆ Our Bestsellers</span>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,6vw,88px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
                TARGETED<br /><span style={{ color: '#F07B32' }}>HEALTH SOLUTIONS.</span>
              </h2>
            </div>
            <Link
              href="/shop"
              style={{ background: '#F07B32', color: '#fff', padding: '12px 24px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0f1117'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0f1117'; }}
            >
              VIEW ALL →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderLeft: '3px solid #0f1117' }}>
            {PRODUCTS.map((product) => (
              <div key={product.id} style={{ borderRight: '3px solid #0f1117', borderBottom: '3px solid #0f1117', borderTop: '3px solid #0f1117' }}>
                <div style={{ margin: 0 }}>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ChromeStats />

      {/* ── MANIFESTO ── */}
      <section
        ref={manifestoRef}
        style={{ background: '#0f1117', padding: '100px 48px', borderTop: '4px solid #F07B32', borderBottom: '4px solid #F07B32', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(240,123,50,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(240,123,50,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="manifesto-line"><span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.9, color: '#fff' }}>WE DON&apos;T MAKE</span></div>
          <div className="manifesto-line"><span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.9, color: '#F07B32' }}>PRODUCTS. WE MAKE</span></div>
          <div className="manifesto-line"><span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.9, color: '#ccff00' }}>THE DIFFERENCE</span></div>
          <div className="manifesto-line"><span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,120px)', lineHeight: 0.9, color: 'rgba(255,255,255,0.7)' }}>BETWEEN DAYS.</span></div>
          <div style={{ marginTop: 56, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/shop" style={{ background: '#F07B32', color: '#fff', padding: '13px 28px', border: '2.5px solid #F07B32', boxShadow: '4px 4px 0 rgba(240,123,50,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              OWN IT NOW →
            </Link>
            <Link href="/about" style={{ color: '#fff', padding: '13px 28px', border: '2.5px solid rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              OUR STORY
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY AMRAJ ── */}
      <section style={{ background: '#fff', borderBottom: '4px solid #0f1117' }} id="why">
        <div style={{ borderBottom: '3px solid #0f1117', padding: '48px 40px', background: 'linear-gradient(135deg,#fff5f0,#faf7f2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', fontWeight: 600, display: 'block', marginBottom: 10 }}>◆ The Amraj Difference</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,6vw,88px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
              BETTER MADE.<br /><span style={{ color: '#F07B32' }}>BETTER LIVED.</span>
            </h2>
          </div>
          <Link href="/shop" style={{ background: '#0f1117', color: '#fff', padding: '13px 28px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 rgba(15,17,23,0.3)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
            SHOP NOW →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {whyItems.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '40px 32px', borderRight: (i + 1) % 3 !== 0 ? '3px solid #0f1117' : 'none',
                borderBottom: i < 3 ? '3px solid #0f1117' : 'none',
                position: 'relative', overflow: 'hidden', cursor: 'default',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#faf7f2')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
            >
              <span style={{ position: 'absolute', top: -10, right: 16, fontFamily: 'Bebas Neue, sans-serif', fontSize: 80, color: 'rgba(240,123,50,0.06)', lineHeight: 1, pointerEvents: 'none' }}>{item.num}</span>
              <div style={{ width: 44, height: 44, background: 'rgba(240,123,50,0.1)', border: '2px solid rgba(240,123,50,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <item.icon style={{ width: 20, height: 20, color: '#F07B32' }} />
              </div>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.04em', color: '#0f1117', marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(15,17,23,0.55)', lineHeight: 1.85 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 48px', background: '#faf7f2', borderBottom: '3px solid #0f1117' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', fontWeight: 600, display: 'block', marginBottom: 12 }}>◆ Simple Process</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(44px,5vw,80px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
              YOUR WELLNESS<br /><span style={{ color: '#F07B32' }}>JOURNEY STARTS HERE.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '3px solid #0f1117' }}>
            {[
              { step: '01', title: 'Choose Your Formula', desc: 'Pick the supplement that targets your specific health goal.' },
              { step: '02', title: 'Order in 60 Seconds', desc: 'Simple checkout — name, phone & address. Done.' },
              { step: '03', title: 'Fast Delivery', desc: 'Dispatched within 24 hours. Delivered pan-India in 3–5 days.' },
              { step: '04', title: 'Feel the Results', desc: '4–6 weeks of consistent use delivers real, measurable results.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '32px 24px', textAlign: 'center', borderRight: i < 3 ? '3px solid #0f1117' : 'none', background: i % 2 === 0 ? '#fff' : '#faf7f2' }}>
                <div style={{ width: 48, height: 48, background: '#0f1117', border: '2px solid #0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '3px 3px 0 #F07B32' }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#F07B32', letterSpacing: '0.05em' }}>{item.step}</span>
                </div>
                <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: '0.04em', color: '#0f1117', marginBottom: 10 }}>{item.title}</h4>
                <p style={{ fontSize: 12, color: 'rgba(15,17,23,0.55)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: '#fff', borderBottom: '3px solid #0f1117', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', fontWeight: 600, display: 'block', marginBottom: 12 }}>◆ Real Results</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(44px,5vw,80px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
              WHAT OUR<br /><span style={{ color: '#F07B32' }}>CUSTOMERS SAY.</span>
            </h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 32px', background: '#faf7f2', borderBottom: '3px solid #0f1117' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', fontWeight: 600, display: 'block', marginBottom: 12 }}>◆ Got Questions?</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(44px,5vw,80px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
              FREQUENTLY ASKED<br /><span style={{ color: '#F07B32' }}>QUESTIONS.</span>
            </h2>
          </div>
          <HomeFAQ />
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: '#0f1117', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(240,123,50,0.04) 12px, rgba(240,123,50,0.04) 13px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px,7vw,100px)', color: '#fff', lineHeight: 0.9, marginBottom: 16 }}>
            READY TO<br /><span style={{ color: '#F07B32' }}>TRANSFORM</span><br />YOUR HEALTH?
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.7 }}>
            Join thousands of Indians who have taken charge of their wellness with Amraj.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 36 }}>
            <Link href="/shop" style={{ background: '#F07B32', color: '#fff', padding: '14px 32px', border: '2.5px solid #F07B32', boxShadow: '4px 4px 0 rgba(240,123,50,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none' }}>
              EXPLORE PRODUCTS →
            </Link>
            <Link href="/contact" style={{ color: '#fff', padding: '14px 32px', border: '2.5px solid rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              TALK TO US
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {['Free Delivery', '30-Day Guarantee', 'Secure Payment'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
                <Check style={{ width: 12, height: 12, color: '#F07B32' }} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes mq-fwd { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes mq-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (max-width: 900px) {
          .hero-grid, section > div[style*='grid-template-columns: repeat(3'] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          section > div[style*='grid-template-columns: repeat(4'] { grid-template-columns: 1fr 1fr !important; }
          section > div[style*='grid-template-columns: 1fr 1fr 1fr 1fr'] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
