'use client'
import Link from "next/link";
import Header from "../../../components/Header";
import { useCart } from "../../../lib/cart";


export default function Cart() {
  const { items, increment, decrement, removeFromCart } = useCart();
  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-blue-950 mb-8">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-center text-blue-700">Your cart is empty.</div>
        ) : (
          <div className="bg-blue-50 rounded-lg shadow-lg p-6">
            <ul>
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center py-3 border-b last:border-none border-blue-100 gap-4"
                >
                  <img
                    src={item.images?.[0]?.src}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-contain bg-white"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-blue-800">{item.name}</div>
                    <div className="text-gray-500 text-sm">₹{item.price} × {item.quantity}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-2" onClick={() => decrement(item.id)}>-</button>
                    <span className="px-2 font-medium">{item.quantity}</span>
                    <button className="px-2" onClick={() => increment(item.id)}>+</button>
                  </div>
                  <button
                    className="ml-4 text-red-500 hover:underline"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mt-6">
              <span className="font-bold text-blue-800 text-lg">Subtotal:</span>
              <span className="font-bold text-blue-700 text-xl">₹{total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-8 block bg-blue-700 hover:bg-blue-900 text-white text-center font-bold py-3 rounded-lg transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
