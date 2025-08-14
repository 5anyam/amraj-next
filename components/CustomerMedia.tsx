'use client';

import React, { useState, useRef } from 'react';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MediaItem {
  id: string;
  type: 'video' | 'image';
  src: string;
  thumbnail?: string; // Optional thumbnail for videos
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
      src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_9043.mp4',
      // No thumbnail - will show first frame automatically
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
    },
  ],
  'weight-management': [
    {
      id: 'wm-video-1',
      type: 'video',
      src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_9018.mp4',
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
    },
  ],
  'liver-detox': [
    {
      id: 'ld-video-1',
      type: 'video',
      src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_1117.mov',
      customerName: 'Vanshika Tyagi',
      customerLocation: 'Delhi',
      title: 'Fatty Liver Reversed',
      description: 'My fatty liver condition improved significantly in 2 months.'
    },
    {
      id: 'ld-image-2',
      type: 'video',
      src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_1148.mov',
      customerName: 'Vikas Yadav',
      customerLocation: 'Jaipur',
      title: 'Medical Reports',
      description: 'Liver function tests showed remarkable improvement.'
    },
    {
        id: 'ld-image-3',
        type: 'video',
        src: 'https://cms.amraj.in/wp-content/uploads/2025/08/Amraj-Liver-Detox.1-1.mp4',
        customerName: 'Vikas Yadav',
        customerLocation: 'Jaipur',
        title: 'Medical Reports',
        description: 'Liver function tests showed remarkable improvement.'
      },
      {
        id: 'ld-video-4',
        type: 'video',
        src: 'https://cms.amraj.in/wp-content/uploads/2025/08/IMG_9029.mp4',
        customerName: 'Vikas Yadav',
        customerLocation: 'Jaipur',
        title: 'Medical Reports',
        description: 'Liver function tests showed remarkable improvement.'
      },

  ]
};

// Default media for products not specifically listed
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

const CustomerMedia: React.FC<CustomerMediaProps> = ({ productSlug, productName }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'videos' | 'images'>('all');
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Get media based on product slug
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

  // Filter media based on active filter
  const filteredMedia = allMedia.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'videos') return item.type === 'video';
    if (activeFilter === 'images') return item.type === 'image';
    return true;
  });

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
        {/* Header */}
        <div className="bg-teal-500 p-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-white text-center">
            Customer Stories & Results
          </h2>
          <p className="text-teal-100 text-center mt-2">
            Real customers, real results with {productName}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex justify-center space-x-1 p-4">
            {[
              { key: 'all', label: 'All Media', icon: '📱' },
              { key: 'videos', label: 'Videos', icon: '🎥' },
              { key: 'images', label: 'Photos', icon: '📸' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as 'all' | 'videos' | 'images')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === key
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer overflow-hidden"
                onClick={() => openModal(media)}
              >
                {/* Media Preview */}
                <div className="relative overflow-hidden rounded-t-2xl bg-white aspect-video">
                  {/* Media Type Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-teal-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg">
                    {media.type === 'video' ? '🎥 Video' : '📸 Photo'}
                  </div>

                  {media.type === 'video' ? (
                    <div className="relative w-full h-full">
                      {/* Video Preview - Shows first frame automatically */}
                      <video
                        ref={(el) => {
                          videoRefs.current[media.id] = el;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={media.src}
                        muted
                        preload="metadata" // This loads first frame automatically
                        poster={media.thumbnail} // Use thumbnail if available, else first frame
                        onMouseEnter={(e) => {
                          // Optional: Play on hover for better UX
                          e.currentTarget.currentTime = 0;
                          e.currentTarget.play().catch(() => {
                            // Handle autoplay restrictions
                          });
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
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
                        <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                          <PlayIcon className="h-8 w-8 text-teal-600" />
                        </div>
                      </div>
                    </div>
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

                {/* Media Details */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-sm lg:text-base mb-2 group-hover:text-teal-600 transition-colors duration-300">
                    {media.title}
                  </h3>

                  {/* Customer Info */}
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">
                        {media.customerName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{media.customerName}</p>
                      {media.customerLocation && (
                        <p className="text-xs text-gray-500">{media.customerLocation}</p>
                      )}
                    </div>
                  </div>


                  {/* View Button */}
                  <button className="w-full mt-3 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                    {media.type === 'video' ? 'Watch Video' : 'View Photo'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMedia.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No {activeFilter} found</h3>
              <p className="text-gray-500">Try selecting a different filter or check back later.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Media Viewer */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all duration-300 z-10"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>

            {/* Media Content */}
            <div className="p-6">
              {selectedMedia.type === 'video' ? (
                <video
                  controls
                  className="w-full max-h-[60vh] rounded-xl"
                  src={selectedMedia.src}
                  poster={selectedMedia.thumbnail} // Use thumbnail if available, else first frame shows automatically
                  preload="metadata"
                  autoPlay={false}
                >
                  <source src={selectedMedia.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.title}
                  className="w-full max-h-[60vh] object-contain rounded-xl"
                />
              )}

              {/* Media Info */}
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedMedia.title}
                </h3>
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">
                      {selectedMedia.customerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedMedia.customerName}</p>
                    {selectedMedia.customerLocation && (
                      <p className="text-sm text-gray-500">{selectedMedia.customerLocation}</p>
                    )}
                  </div>
                </div>
                {selectedMedia.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {selectedMedia.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerMedia;
