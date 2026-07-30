'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* Banner artwork already carries its own headline — nothing is overlaid on top of it. */
const BANNERS = [
  {
    src: 'https://cms.amraj.in/wp-content/uploads/2025/06/Amraj-Bg-Photo_20250623_113828_0000-scaled.jpg',
    alt: 'Amraj — from our soil to our homes, backed by science',
  },
  {
    src: 'https://cms.amraj.in/wp-content/uploads/2025/08/amraj-cover-1-scaled.jpg',
    alt: 'Amraj — the soil we trust',
  },
];

const AUTOPLAY_MS = 5000;

export default function HeroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const el = trackRef.current;
    if (!el) return;
    const next = (index + BANNERS.length) % BANNERS.length;
    el.scrollTo({ left: el.clientWidth * next, behavior });
    setCurrent(next);
  }, []);

  // Autoplay — paused on hover/focus and disabled entirely for reduced-motion users.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [current, paused, goTo]);

  // Keep the active slide aligned when the viewport width changes.
  useEffect(() => {
    const onResize = () => goTo(current, 'auto');
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [current, goTo]);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el || !el.clientWidth) return;
    const i = Math.max(0, Math.min(BANNERS.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
    setCurrent((prev) => (prev === i ? prev : i));
  };

  return (
    <section className="hero-carousel-section">
      <div
        className="hero-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        aria-roledescription="carousel"
        aria-label="Amraj banners"
      >
        <div ref={trackRef} className="hero-carousel-track" onScroll={onScroll}>
          {BANNERS.map((banner, i) => (
            <div
              key={banner.src}
              className="hero-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${BANNERS.length}`}
            >
              {/* Blurred copy fills the letterbox so the two different banner ratios both sit cleanly. */}
              <Image src={banner.src} alt="" aria-hidden className="hero-carousel-bleed" fill sizes="100vw" priority={i === 0} />
              <Image
                src={banner.src}
                alt={banner.alt}
                className="hero-carousel-img"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <button type="button" className="hero-carousel-nav" style={{ left: 14 }} onClick={() => goTo(current - 1)} aria-label="Previous banner">
          <ChevronLeft size={20} />
        </button>
        <button type="button" className="hero-carousel-nav" style={{ right: 14 }} onClick={() => goTo(current + 1)} aria-label="Next banner">
          <ChevronRight size={20} />
        </button>

        <div className="hero-carousel-dots">
          {BANNERS.map((banner, i) => (
            <button
              key={banner.src}
              type="button"
              className="hero-carousel-dot"
              aria-current={i === current}
              aria-label={`Go to banner ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .hero-carousel-section {
          background: linear-gradient(170deg, #ffffff 0%, #f2faf8 60%, #f6f8f7 100%);
          padding: 26px 24px 34px;
        }
        .hero-carousel {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e9eaee;
          box-shadow: 0 18px 50px rgba(16, 24, 40, 0.10);
        }
        .hero-carousel-track {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .hero-carousel-track::-webkit-scrollbar { display: none; }
        .hero-carousel-slide {
          position: relative;
          flex: 0 0 100%;
          aspect-ratio: 1600 / 560;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          overflow: hidden;
        }
        .hero-carousel-bleed {
          object-fit: cover;
          transform: scale(1.2);
          filter: blur(34px) saturate(1.15);
        }
        .hero-carousel-img { object-fit: contain; }

        .hero-carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(16, 24, 40, 0.08);
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(6px);
          color: #17191f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(16, 24, 40, 0.14);
          opacity: 0;
          transition: opacity 0.25s, background 0.2s;
          z-index: 3;
        }
        .hero-carousel:hover .hero-carousel-nav,
        .hero-carousel-nav:focus-visible { opacity: 1; }
        .hero-carousel-nav:hover { background: #fff; }
        @media (hover: none) { .hero-carousel-nav { display: none; } }

        .hero-carousel-dots {
          position: absolute;
          bottom: 14px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 7px;
          z-index: 3;
        }
        .hero-carousel-dot {
          width: 8px;
          height: 8px;
          padding: 0;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          background: rgba(23, 25, 31, 0.24);
          box-shadow: 0 1px 4px rgba(255, 255, 255, 0.7);
          transition: width 0.3s, background 0.3s;
        }
        .hero-carousel-dot[aria-current='true'] { width: 26px; background: #0D9488; }

        @media (max-width: 900px) {
          .hero-carousel-section { padding: 16px 16px 24px; }
          .hero-carousel { border-radius: 18px; }
        }
        @media (max-width: 600px) {
          .hero-carousel-section { padding: 10px 12px 18px; }
          .hero-carousel { border-radius: 14px; }
          .hero-carousel-slide { aspect-ratio: 1600 / 600; }
          .hero-carousel-dots { bottom: 9px; }
          .hero-carousel-dot { width: 6px; height: 6px; }
          .hero-carousel-dot[aria-current='true'] { width: 20px; }
        }
      `}</style>
    </section>
  );
}
