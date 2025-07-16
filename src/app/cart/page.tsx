'use client';
import Link from "next/link";
import { useCart } from "../../../lib/cart";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Package } from "lucide-react";

export default function CartPage() {
  const { items, increment, decrement, removeFromCart } = useCart();
  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>

        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-teal-100 rounded-full">
            <ShoppingBag className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {items.length === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you have not added any items to your cart yet.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                            <img
                              src={item.images?.[0]?.src}
                              alt={item.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">SKU: {item.id}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Price */}
                            <div className="text-lg font-bold text-gray-900">
                            ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                              <span className="text-sm font-normal text-gray-600 ml-1">each</span>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center">
                              <div className="flex items-center bg-gray-100 rounded-full border border-gray-300">
                                <button
                                  onClick={() => decrement(item.id)}
                                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                                <span className="w-12 text-center font-semibold text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => increment(item.id)}
                                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                  <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-4 p-2 rounded-full text-orange-500 hover:text-orange-600 hover:bg-red-50 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <span className="text-lg font-bold text-teal-600">
                              ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">total</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

    <div className="space-y-4 mb-6">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
        <span>₹{total.toFixed(2)}</span> {/* Total already includes tax */}
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Shipping</span>
        <span className="text-green-600 font-medium">Free</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Included GST (18%)</span>
        <span>₹{(total - total / 1.18).toFixed(2)}</span> {/* Tax part extracted from total */}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span className="text-teal-500">₹{total.toFixed(2)}</span> {/* Final total remains same */}
        </div>
      </div>
    </div>


                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <Link
                    href="/"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-xl transition-colors text-center block"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span>Free shipping on all orders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span>No return policy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}