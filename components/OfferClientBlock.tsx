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
  const [offer, setOffer] = useState<SelectedOffer>(undefined);

  // Always parse both for correct logic!
  const salePrice = parseFloat(product.price?.toString() || "0");              // Active sale or regular
  const regularPrice = parseFloat(product.regular_price?.toString() || salePrice.toString());

  // Use correct values for calculation
  const discountedPrice = offer ? salePrice * offer.qty * (1 - offer.discountPercent / 100) : 0;
  const originalPrice = offer ? regularPrice * offer.qty : 0;

  return (
    <>
      <OfferTab salePrice={salePrice} regularPrice={regularPrice} onOfferChange={setOffer} />
      <div className="mb-4">
        <span className="text-2xl font-bold">
          {offer ? `₹${discountedPrice.toFixed(2)}` : "Select offer"}
        </span>
        {offer && (
          <span className="line-through text-gray-400 ml-3">
            ₹{originalPrice.toFixed(2)}
          </span>
        )}
      </div>
      <button
        className="bg-[#168b3f] hover:bg-[#137633] text-white w-full py-4 rounded-xl font-bold disabled:opacity-60"
        disabled={!offer}
        onClick={() => {
          if (!offer) return; // safety
          for (let i = 0; i < offer.qty; i++) {
            addToCart({
              id: Number(product.id),
              name: `${product.name}${offer.qty > 1 ? ` (${i + 1} of ${offer.qty})` : ""}`,
              price: (salePrice * (1 - offer.discountPercent / 100)).toString(),
              images: product.images ?? [],
              regular_price: product.regular_price,
            });
          }
          toast({
            title: "Added to cart",
            description: `${offer.qty} x ${product.name} added with ${offer.discountPercent}% off.`,
          });
        }}
      >
        {offer
          ? `ADD TO CART — ₹${discountedPrice.toFixed(2)}`
          : "SELECT AN OFFER FIRST"}
      </button>
    </>
  );
}
