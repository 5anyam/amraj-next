'use client';

import React, { useState, useRef } from 'react';
import { PlayIcon } from '@heroicons/react/24/outline';

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

const mediaData: Record<string, MediaItem[]> = {
  'prostate-care': [
    { id: 'pc-video-1', type: 'video', src: 'https://youtube.com/shorts/78N-odODcWk', customerName: 'Rajesh Kumar', customerLocation: 'Delhi', title: 'Amazing Results in 3 Weeks!', description: 'My night urination reduced significantly after using Amraj Prostate Care.' },
    { id: 'pc-image-1', type: 'image', src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_0976-scaled.jpg', customerName: 'Rudra', customerLocation: 'Delhi', title: 'Lab Report Improvement', description: 'My PSA levels improved dramatically with consistent use.' }
  ],
  'weight-management': [
    { id: 'wm-video-1', type: 'video', src: 'https://youtube.com/shorts/eFe_floNWxU', customerName: 'Vanshika Tyagi', customerLocation: 'Delhi', title: 'Lost 15 KG in 3 Months!', description: 'Incredible weight loss journey with Amraj Weight Management Pro+.' },
    { id: 'wm-image-1', type: 'image', src: '/images/weight-before-after-1.jpg', customerName: 'Rohit Gupta', customerLocation: 'Delhi', title: 'Transformation Photo', description: 'From 85kg to 72kg in just 4 months!' }
  ],
  'liver-detox': [
    { id: 'ld-video-1', type: 'video', src: 'https://youtube.com/shorts/865MxbjZCSU', customerName: 'Vanshika Tyagi', customerLocation: 'Delhi', title: 'Fatty Liver Reversed', description: 'My fatty liver condition improved significantly in 2 months.' },
    { id: 'ld-video-2', type: 'video', src: 'https://youtube.com/shorts/uA-nYNBfm1I', customerName: 'Hritik Tyagi', customerLocation: 'Delhi', title: 'Medical Reports', description: 'Liver function tests showed remarkable improvement.' },
    { id: 'ld-video-3', type: 'video', src: 'https://youtube.com/shorts/Xzyhd1kE1jc', customerName: 'Vikas Yadav', customerLocation: 'Delhi', title: 'Medical Reports', description: 'Liver function tests showed remarkable improvement.' },
    { id: 'ld-video-4', type: 'video', src: 'https://youtube.com/shorts/K2yZheyW3GY', customerName: 'Vikas Yadav', customerLocation: 'Jaipur', title: 'Medical Reports', description: 'Liver function tests showed remarkable improvement.' }
  ]
};

const defaultMedia: MediaItem[] = [
  { id: 'default-1', type: 'image', src: '/images/happy-customer.jpg', customerName: 'Satisfied Customer', customerLocation: 'India', title: 'Great Product Quality', description: 'Excellent results with consistent use. Highly recommended!' }
];

const CustomerMedia: React.FC<CustomerMediaProps> = ({ productSlug }) => {
  const [playingById, setPlayingById] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const extractYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (url.includes('shorts/')) {
        const pathParts = urlObj.pathname.split('/');
        const shortsIndex = pathParts.indexOf('shorts');
        return shortsIndex !== -1 && pathParts[shortsIndex + 1] ? pathParts[shortsIndex + 1] : null;
      }
      if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1);
      if (urlObj.searchParams.has('v')) return urlObj.searchParams.get('v');
      return null;
    } catch {
      return null;
    }
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0` : null;
    // Note: Shorts IDs work with /embed/{id}
  };

  const getMedia = (): MediaItem[] => {
    if (mediaData[productSlug]) return mediaData[productSlug];
    const slugKey = Object.keys(mediaData).find(key => productSlug.includes(key) || key.includes(productSlug.split('-')[0]));
    if (slugKey) return mediaData[slugKey];
    return defaultMedia;
  };

  const allMedia = getMedia();

  const handleCardClick = (media: MediaItem) => {
    if (media.type !== 'video') return;
    // Ensure only the clicked one plays; stop others
    setPlayingById({ [media.id]: true });
    // Pause all other native videos
    Object.entries(videoRefs.current).forEach(([id, v]) => {
      if (id !== media.id) { try { v?.pause(); } catch {} }
    });
    if (!media.src.includes('youtube.com')) {
      const v = videoRefs.current[media.id];
      v?.play?.().catch(() => {});
    }
  };

  if (allMedia.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allMedia.map((media) => {
            const isYouTubeVideo = media.type === 'video' && media.src.includes('youtube.com');
            const thumbnailUrl = isYouTubeVideo ? getYouTubeThumbnail(media.src) : media.thumbnail;
            const isPlaying = !!playingById[media.id];

            return (
              <div
                key={media.id}
                className={`group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${media.type === 'video' ? 'cursor-pointer' : ''} overflow-hidden`}
                onClick={() => handleCardClick(media)}
              >
                <div className="relative overflow-hidden rounded-t-2xl bg-white" style={{ aspectRatio: '9 / 16' }}>
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-teal-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                    {media.type === 'video' ? '🎥 Video' : '📸 Photo'}
                  </div>

                  {media.type === 'video' ? (
                    isYouTubeVideo ? (
                      isPlaying ? (
                        <iframe
                          src={getYouTubeEmbedUrl(media.src) || ''}
                          title={media.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full rounded-t-2xl"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <img
                            src={thumbnailUrl || '/placeholder-video.jpg'}
                            alt={media.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                              <PlayIcon className="h-8 w-8 text-teal-600" />
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          ref={(el) => { videoRefs.current[media.id] = el; }}
                          className="w-full h-full object-cover"
                          src={media.src}
                          muted={!isPlaying}
                          preload="metadata"
                          poster={media.thumbnail}
                          controls={isPlaying}
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
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                              <PlayIcon className="h-8 w-8 text-teal-600" />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center">
                      <img src={media.src} alt={media.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="text-sm font-semibold text-gray-800">{media.title}</div>
                  <div className="text-xs text-gray-500">
                    {media.customerName}{media.customerLocation ? ` • ${media.customerLocation}` : ''}
                  </div>
                  {media.description && <div className="text-xs text-gray-600 mt-1 line-clamp-2">{media.description}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerMedia;
