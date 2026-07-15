'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { useCart } from '../../../lib/cart';
import { toast } from '../../../hooks/use-toast';
import { ShieldCheck, Truck, ChevronRight, Lock, Zap } from 'lucide-react';

const RAZORPAY_KEY = 'rzp_live_RJVNEePx4007GD';

// ── Premium tokens ──
const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';
const ACCENT_SOFT = '#eef7f5';
const BG_SOFT = '#f6f8f7';
const CARD_SHADOW = '0 2px 16px rgba(16,24,40,0.05)';
const ERR = '#dc2626';
const RADIUS = 20;

// ── Types ────────────────────────────────────────────────────────────────────

interface WooOrder {
  id: number;
  order_key: string;
  status: string;
  total: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailure {
  error?: { description?: string };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id?: string;
  name: string;
  description: string;
  image?: string;
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  prefill?: { name?: string; contact?: string };
  theme?: { color?: string };
  config?: { display?: { blocks?: Record<string, unknown>; sequence?: string[]; preferences?: Record<string, unknown> } };
  retry?: { enabled: boolean; max_count?: number };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, cb: (r: RazorpayFailure) => void) => void;
    };
  }
}

// ── WooCommerce helpers (via server-side API routes to avoid CORS) ───────────

async function createWooOrder(data: Record<string, unknown>): Promise<WooOrder> {
  const res = await fetch('/api/woocommerce/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || `Order failed (${res.status})`);
  }
  return res.json();
}

async function updateWooOrder(
  orderId: number,
  status: string,
  paymentData?: RazorpayResponse
): Promise<void> {
  const updateData: Record<string, unknown> = { status };
  if (paymentData) {
    updateData.meta_data = [
      { key: 'razorpay_payment_id', value: paymentData.razorpay_payment_id },
      { key: 'razorpay_order_id', value: paymentData.razorpay_order_id },
      { key: 'razorpay_signature', value: paymentData.razorpay_signature },
    ];
  }
  const res = await fetch('/api/woocommerce/update-order', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, updateData }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
}

// ── Order Summary ─────────────────────────────────────────────────────────────

function OrderSummary({
  items,
  total,
  delivery,
}: {
  items: { id: number; name: string; price: string; quantity: number; images?: { src: string }[] }[];
  total: number;
  delivery: number;
}) {
  const finalTotal = total + delivery;
  return (
    <div style={{ borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px', borderBottom: `1px solid ${LINE}` }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: INK }}>Order summary</h3>
      </div>
      <div style={{ padding: 22 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {item.images?.[0]?.src && (
                <div style={{ position: 'relative', width: 52, height: 52, flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: BG_SOFT }}>
                  <Image src={item.images[0].src} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="52px" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                <p style={{ fontSize: 12.5, color: INK_SOFT }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: INK, flexShrink: 0 }}>
                ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: INK_SOFT }}>
            <span>Subtotal</span><span style={{ color: INK }}>₹{total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: INK_SOFT }}>Delivery</span>
            {delivery === 0
              ? <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT_DK, background: ACCENT_SOFT, padding: '2px 10px', borderRadius: 999 }}>FREE</span>
              : <span style={{ color: INK }}>₹{delivery}</span>
            }
          </div>
          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>Total</span>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: INK }}>₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>
        {delivery === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 12px', background: ACCENT_SOFT, borderRadius: 12 }}>
            <Truck style={{ width: 14, height: 14, color: ACCENT_DK }} />
            <p style={{ fontSize: 12.5, fontWeight: 500, color: ACCENT_DK }}>Pan-India delivery · 3–5 business days</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Checkout ─────────────────────────────────────────────────────────────

export default function Checkout() {
  const { items, clear } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
  const delivery = subtotal >= 500 ? 0 : 50;
  const finalTotal = subtotal + delivery;

  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [rzpLoaded, setRzpLoaded] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
  }, [items]);

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW, padding: '48px 40px', textAlign: 'center', maxWidth: 400, width: '100%' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: INK, marginBottom: 10 }}>Your cart is empty</h2>
          <p style={{ fontSize: 15, color: INK_SOFT, marginBottom: 26, lineHeight: 1.6 }}>Add some products to continue.</p>
          <Link href="/shop" style={{ display: 'inline-block', background: ACCENT, color: '#fff', padding: '14px 30px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 20px rgba(13,148,136,0.28)' }}>
            Shop now →
          </Link>
        </div>
      </div>
    );
  }

  function validate(): boolean {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    else if (form.address.trim().length < 20) e.address = 'Please enter your complete address (include city, state & pincode)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!rzpLoaded || !window.Razorpay) {
      toast({ title: 'Payment loading...', description: 'Please wait a moment and try again.' });
      return;
    }

    setLoading(true);
    let wooOrder: WooOrder | null = null;

    try {
      // Build WooCommerce order data
      const orderData = {
        payment_method: 'razorpay',
        payment_method_title: 'Razorpay',
        status: 'pending',
        billing: {
          first_name: form.name.trim(),
          last_name: '',
          address_1: form.address.trim(),
          city: '',
          state: '',
          postcode: '',
          country: 'IN',
          email: `${form.phone.trim()}@orders.amraj.in`,
          phone: form.phone.trim(),
        },
        shipping: {
          first_name: form.name.trim(),
          last_name: '',
          address_1: form.address.trim(),
          city: '',
          state: '',
          postcode: '',
          country: 'IN',
        },
        line_items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_lines:
          delivery > 0
            ? [{ method_id: 'flat_rate', method_title: 'Standard Delivery', total: delivery.toString() }]
            : [],
        customer_note: `Name: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}`,
        meta_data: [
          { key: 'customer_name', value: form.name.trim() },
          { key: 'customer_phone', value: form.phone.trim() },
          { key: 'delivery_address', value: form.address.trim() },
        ],
      };

      wooOrder = await createWooOrder(orderData);

      const amountPaise = Math.round(finalTotal * 100);

      // Create a Razorpay order server-side (recommended, reliable flow). If the
      // Razorpay secret isn't configured yet, this returns { configured:false }
      // and we fall back to the amount-only checkout so nothing breaks.
      let rzpOrderId: string | undefined;
      let rzpKey = RAZORPAY_KEY;
      try {
        const rzpRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountPaise,
            receipt: `wc_${wooOrder.id}`,
            notes: { wc_order_id: String(wooOrder.id), customer_phone: form.phone.trim() },
          }),
        });
        const rzpData = await rzpRes.json();
        if (rzpRes.ok && rzpData.configured && rzpData.orderId) {
          rzpOrderId = rzpData.orderId;
          if (rzpData.keyId) rzpKey = rzpData.keyId;
        } else if (!rzpRes.ok) {
          throw new Error(rzpData.error || 'Could not start payment. Please try again.');
        }
      } catch (err) {
        // Network / server error creating the Razorpay order — surface it, cancel WC order.
        if (err instanceof Error && err.message !== 'Failed to fetch') throw err;
      }

      // Open Razorpay Checkout
      const rzpOptions: RazorpayOptions = {
        key: rzpKey,
        amount: amountPaise,
        currency: 'INR',
        ...(rzpOrderId ? { order_id: rzpOrderId } : {}),
        name: 'Amraj Wellness',
        description: `Order #${wooOrder.id}`,
        image: '/amraj-logo.jpg',
        prefill: {
          name: form.name.trim(),
          contact: form.phone.trim(),
        },
        theme: { color: '#0D9488' },
        retry: { enabled: true, max_count: 3 },
        modal: {
          ondismiss: async () => {
            if (wooOrder) {
              await updateWooOrder(wooOrder.id, 'cancelled').catch(() => {});
            }
            toast({ title: 'Payment cancelled', description: 'Your order was not completed.' });
            setLoading(false);
          },
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify the payment signature server-side (skipped automatically if
            // no secret configured, i.e. amount-only fallback).
            if (rzpOrderId) {
              const vr = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const vd = await vr.json().catch(() => ({ valid: false }));
              if (!vr.ok || !vd.valid) {
                await updateWooOrder(wooOrder!.id, 'failed').catch(() => {});
                setLoading(false);
                router.push(
                  `/order-confirmation/failed?orderId=${wooOrder!.id}&error=${encodeURIComponent('Payment verification failed')}`
                );
                return;
              }
            }
            await updateWooOrder(wooOrder!.id, 'processing', response);
            clear();
            router.push(
              `/order-confirmation/success?orderId=${wooOrder!.id}&paymentId=${response.razorpay_payment_id}&total=${finalTotal.toFixed(2)}`
            );
          } catch {
            clear();
            router.push(
              `/order-confirmation/success?orderId=${wooOrder!.id}&paymentId=${response.razorpay_payment_id}&total=${finalTotal.toFixed(2)}`
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', async (response: RazorpayFailure) => {
        if (wooOrder) await updateWooOrder(wooOrder.id, 'failed').catch(() => {});
        const msg = response?.error?.description || 'Payment failed';
        router.push(
          `/order-confirmation/failed?orderId=${wooOrder?.id || ''}&error=${encodeURIComponent(msg)}`
        );
        setLoading(false);
      });

      rzp.open();
      // loading stays true while Razorpay modal is open; reset in handler/ondismiss/failed
    } catch (err) {
      if (wooOrder?.id) await updateWooOrder(wooOrder.id, 'cancelled').catch(() => {});
      toast({
        title: 'Checkout failed',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      });
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRzpLoaded(true)}
        onError={() =>
          toast({ title: 'Payment error', description: 'Could not load payment system. Please refresh.', variant: 'destructive' })
        }
      />

      <div style={{ minHeight: '100vh', background: '#fff', color: INK }}>
        <div className="checkout-container" style={{ maxWidth: 1024, margin: '0 auto', padding: '44px 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: INK_SOFT, textDecoration: 'none', marginBottom: 18 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT_DK)}
              onMouseLeave={e => (e.currentTarget.style.color = INK_SOFT)}
            >
              <ChevronRight style={{ width: 16, height: 16, transform: 'rotate(180deg)' }} /> Back to cart
            </Link>
            <h1 style={{ fontSize: 'clamp(30px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.03em', color: INK, lineHeight: 1.05 }}>Checkout</h1>
            <p style={{ fontSize: 15, color: INK_SOFT, marginTop: 8 }}>Complete your order in a few seconds.</p>
          </div>

          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>

            {/* LEFT: Form */}
            <div>
              <form onSubmit={handleSubmit} style={{ borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 30, height: 30, background: ACCENT, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>1</span>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: INK }}>Delivery details</h2>
                </div>
                <div style={{ padding: '28px 24px' }}>

                  {/* Name */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginBottom: 7 }}>Full name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); if (errors.name) setErrors((er) => ({ ...er, name: undefined })); }}
                      placeholder="Enter your full name"
                      style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${errors.name ? ERR : LINE}`, background: '#fff', color: INK, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', borderRadius: 12, transition: 'border-color 0.2s' }}
                    />
                    {errors.name && <p style={{ color: ERR, fontSize: 12.5, marginTop: 6, fontWeight: 500 }}>{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginBottom: 7 }}>Phone number *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 600, color: INK_SOFT }}>+91</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); setForm((f) => ({ ...f, phone: v })); if (errors.phone) setErrors((er) => ({ ...er, phone: undefined })); }}
                        placeholder="10-digit mobile number"
                        style={{ width: '100%', paddingLeft: 52, paddingRight: 16, paddingTop: 13, paddingBottom: 13, border: `1.5px solid ${errors.phone ? ERR : LINE}`, background: '#fff', color: INK, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', borderRadius: 12 }}
                      />
                    </div>
                    {errors.phone && <p style={{ color: ERR, fontSize: 12.5, marginTop: 6, fontWeight: 500 }}>{errors.phone}</p>}
                    <p style={{ fontSize: 12.5, color: INK_SOFT, marginTop: 6 }}>Order updates will be sent to this number</p>
                  </div>

                  {/* Address */}
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginBottom: 7 }}>Delivery address *</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => { setForm((f) => ({ ...f, address: e.target.value })); if (errors.address) setErrors((er) => ({ ...er, address: undefined })); }}
                      rows={4}
                      placeholder="House/Flat No., Street, Area, Landmark, City, State, Pincode"
                      style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${errors.address ? ERR : LINE}`, background: '#fff', color: INK, fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', borderRadius: 12 }}
                    />
                    {errors.address && <p style={{ color: ERR, fontSize: 12.5, marginTop: 6, fontWeight: 500 }}>{errors.address}</p>}
                    <p style={{ fontSize: 12.5, color: INK_SOFT, marginTop: 6 }}>Include city, state and pincode for accurate delivery</p>
                  </div>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={loading || !rzpLoaded}
                    style={{
                      width: '100%', padding: '16px 20px', background: loading || !rzpLoaded ? '#9aa1ac' : ACCENT,
                      color: '#fff', border: 'none', borderRadius: 14, boxShadow: loading || !rzpLoaded ? 'none' : '0 10px 24px rgba(13,148,136,0.28)',
                      fontSize: 15, fontWeight: 700,
                      cursor: loading || !rzpLoaded ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { if (!loading && rzpLoaded) (e.currentTarget as HTMLElement).style.background = ACCENT_DK; }}
                    onMouseLeave={e => { if (!loading && rzpLoaded) (e.currentTarget as HTMLElement).style.background = ACCENT; }}
                  >
                    {loading ? (
                      <><span style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />Processing…</>
                    ) : !rzpLoaded ? (
                      <><span style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />Loading payment…</>
                    ) : (
                      <><Zap style={{ width: 17, height: 17 }} />Pay ₹{finalTotal.toLocaleString()} securely</>
                    )}
                  </button>

                  {/* Trust row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                    {[{ icon: Lock, label: 'SSL Secured' }, { icon: ShieldCheck, label: 'Safe Checkout' }, { icon: ShieldCheck, label: 'FSSAI Certified' }].map(({ icon: Icon, label }) => (
                      <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: INK_SOFT }}>
                        <Icon style={{ width: 14, height: 14, color: ACCENT }} /> {label}
                      </span>
                    ))}
                  </div>
                </div>
              </form>

              <p style={{ textAlign: 'center', fontSize: 12.5, color: INK_SOFT, marginTop: 14 }}>
                Payments powered by <strong style={{ color: INK }}>Razorpay</strong> — India&apos;s most trusted payment gateway
              </p>
            </div>

            {/* RIGHT: Summary */}
            <div className="checkout-summary" style={{ position: 'sticky', top: 24 }}>
              <OrderSummary items={items} total={subtotal} delivery={delivery} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
                {[{ icon: ShieldCheck, text: 'Secure' }, { icon: Truck, text: 'Delivery' }, { icon: ShieldCheck, text: 'Certified' }].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ padding: '12px 8px', background: BG_SOFT, borderRadius: 12, textAlign: 'center' }}>
                    <Icon style={{ width: 16, height: 16, color: ACCENT, margin: '0 auto 5px' }} />
                    <p style={{ fontSize: 12, fontWeight: 600, color: INK }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .checkout-container { padding: 24px 16px !important; }
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-summary { position: relative !important; top: auto !important; }
        }
      `}</style>
    </>
  );
}
