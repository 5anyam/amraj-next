'use client';

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from "lucide-react";

type Image = { src: string; alt?: string };

interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface ExtendedHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export default function ImageGallery({ images }: { images: Image[] }) {
  const pathname = usePathname();

  const getSlugFromPath = () => {
    const segments = pathname.split('/');
    const slug = segments[segments.length - 1];
    return slug.toLowerCase();
  };

  const currentSlug = getSlugFromPath();

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
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const DRAG_THRESHOLD = 80;
  const VELOCITY_THRESHOLD = 0.5;

  const displayImages = images && images.length > 0 ? images : [];

  const backgroundImages: Record<string, string> = {
    liver: "https://cms.amraj.in/wp-content/uploads/2025/07/liver-bg.png",
    prostate: "https://cms.amraj.in/wp-content/uploads/2025/07/prostate-bg.png",
    weight: "https://cms.amraj.in/wp-content/uploads/2025/07/weight-bg.png",
    diabetes: "https://cms.amraj.in/wp-content/uploads/2025/07/diabetes-bg.png",
    default: "https://cms.amraj.in/wp-content/uploads/2025/07/default-bg.png"
  };

  const getBackgroundImage = () => {
    if (backgroundImages[currentSlug]) return backgroundImages[currentSlug];
    for (const [key, image] of Object.entries(backgroundImages)) {
      if (key !== 'default' && currentSlug.includes(key)) return image;
    }
    return backgroundImages.default;
  };

  const bgImage = getBackgroundImage();

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoading(false);
    img.src = displayImages[active]?.src;
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
    const absDeltaX = Math.abs(deltaX);
    if (absDeltaX > 10) e.preventDefault();
    let adjustedDelta = deltaX;
    if ((active === 0 && deltaX > 0) || (active === displayImages.length - 1 && deltaX < 0)) {
      adjustedDelta = deltaX * 0.3;
    }
    setCurrentX(touch.clientX);
    setDragOffset(adjustedDelta);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isZoomed) return;
    const deltaX = currentX - startX;
    const velocity = Math.abs(deltaX) / 100;
    const shouldSlide = Math.abs(deltaX) > DRAG_THRESHOLD || velocity > VELOCITY_THRESHOLD;
    if (shouldSlide) {
      if (deltaX > 0 && active > 0) handlePrevious();
      else if (deltaX < 0 && active < displayImages.length - 1) handleNext();
    }
    setIsDragging(false);
    setDragOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

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
      if (deltaX > 0 && active > 0) handlePrevious();
      else if (deltaX < 0 && active < displayImages.length - 1) handleNext();
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

  const enterFullscreen = () => {
    setIsFullscreen(true);
    if (fullscreenRef.current) {
      const element = fullscreenRef.current as ExtendedHTMLElement;
      if (element.requestFullscreen) element.requestFullscreen().catch(console.log);
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen().catch(console.log);
      else if (element.msRequestFullscreen) element.msRequestFullscreen().catch(console.log);
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setIsZoomed(false);
    const doc = document as ExtendedDocument;
    if (document.fullscreenElement) document.exitFullscreen().catch(console.log);
    else if (doc.webkitFullscreenElement) doc.webkitExitFullscreen?.().catch(console.log);
    else if (doc.msFullscreenElement) doc.msExitFullscreen?.().catch(console.log);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as ExtendedDocument;
      if (!document.fullscreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        setIsFullscreen(false);
        setIsZoomed(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!displayImages || displayImages.length === 0) return null;

  return (
    <>
      {/* Main Image Container */}
      <div className="relative group">
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 h-[400px] md:h-[600px] lg:h-[700px] touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: isDragging ? 'none' : 'pan-y'
          }}
        >
          {/* Fixed Beautiful Background - Automatically changes based on URL */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bgImage})` }}
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

          {/* Images Container with Smooth Dragging - INCREASED ZOOM */}
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
                  className={`w-[390px] h-[390px] object-cover transition-all duration-500 select-none mx-auto rounded-xl ${
                    isZoomed && i === active 
                      ? 'scale-200 cursor-zoom-out' 
                      : 'cursor-zoom-in hover:scale-110'
                  }`}
                  onClick={() => i === active && setIsZoomed(!isZoomed)}
                  onLoad={() => i === active && setIsLoading(false)}
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15)) drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
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
              onClick={enterFullscreen}
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
                    className="object-cover w-full h-full transition-transform duration-300 group-hover/thumb:scale-110 drop-shadow-md"
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

      {/* Fullscreen Modal - WITH SLIDER INSTEAD OF ARROWS */}
      {isFullscreen && (
        <div 
          ref={fullscreenRef}
          className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-4"
          style={{ width: '100vw', height: '100vh' }}
        >
          <div className="relative w-full flex-1 flex items-center justify-center">
            <button
              onClick={exitFullscreen}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-20 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 border border-white/20"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img
              src={displayImages[active].src}
              alt={displayImages[active].alt || `Product image ${active + 1}`}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-200 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              style={{
                width: isZoomed ? '200%' : '100%',
                height: isZoomed ? '200%' : '100%',
              }}
            />
          </div>
          
          {/* Fullscreen Slider - Replaces navigation arrows */}
          {displayImages.length > 1 && (
            <div className="w-full max-w-4xl px-8 pb-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                {/* Current Image Counter */}
                <div className="text-center text-white mb-4 text-lg font-medium">
                  {active + 1} / {displayImages.length}
                </div>
                
                {/* Slider Track */}
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={displayImages.length - 1}
                    value={active}
                    onChange={(e) => setActive(parseInt(e.target.value))}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider-custom"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(active / (displayImages.length - 1)) * 100}%, rgba(255,255,255,0.2) ${(active / (displayImages.length - 1)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  
                  {/* Slider Thumb Styling */}
                  <style jsx>{`
                    .slider-custom::-webkit-slider-thumb {
                      appearance: none;
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: #3b82f6;
                      cursor: pointer;
                      border: 3px solid white;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                      transition: all 0.2s ease;
                    }
                    .slider-custom::-webkit-slider-thumb:hover {
                      transform: scale(1.2);
                      background: #2563eb;
                    }
                    .slider-custom::-moz-range-thumb {
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      background: #3b82f6;
                      cursor: pointer;
                      border: 3px solid white;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    }
                  `}</style>
                </div>
                
                {/* Thumbnail Preview Row */}
                <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
                  {displayImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`flex-shrink-0 transition-all duration-300 ${
                        i === active 
                          ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent scale-110" 
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img
                          src={img.src}
                          alt={img.alt || `Thumbnail ${i + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
