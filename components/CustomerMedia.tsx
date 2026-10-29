'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

// Define the VideoState interface to avoid 'any'
interface VideoState {
  isClicked: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  showAutoplay: boolean;
}

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

// Media Data (Keep your existing data structure)
const mediaData: Record<string, MediaItem[]> = {
  'prostate-care': [
    {
      id: 'pc-video-1',
      type: 'video',
      src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_9043.mp4',
      customerName: 'Rajendra Singh',
      customerLocation: 'Delhi',
      title: 'Amazing Results',
      description: 'Reduced night urination.'
    },
    {
      id: 'pc-video-2',
      type: 'video',
      src: 'https://youtube.com/shorts/P432UdyYQ4w?feature=share',
      customerName: 'Ritika Gupta',
      customerLocation: 'Delhi',
      title: 'Testimonial',
      description: 'Great results.'
    },
    {
      id: 'pc-image-1',
      type: 'image',
      src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_0976-scaled.jpg',
      customerName: 'Rudra',
      customerLocation: 'Delhi',
      title: 'Lab Report',
      description: 'PSA levels improved.'
    },
    {
      id: 'pc-video-3',
      type: 'video',
      src: 'https://youtube.com/shorts/aHRxvoavSGY?feature=share',
      customerName: 'Rajesh Kumar',
      customerLocation: 'Delhi',
      title: 'Review',
      description: 'Highly recommended.'
    },
  ],
  'weight-management': [
     {
       id: 'wm-video-1',
       type: 'video',
       src: 'https://youtube.com/shorts/eFe_floNWxU',
       customerName: 'Vanshika',
       customerLocation: 'Delhi',
       title: 'Lost 15kg',
       description: 'Incredible journey.'
     },
     {
       id: 'wm-image-1',
       type: 'image',
       src: '/images/weight-before-after-1.jpg',
       customerName: 'Rohit',
       customerLocation: 'Delhi',
       title: 'Transformation',
       description: '85kg to 72kg.'
     }
  ],
  'liver-detox': [
     {
       id: 'ld-video-1',
       type: 'video',
       src: 'https://youtube.com/shorts/865MxbjZCSU',
       customerName: 'Vanshika',
       customerLocation: 'Delhi',
       title: 'Liver Health',
       description: 'Fatty liver reversed.'
     },
     {
       id: 'ld-video-2',
       type: 'video',
       src: 'https://youtube.com/shorts/uA-nYNBfm1I',
       customerName: 'Hritik',
       customerLocation: 'Delhi',
       title: 'Reports',
       description: 'Better liver function.'
     },
     {
       id: 'ld-video-3',
       type: 'video',
       src: 'https://youtube.com/shorts/Xzyhd1kE1jc',
       customerName: 'Vikas',
       customerLocation: 'Delhi',
       title: 'Feedback',
       description: 'Great product.'
     },
     {
       id: 'ld-video-4',
       type: 'video',
       src: 'https://youtube.com/shorts/K2yZheyW3GY',
       customerName: 'Vikas',
       customerLocation: 'Jaipur',
       title: 'Result',
       description: 'Amazing improvement.'
     }
  ]
};

const defaultMedia: MediaItem[] = [
  {
    id: 'default-1',
    type: 'image',
    src: '/placeholder.jpg',
    customerName: 'Amraj Customer',
    customerLocation: 'India',
    title: 'Happy Customer',
    description: 'Great results.'
  }
];

const CustomerMedia: React.FC<CustomerMediaProps> = ({ productSlug }) => {
  // ✅ FIXED: Using the interface instead of generic object
  const [videoStates, setVideoStates] = useState<Record<string, VideoState>>({});
  
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
    } catch { return null; }
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const id = extractYouTubeVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
  };

  const getYouTubeEmbedAutoplayUrl = (url: string): string | null => {
    const id = extractYouTubeVideoId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&loop=1&playlist=${id}&playsinline=1`
      : null;
  };

  const getYouTubeEmbedClickUrl = (url: string, muted: boolean): string | null => {
    const id = extractYouTubeVideoId(url);
    return id
      ? `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&fs=1&playsinline=1&mute=${muted ? '1' : '0'}`
      : null;
  };

  const getMedia = (): MediaItem[] => {
    if (mediaData[productSlug]) return mediaData[productSlug];
    const slugKey = Object.keys(mediaData).find(
      key => productSlug.includes(key) || (productSlug.split('-')[0] && key.includes(productSlug.split('-')[0]))
    );
    return slugKey ? mediaData[slugKey] : defaultMedia;
  };

  const allMedia = getMedia();

  useEffect(() => {
    // ✅ FIXED: Properly typed initial state accumulator
    const initialStates: Record<string, VideoState> = {};
    
    allMedia.forEach((media) => {
      if (media.type === 'video') {
        initialStates[media.id] = {
          isClicked: false,
          isMuted: true,
          isPlaying: true,
          showAutoplay: media.src.includes('youtube.com')
        };
      }
    });
    setVideoStates(initialStates);
  }, [productSlug, allMedia]); // Added allMedia to dependency array for safety

  const toggleMute = (mediaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const media = allMedia.find(m => m.id === mediaId);
    if (!media || media.type !== 'video') return;

    const isYouTube = media.src.includes('youtube.com');
    if (isYouTube) {
      setVideoStates(prev => ({
        ...prev,
        [mediaId]: { ...prev[mediaId], isMuted: !prev[mediaId]?.isMuted, isClicked: true }
      }));
    } else {
      const video = videoRefs.current[mediaId];
      if (video) {
        video.muted = !video.muted;
        setVideoStates(prev => ({ ...prev, [mediaId]: { ...prev[mediaId], isMuted: video.muted } }));
      }
    }
  };

  const togglePlayPause = (mediaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const media = allMedia.find(m => m.id === mediaId);
    if (!media || media.type !== 'video') return;

    const isYouTube = media.src.includes('youtube.com');
    if (!isYouTube) {
      const video = videoRefs.current[mediaId];
      if (video) {
        if (video.paused) {
          video.play().catch(() => {});
          setVideoStates(prev => ({ ...prev, [mediaId]: { ...prev[mediaId], isPlaying: true } }));
        } else {
          video.pause();
          setVideoStates(prev => ({ ...prev, [mediaId]: { ...prev[mediaId], isPlaying: false } }));
        }
      }
    }
  };

  const handleCardClick = (mediaId: string) => {
    const media = allMedia.find(m => m.id === mediaId);
    if (!media || media.type !== 'video') return;

    if (media.src.includes('youtube.com')) {
      setVideoStates(prev => ({ ...prev, [mediaId]: { ...prev[mediaId], isClicked: true } }));
    } else {
      const video = videoRefs.current[mediaId];
      if (video) video.controls = true;
    }
  };

  if (!allMedia || allMedia.length === 0) return null;

  return (
    <section className="py-8">
      {/* Modern Header - Left Aligned */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
          Real Results
        </h2>
        <span className="text-sm font-medium text-gray-400">
           • {allMedia.length} Stories
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {allMedia.map((media) => {
          const isYouTubeVideo = media.type === 'video' && media.src.includes('youtube.com');
          const thumbnailUrl = isYouTubeVideo ? getYouTubeThumbnail(media.src) : media.thumbnail;
          const state = videoStates[media.id] || { isClicked: false, isMuted: true, isPlaying: true, showAutoplay: false };

          return (
            <div
              key={media.id}
              className="relative group rounded-xl overflow-hidden bg-black aspect-[9/16] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCardClick(media.id)}
            >
              {/* Media Content */}
              <div className="absolute inset-0 w-full h-full">
                {media.type === 'video' ? (
                   isYouTubeVideo ? (
                      state.showAutoplay || state.isClicked ? (
                         <iframe
                            className="w-full h-full pointer-events-none group-hover:pointer-events-auto"
                            src={state.isClicked ? (getYouTubeEmbedClickUrl(media.src, state.isMuted) || '') : (getYouTubeEmbedAutoplayUrl(media.src) || '')}
                            title={media.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                         />
                      ) : (
                         <img src={thumbnailUrl || ''} className="w-full h-full object-cover" alt="" />
                      )
                   ) : (
                      <video
                         ref={el => { videoRefs.current[media.id] = el }}
                         className="w-full h-full object-cover"
                         src={media.src}
                         muted={state.isMuted}
                         autoPlay
                         loop
                         playsInline
                         poster={media.thumbnail}
                      />
                   )
                ) : (
                   <img src={media.src} alt={media.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
              </div>

              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />

              {/* Type Badge */}
              <div className="absolute top-2 left-2 z-10">
                 {media.type === 'video' && (
                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                       <PlayIcon className="w-3 h-3 text-white" />
                    </div>
                 )}
              </div>

              {/* Mute Control */}
              {media.type === 'video' && (
                 <button 
                    onClick={(e) => toggleMute(media.id, e)}
                    className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                 >
                    {state.isMuted ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
                 </button>
              )}

              {/* Play Overlay (Native Video) */}
              {!isYouTubeVideo && media.type === 'video' && !state.isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10" onClick={(e) => togglePlayPause(media.id, e)}>
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center pl-1 shadow-lg backdrop-blur-sm">
                       <PlayIcon className="w-5 h-5 text-black" />
                    </div>
                 </div>
              )}

              {/* Customer Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white pointer-events-none">
                 <p className="font-bold text-xs md:text-sm line-clamp-1">{media.customerName}</p>
                 <div className="flex items-center gap-1 opacity-80 text-[10px] md:text-xs mt-0.5">
                    {media.customerLocation && <span>📍 {media.customerLocation}</span>}
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CustomerMedia;
