import { ShoppingCart } from "lucide-react";
import { useCart } from "../lib/cart";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const { items } = useCart();
  const count = items.reduce((c, i) => c + i.quantity, 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    // Animate when count increases (item added), including from 0 to 1
    if (count > prevCount) {
      setIsAnimating(true);
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600); // Animation duration

      return () => clearTimeout(timer);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  return (
    <Link href="/cart" className="relative group">
      <ShoppingCart 
        className={`w-7 h-7 text-black group-hover:scale-110 transition-transform ${
          isAnimating 
            ? 'animate-bounce' 
            : ''
        }`}
      />
      {count > 0 && (
        <span 
          className={`absolute -top-1 -right-1 bg-teal-600 text-white text-xs font-semibold rounded-full px-1.5 py-px shadow-lg border border-white transition-all duration-300 ${
            isAnimating 
              ? 'animate-pulse scale-125' 
              : ''
          }`}
        >
          {count}
        </span>
      )}
      
      {/* Optional: Add a subtle ring animation */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full animate-ping bg-teal-600 opacity-20 scale-150"></div>
      )}
    </Link>
  );
}