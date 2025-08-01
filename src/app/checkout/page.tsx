"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../lib/cart";
import { createOrder, updateOrderStatus } from "../../../lib/woocommerceApi";
import { toast } from "../../../hooks/use-toast";

const RAZORPAY_KEY_ID = "rzp_live_tGuZwArSWs7HdE";

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
}

interface WooOrder {
  id: number;
  meta_data?: Array<{ key: string; value: unknown }>; // ✅ unknown type
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void | Promise<void>;
  };
  prefill?: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

export default function Checkout() {
  const { items, clear } = useCart();
  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const deliveryCharges = total >= 500 ? 0 : 50;
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Final total calculation with coupon
  const subtotalAfterCoupon = total - couponDiscount;
  const finalTotal = subtotalAfterCoupon + deliveryCharges;

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    notes: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<"form" | "processing">("form");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{ orderId: string; wcOrderId: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Coupon validation function
  const validateCoupon = (code: string): { valid: boolean; discount: number; message: string } => {
    const upperCode = code.toUpperCase().trim();
    
    if (upperCode === "WELCOME100") {
      if (total >= 200) { // Minimum order amount for coupon
        return { valid: true, discount: 100, message: "Coupon applied successfully!" };
      } else {
        return { valid: false, discount: 0, message: "Minimum order amount ₹200 required for this coupon" };
      }
    }
    
    return { valid: false, discount: 0, message: "Invalid coupon code" };
  };

  // Apply coupon function
  const handleApplyCoupon = () => {
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

    // Simulate API call delay
    setTimeout(() => {
      const validation = validateCoupon(couponCode);
      
      if (validation.valid) {
        setAppliedCoupon(couponCode.toUpperCase());
        setCouponDiscount(validation.discount);
        setCouponError("");
        toast({
          title: "🎉 Coupon Applied!",
          description: `You saved ₹${validation.discount} with ${couponCode.toUpperCase()}`,
        });
      } else {
        setCouponError(validation.message);
        setAppliedCoupon("");
        setCouponDiscount(0);
      }
      
      setIsApplyingCoupon(false);
    }, 800);
  };

  // Remove coupon function
  const handleRemoveCoupon = () => {
    setAppliedCoupon("");
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
    toast({
      title: "Coupon Removed",
      description: "Coupon discount has been removed from your order",
    });
  };

  function trackPurchaseEvent(orderId: string | number, value: number) {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", {
        order_id: orderId.toString(),
        value,
        currency: "INR",
      });
    }
  }

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
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!/^[0-9]{6}$/.test(form.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function copyPhoneToWhatsApp() {
    if (form.phone) {
      setForm(f => ({ ...f, whatsapp: form.phone }));
      if (errors.whatsapp) {
        setErrors(prev => ({ ...prev, whatsapp: undefined }));
      }
    }
  }

  function generateOrderId(): string {
    return 'COD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  async function handleCODOrder(): Promise<void> {
    try {
      const wooOrder = (await createOrder({
        lineItems: items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
          name: i.name,
          price: i.price,
        })),
        shipping_address: {
          name: form.name,
          address_1: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
          email: form.email,
          phone: form.phone,
        },
        customer: {
          name: form.name,
          email: form.email,
        },
        status: "processing",
        notes: `${form.notes ? form.notes + '\n\n' : ''}WhatsApp: ${form.whatsapp}\nDelivery Charges: ₹${deliveryCharges}\nPayment Method: Cash on Delivery${appliedCoupon ? `\nCoupon Applied: ${appliedCoupon} (₹${couponDiscount} discount)` : ''}`,
      })) as WooOrder;

      const codOrderId = generateOrderId();
      
      await fetch(
        `${process.env.NEXT_PUBLIC_WC_API_URL}/orders/${wooOrder.id}?consumer_key=${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meta_data: [
              ...(wooOrder.meta_data || []),
              {
                key: "payment_method",
                value: "cod",
              },
              {
                key: "cod_order_id",
                value: codOrderId,
              },
              ...(appliedCoupon ? [{
                key: "coupon_code",
                value: appliedCoupon,
              }, {
                key: "coupon_discount",
                value: couponDiscount,
              }] : [])
            ],
          }),
        }
      );

      trackPurchaseEvent(codOrderId, finalTotal);
      setOrderDetails({ orderId: codOrderId, wcOrderId: wooOrder.id });
      setShowOrderConfirmation(true);
      setLoading(false);
      setStep("form");
      
      toast({
        title: "🎉 Order placed successfully!",
        description: "Your COD order has been confirmed. You'll receive updates on WhatsApp.",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not place order. Please try again.";
      toast({
        title: "Order Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  }

  async function handleCheckout(event: FormEvent) {
    event.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check all required fields and correct formats",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setStep("processing");

    if (paymentMethod === "cod") {
      try {
        await handleCODOrder();
      } catch (error) {
        console.error("COD order failed:", error);
        setLoading(false);
        setStep("form");
      }
      return;
    }

    let wooOrder: WooOrder;

    try {
      wooOrder = (await createOrder({
        lineItems: items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
          name: i.name,
          price: i.price,
        })),
        shipping_address: {
          name: form.name,
          address_1: `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`,
          email: form.email,
          phone: form.phone,
        },
        customer: {
          name: form.name,
          email: form.email,
        },
        status: "pending",
        notes: `${form.notes ? form.notes + '\n\n' : ''}WhatsApp: ${form.whatsapp}\nDelivery Charges: ₹${deliveryCharges}\nPayment Method: Online Payment${appliedCoupon ? `\nCoupon Applied: ${appliedCoupon} (₹${couponDiscount} discount)` : ''}`,
      })) as WooOrder;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Could not place order. Please try again.";
      toast({
        title: "Order Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setLoading(false);
      setStep("form");
      return;
    }

    if (!window.Razorpay) {
      toast({
        title: "Payment Gateway Error",
        description: "Payment system not loaded. Please refresh and try again.",
        variant: "destructive",
      });
      setLoading(false);
      setStep("form");
      return;
    }

    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(finalTotal * 100),
      currency: "INR",
      name: "Amraj Wellness LLP",
      description: `Order Payment (Order #${wooOrder.id})`,
      handler: async (response) => {
        try {
          await updateOrderStatus(wooOrder.id, "completed");

          await fetch(
            `${process.env.NEXT_PUBLIC_WC_API_URL}/orders/${wooOrder.id}?consumer_key=${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                meta_data: [
                  ...(wooOrder.meta_data || []),
                  {
                    key: "razorpay_payment_id",
                    value: response.razorpay_payment_id,
                  },
                  ...(appliedCoupon ? [{
                    key: "coupon_code",
                    value: appliedCoupon,
                  }, {
                    key: "coupon_discount",
                    value: couponDiscount,
                  }] : [])
                ],
              }),
            }
          );

          clear();
          trackPurchaseEvent(wooOrder.id, finalTotal);
          toast({
            title: "🎉 Order placed successfully!",
            description: "Thank you for shopping with us. You'll receive updates on WhatsApp.",
          });
          router.push(`/order-confirmation?orderId=${response.razorpay_payment_id}&wcOrderId=${wooOrder.id}`);
        } catch (error) {
          console.error("Payment update failed:", error);
          toast({
            title: "Payment Successful but Order Update Failed",
            description: "Your payment was processed. We'll contact you shortly.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
          setStep("form");
        }
      },
      modal: {
        ondismiss: async () => {
          if (wooOrder?.id) {
            await updateOrderStatus(wooOrder.id, "cancelled").catch(() => {});
            toast({
              title: "Payment Cancelled",
              description: "Order was cancelled. You can try again anytime.",
              variant: "destructive",
            });
            setLoading(false);
            setStep("form");
          }
        },
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: {
        color: "#14b8a6",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  }

  function OrderConfirmationModal() {
    if (!showOrderConfirmation || !orderDetails) return null;

    const handleContinueShopping = () => {
      clear();
      setShowOrderConfirmation(false);
      router.push("/");
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h2>
          <div className="bg-gradient-to-r from-teal-50 to-orange-50 rounded-xl p-4 mb-6">
            <p className="text-gray-600 mb-2">Your Order ID:</p>
            <p className="text-xl font-bold text-teal-600">{orderDetails.orderId}</p>
            <p className="text-sm text-gray-500 mt-2">WooCommerce Order: #{orderDetails.wcOrderId}</p>
            {appliedCoupon && (
              <p className="text-sm text-green-600 mt-2">✅ Coupon {appliedCoupon} applied (₹{couponDiscount} saved)</p>
            )}
          </div>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You will receive updates on WhatsApp and pay when your order arrives.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleContinueShopping}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !showOrderConfirmation) {
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 pb-10">
        <div className="max-w-2xl mx-auto py-10 px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-600">Complete your order in just a few steps</p>
          </div>

          {/* Order Summary */}
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
              
              {/* Coupon Discount Display */}
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

          {/* Coupon Code Section */}
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
                {isApplyingCoupon ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Applying...
                  </div>
                ) : appliedCoupon ? (
                  'Remove'
                ) : (
                  'Apply Coupon'
                )}
              </button>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("online")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "online"
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800">Online Payment</h3>
                <p className="text-sm text-gray-600 mt-1">Pay with UPI, Cards, Net Banking</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "cod"
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">₹</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800">Cash on Delivery</h3>
                <p className="text-sm text-gray-600 mt-1">Pay when your order arrives</p>
              </button>
            </div>
          </div>

          {/* Rest of the form (unchanged) */}
          <form onSubmit={handleCheckout} className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Information</h2>
            
            {/* All your existing form fields... */}
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
                  <option value="Tripura">Tripura</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Sikkim">Sikkim</option>
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

            {/* Payment Methods Display */}
            {paymentMethod === "online" && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <h3 className="text-gray-700 font-semibold mb-3 text-center">Pay with</h3>
                <div className="flex items-center justify-center gap-10 mb-5">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={loading || step === "processing"}
                    className={`flex flex-col items-center focus:outline-none cursor-pointer w-28 py-2 rounded-lg transition-all bg-white border border-teal-200 hover:shadow-lg
                      ${loading || step === "processing" ? "opacity-60 pointer-events-none" : ""}
                    `}
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <rect width="36" height="36" rx="10" fill="#fff"/>
                        <path d="M11 24l4.4-12h2.2l-4.4 12h-2.2zm5.2 0l4.4-12h2.2l-4.4 12h-2.2zm5.4 0l4.4-12h2.2l-4.4 12h-2.2z" fill="#14b8a6"/>
                      </svg>
                    </div>
                    <span className="text-base font-bold text-teal-700 tracking-wide">UPI</span>
                    <span className="text-xs text-gray-500 mt-0.5">Google Pay, PhonePe, etc</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={loading || step === "processing"}
                    className={`flex flex-col items-center focus:outline-none cursor-pointer w-28 py-2 rounded-lg transition-all bg-white border border-orange-200 hover:shadow-lg
                      ${loading || step === "processing" ? "opacity-60 pointer-events-none" : ""}
                    `}
                  >
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                      <svg width="32" height="32" fill="none">
                        <rect x="6" y="10" width="20" height="12" rx="3" fill="#FDBA74" stroke="#F59E42" strokeWidth="1.5"/>
                        <rect x="10" y="15" width="7" height="2" rx="1" fill="#fff"/>
                        <rect x="19" y="19" width="3" height="1.3" rx="0.65" fill="#F59E42"/>
                        <rect x="10" y="19" width="3" height="1.3" rx="0.65" fill="#F59E42"/>
                      </svg>
                    </div>
                    <span className="text-base font-bold text-orange-600 tracking-wide">Cards</span>
                    <span className="text-xs text-gray-500 mt-0.5">Debit, Credit, Rupay etc.</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                    loading || step === "processing" ? "opacity-60 pointer-events-none scale-100" : ""
                  }`}
                  disabled={loading || step === "processing"}
                >
                  {loading || step === "processing" ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {"Processing Payment..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🔒</span>
                      Pay Now
                    </div>
                  )}
                </button>

                {step === "processing" && (
                  <div className="text-center text-teal-600 text-sm mt-3 animate-pulse">
                    Creating your order and launching secure payment gateway...
                  </div>
                )}

                <div className="flex items-center justify-center mt-4 space-x-2 opacity-60">
                  <span className="text-xs text-gray-500">Powered by:</span>
                  <div className="flex space-x-2">
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">Razorpay</div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">PhonePe</div>
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">Paytm</div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                  loading || step === "processing" ? "opacity-60 pointer-events-none scale-100" : ""
                }`}
                disabled={loading || step === "processing"}
              >
                {loading || step === "processing" ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {"Placing Order..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">📦</span>
                    Place Order (COD)
                  </div>
                )}
              </button>
            )}

            {step === "processing" && (
              <div className="text-center text-teal-600 text-sm mt-3 animate-pulse">
                {paymentMethod === "cod" 
                  ? "Creating your order..." 
                  : "Creating your order and launching secure payment gateway..."
                }
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
                <span className="mr-1">🚚</span>
                <span>Fast Delivery</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Your personal details are safe & secured with 256-bit encryption
            </p>
          </div>
        </div>
      </div>

      <OrderConfirmationModal />
    </>
  );
}
