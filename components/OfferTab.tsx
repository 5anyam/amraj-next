import React, { useState } from "react";

// Modern, card-style offers for Plix look-alike
type Offer = {
  label: string;
  duration: string;
  qty: number;
  discountPercent: number;
  isRecommended?: boolean;
};

const OFFERS: Offer[] = [
  { label: "1 Month", duration: "1 Month", qty: 1, discountPercent: 10 },
  { label: "2 Months", duration: "2 Months", qty: 2, discountPercent: 15 },
  { label: "3 Months", duration: "3 Months", qty: 3, discountPercent: 20, isRecommended: true },
];

export type SelectedOffer = Offer;

export default function OfferTab({
  price = 299,
  onOfferChange = () => {},
}: {
  price?: number;
  onOfferChange?: (offer: SelectedOffer) => void;
}) {
  const [selected, setSelected] = useState(OFFERS[0]);
  
  React.useEffect(() => {
    onOfferChange(selected);
  }, [selected, onOfferChange]);
  
  // Function to calculate "save" amount
  const getSaveAmount = (offer: Offer) => {
    const original = price * offer.qty;
    const discounted = price * offer.qty * (1 - offer.discountPercent / 100);
    return Math.round(original - discounted);
  };

  // Function to get MRP (strike-through) price
  const getMRP = (offer: Offer) => {
    return Math.round(price * offer.qty / (1 - offer.discountPercent / 100));
  };

  return (
    <div className="mb-6 mt-4 flex flex-col gap-2">
      {/* Mobile: 3 items per row, Desktop: Side by side */}
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:gap-5">
        {OFFERS.map((offer) => (
          <button
            key={offer.label}
            className={`flex-1 relative px-2 sm:px-4 py-3 sm:py-5 border rounded-lg sm:rounded-xl shadow-sm transition-all text-left
              ${selected.label === offer.label
                ? "border-green-700 bg-green-50 ring-2 ring-green-600"
                : "border-green-200 bg-white hover:border-green-600"
              }`}
            onClick={() => setSelected(offer)}
            type="button"
          >
           
            
            {/* Save badge - responsive positioning and sizing */}
            <span className="absolute -top-2 sm:-top-3 left-1 sm:left-3 bg-[#168b3f] text-white text-xs font-bold px-1 sm:px-3 py-1 rounded-md sm:rounded-lg shadow">
              Save ₹{getSaveAmount(offer)}
            </span>
            
            {/* Duration - responsive text size */}
            <div className="font-bold text-xs sm:text-lg text-[#168b3f] mt-2 sm:mt-0">
              {offer.duration}
            </div>
            
            {/* Pack info - responsive layout */}
            <div className="text-xs mt-1 text-gray-700">
              <span className="block">Pack Of {offer.qty * 4}</span>
              <span className="block text-gray-400 text-xs">
                ({offer.qty * 60} Tablets)
              </span>
            </div>
            
            {/* Price - responsive size */}
            <div className="mt-1 text-sm sm:text-2xl font-bold text-[#168b3f]">
              ₹{Math.round(price * offer.qty * (1 - offer.discountPercent / 100))}
            </div>
            
            {/* MRP - responsive text size */}
            <div className="mt-1 text-xs text-gray-500 line-through">
              MRP: ₹{getMRP(offer)}
            </div>
            
            {/* Recommended badge for 3rd month only */}
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