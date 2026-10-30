'use client';

/* Sitewide video coordinator.
   - Only one video plays at a time: starting one pauses every other.
   - Scroll-driven: the most visible video (≥60% on screen) autoplays; a video that
     scrolls away pauses.
   - A video the user paused stays paused until it leaves the screen and comes back.
   - Mute is one shared setting, so unmuting carries over to the next reel.
   - Reduced-motion and Save-Data users get no autoplay — tap to play only. */

const PLAY_RATIO = 0.6;
const RESET_RATIO = 0.2;

interface Entry {
  ratio: number;
  userPaused: boolean;
}

const entries = new Map<HTMLVideoElement, Entry>();
let active: HTMLVideoElement | null = null;
let muted = true;
const muteListeners = new Set<() => void>();

let autoplayAllowed: boolean | null = null;
function canAutoplay() {
  if (autoplayAllowed === null) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    autoplayAllowed = !reduce && !saveData;
  }
  return autoplayAllowed;
}

function start(el: HTMLVideoElement) {
  for (const other of entries.keys()) if (other !== el && !other.paused) other.pause();
  active = el;
  el.muted = muted;
  el.play().catch(() => {
    // Unmuted autoplay can be blocked until the user interacts — fall back to muted.
    if (!el.muted) {
      setMuted(true);
      el.play().catch(() => {});
    } else if (active === el) {
      // No source attached yet — let the next refresh() retry.
      active = null;
    }
  });
}

function reconcile() {
  if (!canAutoplay()) return;
  let best: HTMLVideoElement | null = null;
  let bestRatio = PLAY_RATIO;
  for (const [el, e] of entries) {
    if (!e.userPaused && e.ratio >= bestRatio && (best === null || e.ratio > bestRatio)) {
      best = el;
      bestRatio = e.ratio;
    }
  }
  if (best && (best !== active || best.paused)) start(best);
}

/** A video started by any means (native controls included) pauses all others. */
function onPlay(e: Event) {
  const el = e.currentTarget as HTMLVideoElement;
  for (const other of entries.keys()) if (other !== el && !other.paused) other.pause();
  active = el;
}

/* One observer for every video, so a scroll updates all ratios in one batch before
   deciding what plays — per-video observers decided on stale ratios. */
let observer: IntersectionObserver | null = null;
function getObserver() {
  observer ??= new IntersectionObserver(
    (changes) => {
      for (const c of changes) {
        const el = c.target as HTMLVideoElement;
        const e = entries.get(el);
        if (!e) continue;
        e.ratio = c.intersectionRatio;
        if (e.ratio < RESET_RATIO) e.userPaused = false;
        if (e.ratio < PLAY_RATIO && !el.paused) el.pause();
      }
      reconcile();
    },
    { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
  );
  return observer;
}

export function registerVideo(el: HTMLVideoElement) {
  entries.set(el, { ratio: 0, userPaused: false });
  el.addEventListener('play', onPlay);
  getObserver().observe(el);
  return () => {
    observer?.unobserve(el);
    el.removeEventListener('play', onPlay);
    entries.delete(el);
    if (active === el) active = null;
  };
}

/** Re-run the autoplay decision, e.g. once a lazily attached source is in place. */
export const refresh = () => reconcile();

/** Tap on a video: play it (pausing the rest) or pause it. */
export function toggleVideo(el: HTMLVideoElement) {
  const e = entries.get(el);
  if (el.paused) {
    if (e) e.userPaused = false;
    start(el);
  } else {
    el.pause();
    if (e) e.userPaused = true;
  }
}

export function setMuted(next: boolean) {
  muted = next;
  if (active) active.muted = next;
  muteListeners.forEach((fn) => fn());
}

export const getMuted = () => muted;

export function subscribeMuted(fn: () => void) {
  muteListeners.add(fn);
  return () => {
    muteListeners.delete(fn);
  };
}
