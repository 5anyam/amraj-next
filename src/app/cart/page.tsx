'use client';
import Link from 'next/link';
import { useCart } from '../../../lib/cart';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, ShieldCheck, Truck, BadgeCheck, Leaf } from 'lucide-react';

const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';
const ACCENT_SOFT = '#eef7f5';
const BG_SOFT = '#f6f8f7';
const CARD_SHADOW = '0 2px 16px rgba(16,24,40,0.05)';
const RADIUS = 20;

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
    <div style={{ minHeight: '100vh', background: '#fff', color: INK }}>
      <div className="cart-container" style={{ maxWidth: 1120, margin: '0 auto', padding: '44px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: INK_SOFT, textDecoration: 'none', marginBottom: 18 }}
            onMouseEnter={e => (e.currentTarget.style.color = ACCENT_DK)}
            onMouseLeave={e => (e.currentTarget.style.color = INK_SOFT)}
          >
            <ArrowLeft size={16} /> Continue shopping
          </Link>
          <h1 style={{ fontSize: 'clamp(30px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.03em', color: INK, lineHeight: 1.05 }}>Shopping cart</h1>
          {items.length > 0 && (
            <p style={{ fontSize: 15, color: INK_SOFT, marginTop: 8 }}>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 32px', borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW, maxWidth: 460, margin: '0 auto' }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
              <ShoppingBag size={30} style={{ color: ACCENT_DK }} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: INK, marginBottom: 10 }}>Your cart is empty</h2>
            <p style={{ fontSize: 15, color: INK_SOFT, marginBottom: 26, lineHeight: 1.6 }}>Looks like you haven&apos;t added any items yet.</p>
            <Link href="/shop" style={{ display: 'inline-block', background: ACCENT, color: '#fff', padding: '14px 30px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 20px rgba(13,148,136,0.28)' }}>
              Shop now →
            </Link>
          </div>
        ) : (
          <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>

            {/* Cart Items */}
            <div style={{ borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: `1px solid ${LINE}` }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: INK }}>Cart items</h2>
              </div>

              {items.map((item, idx) => {
                const rp = item.regular_price;
                const hasDiscount = rp && parseFloat(rp) > parseFloat(item.price);
                return (
                  <div key={item.id} className="cart-item-row" style={{ padding: '20px 24px', borderBottom: idx < items.length - 1 ? `1px solid ${LINE}` : 'none', display: 'flex', gap: 16 }}>
                    <div className="cart-item-image" style={{ width: 96, height: 96, flexShrink: 0, borderRadius: 14, overflow: 'hidden', background: BG_SOFT }}>
                      <img src={item.images?.[0]?.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 5, lineHeight: 1.3 }}>{item.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 17, fontWeight: 700, color: INK }}>₹{parseFloat(item.price).toLocaleString()}</span>
                        {hasDiscount && <span style={{ fontSize: 13, color: '#9aa1ac', textDecoration: 'line-through' }}>₹{parseFloat(rp!).toLocaleString()}</span>}
                        <span style={{ fontSize: 12, color: INK_SOFT }}>each</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                        {/* Qty */}
                        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${LINE}`, borderRadius: 999, overflow: 'hidden', background: '#fff' }}>
                          <button onClick={() => decrement(item.id)} disabled={item.quantity <= 1} style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity <= 1 ? 0.3 : 1, color: INK }}>
                            <Minus size={15} />
                          </button>
                          <span style={{ width: 38, textAlign: 'center', fontSize: 15, fontWeight: 700, color: INK }}>{item.quantity}</span>
                          <button onClick={() => increment(item.id)} style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK }}>
                            <Plus size={15} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color: INK }}>₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                          <button onClick={() => removeFromCart(item.id)} style={{ width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${LINE}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK_SOFT, transition: 'all 0.2s' }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#ef4444'; el.style.color = '#ef4444'; el.style.background = '#fef2f2'; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = LINE; el.style.color = INK_SOFT; el.style.background = '#fff'; }}>
                            <Trash2 size={15} />
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
              <div style={{ borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${LINE}` }}>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: INK }}>Order summary</h2>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: INK_SOFT }}>
                        <span>Total MRP ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                        <span>₹{mrpTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: INK_SOFT }}>
                      <span>Subtotal</span>
                      <span style={{ color: INK }}>₹{total.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: INK_SOFT }}>Discount on MRP</span>
                        <span style={{ color: ACCENT_DK, fontWeight: 600 }}>−₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span style={{ color: INK_SOFT }}>Delivery</span>
                      {delivery === 0
                        ? <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT_DK, background: ACCENT_SOFT, padding: '2px 10px', borderRadius: 999 }}>FREE</span>
                        : <span style={{ color: INK }}>₹{delivery}</span>
                      }
                    </div>
                  </div>

                  <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 16, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>Total</span>
                      <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: INK }}>₹{(total + delivery).toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Link href="/checkout" style={{ display: 'block', background: ACCENT, color: '#fff', padding: '15px 20px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', textAlign: 'center', boxShadow: '0 8px 20px rgba(13,148,136,0.28)' }}>
                      Proceed to checkout →
                    </Link>
                    <Link href="/shop" style={{ display: 'block', color: INK, padding: '13px 20px', border: `1.5px solid ${LINE}`, borderRadius: 14, fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                      Continue shopping
                    </Link>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
                {[
                  { icon: ShieldCheck, t: 'Secure Payment' },
                  { icon: Truck, t: 'Pan-India Delivery' },
                  { icon: BadgeCheck, t: 'FSSAI Certified' },
                  { icon: Leaf, t: 'GMP Certified' },
                ].map(({ icon: Icon, t }) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 12px', background: BG_SOFT, borderRadius: 12 }}>
                    <Icon style={{ width: 15, height: 15, color: ACCENT, flexShrink: 0 }} />
                    <p style={{ fontSize: 12, fontWeight: 500, color: INK }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-container { padding: 28px 16px !important; }
          .cart-grid { grid-template-columns: 1fr !important; }
          .cart-summary { position: relative !important; top: auto !important; }
        }
        @media (max-width: 460px) {
          .cart-item-row { flex-direction: column !important; }
          .cart-item-image { width: 100% !important; height: 200px !important; }
        }
      `}</style>
    </div>
  );
}
