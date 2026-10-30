'use client';

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Play, Volume2, VolumeX, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductVideo } from '../../lib/videos';
import { getProductBySlug } from '../../lib/products-data';
import { useCart } from '../../lib/cart';
import { toast } from '../../hooks/use-toast';
import { registerVideo, refresh, toggleVideo, setMuted, getMuted, subscribeMuted } from './playback';

const INK = '#17191f';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';

/* ── ONE REEL ── */
function ReelCard({ video, showProduct }: { video: ProductVideo; showProduct: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const muted = useSyncExternalStore(subscribeMuted, getMuted, () => true);
  const { addToCart } = useCart();
  const product = getProductBySlug(video.productSlug);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const unregister = registerVideo(el);

    // Attach the source only when the card is close to the viewport — no video bytes before then.
    const nearObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          nearObs.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    nearObs.observe(el);

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => el.duration && setProgress(el.currentTime / el.duration);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('timeupdate', onTime);
    return () => {
      nearObs.disconnect();
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('timeupdate', onTime);
      unregister();
    };
  }, []);

  // The source was just attached — if this card is the most visible one, start it now.
  useEffect(() => {
    if (near) refresh();
  }, [near]);

  const onMute = () => {
    const el = ref.current;
    setMuted(!muted);
    if (el?.paused) toggleVideo(el);
  };

  const onAdd = () => {
    if (!product) return;
    addToCart({ id: product.id, name: product.name, price: product.price.toString(), regular_price: product.regularPrice.toString(), images: product.images.map((src) => ({ src })) });
    toast({ title: 'Added to Cart', description: `${product.shortName} added to your cart.` });
  };

  return (
    <div className="reel-card">
      <video
        ref={ref}
        src={near ? video.src : undefined}
        poster={video.poster}
        preload="none"
        muted
        loop
        playsInline
        aria-label={video.title}
        className="reel-video"
      />

      {/* Whole card toggles play/pause */}
      <button
        type="button"
        className="reel-hit"
        onClick={() => ref.current && toggleVideo(ref.current)}
        aria-label={playing ? `Pause: ${video.title}` : `Play: ${video.title}`}
      >
        {!playing && (
          <span className="reel-play" aria-hidden>
            <Play size={24} fill="#fff" />
          </span>
        )}
      </button>

      <button type="button" className="reel-mute" onClick={onMute} aria-label={muted ? 'Unmute' : 'Mute'} aria-pressed={!muted}>
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <div className="reel-progress" aria-hidden>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      {showProduct && product && (
        <div className="reel-product">
          <Link href={`/product/${product.slug}`} className="reel-product-link">
            <span className="reel-product-name">{product.name}</span>
            <span className="reel-product-price">
              ₹{product.price.toLocaleString()}
              <s>₹{product.regularPrice.toLocaleString()}</s>
            </span>
          </Link>
          <button type="button" className="reel-add" onClick={onAdd} aria-label={`Add ${product.name} to cart`}>
            <ShoppingCart size={16} />
            <span>Add</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── HORIZONTAL STRIP ── */
export default function ReelsStrip({ videos, showProduct = true }: { videos: ProductVideo[]; showProduct?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  // Arrows only when there is something to scroll to.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [videos.length]);

  if (videos.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="reels">
      <div ref={trackRef} className="reels-track" role="list">
        {videos.map((v) => (
          <div key={v.id} role="listitem" className="reels-item">
            <ReelCard video={v} showProduct={showProduct} />
          </div>
        ))}
      </div>
      {overflows && (
        <>
          <button type="button" className="reels-nav" style={{ left: -6 }} onClick={() => scrollBy(-1)} aria-label="Previous videos">
            <ChevronLeft size={20} />
          </button>
          <button type="button" className="reels-nav" style={{ right: -6 }} onClick={() => scrollBy(1)} aria-label="Next videos">
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <style>{`
        .reels { position: relative; }
        .reels-track {
          display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory;
          padding: 4px 2px 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch;
        }
        .reels-track::-webkit-scrollbar { display: none; }
        .reels-item { flex: 0 0 calc((100% - 48px) / 4); min-width: 220px; scroll-snap-align: start; }
        .reel-card {
          position: relative; aspect-ratio: 9 / 16; border-radius: 18px; overflow: hidden;
          background: #0f1114; box-shadow: 0 2px 16px rgba(16,24,40,0.08);
        }
        .reel-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .reel-hit {
          position: absolute; inset: 0; border: 0; padding: 0; background: transparent; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }
        .reel-hit:focus-visible, .reel-mute:focus-visible, .reel-add:focus-visible, .reel-product-link:focus-visible, .reels-nav:focus-visible {
          outline: 3px solid #fff; outline-offset: -3px; box-shadow: 0 0 0 5px ${ACCENT};
        }
        .reel-play {
          width: 56px; height: 56px; border-radius: 999px; background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center; color: #fff; padding-left: 3px;
          backdrop-filter: blur(4px);
        }
        .reel-mute {
          position: absolute; top: 10px; right: 10px; width: 44px; height: 44px; border-radius: 999px;
          border: 0; background: rgba(0,0,0,0.5); color: #fff; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
        }
        .reel-progress { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: rgba(255,255,255,0.25); }
        .reel-progress span { display: block; height: 100%; background: #fff; transform-origin: left; }
        .reel-product {
          position: absolute; left: 0; right: 0; bottom: 0; padding: 40px 12px 12px;
          background: linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0));
          display: flex; align-items: flex-end; gap: 8px;
        }
        .reel-product-link { flex: 1; min-width: 0; color: #fff; text-decoration: none; min-height: 44px; display: flex; flex-direction: column; justify-content: flex-end; }
        .reel-product-name { font-size: 13.5px; font-weight: 700; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .reel-product-price { font-size: 14px; font-weight: 700; margin-top: 2px; }
        .reel-product-price s { font-size: 12px; font-weight: 500; opacity: 0.75; margin-left: 6px; }
        .reel-add {
          flex-shrink: 0; height: 44px; padding: 0 14px; border-radius: 12px; border: 0;
          background: ${ACCENT_DK}; color: #fff; font-size: 13.5px; font-weight: 700; font-family: inherit;
          display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
        }
        .reel-add:hover { background: ${ACCENT}; }
        .reels-nav {
          position: absolute; top: 45%; transform: translateY(-50%); width: 44px; height: 44px;
          border-radius: 999px; border: 1px solid rgba(16,24,40,0.08); background: #fff; color: ${INK};
          display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;
          box-shadow: 0 4px 14px rgba(16,24,40,0.14);
        }
        @media (hover: none) { .reels-nav { display: none; } }
        @media (max-width: 900px) { .reels-item { flex-basis: calc((100% - 32px) / 3); } }
        @media (max-width: 600px) {
          .reels-track { gap: 12px; }
          .reels-item { flex-basis: 64%; min-width: 0; }
        }
      `}</style>
    </div>
  );
}
