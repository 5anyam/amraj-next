'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StaticProduct } from '../../../lib/products-data';
import { Star, Search, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  products: StaticProduct[];
}

const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';
const ACCENT_SOFT = '#eef7f5';
const BG_SOFT = '#f6f8f7';
const CARD_SHADOW = '0 2px 16px rgba(16,24,40,0.05)';
const RADIUS = 20;

function ProductCard({ product }: { product: StaticProduct }) {
  const discount = Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100);
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', overflow: 'hidden', boxShadow: CARD_SHADOW, transition: 'transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 18px 40px rgba(16,24,40,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: BG_SOFT, overflow: 'hidden' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        {product.badge && (
          <span style={{ position: 'absolute', top: 14, left: 14, background: '#fff', color: INK, fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 999, boxShadow: '0 2px 8px rgba(16,24,40,0.1)' }}>{product.badge}</span>
        )}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 14, right: 14, background: ACCENT, color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 11px', borderRadius: 999 }}>{discount}% OFF</span>
        )}
      </div>
      <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8, fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.015em', color: INK, marginBottom: 8, lineHeight: 1.2 }}>{product.name}</h3>
        <p style={{ fontSize: 14, color: INK_SOFT, marginBottom: 14, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => <Star key={i} style={{ width: 14, height: 14, fill: i <= Math.round(product.rating) ? '#f5a623' : '#e4e6eb', color: i <= Math.round(product.rating) ? '#f5a623' : '#e4e6eb' }} />)}
          </div>
          <span style={{ fontSize: 12.5, color: INK_SOFT }}>{product.rating.toFixed(1)} ({product.reviewCount})</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: INK }}>₹{product.price.toLocaleString()}</span>
            <span style={{ fontSize: 15, color: '#9aa1ac', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString()}</span>
          </div>
          <div style={{ background: ACCENT, color: '#fff', textAlign: 'center', padding: '13px 16px', fontSize: 14, fontWeight: 700, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
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

export default function ShopPageClient({ products }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      return true;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: INK }}>

      {/* Hero */}
      <section className="shop-hero" style={{ background: 'linear-gradient(170deg,#ffffff 0%,#f2faf8 60%,#f6f8f7 100%)', padding: '64px 24px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT_SOFT, color: ACCENT_DK, fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 999, marginBottom: 22 }}>
            <Sparkles size={14} /> Premium range
          </span>
          <h1 style={{ fontSize: 'clamp(36px,5.2vw,56px)', fontWeight: 700, letterSpacing: '-0.03em', color: INK, lineHeight: 1.06, marginBottom: 18 }}>All products</h1>
          <p style={{ fontSize: 17, color: INK_SOFT, lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Focused supplements crafted with well-researched ingredients at meaningful doses — for everyday wellness.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px' }}>
        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: INK_SOFT }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '13px 16px 13px 44px', border: `1px solid ${LINE}`, background: BG_SOFT, color: INK, fontSize: 14, outline: 'none', boxSizing: 'border-box', borderRadius: 999 }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '13px 18px', border: `1px solid ${LINE}`, background: BG_SOFT, color: INK, fontSize: 14, outline: 'none', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <option value="">All categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <p style={{ fontSize: 14, color: INK_SOFT, marginBottom: 24 }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 32px' }}>
            <p style={{ fontSize: 15, color: INK_SOFT, marginBottom: 24 }}>No products match your search.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
              style={{ background: ACCENT, color: '#fff', padding: '13px 28px', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .shop-hero { padding: 48px 18px !important; }
          .shop-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .shop-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
