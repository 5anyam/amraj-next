'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS, StaticProduct } from '../../lib/products-data';
import Testimonials from '../../components/TestimonialsSection';
import HomeFAQ from '../../components/HomeFaq';
import HeroCarousel from '../../components/HeroCarousel';
import Reveal from '../../components/Reveal';
import {
  Star, ShieldCheck, Truck, Award, Check, Leaf,
  FlaskConical, BadgeCheck, HeartHandshake, ArrowRight,
} from 'lucide-react';

/* ── PREMIUM TOKENS ── */
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

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <Reveal variant="blur" style={{ textAlign: 'center', marginBottom: 44, maxWidth: 680, margin: '0 auto 44px' }}>
      <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>{eyebrow}</span>
      <h2 style={{ fontSize: 'clamp(30px,3.6vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', color: INK, lineHeight: 1.1 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15.5, color: INK_SOFT, lineHeight: 1.7, marginTop: 16 }}>{sub}</p>}
    </Reveal>
  );
}

/* ── PRODUCT CARD ── */
function ProductCard({ product }: { product: StaticProduct }) {
  const discount = Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100);
  return (
    <Link
      href={`/product/${product.slug}`}
      className="pcard"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', overflow: 'hidden', boxShadow: CARD_SHADOW, transition: 'transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 18px 40px rgba(16,24,40,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: BG_SOFT, overflow: 'hidden' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 50vw, 33vw" />
        {product.badge && (
          <span style={{ position: 'absolute', top: 14, left: 14, background: '#fff', color: INK, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', padding: '5px 12px', borderRadius: 999, boxShadow: '0 2px 8px rgba(16,24,40,0.1)' }}>{product.badge}</span>
        )}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 14, right: 14, background: ACCENT, color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 999 }}>{discount}% OFF</span>
        )}
      </div>
      <div className="pcard-body" style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p className="pcard-cat" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8, fontWeight: 600 }}>{product.category}</p>
        <h3 className="pcard-title" style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.015em', color: INK, marginBottom: 8, lineHeight: 1.2 }}>{product.name}</h3>
        <p className="pcard-tagline" style={{ fontSize: 14, color: INK_SOFT, marginBottom: 14, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.tagline}</p>
        <div className="pcard-rating" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <StarRating rating={product.rating} size={14} />
          <span style={{ fontSize: 12.5, color: INK_SOFT }}>{product.rating.toFixed(1)} ({product.reviewCount})</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div className="pcard-price" style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: INK }}>₹{product.price.toLocaleString()}</span>
            <span style={{ fontSize: 15, color: '#9aa1ac', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString()}</span>
          </div>
          <div className="pcard-btn" style={{ background: ACCENT, color: '#fff', textAlign: 'center', padding: '13px 16px', fontSize: 14, fontWeight: 700, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = ACCENT_DK)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = ACCENT)}
          >
            Shop Now <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}


/* ── WHY AMRAJ ── */
const whyItems = [
  { icon: FlaskConical, title: 'Research-led formulas', desc: 'Every ingredient is chosen based on published research at meaningful dosages.' },
  { icon: Leaf, title: 'Pure & natural', desc: 'No artificial fillers or GMOs — only standardised herbal extracts & nutraceuticals.' },
  { icon: BadgeCheck, title: 'GMP certified', desc: 'Manufactured in ISO-approved, GMP-certified facilities with strict quality controls.' },
  { icon: ShieldCheck, title: 'Heavy-metal tested', desc: 'Every batch is screened for purity, potency and freedom from contaminants.' },
  { icon: Truck, title: 'Pan-India delivery', desc: 'Delivered across India in 3–5 business days, securely packaged to stay fresh.' },
  { icon: Award, title: 'FSSAI licensed', desc: 'Made to the highest Indian quality and safety standards.' },
];

export default function Homepage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: INK }}>
      <HeroCarousel />

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#fff', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 24px' }}>
          <Reveal variant="stagger" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 40px', alignItems: 'center' }}>
            {[
              { icon: Award, label: 'FSSAI Certified' },
              { icon: ShieldCheck, label: 'GMP Lab Tested' },
              { emoji: '🇮🇳', label: 'Made in India' },
              { icon: Leaf, label: '100% Natural' },
              { icon: FlaskConical, label: 'Heavy-Metal Tested' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, fontWeight: 500, color: INK }}>
                {item.emoji ? <span style={{ fontSize: 17 }}>{item.emoji}</span> : item.icon && <item.icon style={{ width: 16, height: 16, color: ACCENT }} />}
                {item.label}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section style={{ padding: '84px 24px' }} id="products">
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionHeading eyebrow="Our bestsellers" title="Targeted health solutions" sub="Three focused formulas for the goals that matter most — prostate care, liver health and weight management." />
          <Reveal variant="stagger" className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {PRODUCTS.map((product) => <ProductCard key={product.id} product={product} />)}
          </Reveal>
          <Reveal style={{ textAlign: 'center', marginTop: 44 }}>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: INK, padding: '14px 28px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', border: `1.5px solid ${INK}` }}>
              View all products <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: BG_SOFT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '56px 24px' }}>
        <Reveal variant="stagger" style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="stats-grid">
          {[
            { num: '10,000+', label: 'Happy customers' },
            { num: '4.8★', label: 'Average rating' },
            { num: '100%', label: 'Natural ingredients' },
            { num: 'FSSAI', label: 'Certified & licensed' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(30px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.02em', color: ACCENT_DK, lineHeight: 1 }}>{s.num}</p>
              <p style={{ fontSize: 13.5, color: INK_SOFT, marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── WHY AMRAJ ── */}
      <section style={{ padding: '84px 24px' }} id="why">
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionHeading eyebrow="The Amraj difference" title="Better made, better lived" sub="We hold every formula to a higher standard — from sourcing to the capsule in your hand." />
          <Reveal variant="stagger" className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {whyItems.map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: RADIUS, border: `1px solid ${LINE}`, padding: '28px 26px', boxShadow: CARD_SHADOW }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <item.icon style={{ width: 23, height: 23, color: ACCENT_DK }} />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em', color: INK, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 14.5, color: INK_SOFT, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: BG_SOFT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '84px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SectionHeading eyebrow="Simple process" title="Your wellness journey starts here" />
          <Reveal variant="stagger" className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { step: '01', title: 'Choose your formula', desc: 'Pick the supplement that targets your specific health goal.' },
              { step: '02', title: 'Order in 60 seconds', desc: 'Simple checkout — name, phone & address. Done.' },
              { step: '03', title: 'Pan-India delivery', desc: 'Delivered across India in 3–5 business days, securely packaged.' },
              { step: '04', title: 'Feel the difference', desc: 'Consistent use over 4–6 weeks supports real, lasting results.' },
            ].map((item) => (
              <div key={item.step} style={{ background: '#fff', borderRadius: RADIUS, border: `1px solid ${LINE}`, padding: '28px 24px', boxShadow: CARD_SHADOW }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{item.step}</span>
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, color: INK, marginBottom: 9 }}>{item.title}</h4>
                <p style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '84px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <SectionHeading eyebrow="Real results" title="What our customers say" />
          <Reveal><Testimonials /></Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: BG_SOFT, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: '84px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <SectionHeading eyebrow="Got questions?" title="Frequently asked questions" />
          <Reveal><HomeFAQ /></Reveal>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: '84px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', background: 'linear-gradient(135deg,#0D9488 0%,#0a7a6e 100%)', borderRadius: 32, padding: '72px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 40%)', pointerEvents: 'none' }} />
          <Reveal variant="blur" style={{ position: 'relative', zIndex: 2, maxWidth: 620, margin: '0 auto' }}>
            <HeartHandshake style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.9)', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
              Ready to take charge of your health?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 34 }}>
              Join thousands of Indians who have made Amraj part of their daily wellness routine.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 34 }}>
              <Link href="/shop" style={{ background: '#fff', color: INK, padding: '15px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Explore products <ArrowRight size={16} />
              </Link>
              <Link href="/contact" style={{ background: 'transparent', color: '#fff', padding: '15px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.5)' }}>
                Talk to us
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
              {['100% Natural', 'Lab Tested', 'Secure Payment'].map((t) => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'rgba(255,255,255,0.85)' }}>
                  <Check style={{ width: 15, height: 15, color: '#fff' }} strokeWidth={3} /> {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        /* Tablet & below: 2 products on top, 3rd centred underneath */
        @media (max-width: 900px) {
          .why-grid { grid-template-columns: 1fr !important; }
          .how-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 32px 20px !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; }
          .products-grid > .pcard:nth-child(odd):last-child {
            grid-column: 1 / -1;
            width: calc(50% - 10px);
            margin: 0 auto;
          }
        }
        @media (min-width: 561px) and (max-width: 900px) {
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        /* Phones: same 2 + 1 layout, compact card */
        @media (max-width: 600px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .products-grid { gap: 14px !important; }
          .products-grid > .pcard:nth-child(odd):last-child { width: calc(50% - 7px); }
          .pcard-body { padding: 14px 14px 16px !important; }
          .pcard-cat { font-size: 9.5px !important; margin-bottom: 5px !important; }
          .pcard-title { font-size: 15px !important; margin-bottom: 5px !important; }
          .pcard-tagline { font-size: 12px !important; margin-bottom: 9px !important; line-height: 1.45 !important; }
          .pcard-rating { margin-bottom: 10px !important; gap: 5px !important; }
          .pcard-rating span { font-size: 11px !important; }
          .pcard-price { margin-bottom: 10px !important; gap: 6px !important; }
          .pcard-price span:first-child { font-size: 18px !important; }
          .pcard-price span:last-child { font-size: 12px !important; }
          .pcard-btn { padding: 10px 10px !important; font-size: 12.5px !important; gap: 5px !important; border-radius: 10px !important; }
        }
        /* Very narrow phones: 3rd card full width so it isn't a sliver */
        @media (max-width: 380px) {
          .products-grid > .pcard:nth-child(odd):last-child { width: 100%; }
        }
      `}</style>
    </div>
  );
}
