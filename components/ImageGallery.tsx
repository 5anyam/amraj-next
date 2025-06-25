
import React, { useState } from "react";

type Image = { src: string; alt?: string };

export default function ImageGallery({ images }: { images: Image[] }) {
  const [active, setActive] = useState(0);
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg p-2 flex justify-center items-center mb-4">
        <img
          src={images[active].src}
          alt={images[active].alt || ""}
          className="object-contain w-full h-80 rounded-lg bg-blue-50 transition-all duration-200"
          style={{ maxHeight: 340 }}
        />
      </div>
      <div className="flex gap-2 justify-center mt-2">
        {images.map((img, i) => (
          <button
            key={i}
            className={`border-2 rounded-lg p-1 transition-all duration-200 ${
              i === active ? "border-blue-600" : "border-transparent opacity-60 hover:opacity-100"
            }`}
            onClick={() => setActive(i)}
            style={{ width: 60, height: 60 }}
            aria-label={`Show image ${i + 1}`}
          >
            <img
              src={img.src}
              alt={img.alt || ""}
              className="object-contain w-full h-full rounded"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
