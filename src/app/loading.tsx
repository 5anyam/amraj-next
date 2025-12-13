// app/loading.tsx
import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-16 h-16 mb-4">
          {/* Static Ring */}
          <div className="absolute inset-0 border-4 border-[#D4A574]/20 rounded-full"></div>
          {/* Spinning Ring */}
          <div className="absolute inset-0 border-4 border-t-[#D4A574] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Brand Text */}
        <div className="text-center space-y-2">
          <h2 className="text-[#5D4E37] font-bold text-lg tracking-[0.2em] animate-pulse">
            AMRAJ
          </h2>
          <p className="text-[#D4A574] text-xs font-medium uppercase tracking-wider">
            Rooted in Tradition
          </p>
        </div>
      </div>
    </div>
  );
}
