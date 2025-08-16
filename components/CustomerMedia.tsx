'use client';

import React, { useState, useRef } from 'react';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
  productName: string;
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
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
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
      
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      
      if (urlObj.searchParams.has('v')) {
        return urlObj.searchParams.get('v');
      }
      
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
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1` : null;
  };

  const getMedia = (): MediaItem[] => {
    if (mediaData[productSlug]) {
      return mediaData[productSlug];
    }

    const slugKey = Object.keys(mediaData).find(key => 
      productSlug.includes(key) || key.includes(productSlug.split('-')[0])
    );

    if (slugKey) {
      return mediaData[slugKey];
    }

    return defaultMedia;
  };

  const allMedia = getMedia();

  const openModal = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  if (allMedia.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMedia.map((media) => {
              const isYouTubeVideo = media.type === 'video' && media.src.includes('youtube.com');
              const thumbnailUrl = isYouTubeVideo ? getYouTubeThumbnail(media.src) : media.thumbnail;

              return (
                <div
                  key={media.id}
                  className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer overflow-hidden"
                  onClick={() => openModal(media)}
                >
                  <div className="relative overflow-hidden rounded-t-2xl bg-white" style={{ aspectRatio: '9 / 16' }}>
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-teal-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                      {media.type === 'video' ? '🎥 Video' : '📸 Photo'}
                    </div>

                    {media.type === 'video' ? (
                      isYouTubeVideo ? (
                        <div className="relative w-full h-full">
                          <img
                            src={thumbnailUrl || '/placeholder-video.jpg'}
                            alt={media.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
                            <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                              <PlayIcon className="h-8 w-8 text-teal-600" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            ref={(el) => {
                              videoRefs.current[media.id] = el;
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            src={media.src}
                            muted
                            preload="metadata"
                            poster={media.thumbnail}
                            onMouseEnter={(e) => {
                              e.currentTarget.currentTime = 0;
                              e.currentTarget.play().catch(() => {});
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(media);
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
                            <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                              <PlayIcon className="h-8 w-8 text-teal-600" />
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={media.src}
                          alt={media.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all duration-300 z-10"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>

            <div className="p-6">
              {selectedMedia.type === 'video' ? (
                selectedMedia.src.includes('youtube.com') ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedMedia.src) || ''}
                    title={selectedMedia.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-[60vh] rounded-xl"
                  />
                ) : (
                  <video
                    controls
                    className="w-full max-h-[60vh] rounded-xl"
                    src={selectedMedia.src}
                    poster={selectedMedia.thumbnail}
                    preload="metadata"
                    autoPlay={false}
                  >
                    <source src={selectedMedia.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.title}
                  className="w-full max-h-[60vh] object-contain rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerMedia;
