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
    <div style={{ border: '3px solid #0f1117', background: '#fff', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '3px solid #0f1117', background: '#0f1117' }}>
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#0D9488', letterSpacing: '0.08em' }}>ORDER SUMMARY</h3>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {item.images?.[0]?.src && (
                <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0, border: '2px solid #0f1117', overflow: 'hidden', background: '#f3ede4' }}>
                  <Image src={item.images[0].src} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="48px" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0f1117', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                <p style={{ fontSize: 10, color: 'rgba(15,17,23,0.45)', letterSpacing: '0.06em' }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#0f1117', flexShrink: 0 }}>
                ₹{(parseFloat(item.price) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '2px solid rgba(15,17,23,0.12)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(15,17,23,0.55)' }}>
            <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'rgba(15,17,23,0.55)' }}>Delivery</span>
            {delivery === 0
              ? <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#0f1117', background: '#ccff00', border: '2px solid #0f1117', padding: '1px 8px' }}>FREE</span>
              : <span style={{ color: '#0f1117' }}>₹{delivery}</span>
            }
          </div>
          <div style={{ borderTop: '2px solid #0f1117', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0f1117' }}>Total</span>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: '#0D9488', letterSpacing: '0.02em' }}>₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>
        {delivery === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '8px 10px', background: 'rgba(204,255,0,0.15)', border: '2px solid rgba(15,17,23,0.15)' }}>
            <Truck style={{ width: 12, height: 12, color: '#0f1117' }} />
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#0f1117' }}>Pan-India delivery · 3–5 business days</p>
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
      <div style={{ minHeight: '100vh', background: '#faf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ border: '3px solid #0f1117', background: '#fff', boxShadow: '6px 6px 0 #0f1117', padding: '48px 40px', textAlign: 'center', maxWidth: 380, width: '100%' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: '#0f1117', marginBottom: 10, letterSpacing: '0.04em' }}>YOUR CART IS EMPTY</h2>
          <p style={{ fontSize: 13, color: 'rgba(15,17,23,0.5)', marginBottom: 28, lineHeight: 1.6 }}>Add some products to continue.</p>
          <Link href="/shop" style={{ display: 'inline-block', background: '#0D9488', color: '#fff', padding: '13px 28px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none' }}>
            SHOP NOW →
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

      // Open Razorpay Magic Checkout
      const rzpOptions: RazorpayOptions = {
        key: RAZORPAY_KEY,
        amount: Math.round(finalTotal * 100),
        currency: 'INR',
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

      <div style={{ minHeight: '100vh', background: '#faf7f2' }}>
        <div className="checkout-container" style={{ maxWidth: 1024, margin: '0 auto', padding: '40px 32px' }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <Link href="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(15,17,23,0.5)', textDecoration: 'none', marginBottom: 20 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0D9488')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(15,17,23,0.5)')}
            >
              <ChevronRight style={{ width: 14, height: 14, transform: 'rotate(180deg)' }} /> BACK TO CART
            </Link>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,7vw,88px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 0.9 }}>
              CHECKOUT.<br /><span style={{ color: '#0D9488', fontSize: '0.7em' }}>COMPLETE YOUR ORDER.</span>
            </h1>
          </div>

          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>

            {/* LEFT: Form */}
            <div>
              <form onSubmit={handleSubmit} style={{ border: '3px solid #0f1117', background: '#fff', boxShadow: '4px 4px 0 #0f1117', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '3px solid #0f1117', background: '#0f1117', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 28, height: 28, background: '#0D9488', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, color: '#fff', flexShrink: 0 }}>1</span>
                  <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#0D9488', letterSpacing: '0.08em' }}>DELIVERY DETAILS</h2>
                </div>
                <div style={{ padding: '28px 24px' }}>

                  {/* Name */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0f1117', marginBottom: 8 }}>Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); if (errors.name) setErrors((er) => ({ ...er, name: undefined })); }}
                      placeholder="Enter your full name"
                      style={{ width: '100%', padding: '12px 16px', border: `2.5px solid ${errors.name ? '#d95f1a' : '#0f1117'}`, background: errors.name ? '#f0fdf9' : '#faf7f2', color: '#0f1117', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    />
                    {errors.name && <p style={{ color: '#d95f1a', fontSize: 10, marginTop: 6, fontWeight: 600, letterSpacing: '0.05em' }}>{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0f1117', marginBottom: 8 }}>Phone Number *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: '#0f1117' }}>+91</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); setForm((f) => ({ ...f, phone: v })); if (errors.phone) setErrors((er) => ({ ...er, phone: undefined })); }}
                        placeholder="10-digit mobile number"
                        style={{ width: '100%', paddingLeft: 50, paddingRight: 16, paddingTop: 12, paddingBottom: 12, border: `2.5px solid ${errors.phone ? '#d95f1a' : '#0f1117'}`, background: errors.phone ? '#f0fdf9' : '#faf7f2', color: '#0f1117', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                    </div>
                    {errors.phone && <p style={{ color: '#d95f1a', fontSize: 10, marginTop: 6, fontWeight: 600 }}>{errors.phone}</p>}
                    <p style={{ fontSize: 10, color: 'rgba(15,17,23,0.4)', marginTop: 6, letterSpacing: '0.04em' }}>Order updates will be sent to this number</p>
                  </div>

                  {/* Address */}
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0f1117', marginBottom: 8 }}>Delivery Address *</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => { setForm((f) => ({ ...f, address: e.target.value })); if (errors.address) setErrors((er) => ({ ...er, address: undefined })); }}
                      rows={4}
                      placeholder="House/Flat No., Street, Area, Landmark, City, State, Pincode"
                      style={{ width: '100%', padding: '12px 16px', border: `2.5px solid ${errors.address ? '#d95f1a' : '#0f1117'}`, background: errors.address ? '#f0fdf9' : '#faf7f2', color: '#0f1117', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
                    />
                    {errors.address && <p style={{ color: '#d95f1a', fontSize: 10, marginTop: 6, fontWeight: 600 }}>{errors.address}</p>}
                    <p style={{ fontSize: 10, color: 'rgba(15,17,23,0.4)', marginTop: 6, letterSpacing: '0.04em' }}>Include city, state and pincode for accurate delivery</p>
                  </div>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={loading || !rzpLoaded}
                    style={{
                      width: '100%', padding: '16px 20px', background: loading || !rzpLoaded ? 'rgba(15,17,23,0.5)' : '#0D9488',
                      color: '#fff', border: '2.5px solid #0f1117', boxShadow: loading || !rzpLoaded ? 'none' : '4px 4px 0 #0f1117',
                      fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                      cursor: loading || !rzpLoaded ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { if (!loading && rzpLoaded) { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0f1117'; }}}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0f1117'; }}
                  >
                    {loading ? (
                      <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />PROCESSING...</>
                    ) : !rzpLoaded ? (
                      <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />LOADING PAYMENT...</>
                    ) : (
                      <><Zap style={{ width: 16, height: 16 }} />PAY ₹{finalTotal.toLocaleString()} SECURELY</>
                    )}
                  </button>

                  {/* Trust row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
                    {[{ icon: Lock, label: 'SSL Secured' }, { icon: ShieldCheck, label: 'Safe Checkout' }, { icon: ShieldCheck, label: 'FSSAI Certified' }].map(({ icon: Icon, label }) => (
                      <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(15,17,23,0.4)', letterSpacing: '0.08em' }}>
                        <Icon style={{ width: 12, height: 12 }} /> {label}
                      </span>
                    ))}
                  </div>
                </div>
              </form>

              <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(15,17,23,0.35)', marginTop: 14, letterSpacing: '0.08em' }}>
                Payments powered by <strong style={{ color: 'rgba(15,17,23,0.6)' }}>Razorpay</strong> — India&apos;s most trusted payment gateway
              </p>
            </div>

            {/* RIGHT: Summary */}
            <div className="checkout-summary" style={{ position: 'sticky', top: 24 }}>
              <OrderSummary items={items} total={subtotal} delivery={delivery} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
                {[{ icon: ShieldCheck, text: 'Secure' }, { icon: Truck, text: 'Delivery' }, { icon: ShieldCheck, text: 'Certified' }].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ padding: '10px 8px', background: '#fff', border: '2px solid rgba(15,17,23,0.15)', textAlign: 'center' }}>
                    <Icon style={{ width: 14, height: 14, color: '#0D9488', margin: '0 auto 4px' }} />
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f1117' }}>{text}</p>
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
