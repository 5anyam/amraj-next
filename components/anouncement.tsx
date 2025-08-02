'use client';

import { useState, useEffect } from 'react';

export default function EnhancedAnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  // Auto-hide after 30 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`bg-teal-500 text-white py-3 px-4 relative overflow-hidden transition-all duration-300 ${
        isAnimating ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between">
          {/* Left Decoration */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Center Content */}
          <div className="flex items-center justify-center space-x-3 text-center flex-1">
            <span className="text-lg animate-bounce">🎉</span>
            <div className="flex flex-col md:flex-row items-center md:space-x-2">
              <p className="text-sm md:text-base font-semibold">
                Use coupon code
              </p>
              <div className="bg-white text-teal-600 px-3 py-1 rounded-lg font-bold text-sm md:text-base shadow-md hover:shadow-lg transition-shadow duration-200 animate-pulse">
                WELCOME100
              </div>
              <p className="text-sm md:text-base font-semibold">
                & get ₹100 OFF!
              </p>
            </div>
            <span className="text-lg animate-bounce" style={{ animationDelay: '0.5s' }}>🎉</span>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-600 hover:rotate-90 transition-all duration-200 group"
            aria-label="Close announcement"
          >
            <svg 
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
