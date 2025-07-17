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

{/* Payment Methods Section */}
<div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
  <h3 className="text-gray-700 font-semibold mb-3 text-center">Pay with</h3>
  <div className="flex items-center justify-center space-x-6">
    {/* UPI */}
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333334 199007" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"><path d="M44732 130924h1856l-1738 7215c-265 1061-206 1885 147 2415 354 530 1001 795 1973 795 942 0 1737-265 2356-795 618-531 1031-1355 1296-2415l1737-7215h1885l-1767 7392c-383 1590-1060 2798-2061 3593-972 795-2268 1208-3858 1208s-2680-383-3269-1179c-589-795-707-2002-324-3592l1767-7421zm223507 11868l2826-11868h6449l-383 1649h-4564l-706 2974h4564l-413 1679h-4564l-913 3827h4565l-412 1738h-6449zm-177-8982c-413-470-913-824-1443-1031-531-235-1119-353-1797-353-1266 0-2385 412-3386 1237s-1649 1915-1973 3239c-295 1267-177 2327 413 3181 559 824 1442 1237 2620 1237 677 0 1355-118 2031-383 678-235 1356-619 2062-1119l-530 2179c-589 382-1207 648-1856 825-648 176-1296 265-2002 265-883 0-1679-148-2356-443-678-294-1236-736-1679-1324-441-560-706-1237-824-2002-117-766-88-1590 148-2474 206-883 559-1680 1031-2445 471-766 1089-1443 1796-2002 706-589 1472-1030 2297-1325 824-294 1648-441 2503-441 677 0 1295 88 1885 294 559 207 1089 500 1560 913l-500 1972zm-18317 4300h3209l-530-2710c-29-176-59-383-59-589-30-235-30-471-30-736-118 265-235 500-383 736-118 235-235 442-353 619l-1855 2680zm4093 4682l-589-3062h-4594l-2062 3062h-1972l8539-12338 2650 12338h-1972zm-15548 0l2827-11868h6449l-383 1649h-4565l-706 2945h4563l-412 1679h-4564l-1325 5565h-1885v30zm-5566-6832h353c1001 0 1679-118 2062-354 382-236 648-648 795-1267 146-648 88-1119-207-1384-293-265-913-413-1855-413h-354l-795 3417zm-471 1502l-1267 5300h-1767l2828-11867h2621c766 0 1354 59 1737 148 411 89 736 265 971 500 295 295 471 648 559 1119 89 443 59 943-59 1502-235 943-619 1709-1207 2238-589 530-1326 854-2209 972l2680 5387h-2121l-2562-5300h-206zm-11632 5330l2828-11868h6478l-382 1649h-4565l-706 2974h4564l-411 1679h-4565l-912 3827h4564l-413 1738h-6479zm-2031-10248l-2444 10218h-1884l2444-10218h-3063l383-1649h8010l-382 1649h-3063zm-19170 10248l2945-12338 5595 7244c148 206 294 413 441 648s295 501 471 794l1974-8216h1737l-2945 12310-5713-7392c-147-206-295-412-441-619-147-235-265-442-354-707l-1972 8245h-1737v30zm-4594 0l2827-11868h1884l-2827 11868h-1884zm-13870-2385l1678-707c29 530 176 942 501 1207 324 265 765 413 1354 413 559 0 1031-148 1443-471 412-324 678-736 795-1266 177-707-235-1326-1236-1855-147-89-235-148-325-177-1119-648-1825-1207-2120-1737-294-530-354-1149-176-1884 235-972 736-1738 1530-2356 796-589 1679-913 2740-913 854 0 1530 177 2031 500 501 325 766 825 854 1444l-1648 766c-148-383-325-648-560-825-235-176-530-265-884-265-501 0-942 147-1295 412-354 265-589 619-707 1090-176 707 325 1383 1472 2002 89 59 147 89 207 117 1001 530 1678 1061 1972 1591 295 529 354 1148 178 1943-266 1119-825 2002-1680 2680-853 647-1855 1002-3033 1002-971 0-1737-237-2267-708-589-471-854-1149-824-2002zm-1973-7863l-2444 10218h-1884l2444-10218h-3062l381-1649h8010l-383 1649h-3062zm-19170 10248l2944-12338 5596 7244c147 206 295 413 442 648 146 235 294 501 471 794l1973-8216h1737l-2944 12310-5713-7392c-148-206-294-412-442-619-147-235-265-442-353-707l-1973 8245h-1737v30zm-8599 0l2827-11868h6449l-383 1649h-4564l-707 2974h4564l-412 1679h-4564l-913 3827h4565l-413 1738h-6449zm-3121-5860c0-88 29-354 88-766 30-353 59-618 89-854-118 266-236 530-383 824-147 266-324 560-530 825l-4535 6331-1472-6448c-59-265-118-530-148-766-29-235-59-500-59-736-59 236-147 500-235 794-89 266-206 560-354 855l-2650 5831h-1737l5683-12368 1620 7479c29 118 59 324 89 589 29 266 88 619 147 1031 206-353 471-765 825-1296 88-146 176-235 206-324l5124-7479-177 12368h-1737l148-5890zm-17933 5860l1296-5418-2356-6420h1972l1472 4035c30 117 59 235 118 411 59 178 89 354 147 530 118-176 236-353 354-530 118-176 236-324 353-471l3446-3975h1884l-5506 6390-1296 5417h-1885v30zm-8746-4682h3209l-530-2710c-30-176-59-383-59-589-30-235-30-471-30-736-118 265-236 500-383 736-118 235-235 442-354 619l-1855 2680zm4063 4682l-589-3062h-4594l-2061 3062h-1973l8540-12338 2650 12338h-1973zm-11808-6920h471c1031 0 1767-118 2179-354 412-235 677-647 825-1237 146-618 58-1089-236-1324-324-265-972-383-1943-383h-471l-825 3299zm-501 1590l-1266 5330h-1767l2827-11868h2856c854 0 1443 59 1826 147s678 236 913 471c294 265 500 648 589 1119 88 472 59 972-59 1531-147 560-353 1090-677 1561s-707 854-1119 1119c-353 206-736 382-1148 471-412 88-1060 148-1885 148h-1089v-30zm-17580 3563h1590c854 0 1531-59 2003-176 471-117 883-324 1266-589 530-383 972-854 1325-1443 354-560 619-1237 795-2002 176-766 235-1414 147-1972-88-561-294-1061-648-1444-265-294-589-471-1030-589-442-118-1119-176-2091-176h-1354l-2003 8392zm-2297 1767l2828-11868h2532c1649 0 2798 88 3415 265 619 177 1148 442 1561 854 530 530 884 1208 1031 2002 147 825 88 1767-147 2798-266 1060-648 1972-1178 2796-530 825-1207 1473-2002 2003-589 413-1237 678-1944 854-677 177-1708 265-3063 265h-3033v30zm-8628 0l2827-11868h6449l-383 1649h-4565l-707 2974h4565l-412 1679h-4565l-913 3827h4565l-412 1738h-6449zm-4565 0l2827-11868h1884l-2827 11868h-1885zm-8540 0l2827-11868h6449l-383 1649h-4564l-707 2945h4564l-412 1679h-4565l-1325 5565h-1885v30zm-4565 0l2827-11868h1884l-2827 11868h-1885zm-13015 0l2944-12338 5595 7244c147 206 294 413 442 648 147 235 294 501 471 794l1973-8216h1737l-2944 12310-5713-7392c-147-206-294-412-442-619-147-235-265-442-353-707l-1973 8245h-1737v30z" fill="#3a3734"/><path d="M233961 120588h-12927l17963-64873h12927l-17963 64873zm-107424-4064c-707 2562-3063 4358-5713 4358H54185c-1826 0-3180-619-4064-1855-883-1238-1089-2769-559-4594l16255-58541h12928l-14518 52298h51710l14517-52298h12928l-16844 60632zm100710-58777c-883-1237-2268-1855-4152-1855h-71027l-3504 12721h64608l-3769 13576h-51680v-30h-12927l-10719 38724h12927l7185-25973h58100c1826 0 3534-619 5124-1855 1590-1237 2651-2768 3151-4594l7185-25972c559-1943 383-3504-501-4741z" fill="#716d6a"/><path fill="#0e8635" d="M274245 55833l16344 32510-34365 32510 4087-14747 18794-17763-8941-17785z"/><path fill="#e97208" d="M262762 55833l16343 32510-34395 32510z"/><path d="M31367 0h270601c8631 0 16474 3528 22156 9210 5683 5683 9211 13526 9211 22156v136275c0 8629-3529 16472-9211 22155-5683 5682-13526 9211-22155 9211H31368c-8629 0-16473-3528-22156-9211C3530 184114 2 176272 2 167641V31366c0-8631 3528-16474 9210-22156S22738 0 31369 0zm270601 10811H31367c-5647 0-10785 2315-14513 6043s-6043 8866-6043 14513v136275c0 5646 2315 10784 6043 14512 3729 3729 8867 6044 14513 6044h270601c5645 0 10783-2315 14512-6044 3728-3729 6044-8867 6044-14511V31368c0-5645-2315-10784-6043-14513-3728-3728-8867-6043-14513-6043z" fill="gray" fill-rule="nonzero"/></svg>
      </div>
      <span className="text-sm text-gray-600 font-medium">UPI</span>
    </div>

    {/* Credit Cards */}
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center mb-2">
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
      </div>
      <span className="text-sm text-gray-600 font-medium">Cards</span>
    </div>
  </div>
  
  {/* Payment Icons */}
  <div className="flex items-center justify-center mt-4 space-x-3 opacity-60">
    <span className="text-xs text-gray-500">Powered by:</span>
    <div className="flex space-x-2">
      <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">Razorpay</div>
      <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">Paytm</div>
      <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">PhonePe</div>
    </div>
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
      Pay Now
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