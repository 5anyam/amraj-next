'use client';
import Link from "next/link";
import Header from "../../../components/Header";
import { useCart } from "../../../lib/cart";
import { Trash2, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const { items, increment, decrement, removeFromCart } = useCart();
  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center text-gray-600 mt-12">Your cart is empty 😔</div>
        ) : (
          <div className="mt-6 rounded-lg bg-white p-4 sm:p-6 shadow-lg">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images?.[0]?.src}
                      alt={item.name}
                      className="w-20 h-20 rounded object-contain bg-gray-100"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">{item.name}</span>
                      <span className="text-gray-600 text-sm">₹{item.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 flex-1">
                    <div className="flex items-center rounded-full border border-gray-300">
                      <button
                        onClick={() => decrement(item.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => increment(item.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <span className="font-bold text-gray-800">
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Subtotal: <span className="text-blue-600">₹{total.toFixed(2)}</span></span>
              <Link
                href="/checkout"
                className="mt-4 sm:mt-0 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-3 px-6 rounded-lg transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
