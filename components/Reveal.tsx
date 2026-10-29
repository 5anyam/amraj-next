'use client';

import React, { useEffect, useRef, useState } from 'react';

type Variant = 'up' | 'fade' | 'blur' | 'stagger';

interface RevealProps {
  children: React.ReactNode;
  /**
   * up      — rises and fades in (default, good for cards & blocks)
   * fade    — cross-fades only, no movement
   * blur    — rises out of a soft blur; reads best on headings
   * stagger — direct children cascade in one after another
   */
  variant?: Variant;
  /** Extra delay in ms before this block starts animating. */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  /** How much of the block must be on screen before it plays (0–1). */
  threshold?: number;
}

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  style,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Assume visible when IntersectionObserver is unavailable, so content is never stuck hidden.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect(); // play once — no re-hiding on scroll back up
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const base = variant === 'stagger' ? 'reveal-stagger' : `reveal reveal-${variant}`;

  return (
    <div
      ref={ref}
      className={`${base}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { ...style, '--reveal-delay': `${delay}ms` } as React.CSSProperties : style}
    >
      {children}
    </div>
  );
}
