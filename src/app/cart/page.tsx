'use client';
import Link from 'next/link';
import { useCart } from '../../../lib/cart';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, increment, decrement, removeFromCart } = useCart();
  const total = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const mrpTotal = items.reduce((s, item) => {
    const rp = item.regular_price;
    return s + (rp ? parseFloat(rp) : parseFloat(item.price)) * item.quantity;
  }, 0);
  const discountAmount = mrpTotal - total;
  const delivery = total >= 500 ? 0 : 50;

  return (
    <div style={{ minHeight: '100vh', background: '#faf7f2' }}>
      <div className="cart-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(15,17,23,0.5)', textDecoration: 'none', marginBottom: 20 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0D9488')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(15,17,23,0.5)')}
          >
            <ArrowLeft size={14} /> CONTINUE SHOPPING
          </Link>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px,7vw,88px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
            SHOPPING<br /><span style={{ color: '#0D9488' }}>CART.</span>
          </h1>
          {items.length > 0 && (
            <p style={{ fontSize: 12, color: 'rgba(15,17,23,0.5)', marginTop: 8, letterSpacing: '0.08em' }}>
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty */
          <div style={{ textAlign: 'center', padding: '80px 32px', border: '3px solid #0f1117', background: '#fff', boxShadow: '6px 6px 0 #0f1117', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ width: 72, height: 72, background: '#faf7f2', border: '3px solid #0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <ShoppingBag size={28} style={{ color: '#0f1117' }} />
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, color: '#0f1117', marginBottom: 10, letterSpacing: '0.04em' }}>YOUR CART IS EMPTY</h2>
            <p style={{ fontSize: 13, color: 'rgba(15,17,23,0.5)', marginBottom: 28, lineHeight: 1.6 }}>Looks like you haven&apos;t added any items yet.</p>
            <Link href="/shop" style={{ display: 'inline-block', background: '#0D9488', color: '#fff', padding: '13px 28px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none' }}>
              SHOP NOW →
            </Link>
          </div>
        ) : (
          <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>

            {/* Cart Items */}
            <div style={{ border: '3px solid #0f1117', background: '#fff', boxShadow: '4px 4px 0 #0f1117', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '3px solid #0f1117', background: '#0f1117' }}>
                <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#0D9488', letterSpacing: '0.08em' }}>CART ITEMS</h2>
              </div>

              {items.map((item, idx) => {
                const rp = item.regular_price;
                const hasDiscount = rp && parseFloat(rp) > parseFloat(item.price);
                return (
                  <div key={item.id} style={{ padding: '20px 24px', borderBottom: idx < items.length - 1 ? '2px solid rgba(15,17,23,0.1)' : 'none', display: 'flex', gap: 16 }}>
                    {/* Image */}
                    <div style={{ width: 100, height: 100, flexShrink: 0, border: '2px solid #0f1117', overflow: 'hidden', background: '#f3ede4' }}>
                      <img src={item.images?.[0]?.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#0f1117', marginBottom: 4, letterSpacing: '0.02em' }}>{item.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#0f1117' }}>₹{parseFloat(item.price).toLocaleString()}</span>
                        {hasDiscount && <span style={{ fontSize: 12, color: 'rgba(15,17,23,0.35)', textDecoration: 'line-through' }}>₹{parseFloat(rp!).toLocaleString()}</span>}
                        <span style={{ fontSize: 10, color: 'rgba(15,17,23,0.4)', letterSpacing: '0.06em' }}>each</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                        {/* Qty */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117' }}>
                          <button onClick={() => decrement(item.id)} disabled={item.quantity <= 1} style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity <= 1 ? 0.3 : 1, transition: 'background 0.15s' }} onMouseEnter={e => { if (item.quantity > 1) (e.currentTarget as HTMLElement).style.background = '#faf7f2'; }} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'none')}>
                            <Minus size={14} />
                          </button>
                          <span style={{ width: 40, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#0f1117', borderLeft: '2px solid rgba(15,17,23,0.15)', borderRight: '2px solid rgba(15,17,23,0.15)' }}>{item.quantity}</span>
                          <button onClick={() => increment(item.id)} style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#faf7f2')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'none')}>
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item total + remove */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#0D9488' }}>₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                          <button onClick={() => removeFromCart(item.id)} style={{ width: 32, height: 32, background: 'none', border: '2px solid rgba(15,17,23,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(15,17,23,0.4)', transition: 'border-color 0.2s, color 0.2s, background 0.2s' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0D9488'; el.style.color = '#0D9488'; el.style.background = '#f0fdf9'; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(15,17,23,0.2)'; el.style.color = 'rgba(15,17,23,0.4)'; el.style.background = 'none'; }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="cart-summary" style={{ position: 'sticky', top: 24 }}>
              <div style={{ border: '3px solid #0f1117', background: '#fff', boxShadow: '4px 4px 0 #0f1117', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '3px solid #0f1117', background: '#0f1117' }}>
                  <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#0D9488', letterSpacing: '0.08em' }}>ORDER SUMMARY</h2>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(15,17,23,0.55)' }}>
                        <span>Total MRP ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                        <span>₹{mrpTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(15,17,23,0.55)' }}>
                      <span>Subtotal</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'rgba(15,17,23,0.55)' }}>Discount on MRP</span>
                        <span style={{ color: '#ccff00', background: '#0f1117', padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'rgba(15,17,23,0.55)' }}>Delivery</span>
                      {delivery === 0
                        ? <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#0f1117', background: '#ccff00', border: '2px solid #0f1117', padding: '1px 8px' }}>FREE</span>
                        : <span>₹{delivery}</span>
                      }
                    </div>
                  </div>

                  <div style={{ borderTop: '3px solid #0f1117', paddingTop: 16, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0f1117' }}>Total</span>
                      <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#0D9488', letterSpacing: '0.02em' }}>₹{(total + delivery).toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link href="/checkout" style={{ display: 'block', background: '#0D9488', color: '#fff', padding: '14px 20px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center', transition: 'transform 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0f1117'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0f1117'; }}
                    >
                      PROCEED TO CHECKOUT →
                    </Link>
                    <Link href="/shop" style={{ display: 'block', color: '#0f1117', padding: '12px 20px', border: '2.5px solid #0f1117', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#faf7f2')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
                    >
                      CONTINUE SHOPPING
                    </Link>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                {['Secure Payment', 'Fast Delivery', '30-Day Returns', 'GMP Certified'].map((t) => (
                  <div key={t} style={{ padding: '10px 12px', background: '#fff', border: '2px solid rgba(15,17,23,0.15)', textAlign: 'center' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f1117' }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-container { padding: 24px 16px !important; }
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-summary { position: relative !important; top: auto !important; }
        }
        @media (max-width: 500px) {
          .cart-item-row { flex-direction: column !important; }
          .cart-item-image { width: 100% !important; height: 200px !important; }
        }
      `}</style>
    </div>
  );
}
