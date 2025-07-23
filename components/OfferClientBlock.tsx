'use client';

import { useState } from "react";
import { useCart } from "../lib/cart";
import { toast } from "../hooks/use-toast";
import OfferTab, { type SelectedOffer } from "../components/OfferTab";

interface Product {
  id: number | string;
  name: string;
  price: number | string;
  regular_price: string;
  images?: { src: string }[];
}

interface OfferClientBlockProps {
  product: Product;
}

export default function OfferClientBlock({ product }: OfferClientBlockProps) {
  const { addToCart } = useCart();
  const [offer, setOffer] = useState<SelectedOffer>({
    label: "1 Month",
    duration: "1 Month",
    qty: 1,
    discountPercent: 10,
  });
  const price = parseFloat(product.price?.toString() || "0");
  const discountedPrice = price * offer.qty * (1 - offer.discountPercent / 100);
  const originalPrice = price * offer.qty;

  return (
    <>
      <OfferTab price={price} onOfferChange={setOffer} />
      <div className="mb-4">
        <span className="text-2xl font-bold">₹{discountedPrice.toFixed(2)}</span>
        <span className="line-through text-gray-400 ml-3">₹{originalPrice.toFixed(2)}</span>
      </div>
      <button
        className="bg-[#168b3f] hover:bg-[#137633] text-white w-full py-4 rounded-xl font-bold"
        onClick={() => {
          for (let i = 0; i < offer.qty; i++) {
            addToCart({
              id: Number(product.id),
              name: `${product.name}${offer.qty > 1 ? ` (${i + 1} of ${offer.qty})` : ""}`,
              price: (price * (1 - offer.discountPercent / 100)).toString(),
              images: product.images ?? [],
              regular_price: product.regular_price, // ✅ Add this line
            });            
          }
          toast({
            title: "Added to cart",
            description: `${offer.qty} x ${product.name} added with ${offer.discountPercent}% off.`,
          });
        }}
      >
        ADD TO CART — ₹{discountedPrice.toFixed(2)}
      </button>
    </>
  );
}
