"use client";

import React, { useState, useRef, useEffect } from "react";
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

  // --- Background Images Logic ---
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

  // --- Image Loading State ---
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setIsLoading(false);
    img.src = displayImages[active]?.src;
    setIsLoading(true);
  }, [active, displayImages]);

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

  // -- Touch/Drag handlers (main area & fullscreen mobile)
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

  // -- Desktop Mouse drag
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
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isFullscreen) return;
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
    // eslint-disable-next-line
  }, [isFullscreen, active]);

  // --- Fullscreen logic ---
  const enterFullscreen = () => {
    setIsFullscreen(true);
    setIsZoomed(false); // Don't zoom on entry
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
    // Clean up on native fullscreen exit (escape, android nav, etc)
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
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 h-[400px] md:h-[600px] lg:h-[700px] bg-white touch-pan-y"
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
          {/* Fixed Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bgImage})` }}
              ></div>
            </div>
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
              </div>
            </div>
          )}

          {/* Images Container with Drag */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {displayImages.map((img, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                  i === active
                    ? "opacity-100 translate-x-0 scale-100 z-10"
                    : i < active
                      ? "opacity-0 -translate-x-full scale-95 z-0"
                      : "opacity-0 translate-x-full scale-95 z-0"
                }`}
                style={{
                  transform: i === active ? `translateX(${dragOffset}px)` : undefined
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || `Product image ${i + 1}`}
                  className={`w-[375px] h-[375px] sm:w-[490px] sm:h-[490px] object-cover transition-all duration-500 select-none mx-auto rounded-xl ${
                    isZoomed && i === active
                      ? "scale-200 cursor-zoom-out"
                      : "cursor-pointer hover:scale-105"
                  }`}
                  onClick={() => {
                    setActive(i);
                    setIsZoomed(false);
                    enterFullscreen();
                  }}
                  onLoad={() => i === active && setIsLoading(false)}
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15)) drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
                    userSelect: "none"
                  }}
                />
              </div>
            ))}
          </div>

          {/* Desktop Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200/50 z-30 hidden md:block disabled:opacity-50 focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-gray-200/50 z-30 hidden md:block disabled:opacity-50 focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Action Buttons (Zoom, Fullscreen) */}
          <div className="absolute top-4 right-4 flex gap-2 z-30">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-200 border border-gray-200/50 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              tabIndex={-1}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={enterFullscreen}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-200 border border-gray-200/50 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label="View fullscreen"
              tabIndex={-1}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Drag Indicator */}
          {isDragging && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-white/20 z-10">
              {Math.abs(dragOffset) > DRAG_THRESHOLD ? "Release to slide" : "Drag to slide"}
            </div>
          )}

          {/* Improved Image Counter (bottom, spacing) */}
    
        </div>
      </div>

      {/* Thumbnails (desktop+mobile) */}
      {displayImages.length > 1 && (
        <div className="mt-8">
          <div className="flex overflow-x-auto gap-4 px-2 py-2 scrollbar-hide">
            {displayImages.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setActive(i);
                  setIsZoomed(false);
                }}
                className={`flex-shrink-0 relative group/thumb transition-all duration-300 focus:outline-none ${
                  i === active
                    ? "ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-lg"
                    : "ring-2 ring-transparent hover:ring-gray-300 opacity-70 hover:opacity-100 hover:scale-105"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <div className="w-[64px] h-[64px] rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50">
                  <img
                    src={img.src}
                    alt={img.alt || `Thumbnail ${i + 1}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover/thumb:scale-110 drop-shadow-md"
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
        <div className="flex justify-center mt-4 gap-3 sm:hidden">
          {displayImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-8 h-2 rounded-full transition-all duration-300 shadow-sm ${
                i === active
                  ? "bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-400 shadow-blue-500/40"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ----- FULLSCREEN MODAL ----- */}
      {isFullscreen && (
        <div
          ref={fullscreenRef}
          className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-4"
          style={{ width: "100vw", height: "100vh" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
         

          {/* Close Button */}
          <button
            onClick={exitFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-40 rounded-full bg-black/70 hover:bg-black/80 transition-all duration-200 border border-white/20 focus:outline-none"
            aria-label="Close fullscreen"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Fullscreen Image */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            <img
              src={displayImages[active].src}
              alt={displayImages[active].alt || `Product image ${active + 1}`}
              className={`max-w-[98vw] max-h-[75vh] sm:max-h-[80vh] object-contain transition-transform duration-300 mx-auto rounded-2xl shadow-2xl ${
                isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
              onDragStart={(e) => e.preventDefault()}
              style={{
                width: isZoomed ? "auto" : "auto",
                height: isZoomed ? "auto" : "auto"
              }}
            />
          </div>

          {/* Fullscreen Slider and Thumbs */}
          {displayImages.length > 1 && (
            <div className="w-full max-w-4xl px-1 sm:px-8 pb-8">
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-5 border border-white/10 shadow-2xl">
                {/* Counter */}
                <div className="text-center text-white/90 mb-5 text-lg font-semibold tracking-wide">
                  {active + 1} / {displayImages.length}
                </div>
                {/* Range Slider */}
                
                {/* Thumbnails Row */}
                <div className="flex justify-center gap-3 mt-2 overflow-x-auto pb-1">
                  {displayImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`flex-shrink-0 transition-all duration-300 focus:outline-none ${
                        i === active
                          ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent scale-110"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden shadow border border-white/10">
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
