'use client';

import { useState, useEffect } from 'react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`bg-teal-500 text-white py-1.5 md:py-2 px-3 md:px-4 relative overflow-hidden transition-all duration-300 ${
        isAnimating ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between">
          {/* Left Decoration - Desktop only */}
          <div className="hidden lg:flex items-center space-x-1.5">
            <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Center Content - Single line for mobile */}
          <div className="flex items-center justify-center flex-1 px-1">
            <div className="flex items-center space-x-2 text-center">
              <span className="text-sm md:text-base">🎉</span>
              <p className="text-xs md:text-sm font-semibold">
                Use <span className="bg-white text-teal-600 px-1.5 md:px-2 py-0.5 rounded font-bold mx-1">WELCOME100</span> & get ₹100 OFF!
              </p>
              <span className="hidden md:inline text-base">🎉</span>
            </div>
          </div>
          
          {/* Compact Close Button */}
          <button
            onClick={handleClose}
            className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full hover:bg-teal-600 transition-all duration-200 group flex-shrink-0"
            aria-label="Close"
          >
            <svg 
              className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:scale-110 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
