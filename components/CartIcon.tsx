'use client';

import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../lib/cart";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CartIcon() {
  // ✅ FIX: Using the correct methods from your type definition
  const { items, increment, decrement, removeFromCart } = useCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Calculate totals
  const count = items.reduce((c, i) => c + i.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  // Animation effect on add
  useEffect(() => {
    if (count > prevCount) {
      setIsAnimating(true);
      setIsOpen(true); // Auto-open drawer when adding item
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* 1. The Trigger Icon */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="relative group p-2 hover:bg-gray-50 rounded-full transition-colors"
      >
        <ShoppingBag 
          className={`w-6 h-6 text-gray-900 group-hover:text-black transition-transform ${
            isAnimating ? 'scale-110' : 'group-hover:scale-105'
          }`} 
          strokeWidth={2}
        />
        {count > 0 && (
          <span className={`absolute top-1 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-black text-white text-[10px] font-bold rounded-full border-2 border-white transition-all duration-300 ${
            isAnimating ? 'scale-125 bg-orange-500' : ''
          }`}>
            {count}
          </span>
        )}
      </button>

      {/* 2. The Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 3. The Sliding Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
           <h2 className="text-lg font-bold flex items-center gap-2">
             Your Cart <span className="text-gray-400 text-sm font-normal">({count} items)</span>
           </h2>
           <button 
             onClick={() => setIsOpen(false)}
             className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Scrollable Items Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
           {items.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                   <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                   <p className="text-gray-900 font-medium">Your cart is empty</p>
                   <p className="text-gray-500 text-sm">Looks like you have not added anything yet.</p>
                </div>
                <button 
                   onClick={() => setIsOpen(false)}
                   className="mt-4 px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                   Start Shopping
                </button>
             </div>
           ) : (
             items.map((item) => {
               // Handle image source safely
               const mainImage = item.images && item.images.length > 0 
                  ? (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].src)
                  : '/placeholder.png';

               return (
                 <div key={item.id} className="flex gap-4 group">
                    {/* Image */}
                    <div className="relative w-20 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                       <Image
                          src={mainImage}
                          alt={item.name}
                          fill
                          className="object-cover mix-blend-multiply"
                       />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                       <div>
                          <div className="flex justify-between items-start">
                             <h3 className="text-sm font-medium text-gray-900 line-clamp-2 pr-4">
                                {item.name}
                             </h3>
                             <button 
                                // ✅ FIX: Using removeFromCart
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                             ₹{Number(item.price).toLocaleString()}
                          </p>
                       </div>

                       {/* Quantity Control */}
                       <div className="flex items-center gap-3 bg-gray-50 w-fit px-2 py-1 rounded-md border border-gray-100">
                          <button 
                             // ✅ FIX: Using decrement
                             onClick={() => decrement(item.id)}
                             className="p-1 hover:text-black text-gray-500 transition-colors disabled:opacity-50"
                             disabled={item.quantity <= 1}
                          >
                             <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                          <button 
                             // ✅ FIX: Using increment
                             onClick={() => increment(item.id)}
                             className="p-1 hover:text-black text-gray-500 transition-colors"
                          >
                             <Plus className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                 </div>
               );
             })
           )}
        </div>

        {/* Footer (Subtotal & Checkout) */}
        {items.length > 0 && (
           <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-gray-500">Subtotal</span>
                 <span className="text-lg font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-400 mb-4 text-center">
                 Tax included. Shipping calculated at checkout.
              </p>
              <Link
                 href="/checkout"
                 className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                 onClick={() => setIsOpen(false)}
              >
                 Checkout Securely <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                 href="/cart"
                 className="block text-center text-xs font-medium text-gray-500 hover:text-black mt-3 underline decoration-gray-300 underline-offset-4"
                 onClick={() => setIsOpen(false)}
              >
                 View Cart Details
              </Link>
           </div>
        )}

      </div>
    </>
  );
}
