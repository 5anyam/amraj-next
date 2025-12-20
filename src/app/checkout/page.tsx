"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../../lib/cart";
import { useAuth } from "../../../lib/auth-context"; // ✅ ADDED
import { toast } from "../../../hooks/use-toast";
import { useFacebookPixel } from "../../../hooks/useFacebookPixel";
import type { CartItem } from "../../../lib/facebook-pixel";
import Script from "next/script";

// ✅ PRODUCTION CONFIGURATION (SAME)
const WOOCOMMERCE_CONFIG = {
  BASE_URL: 'https://cms.amraj.in',
  CONSUMER_KEY: 'ck_7610f309972822bfa8e87304ea6c47e9e93b8ff6',
  CONSUMER_SECRET: 'cs_0f117bc7ec4611ca378adde03010f619c0af59b2',
};

const RAZORPAY_CONFIG = {
  KEY_ID: "rzp_live_RJVNEePx4007GD",
  COMPANY_NAME: "Amraj Wellness",
  THEME_COLOR: "#14b8a6"
};

// ✅ UPDATED INTERFACES
interface FormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  notes: string;
  password?: string; // ✅ ADDED
}

interface WooCommerceOrder {
  id: number;
  order_key: string;
  status: string;
  total: string;
  payment_url?: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
    code?: string;
    metadata?: Record<string, string>;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  retry?: {
    enabled: boolean;
    max_count?: number;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { 
      open: () => void;
      on: (event: string, callback: (response: RazorpayFailureResponse) => void) => void;
    };
  }
}

// ✅ WOOCOMMERCE FUNCTIONS (SAME)
const createWooCommerceOrder = async (orderData: Record<string, unknown>): Promise<WooCommerceOrder> => {
  const apiUrl = `${WOOCOMMERCE_CONFIG.BASE_URL}/wp-json/wc/v3/orders`;
  const auth = btoa(`${WOOCOMMERCE_CONFIG.CONSUMER_KEY}:${WOOCOMMERCE_CONFIG.CONSUMER_SECRET}`);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }

    let errorMessage = `Order creation failed: ${response.status}`;
    if (response.status === 404) {
      errorMessage = 'WooCommerce API not found. Please contact support.';
    } else if (response.status === 401) {
      errorMessage = 'Authentication failed. Please contact support.';
    } else if (typeof errorData === 'object' && errorData && errorData !== null && 'message' in errorData) {
      const typedError = errorData as { message: string };
      errorMessage += ` - ${typedError.message}`;
    }

    throw new Error(errorMessage);
  }

  const order = await response.json();
  return order as WooCommerceOrder;
};

const updateWooCommerceOrderStatus = async (orderId: number, status: string, paymentData?: RazorpayHandlerResponse): Promise<WooCommerceOrder> => {
  const updateData: Record<string, unknown> = { status };

  if (paymentData) {
    updateData.meta_data = [
      { key: 'razorpay_payment_id', value: paymentData.razorpay_payment_id },
      { key: 'razorpay_order_id', value: paymentData.razorpay_order_id },
      { key: 'razorpay_signature', value: paymentData.razorpay_signature },
      { key: 'payment_method', value: 'razorpay' },
      { key: 'payment_captured_at', value: new Date().toISOString() },
    ];
  }

  const apiUrl = `${WOOCOMMERCE_CONFIG.BASE_URL}/wp-json/wc/v3/orders/${orderId}`;
  const auth = btoa(`${WOOCOMMERCE_CONFIG.CONSUMER_KEY}:${WOOCOMMERCE_CONFIG.CONSUMER_SECRET}`);

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update order: ${errorText}`);
  }

  const result = await response.json();
  return result as WooCommerceOrder;
};

export default function Checkout(): React.ReactElement {
  const { items, clear } = useCart();
  const { user, register } = useAuth(); // ✅ ADDED
  const router = useRouter();
  const { trackInitiateCheckout, trackAddPaymentInfo, trackPurchase } = useFacebookPixel();

  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const deliveryCharges = total >= 500 ? 0 : 50;

  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

  const subtotalAfterCoupon = total - couponDiscount;
  const finalTotal = subtotalAfterCoupon + deliveryCharges;

  // ✅ UPDATED FormData with password
  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", whatsapp: "", address: "", 
    pincode: "", city: "", state: "", notes: "", password: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<"form" | "processing">("form");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
  const [showPasswordField, setShowPasswordField] = useState<boolean>(false); // ✅ NEW

  // ✅ INITIALIZATION (SAME)
  useEffect(() => {
    if (items.length > 0) {
      const cartItems: CartItem[] = items.map(item => ({
        id: item.id, 
        name: item.name, 
        price: parseFloat(item.price), 
        quantity: item.quantity
      }));
      trackInitiateCheckout(cartItems, finalTotal);
    }
  }, [items, finalTotal, trackInitiateCheckout]);

  // ✅ COUPON FUNCTIONS (SAME)
  const validateCoupon = (code: string): { valid: boolean; discount: number; message: string } => {
    const upperCode = code.toUpperCase().trim();
    if (upperCode === "WELCOME100") {
      if (total >= 200) {
        return { valid: true, discount: 100, message: "Coupon applied successfully!" };
      } else {
        return { valid: false, discount: 0, message: "Minimum order amount ₹200 required" };
      }
    }
    return { valid: false, discount: 0, message: "Invalid coupon code" };
  };

  const handleApplyCoupon = (): void => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    if (appliedCoupon === couponCode.toUpperCase()) {
      setCouponError("Coupon already applied");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    setTimeout(() => {
      const validation = validateCoupon(couponCode);
      if (validation.valid) {
        setAppliedCoupon(couponCode.toUpperCase());
        setCouponDiscount(validation.discount);
        setCouponError("");
        toast({
          title: "🎉 Coupon Applied!",
          description: `You saved ₹${validation.discount}`,
        });
      } else {
        setCouponError(validation.message);
        setAppliedCoupon("");
        setCouponDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 800);
  };

  const handleRemoveCoupon = (): void => {
    setAppliedCoupon("");
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
    toast({
      title: "Coupon Removed",
      description: "Coupon discount has been removed",
    });
  };

  // ✅ UPDATED VALIDATION
  function validateForm(): boolean {
    const newErrors: Partial<FormData> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!form.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
    if (!/^[0-9]{10}$/.test(form.whatsapp)) {
      newErrors.whatsapp = "Please enter a valid 10-digit WhatsApp number";
    }
    // ✅ PASSWORD VALIDATION (optional)
    if (showPasswordField && form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";

    const isValid = Object.keys(newErrors).length === 0;

    if (isValid && items.length > 0) {
      const cartItems: CartItem[] = items.map(item => ({
        id: item.id, 
        name: item.name, 
        price: parseFloat(item.price), 
        quantity: item.quantity
      }));
      trackAddPaymentInfo(cartItems, finalTotal);
    }

    setErrors(newErrors);
    return isValid;
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name as keyof FormData]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name as keyof FormData]: undefined }));
    }
  }

  function copyPhoneToWhatsApp(): void {
    if (form.phone) {
      setForm(f => ({ ...f, whatsapp: form.phone }));
      if (errors.whatsapp) {
        setErrors(prev => ({ ...prev, whatsapp: undefined }));
      }
    }
  }

  // ✅ PAYMENT HANDLERS (SAME)
  const handlePaymentSuccess = async (wooOrder: WooCommerceOrder, response: RazorpayHandlerResponse): Promise<void> => {
    try {
      await updateWooCommerceOrderStatus(wooOrder.id, 'processing', response);

      const orderItems: CartItem[] = items.map(item => ({
        id: item.id, 
        name: item.name, 
        price: parseFloat(item.price), 
        quantity: item.quantity
      }));
      trackPurchase(orderItems, finalTotal, response.razorpay_payment_id);

      clear();
      router.push(`/order-confirmation/success?orderId=${wooOrder.id}&paymentId=${response.razorpay_payment_id}&total=${finalTotal.toFixed(2)}`);
    } catch {
      clear();
      router.push(`/order-confirmation/success?orderId=${wooOrder.id}&paymentId=${response.razorpay_payment_id}&total=${finalTotal.toFixed(2)}`);
    } finally {
      setLoading(false);
      setStep("form");
    }
  };

  const handlePaymentFailure = async (wooOrder: WooCommerceOrder | null, response: RazorpayFailureResponse): Promise<void> => {
    if (wooOrder?.id) {
      try {
        await updateWooCommerceOrderStatus(wooOrder.id, 'failed');
      } catch {
        // Silently handle error
      }
    }

    const errorMsg = response?.error?.description || "Payment was not successful";
    router.push(`/order-confirmation/failed?orderId=${wooOrder?.id || ''}&error=${encodeURIComponent(errorMsg)}`);

    setLoading(false);
    setStep("form");
  };

  const handlePaymentDismiss = async (wooOrder: WooCommerceOrder | null): Promise<void> => {
    if (wooOrder?.id) {
      try {
        await updateWooCommerceOrderStatus(wooOrder.id, 'cancelled');
      } catch {
        // Silently handle error
      }
    }

    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment process",
      variant: "destructive",
    });

    setLoading(false);
    setStep("form");
  };

  // ✅ UPDATED CHECKOUT HANDLER
  async function handleCheckout(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    let wooOrder: WooCommerceOrder | null = null;

    try {
      if (!razorpayLoaded || typeof window === 'undefined' || !window.Razorpay) {
        toast({
          title: "Payment System Loading",
          description: "Please wait for payment system to load",
          variant: "destructive",
        });
        return;
      }

      if (!validateForm()) {
        toast({
          title: "Please fix the errors",
          description: "Check all required fields",
          variant: "destructive",
        });
        return;
      }

      // ✅ CREATE ACCOUNT (OPTIONAL)
      if (!user && showPasswordField && form.password && form.password.length >= 6) {
        try {
          await register(form.email, form.password, form.name);
          toast({
            title: "✅ Account Created!",
            description: "Your account has been created successfully",
          });
        } catch (err: unknown) {
          console.log("Account creation skipped:", err);
          // Account creation is optional - continue checkout
        }
      }

      setLoading(true);
      setStep("processing");

      const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;

      const orderData = {
        payment_method: 'razorpay',
        payment_method_title: 'Razorpay (Credit Card/Debit Card/NetBanking/UPI)',
        status: 'pending',
        billing: {
          first_name: form.name,
          last_name: '',
          address_1: form.address,
          address_2: '',
          city: form.city,
          state: form.state,
          postcode: form.pincode,
          country: 'IN',
          email: form.email,
          phone: form.phone,
        },
        shipping: {
          first_name: form.name,
          last_name: '',
          address_1: form.address,
          address_2: '',
          city: form.city,
          state: form.state,
          postcode: form.pincode,
          country: 'IN',
        },
        line_items: items.map((item) => ({
          product_id: parseInt(String(item.id), 10),
          quantity: item.quantity,
        })),
        shipping_lines: deliveryCharges > 0 ? [{
          method_id: 'flat_rate',
          method_title: 'Standard Delivery',
          total: deliveryCharges.toString(),
        }] : [],
        coupon_lines: appliedCoupon ? [{
          code: appliedCoupon.toLowerCase(),
          discount: couponDiscount.toString(),
        }] : [],
        customer_note: form.notes + (form.notes ? '\n\n' : '') + 
          `WhatsApp: ${form.whatsapp}\n` +
          `Full Address: ${fullAddress}` +
          (appliedCoupon ? `\nCoupon Applied: ${appliedCoupon} (₹${couponDiscount} discount)` : ''),
        meta_data: [
          { key: 'whatsapp_number', value: form.whatsapp },
          { key: 'full_address', value: fullAddress },
          { key: 'original_subtotal', value: total.toString() },
          { key: 'delivery_charges', value: deliveryCharges.toString() },
          { key: 'final_total', value: finalTotal.toString() },
          { key: 'payment_capture', value: '1' },
          ...(appliedCoupon ? [
            { key: 'coupon_code', value: appliedCoupon },
            { key: 'coupon_discount', value: couponDiscount.toString() }
          ] : []),
        ],
      };

      wooOrder = await createWooCommerceOrder(orderData);

      const razorpayOptions: RazorpayOptions = {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: Math.round(finalTotal * 100),
        currency: "INR",
        name: RAZORPAY_CONFIG.COMPANY_NAME,
        description: `Order #${wooOrder.id}`,
        handler: (response: RazorpayHandlerResponse) => {
          handlePaymentSuccess(wooOrder!, response);
        },
        modal: {
          ondismiss: () => {
            handlePaymentDismiss(wooOrder);
          },
        },
        prefill: { 
          name: form.name, 
          email: form.email, 
          contact: form.phone 
        },
        theme: { 
          color: RAZORPAY_CONFIG.THEME_COLOR 
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on('payment.failed', (response: RazorpayFailureResponse) => {
        handlePaymentFailure(wooOrder, response);
      });
      rzp.open();
      setLoading(false);

    } catch (err: unknown) {
      if (wooOrder?.id) {
        try {
          await updateWooCommerceOrderStatus(wooOrder.id, 'cancelled');
        } catch {
          // Silently handle cancellation error
        }
      }

      toast({
        title: "Checkout Failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
      setLoading(false);
      setStep("form");
    }
  }

  // ✅ EMPTY CART CHECK (SAME)
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50">
        <div className="max-w-lg mx-auto text-center py-24 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some amazing products to get started!</p>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-orange-600 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          toast({
            title: "Payment System Error",
            description: "Failed to load payment system. Please refresh the page.",
            variant: "destructive",
          });
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 pb-10">
        <div className="max-w-2xl mx-auto py-10 px-4">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">Complete your purchase securely</p>
          </div>

          {/* ✅ ORDER SUMMARY (SAME) */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium text-black">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-teal-500">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-black items-center py-2">
                <span>Subtotal:</span>
                <span className="font-semibold text-teal-500">₹{total.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600 items-center py-2">
                  <div className="flex items-center gap-2">
                    <span>Coupon ({appliedCoupon}):</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                  <span className="font-semibold">-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-black items-center py-2">
                <div>
                  <span>Delivery Charges:</span>
                  {total >= 500 && <span className="text-teal-600 text-sm ml-1">(Free above ₹500)</span>}
                </div>
                <span className={`font-semibold ${deliveryCharges === 0 ? 'text-green-600' : ''}`}>
                  {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-teal-100">
                <span className="text-lg text-black font-bold">Total:</span>
                <span className="text-xl font-bold text-teal-600">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ✅ COUPON SECTION (SAME) */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Have a Coupon Code?</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g., WELCOME100)"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors text-black"
                  disabled={!!appliedCoupon}
                />
                {couponError && (
                  <p className="text-red-500 text-sm mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <span>✅</span> Coupon {appliedCoupon} applied successfully!
                  </p>
                )}
              </div>
              <button
                onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                disabled={isApplyingCoupon}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  appliedCoupon
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white'
                } ${isApplyingCoupon ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isApplyingCoupon ? 'Applying...' : appliedCoupon ? 'Remove' : 'Apply Coupon'}
              </button>
            </div>
          </div>

          {/* ✅ FORM WITH AUTH */}
          <form onSubmit={handleCheckout} className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Information</h2>

            {/* ✅ LOGIN STATUS BANNER */}
            <div className={`p-4 rounded-xl mb-6 transition-all ${
              user 
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-teal-50 border-2 border-teal-200'
            }`}>
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Welcome back, {user.name}!</p>
                      <p className="text-sm text-green-700">Your orders will be automatically linked</p>
                    </div>
                  </div>
                  <Link 
                    href="/my-account" 
                    className="text-green-600 hover:text-green-700 font-semibold text-sm"
                  >
                    View Orders →
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-teal-800">Create Account (Optional)</p>
                    <p className="text-sm text-teal-700">Save details & track/cancel orders later</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordField(!showPasswordField)}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white text-sm font-semibold rounded-lg transition-all"
                  >
                    {showPasswordField ? 'Skip' : 'Create Account'}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  name="name"
                  required
                  className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={onChange}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={onChange}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* ✅ PASSWORD FIELD */}
              {showPasswordField && !user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Create Password</label>
                  <input
                    name="password"
                    type="password"
                    className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-teal-500'
                    }`}
                    placeholder="At least 6 characters (optional)"
                    value={form.password || ''}
                    onChange={onChange}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1">Track orders & save details for future</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  name="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  required
                  className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                    errors.phone 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={onChange}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number * 
                  <button
                    type="button"
                    onClick={copyPhoneToWhatsApp}
                    className="ml-2 text-xs bg-gradient-to-r from-teal-500 to-orange-500 text-white px-2 py-1 rounded hover:from-teal-600 hover:to-orange-600 transition-all"
                  >
                    Same as phone
                  </button>
                </label>
                <input
                  name="whatsapp"
                  type="tel"
                  pattern="[0-9]{10}"
                  required
                  className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                    errors.whatsapp 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                  placeholder="WhatsApp number for updates"
                  value={form.whatsapp}
                  onChange={onChange}
                />
                {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
              <textarea
                name="address"
                rows={3}
                required
                className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                  errors.address 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-teal-500'
                }`}
                placeholder="House/Flat No., Street, Area, Landmark"
                value={form.address}
                onChange={onChange}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  name="pincode"
                  type="text"
                  pattern="[0-9]{6}"
                  required
                  className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                    errors.pincode 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                  placeholder="6-digit pincode"
                  value={form.pincode}
                  onChange={onChange}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  name="city"
                  required
                  className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                    errors.city 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                  placeholder="Your city"
                  value={form.city}
                  onChange={onChange}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <select
                  name="state"
                  required
                  className={`w-full p-3 rounded-lg border-2 text-black transition-colors focus:outline-none ${
                    errors.state 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-teal-500'
                  }`}
                  value={form.state}
                  onChange={onChange}
                >
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Assam">Assam</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Goa">Goa</option>
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
              <textarea
                name="notes"
                rows={2}
                className="w-full p-3 rounded-lg border-2 text-black border-gray-200 focus:border-teal-500 focus:outline-none transition-colors"
                placeholder="Any special instructions for delivery"
                value={form.notes}
                onChange={onChange}
              />
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-gray-800">Final Amount:</span>
                <div className="text-right">
                  <span className="text-2xl bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                  {appliedCoupon && (
                    <p className="text-sm text-green-600 mt-1">You saved ₹{couponDiscount} with {appliedCoupon}!</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                loading || step === "processing" || !razorpayLoaded 
                  ? "opacity-60 pointer-events-none scale-100" 
                  : ""
              }`}
              disabled={loading || step === "processing" || !razorpayLoaded}
            >
              {loading || step === "processing" ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Order & Processing Payment...
                </div>
              ) : !razorpayLoaded ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading Payment System...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">💳</span>
                  Pay Securely ₹{finalTotal.toFixed(2)}
                </div>
              )}
            </button>

            {step === "processing" && (
              <div className="text-center text-blue-600 text-sm mt-3 animate-pulse">
                🔄 Creating order and processing payment...
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
              <div className="flex items-center">
                <span className="mr-1">🔒</span>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">📱</span>
                <span>WhatsApp Updates</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">⚡</span>
                <span>Fast Delivery</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
