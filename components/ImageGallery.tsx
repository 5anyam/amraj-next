'use client';

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from "lucide-react";

type Image = { src: string; alt?: string };

export default function ImageGallery({ images }: { images: Image[] }) {
  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const DRAG_THRESHOLD = 80; // Minimum drag distance to trigger slide
  const VELOCITY_THRESHOLD = 0.5; // Minimum velocity for quick swipes

  // Default images for demo
  const defaultImages = [
    { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop", alt: "Premium Watch" },
    { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop", alt: "Running Shoes" },
    { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop", alt: "Headphones" },
    { src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop", alt: "Sunglasses" },
    { src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=600&fit=crop", alt: "Sneakers" }
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoading(false);
    img.src = displayImages[active].src;
    setIsLoading(true);
  }, [active, displayImages]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActive((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActive((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Enhanced touch handling with smooth dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isZoomed) return;
    
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setCurrentX(touch.clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isZoomed) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    
    // Apply resistance at boundaries
    let adjustedDelta = deltaX;
    if ((active === 0 && deltaX > 0) || (active === displayImages.length - 1 && deltaX < 0)) {
      adjustedDelta = deltaX * 0.3; // Resistance effect
    }
    
    setCurrentX(touch.clientX);
    setDragOffset(adjustedDelta);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isZoomed) return;
    
    const deltaX = currentX - startX;
    const velocity = Math.abs(deltaX) / 100; // Simple velocity calculation
    
    // Determine if we should slide to next/previous
    const shouldSlide = Math.abs(deltaX) > DRAG_THRESHOLD || velocity > VELOCITY_THRESHOLD;
    
    if (shouldSlide) {
      if (deltaX > 0 && active > 0) {
        handlePrevious();
      } else if (deltaX < 0 && active < displayImages.length - 1) {
        handleNext();
      }
    }
    
    // Reset drag state
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  // Mouse events for desktop dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isZoomed) return;
    
    setStartX(e.clientX);
    setCurrentX(e.clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isZoomed) return;
    
    const deltaX = e.clientX - startX;
    
    // Apply resistance at boundaries
    let adjustedDelta = deltaX;
    if ((active === 0 && deltaX > 0) || (active === displayImages.length - 1 && deltaX < 0)) {
      adjustedDelta = deltaX * 0.3;
    }
    
    setCurrentX(e.clientX);
    setDragOffset(adjustedDelta);
  };

  const handleMouseUp = () => {
    if (!isDragging || isZoomed) return;
    
    const deltaX = currentX - startX;
    const shouldSlide = Math.abs(deltaX) > DRAG_THRESHOLD;
    
    if (shouldSlide) {
      if (deltaX > 0 && active > 0) {
        handlePrevious();
      } else if (deltaX < 0 && active < displayImages.length - 1) {
        handleNext();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') {
      setIsFullscreen(false);
      setIsZoomed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent default touch behavior to avoid scrolling
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, [isDragging]);

  if (!displayImages || displayImages.length === 0) return null;

  return (
    <>
      {/* Main Image Container */}
      <div className="relative group">
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 h-[700px] cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Fixed Beautiful Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url("https://cms.amraj.in/wp-content/uploads/2025/07/liver-bg.png")`
                }}
              ></div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
              </div>
            </div>
          )}
          
          {/* Images Container with Smooth Dragging */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {displayImages.map((img, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                  i === active 
                    ? 'opacity-100 translate-x-0 scale-100 z-10' 
                    : i < active 
                      ? 'opacity-0 -translate-x-full scale-95 z-0' 
                      : 'opacity-0 translate-x-full scale-95 z-0'
                }`}
                style={{
                  transform: i === active ? `translateX(${dragOffset}px)` : undefined
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || `Product image ${i + 1}`}
                  className={`h-[600px] w-auto object-contain transition-all duration-500 select-none mx-auto ${
                    isZoomed && i === active 
                      ? 'scale-150 cursor-zoom-out' 
                      : 'cursor-zoom-in hover:scale-105'
                  }`}
                  onClick={() => i === active && setIsZoomed(!isZoomed)}
                  onLoad={() => i === active && setIsLoading(false)}
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15)) drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                    maxHeight: '600px',
                    maxWidth: '90%',
                    userSelect: 'none'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Desktop only */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200/50 z-30 hidden md:block disabled:opacity-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200/50 z-30 hidden md:block disabled:opacity-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-30">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-200 border border-gray-200/50 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-200 border border-gray-200/50 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Drag Indicator */}
          {isDragging && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-white/20 z-10">
              {Math.abs(dragOffset) > DRAG_THRESHOLD ? "Release to slide" : "Drag to slide"}
            </div>
          )}

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/20 z-10">
              {active + 1} / {displayImages.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="mt-6">
          <div className="flex overflow-x-auto gap-3 px-2 py-2 scrollbar-hide">
            {displayImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 relative group/thumb transition-all duration-300 ${
                  i === active 
                    ? "ring-3 ring-blue-500 ring-offset-2 scale-105 shadow-lg" 
                    : "ring-2 ring-transparent hover:ring-gray-300 opacity-70 hover:opacity-100 hover:scale-105"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50">
                  <img
                    src={img.src}
                    alt={img.alt || `Thumbnail ${i + 1}`}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover/thumb:scale-110 drop-shadow-md"
                    loading="lazy"
                  />
                </div>
                {i === active && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl border-2 border-blue-500/50"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dots Indicator for Mobile */}
      {displayImages.length > 1 && (
        <div className="flex justify-center mt-4 gap-2 sm:hidden">
          {displayImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${
                i === active ? "bg-blue-500 w-8 shadow-blue-500/50" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 z-10 rounded-full hover:bg-white/10 transition-all duration-200 hidden md:block"
              aria-label="Close fullscreen"
            >
              <X className="w-8 h-8" />
            </button>
            
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 border border-white/20 md:hidden"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <img
                src={displayImages[active].src}
                alt={displayImages[active].alt || `Product image ${active + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg drop-shadow-2xl"
              />
            </div>
            
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 border border-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 border border-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full border border-white/20">
              {active + 1} / {displayImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}