'use client';

import React, { useRef, useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';

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

// Media Data for different products
const mediaData: Record<string, MediaItem[]> = {
  'prostate-care': [
    {
      id: 'pc-video-1',
      type: 'video',
      src: 'https://youtube.com/shorts/78N-odODcWk',
      customerName: 'Rajesh Kumar',
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
  // Track which media is “playing” inline
  const [playingById, setPlayingById] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

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

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const id = extractYouTubeVideoId(url);
    // Minimize branding; full removal not allowed by YouTube ToS
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&fs=1`
      : null;
  };

  const getMedia = (): MediaItem[] => {
    if (mediaData[productSlug]) return mediaData[productSlug];
    const slugKey = Object.keys(mediaData).find(
      key => productSlug.includes(key) || key.includes(productSlug.split('-')[0])
    );
    return slugKey ? mediaData[slugKey] : defaultMedia;
  };

  const allMedia = getMedia();

  const handleCardClick = (media: MediaItem) => {
    if (media.type !== 'video') return;
    // Play only clicked one; stop others
    setPlayingById({ [media.id]: true });
    Object.entries(videoRefs.current).forEach(([id, v]) => {
      if (id !== media.id) {
        try {
          v?.pause();
        } catch {}
      }
    });
    if (!media.src.includes('youtube.com')) {
      const v = videoRefs.current[media.id];
      v?.play?.().catch(() => {});
    }
  };

  if (allMedia.length === 0) return null;

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Grid: 2 on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {allMedia.map((media) => {
            const isYouTubeVideo = media.type === 'video' && media.src.includes('youtube.com');
            const isPlaying = !!playingById[media.id];
            const thumbnailUrl = isYouTubeVideo ? getYouTubeThumbnail(media.src) : media.thumbnail;

            return (
              <article
                key={media.id}
                className={`group rounded-2xl overflow-hidden border border-gray-200 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl ${
                  media.type === 'video' ? 'cursor-pointer' : ''
                } bg-white`}
                onClick={() => handleCardClick(media)}
              >
                {/* Compact height for smaller cards */}
                <div className="relative w-full h-[300px] sm:h-[320px] lg:h-[260px]">
                  {media.type === 'video' ? (
                    isYouTubeVideo ? (
                      isPlaying ? (
                        <iframe
                          src={getYouTubeEmbedUrl(media.src) || ''}
                          title={media.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={thumbnailUrl || '/placeholder-video.jpg'}
                            alt={media.title}
                            className="w-full h-full object-cover transform-gpu group-hover:scale-[1.03] transition-transform duration-300"
                            loading="lazy"
                          />
                          {/* Clean play button (no black overlay) */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/95 shadow-lg ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-200">
                              <PlayIcon className="h-6 w-6 text-teal-600" />
                            </span>
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
                          muted={!isPlaying}
                          preload="metadata"
                          poster={media.thumbnail}
                          controls={isPlaying}
                          playsInline
                          onMouseEnter={(e) => {
                            if (!isPlaying) {
                              e.currentTarget.currentTime = 0;
                              e.currentTarget.play().catch(() => {});
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isPlaying) {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {!isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/95 shadow-lg ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-200">
                              <PlayIcon className="h-6 w-6 text-teal-600" />
                            </span>
                          </div>
                        )}
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

                {/* Meta (tighter spacing) */}
                <div className="p-3">
                  <div className="text-sm font-semibold text-gray-900">{media.title}</div>
                  <div className="text-xs text-gray-500">
                    {media.customerName}
                    {media.customerLocation ? ` • ${media.customerLocation}` : ''}
                  </div>
                  {media.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{media.description}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CustomerMedia;
