"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../lib/cart";
import { createOrder, updateOrderStatus } from "../../../lib/woocommerceApi";
import { toast } from "../../../hooks/use-toast";

const RAZORPAY_KEY_ID = "rzp_live_BuTLIdi7g6nzab";

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
  meta_data?: Array<{ key: string; value: [] }>;
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
  const finalTotal = total + deliveryCharges;

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
    
    // Clear error when user starts typing
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
        notes: `${form.notes ? form.notes + '\n\n' : ''}WhatsApp: ${form.whatsapp}\nDelivery Charges: ₹${deliveryCharges}`,
      })) as WooOrder;
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Order Creation Failed",
        description: error.message || "Could not place order. Please try again.",
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
                ],
              }),
            }
          );

          clear();
          toast({
            title: "🎉 Order placed successfully!",
            description: "Thank you for shopping with us. You'll receive updates on WhatsApp.",
          });
          router.push(`/order-confirmation?orderId=${response.razorpay_payment_id}&wcOrderId=${wooOrder.id}`);
        } catch {
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
        color: "#14b8a6", // teal-500
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  }

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

        {/* Checkout Form */}
        <form onSubmit={handleCheckout} className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Information</h2>
          
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
              <span className="text-2xl bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent">
                ₹{finalTotal.toFixed(2)}
              </span>
            </div>
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
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span className="mr-2">🔒</span>
                Pay Securely with Razorpay
              </div>
            )}
          </button>

          {step === "processing" && (
            <div className="text-center text-teal-600 text-sm mt-3 animate-pulse">
              Creating your order and launching secure payment gateway...
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
  );
}