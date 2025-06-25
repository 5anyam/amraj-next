
import { ShoppingCart } from "lucide-react";
import { useCart } from "../lib/cart";
import Link from "next/link";

export default function CartIcon() {
  const { items } = useCart();
  const count = items.reduce((c, i) => c + i.quantity, 0);

  return (
    <Link href="/cart" className="relative group">
      <ShoppingCart className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-semibold rounded-full px-1.5 py-px shadow-lg border border-white">
          {count}
        </span>
      )}
    </Link>
  );
}
