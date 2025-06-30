'use client';

import React, { useState, useRef } from "react";

type Image = { src: string; alt?: string };

export default function ImageGallery({ images }: { images: Image[] }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!images || images.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (delta > threshold && active < images.length - 1) {
      setActive((prev) => prev + 1);
    } else if (delta < -threshold && active > 0) {
      setActive((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Image */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[active].src}
          alt={images[active].alt || ""}
          className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto gap-3 mt-5 px-1 sm:px-4 scrollbar-hide">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 w-20 h-20 border-2 rounded-xl overflow-hidden transition-all duration-300 ${
              i === active ? "border-teal-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"
            }`}
            aria-label={`Show image ${i + 1}`}
          >
            <img
              src={img.src}
              alt={img.alt || ""}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
