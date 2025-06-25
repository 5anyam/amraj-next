"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import { useCart } from "../../../lib/cart";
import { createOrder, updateOrderStatus } from "../../../lib/woocommerceApi";
import { toast } from "../../../hooks/use-toast";

const RAZORPAY_KEY_ID = "rzp_live_BuTLIdi7g6nzab";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
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

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<"form" | "processing">("form");
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

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCheckout(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStep("processing");

    let wooOrder: WooOrder;

    try {
      wooOrder = await createOrder({
        lineItems: items.map((i) => ({ product_id: i.id, quantity: i.quantity, name: i.name, price: i.price })),
        shipping_address: {
          name: form.name,
          address_1: form.address,
          email: form.email,
          phone: form.phone,
        },
        customer: {
          name: form.name,
          email: form.email,
        },
        status: "pending",
        notes: form.notes,
      });
    } catch (err) {
      const error = err as Error;
      toast({ title: "Order Error", description: error.message || "Could not place order in WooCommerce", variant: "destructive" });
      setLoading(false);
      setStep("form");
      return;
    }

    if (!window.Razorpay) {
      toast({ title: "Razorpay SDK Error", description: "Razorpay SDK not loaded.", variant: "destructive" });
      setLoading(false);
      setStep("form");
      return;
    }

    const options: RazorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(total * 100),
      currency: "INR",
      name: "PlixBlue",
      description: `Order Payment (Order #${wooOrder.id})`,
      handler: async (response) => {
        try {
          await updateOrderStatus(wooOrder.id, "completed");

          await fetch(`${process.env.NEXT_PUBLIC_WC_API_URL}/orders/${wooOrder.id}?consumer_key=${process.env.NEXT_PUBLIC_WC_CONSUMER_KEY}&consumer_secret=${process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meta_data: [
                ...(wooOrder.meta_data || []),
                { key: "razorpay_payment_id", value: response.razorpay_payment_id },
              ],
            }),
          });
          
          clear();
          toast({ title: "Order placed!", description: "Thank you for shopping with us." });
          router.push(`/order-confirmation?orderId=${response.razorpay_payment_id}&wcOrderId=${wooOrder.id}`);
        } catch (error) {
          toast({ title: "Order Update Error", description: (error as Error).message || "Could not update order status.", variant: "destructive" });
        } finally {
          setLoading(false);
          setStep("form");
        }
      },
      modal: {
        ondismiss: async () => {
          if (wooOrder?.id) {
            await updateOrderStatus(wooOrder.id, "cancelled").catch(() => {});
            toast({ title: "Payment cancelled", description: "Order was cancelled. You can try again.", variant: "destructive" });
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
        color: "#2563eb",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-lg mx-auto text-center py-24">
          <p className="text-xl">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <Header />
      <div className="max-w-lg mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Checkout</h1>
        <form onSubmit={handleCheckout} className="bg-blue-50 shadow-lg p-8 rounded-2xl space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <input
              name="name"
              required
              className="w-full p-3 rounded border border-blue-200 focus:border-blue-500"
              placeholder="Your Name"
              value={form.name}
              onChange={onChange}
            />
            <input
              name="email"
              type="email"
              required
              className="w-full p-3 rounded border border-blue-200 focus:border-blue-500"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
            />
            <input
              name="phone"
              type="tel"
              pattern="[0-9]{10}"
              required
              className="w-full p-3 rounded border border-blue-200 focus:border-blue-500"
              placeholder="Phone Number"
              value={form.phone}
              onChange={onChange}
            />
            <input
              name="address"
              required
              className="w-full p-3 rounded border border-blue-200 focus:border-blue-500"
              placeholder="Shipping Address"
              value={form.address}
              onChange={onChange}
            />
            <textarea
              name="notes"
              rows={2}
              className="w-full p-3 rounded border border-blue-200 focus:border-blue-500"
              placeholder="Order Notes (optional)"
              value={form.notes}
              onChange={onChange}
            />
          </div>

          <div className="flex items-center justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-700 hover:bg-blue-900 text-white py-3 rounded-lg font-semibold text-lg ${loading || step === "processing" ? "opacity-60 pointer-events-none" : ""}`}
            disabled={loading || step === "processing"}
          >
            {loading || step === "processing" ? "Processing…" : "Pay with Razorpay"}
          </button>

          {step === "processing" && (
            <div className="text-center text-blue-700 text-sm mt-2">Creating order and launching payment gateway…</div>
          )}
        </form>
        <div className="mt-6 text-center text-gray-500 text-xs">Your personal details are safe & secured.</div>
      </div>
    </div>
  );
}
