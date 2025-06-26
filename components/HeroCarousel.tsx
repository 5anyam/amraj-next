'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';
import Image from 'next/image';
import { CarouselApi } from '../components/ui/carousel';

const IMAGES = [
  {
    src: 'https://cms.amraj.in/wp-content/uploads/2025/06/Amraj-Bg-Photo_20250623_113828_0000-scaled.jpg',
    alt: 'Model smiling with serum',
  },
  {
    src: 'https://cms.amraj.in/wp-content/uploads/2025/06/Amraj-Bg-Photo_20250623_113828_0000-scaled.jpg',
    alt: 'Healthy skin with bottle',
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = React.useState(0);

  // Syncs carousel with the clicked dot
  const handleSlideChange = React.useCallback((api: CarouselApi) => {
    if (api && typeof api.selectedScrollSnap === 'function') {
      setCurrent(api.selectedScrollSnap());
    }
  }, []);

  // Change to specific slide on dot click
  const handleDotClick = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="w-full h-full relative">
      <Carousel
        opts={{ loop: true }}
        setApi={handleSlideChange}
        className="w-full h-full"
      >
        <CarouselContent>
          {IMAGES.map((img, i) => (
            <CarouselItem key={i}>
              <div className="relative w-full h-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  className="object-cover w-full h-full rounded-xl shadow-lg"
                  width={1920}
                  height={1080}
                  priority={i === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Controls */}
        <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-40 text-white bg-gray-500/50 rounded-full p-2" />
        <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-40 text-white bg-gray-500/50 rounded-full p-2" />
      </Carousel>

      {/* Carousel Indicator (Clickable) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {IMAGES.map((_, i) => (
          <span
            key={i}
            className={`block w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
              i === current
                ? 'bg-green-600 scale-125'
                : 'bg-gray-300 opacity-70'
            }`}
            onClick={() => handleDotClick(i)} // Sync dot click with carousel
          />
        ))}
      </div>
    </div>
  );
}
