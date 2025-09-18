'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

interface MediaItem {
  id: string;
  type: 'video' | 'image';
  src: string;
  thumbnail?: string;
  customerName: string;
  customerLocation?: string;
  title: string;
  description?: string;
}

interface CustomerMediaProps {
  productSlug: string;
}

// Media Data for different products (same as before)
const mediaData: Record<string, MediaItem[]> = {
  'prostate-care': [
    {
      id: 'pc-video-1',
      type: 'video',
      src: 'https://youtube.com/shorts/P432UdyYQ4w?feature=share',
      customerName: 'Deepika Sharma',
      customerLocation: 'Delhi',
      title: 'Amazing Results in 3 Weeks!',
      description: 'My night urination reduced significantly after using Amraj Prostate Care.'
    },
    {
      id: 'pc-image-1',
      type: 'image',
      src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_0976-scaled.jpg',
      customerName: 'Rudra',
      customerLocation: 'Delhi',
      title: 'Lab Report Improvement',
      description: 'My PSA levels improved dramatically with consistent use.'
    },
    {
      id: 'pc-video-2',
      type: 'video',
      src: 'https://youtube.com/shorts/aHRxvoavSGY?feature=share',
      customerName: 'Rajesh Kumar',
      customerLocation: 'Delhi',
      title: 'Amazing Results in 3 Weeks!',
      description: 'My night urination reduced significantly after using Amraj Prostate Care.'
    }
  ],
  'weight-management': [
    {
      id: 'wm-video-1',
      type: 'video',
      src: 'https://youtube.com/shorts/eFe_floNWxU',
      customerName: 'Vanshika Tyagi',
      customerLocation: 'Delhi',
      title: 'Lost 15 KG in 3 Months!',
      description: 'Incredible weight loss journey with Amraj Weight Management Pro+.'
    },
    {
      id: 'wm-image-1',
      type: 'image',
      src: '/images/weight-before-after-1.jpg',
      customerName: 'Rohit Gupta',
      customerLocation: 'Delhi',
      title: 'Transformation Photo',
      description: 'From 85kg to 72kg in just 4 months!'
    }
  ],
  'liver-detox': [
    {
      id: 'ld-video-1',
      type: 'video',
      src: 'https://youtube.com/shorts/865MxbjZCSU',
      customerName: 'Vanshika Tyagi',
      customerLocation: 'Delhi',
      title: 'Fatty Liver Reversed',
      description: 'My fatty liver condition improved significantly in 2 months.'
    },
    {
      id: 'ld-video-2',
      type: 'video',
      src: 'https://youtube.com/shorts/uA-nYNBfm1I',
      customerName: 'Hritik Tyagi',
      customerLocation: 'Delhi',
      title: 'Medical Reports',
      description: 'Liver function tests showed remarkable improvement.'
    },
    {
      id: 'ld-video-3',
      type: 'video',
      src: 'https://youtube.com/shorts/Xzyhd1kE1jc',
      customerName: 'Vikas Yadav',
      customerLocation: 'Delhi',
      title: 'Medical Reports',
      description: 'Liver function tests showed remarkable improvement.'
    },
    {
      id: 'ld-video-4',
      type: 'video',
      src: 'https://youtube.com/shorts/K2yZheyW3GY',
      customerName: 'Vikas Yadav',
      customerLocation: 'Jaipur',
      title: 'Medical Reports',
      description: 'Liver function tests showed remarkable improvement.'
    }
  ]
};

const defaultMedia: MediaItem[] = [
  {
    id: 'default-1',
    type: 'image',
    src: '/images/happy-customer.jpg',
    customerName: 'Satisfied Customer',
    customerLocation: 'India',
    title: 'Great Product Quality',
    description: 'Excellent results with consistent use. Highly recommended!'
  }
];

const CustomerMedia: React.FC<CustomerMediaProps> = ({ productSlug }) => {
  const [clickedVideo, setClickedVideo] = useState<string | null>(null);
  const [autoplayVideos, setAutoplayVideos] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const iframeRefs = useRef<{ [key: string]: HTMLIFrameElement | null }>({});

  const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (url.includes('shorts/')) {
        const p = urlObj.pathname.split('/');
        const i = p.indexOf('shorts');
        return i !== -1 && p[i + 1] ? p[i + 1] : null;
      }
      if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
      if (urlObj.searchParams.has('v')) return urlObj.searchParams.get('v');
      return null;
    } catch {
      return null;
    }
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const id = extractYouTubeVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  };

  // YouTube embed URL without controls and muted for autoplay
  const getYouTubeEmbedAutoplayUrl = (url: string): string | null => {
    const id = extractYouTubeVideoId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&loop=1&playlist=${id}&playsinline=1`
      : null;
  };

  // ✅ Updated: YouTube embed URL with controls AND AUDIO for clicked videos
  const getYouTubeEmbedClickUrl = (url: string): string | null => {
    const id = extractYouTubeVideoId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&fs=1&playsinline=1&mute=0`
      : null; // ← Removed mute=1, added mute=0 to explicitly enable audio
  };

  const getMedia = (): MediaItem[] => {
    if (mediaData[productSlug]) return mediaData[productSlug];
    const slugKey = Object.keys(mediaData).find(
      key => productSlug.includes(key) || key.includes(productSlug.split('-')[0])
    );
    return slugKey ? mediaData[slugKey] : defaultMedia;
  };

  const allMedia = getMedia();

  // Auto-start YouTube videos on component mount
  useEffect(() => {
    const startAutoplay = () => {
      const newAutoplayVideos: Record<string, boolean> = {};
      allMedia.forEach((media) => {
        if (media.type === 'video' && media.src.includes('youtube.com')) {
          newAutoplayVideos[media.id] = true;
        }
      });
      setAutoplayVideos(newAutoplayVideos);
    };

    // Delay to ensure DOM is ready
    const timer = setTimeout(startAutoplay, 500);
    return () => clearTimeout(timer);
  }, [allMedia]);

  const handleCardClick = (media: MediaItem) => {
    if (media.type !== 'video') return;

    if (media.src.includes('youtube.com')) {
      // ✅ For YouTube videos, switch to controls version WITH AUDIO
      setClickedVideo(media.id);
    } else {
      // For regular videos, unmute and play with controls
      const video = videoRefs.current[media.id];
      if (video) {
        video.muted = false;
        video.controls = true;
        video.play().catch(() => {});
      }
    }
  };

  if (allMedia.length === 0) return null;

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header with customer stories title */}
      <div className="bg-gradient-to-r from-teal-500 to-orange-500 p-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-white text-center">
          Customer Stories & Results
        </h2>
        <p className="text-teal-100 text-center mt-2">
          Real customers sharing their experiences
        </p>
      </div>

      <div className="p-6">
        {/* Grid: 2 on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {allMedia.map((media) => {
            const isYouTubeVideo = media.type === 'video' && media.src.includes('youtube.com');
            const isClicked = clickedVideo === media.id;
            const shouldAutoplay = autoplayVideos[media.id] && !isClicked;
            const thumbnailUrl = isYouTubeVideo ? getYouTubeThumbnail(media.src) : media.thumbnail;

            return (
              <article
                key={media.id}
                className={`group rounded-2xl overflow-hidden border border-gray-200 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl ${
                  media.type === 'video' ? 'cursor-pointer' : ''
                } bg-white relative`}
                onClick={() => handleCardClick(media)}
              >
                {/* ✅ Audio indicator for clicked videos */}
                {isClicked && isYouTubeVideo && (
                  <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <SpeakerWaveIcon className="h-3 w-3" />
                    Audio ON
                  </div>
                )}

                {/* Media container with 9:16 aspect ratio */}
                <div className="relative w-full" style={{ aspectRatio: '9 / 16' }}>
                  {media.type === 'video' ? (
                    isYouTubeVideo ? (
                      shouldAutoplay || isClicked ? (
                        <iframe
                          ref={(el) => {
                            iframeRefs.current[media.id] = el;
                          }}
                          src={
                            isClicked
                              ? getYouTubeEmbedClickUrl(media.src) || ''
                              : getYouTubeEmbedAutoplayUrl(media.src) || ''
                          }
                          title={media.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                          style={{ border: 'none' }}
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={thumbnailUrl || '/placeholder-video.jpg'}
                            alt={media.title}
                            className="w-full h-full object-cover transform-gpu group-hover:scale-[1.03] transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/95 shadow-lg ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-200">
                                <PlayIcon className="h-6 w-6 text-teal-600" />
                              </span>
                              {/* ✅ Audio hint on hover */}
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                Click for audio
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          ref={(el) => {
                            videoRefs.current[media.id] = el;
                          }}
                          className="w-full h-full object-cover"
                          src={media.src}
                          muted
                          autoPlay
                          loop
                          preload="metadata"
                          poster={media.thumbnail}
                          playsInline
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/95 shadow-lg ring-1 ring-black/5">
                            <PlayIcon className="h-6 w-6 text-teal-600" />
                          </span>
                        </div>
                      </div>
                    )
                  ) : (
                    <img
                      src={media.src}
                      alt={media.title}
                      className="w-full h-full object-cover transform-gpu group-hover:scale-[1.03] transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state */}
        {allMedia.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No customer stories yet</h3>
            <p className="text-gray-500">Check back later for amazing customer experiences!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerMedia;
