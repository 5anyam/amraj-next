import React, { useState, useEffect } from "react";

// Offer type
type Offer = {
  label: string;
  duration: string;
  qty: number;
  discountPercent: number;
  isRecommended?: boolean;
};

export type SelectedOffer = Offer | undefined;

// Offers list
const OFFERS: Offer[] = [
  { label: "1 Months", duration: "1 Months", qty: 1, discountPercent: 0 },
  { label: "2 Months", duration: "2 Months", qty: 2, discountPercent: 7 },
  { label: "3 Months", duration: "3 Months", qty: 3, discountPercent: 10, isRecommended: true },
];

export default function OfferTab({
  price = 299,
  onOfferChange = () => {},
}: {
  price?: number;
  onOfferChange?: (offer: SelectedOffer) => void;
}) {
  // By default: no offer selected
  const [selected, setSelected] = useState<SelectedOffer>(undefined);

  // Only notify parent when user selects (or clears) an offer
  useEffect(() => {
    onOfferChange(selected);
  }, [selected, onOfferChange]);

  // Calculate savings
  const getSaveAmount = (offer: Offer) => {
    const original = price * offer.qty;
    const discounted = original * (1 - offer.discountPercent / 100);
    return Math.round(original - discounted);
  };

  // Calculate MRP (before discount)
  const getMRP = (offer: Offer) => {
    if (!offer.discountPercent) return price * offer.qty;
    return Math.round((price * offer.qty) / (1 - offer.discountPercent / 100));
  };

  return (
    <div className="mb-6 mt-4 flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:gap-5">
        {OFFERS.map((offer) => (
          <button
            key={offer.label}
            className={`flex-1 relative px-2 sm:px-4 py-3 sm:py-5 border rounded-lg sm:rounded-xl shadow-sm transition-all text-left
              ${
                selected?.label === offer.label
                  ? "border-green-700 bg-green-50 ring-2 ring-green-600"
                  : "border-green-200 bg-white hover:border-green-600"
              }`}
            onClick={() => setSelected(offer)}
            type="button"
            aria-pressed={selected?.label === offer.label}
          >
            {/* Save badge */}
            <span className="absolute -top-2 sm:-top-3 left-1 sm:left-3 bg-[#168b3f] text-white text-xs font-bold px-1 sm:px-3 py-1 rounded-md sm:rounded-lg shadow">
              Save ₹{getSaveAmount(offer)}
            </span>

            {/* Duration */}
            <div className="font-bold text-xs sm:text-lg text-[#168b3f] mt-2 sm:mt-0">{offer.duration}</div>

            {/* Pack Info */}
            <div className="text-xs mt-1 text-gray-700">
              <span className="block">Pack Of {offer.qty}</span>
              <span className="block text-gray-400 text-xs">
                ({offer.qty * 60} Capsules)
              </span>
            </div>

            {/* Price */}
            <div className="mt-1 text-sm sm:text-2xl font-bold text-[#168b3f]">
              ₹{Math.round(price * offer.qty * (1 - offer.discountPercent / 100))}
            </div>

            {/* MRP */}
            <div className="mt-1 text-xs text-gray-500 line-through">
              MRP: ₹{getMRP(offer)}
            </div>

            {/* Recommended badge */}
            {offer.isRecommended && (
              <div className="absolute -bottom-4 sm:-bottom-4 right-0 sm:right-0 m-1 sm:m-2 px-1 sm:px-2 py-1 text-[10px] rounded bg-orange-500 text-white font-semibold">
                Recommended
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
