'use client'; // ✅ FIXED - Client Component banaya

import React from 'react';
import Link from 'next/link';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-orange-50 px-4">
      <div className="relative flex flex-col items-center p-8 max-w-md mx-auto">
        {/* Premium Animated Logo */}
        <div className="relative w-24 h-24 mb-8 group">
          {/* Outer Glow Ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-teal-400/20 to-orange-400/20 rounded-3xl blur-xl animate-ping"></div>
          
          {/* Main Logo Ring */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-teal-500/95 to-orange-500/95 rounded-2xl shadow-2xl border-4 border-white/80 backdrop-blur-xl flex items-center justify-center">
            
            {/* Inner Spinning Ring */}
            <div className="absolute inset-2 border-2 border-t-teal-400 border-r-orange-400 border-b-transparent border-l-transparent rounded-xl animate-spin" style={{animationDuration: '2s'}}></div>
            
            {/* Logo Icon */}
            <div className="relative z-10 animate-bounce" style={{animationDuration: '2s'}}>
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-orange-600 rounded-xl shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="text-center space-y-4 animate-pulse" style={{animationDuration: '3s'}}>
          <div className="space-y-2">
            <h2 className="bg-gradient-to-r from-teal-600 via-orange-500 to-teal-600 bg-clip-text text-transparent font-bold text-2xl md:text-3xl tracking-wider drop-shadow-lg">
              AMRAJ
            </h2>
            <div className="flex items-center justify-center gap-2 mx-4">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full animate-ping"></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-teal-100/70 to-orange-100/70 px-6 py-3 rounded-2xl backdrop-blur-xl border border-teal-200/50 shadow-xl">
            <p className="text-teal-800 font-semibold text-sm md:text-base tracking-wider uppercase">
              Loading Wellness...
            </p>
          </div>
        </div>

        {/* Subtle Progress Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 max-w-xs bg-white/40 backdrop-blur-sm rounded-full p-1 border border-teal-200/50 shadow-xl overflow-hidden">
          <div 
            className="h-2.5 bg-gradient-to-r from-teal-500 via-orange-500 to-teal-500 rounded-full shadow-lg animate-pulse"
            style={{animationDuration: '1.5s'}}
          ></div>
        </div>
      </div>

      {/* Skip Link for SSR */}
      <Link 
        href="/"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
      >
        Skip to Home →
      </Link>
    </div>
  );
}
