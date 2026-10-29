'use client';

import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    // Fixed overlay covering the screen, but with transparent black background
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      
      {/* Central Logo Container */}
      <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl">
        
        {/* Optional: Subtle Glow behind logo to ensure readability against any background */}
        <div className="absolute inset-0 bg-black/40 rounded-full blur-3xl" />

        {/* The Logo Image */}
        <div className="relative z-10 w-32 md:w-40 animate-pulse">
          <Image
            src="/amraj-dark-logo.png"
            alt="Amraj Loading"
            width={160}
            height={60}
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* Minimal Loading Line */}
        <div className="relative z-10 mt-6 w-24 h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-white w-1/2 animate-[loading-bar_1s_infinite_linear]" />
        </div>

      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

    </div>
  );
}
