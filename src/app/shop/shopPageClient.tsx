'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StaticProduct } from '../../../lib/products-data';
import { Star } from 'lucide-react';

interface Props {
  products: StaticProduct[];
}

function ProductCard({ product }: { product: StaticProduct }) {
  const discount = Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100);
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', background: '#fff', overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0f1117'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0f1117'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: '#f3ede4', overflow: 'hidden', borderBottom: '2.5px solid #0f1117' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover', transition: 'transform 0.5s' }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        {product.badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: '#0f1117', color: '#F07B32', fontSize: 9, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.2em', padding: '4px 10px', border: '2px solid #F07B32' }}>{product.badge}</span>
        )}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#F07B32', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 8px', border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117' }}>{discount}% OFF</span>
        )}
      </div>
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F07B32', marginBottom: 6, fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, letterSpacing: '0.03em', color: '#0f1117', marginBottom: 6, lineHeight: 1.1 }}>{product.name}</h3>
        <p style={{ fontSize: 12, color: 'rgba(15,17,23,0.5)', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(i => <Star key={i} style={{ width: 13, height: 13, fill: i <= Math.round(product.rating) ? '#F07B32' : '#e2d9d0', color: i <= Math.round(product.rating) ? '#F07B32' : '#e2d9d0' }} />)}
          </div>
          <span style={{ fontSize: 11, color: 'rgba(15,17,23,0.45)' }}>({product.reviewCount})</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#0f1117' }}>₹{product.price.toLocaleString()}</span>
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
    <div style={{ minHeight: '100vh', background: '#faf7f2' }}>

      {/* Hero */}
      <section style={{ background: '#0f1117', padding: '64px 32px', borderBottom: '4px solid #F07B32', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(240,123,50,0.04) 40px, rgba(240,123,50,0.04) 41px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 16 }}>◆ Premium Range</span>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(64px,10vw,120px)', color: '#fff', lineHeight: 0.9, marginBottom: 16, letterSpacing: '0.02em' }}>
            ALL<br /><span style={{ color: '#F07B32' }}>PRODUCTS.</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
            Science-backed supplements crafted with clinically studied ingredients for real, measurable results.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px' }}>
        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(15,17,23,0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', border: '2.5px solid #0f1117', background: '#fff', color: '#0f1117', fontSize: 12, outline: 'none', boxSizing: 'border-box', boxShadow: '2px 2px 0 #0f1117' }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '12px 16px', border: '2.5px solid #0f1117', background: '#fff', color: '#0f1117', fontSize: 12, outline: 'none', boxShadow: '2px 2px 0 #0f1117', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(15,17,23,0.4)', marginBottom: 24 }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 32px' }}>
            <p style={{ fontSize: 14, color: 'rgba(15,17,23,0.5)', marginBottom: 24 }}>No products match your search.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
              style={{ background: '#F07B32', color: '#fff', padding: '12px 28px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '3px solid #0f1117' }}>
            {filtered.map((p, i) => (
              <div key={p.id} style={{ borderRight: (i + 1) % 3 !== 0 ? '3px solid #0f1117' : 'none', borderBottom: i < filtered.length - (filtered.length % 3 || 3) ? '3px solid #0f1117' : 'none' }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@media(max-width:900px){div[style*='grid-template-columns: repeat(3, 1fr)']:not(section *){grid-template-columns:1fr 1fr!important}div[style*='grid-template-columns: repeat(3, 1fr)']:not(section *)>div{border-right:3px solid #0f1117!important;border-bottom:3px solid #0f1117!important}}@media(max-width:560px){div[style*='grid-template-columns: repeat(3, 1fr)']:not(section *){grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
