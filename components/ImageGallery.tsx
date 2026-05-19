"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from "lucide-react";

// --- Types and Interfaces ---
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

// --- MAIN COMPONENT ---
export default function ImageGallery({ images }: { images: Image[] }) {
  const pathname = usePathname();

  // Memoize slug extraction to avoid recalculation
  const currentSlug = useMemo(() => {
    const segments = pathname.split('/');
    return segments[segments.length - 1].toLowerCase();
  }, [pathname]);

  const [active, setActive] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));

  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const DRAG_THRESHOLD = 80;
  const VELOCITY_THRESHOLD = 0.5;

  const displayImages = images && images.length > 0 ? images : [];

  // --- Optimized Background Images Logic ---
  const backgroundImages: Record<string, string> = useMemo(() => ({
    liver: "https://cms.amraj.in/wp-content/uploads/2025/07/liver-bg.png",
    prostate: "https://cms.amraj.in/wp-content/uploads/2025/07/prostate-bg.png",
    weight: "https://cms.amraj.in/wp-content/uploads/2025/07/weight-bg.png",
    diabetes: "https://cms.amraj.in/wp-content/uploads/2025/07/diabetes-bg.png",
    default: "https://cms.amraj.in/wp-content/uploads/2025/07/default-bg.png"
  }), []);

  const bgImage = useMemo(() => {
    if (backgroundImages[currentSlug]) return backgroundImages[currentSlug];
    for (const [key, image] of Object.entries(backgroundImages)) {
      if (key !== 'default' && currentSlug.includes(key)) return image;
    }
    return backgroundImages.default;
  }, [currentSlug, backgroundImages]);

  // --- Preload adjacent images for faster navigation ---
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < displayImages.length && !loadedImages.has(index)) {
        const img = new window.Image();
        img.src = displayImages[index].src;
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, index]));
        };
      }
    };

    // Preload current, next, and previous images
    preloadImage(active);
    if (active > 0) preloadImage(active - 1);
    if (active < displayImages.length - 1) preloadImage(active + 1);
  }, [active, displayImages, loadedImages]);

  // --- Navigation/Drag Logic ---
  const handlePrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActive((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 300);
    setIsZoomed(false);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActive((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 300);
    setIsZoomed(false);
  };

  // -- Touch/Drag handlers (optimized)
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

  // -- Desktop Mouse drag (optimized)
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

  // --- Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, active]);

  // --- Fullscreen logic ---
  const enterFullscreen = () => {
    setIsFullscreen(true);
    setIsZoomed(false);
    if (fullscreenRef.current) {
      const element = fullscreenRef.current as ExtendedHTMLElement;
      if (element.requestFullscreen) element.requestFullscreen().catch(()=>{});
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen().catch(()=>{});
      else if (element.msRequestFullscreen) element.msRequestFullscreen().catch(()=>{});
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setIsZoomed(false);
    const doc = document as ExtendedDocument;
    if (document.fullscreenElement) document.exitFullscreen().catch(()=>{});
    else if (doc.webkitFullscreenElement) doc.webkitExitFullscreen?.().catch(()=>{});
    else if (doc.msFullscreenElement) doc.msExitFullscreen?.().catch(()=>{});
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

  // --- UI RETURN ---
  return (
    <>
      {/* Main Image Container */}
      <div className="relative group">
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden shadow-md border border-gray-200 h-[400px] md:h-[600px] lg:h-[700px] bg-white touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: isDragging ? "none" : "pan-y"
          }}
        >
          {/* Optimized Background with will-change */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${bgImage})`,
                  willChange: 'transform'
                }}
              />
            </div>
          </div>

          {/* Simplified Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/50">
              <div className="w-10 h-10 border-3 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          )}

          {/* Images Container with Optimized Rendering */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {displayImages.map((img, i) => {
              const isActive = i === active;
              const shouldRender = Math.abs(i - active) <= 1; // Only render adjacent images
              
              if (!shouldRender && !isActive) return null;

              return (
                <div
                  key={i}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                    isActive
                      ? "opacity-100 translate-x-0 scale-100 z-10"
                      : i < active
                        ? "opacity-0 -translate-x-full scale-95 z-0"
                        : "opacity-0 translate-x-full scale-95 z-0"
                  }`}
                  style={{
                    transform: isActive ? `translateX(${dragOffset}px)` : undefined,
                    willChange: isActive ? 'transform' : 'auto'
                  }}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Product image ${i + 1}`}
                    className={`w-[375px] h-[375px] sm:w-[490px] sm:h-[490px] object-cover transition-transform duration-300 select-none mx-auto rounded-xl ${
                      isZoomed && isActive ? "scale-150 cursor-zoom-out" : "cursor-pointer hover:scale-105"
                    }`}
                    onClick={() => {
                      setActive(i);
                      setIsZoomed(false);
                      enterFullscreen();
                    }}
                    onLoad={() => {
                      if (isActive) setIsLoading(false);
                      setLoadedImages(prev => new Set([...prev, i]));
                    }}
                    loading={i === 0 ? "eager" : "lazy"}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.12))",
                      userSelect: "none"
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Desktop Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200 z-30 hidden md:block disabled:opacity-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200 z-30 hidden md:block disabled:opacity-50"
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
              className="bg-white/95 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-all duration-200 border border-gray-200"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={enterFullscreen}
              className="bg-white/95 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-md hover:scale-110 transition-all duration-200 border border-gray-200"
              aria-label="View fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Simplified Drag Indicator */}
          {isDragging && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-full text-sm z-10">
              {Math.abs(dragOffset) > DRAG_THRESHOLD ? "Release" : "Drag"}
            </div>
          )}
        </div>
      </div>

      {/* Optimized Thumbnails with Lazy Loading */}
      {displayImages.length > 1 && (
        <div className="mt-6">
          <div className="flex overflow-x-auto gap-3 px-2 py-2 scrollbar-hide">
            {displayImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setActive(i);
                  setIsZoomed(false);
                }}
                className={`flex-shrink-0 relative transition-all duration-300 focus:outline-none ${
                  i === active
                    ? "ring-2 ring-emerald-500 ring-offset-2 scale-105 shadow-md"
                    : "ring-2 ring-transparent hover:ring-gray-300 opacity-70 hover:opacity-100 hover:scale-105"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={img.src}
                    alt={img.alt || `Thumbnail ${i + 1}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Dots Indicator */}
      {displayImages.length > 1 && (
        <div className="flex justify-center mt-4 gap-2 sm:hidden">
          {displayImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-7 h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "bg-emerald-500 shadow-sm" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Optimized Fullscreen Modal */}
      {isFullscreen && (
        <div
          ref={fullscreenRef}
          className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={exitFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-40 rounded-full bg-black/60 hover:bg-black/80 transition-all duration-200"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full flex-1 flex items-center justify-center">
            <img
              src={displayImages[active].src}
              alt={displayImages[active].alt || `Product image ${active + 1}`}
              className={`max-w-[95vw] max-h-[75vh] object-contain transition-transform duration-300 mx-auto rounded-xl shadow-2xl ${
                isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              onDragStart={(e) => e.preventDefault()}
              loading="eager"
            />
          </div>

          {displayImages.length > 1 && (
            <div className="w-full max-w-4xl px-4 pb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="text-center text-white mb-3 text-base font-medium">
                  {active + 1} / {displayImages.length}
                </div>
                <div className="flex justify-center gap-2 overflow-x-auto pb-1">
                  {displayImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`flex-shrink-0 transition-all duration-300 ${
                        i === active
                          ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent scale-110"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden shadow border border-white/10">
                        <img
                          src={img.src}
                          alt={img.alt || `Thumbnail ${i + 1}`}
                          className="object-cover w-full h-full"
                          loading="lazy"
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
