'use client';

import React from 'react';

const MarqueeBanner = () => {
  const bannerItems = [
    { text: "Soy Free", icon: "🌱" },
    { text: "Plant-Based", icon: "🍃" },
    { text: "Gluten Free", icon: "🌾" },
    { text: "Non-GMO", icon: "🧬" },
    { text: "100% Natural", icon: "🌿" },
    { text: "Lab Tested", icon: "🔬" },
    { text: "Organic", icon: "🌱" },
    { text: "Chemical Free", icon: "❌" }
  ];

  return (
    <div className="overflow-hidden bg-black py-3 relative select-none">
      
      {/* Side Fades - Dark to Transparent */}
      <div className="absolute top-0 left-0 w-8 sm:w-20 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 sm:w-20 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee whitespace-nowrap items-center">
        {/* Render 3 sets for seamless looping */}
        {[...bannerItems, ...bannerItems, ...bannerItems].map((item, index) => (
          <div 
            key={index} 
            className="inline-flex items-center mx-6 sm:mx-8 text-white/90 group"
          >
            {/* Icon - slightly smaller/subtle */}
            <span className="text-base mr-2 opacity-80 group-hover:opacity-100 transition-opacity">
              {item.icon}
            </span>
            
            {/* Text - Clean, uppercase, tracking-wide */}
            <span className="text-xs sm:text-sm font-medium tracking-[0.15em] uppercase opacity-90 group-hover:opacity-100 group-hover:text-orange-400 transition-colors">
              {item.text}
            </span>

            {/* Separator Dot (Decoration) */}
            <span className="ml-8 sm:ml-12 w-1 h-1 bg-white/30 rounded-full block"></span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); } 
        }
        
        .animate-marquee {
          animation: marquee 45s linear infinite; /* Slower for elegance */
          width: fit-content;
        }
        
        .animate-marquee:hover, 
        .animate-marquee:active {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MarqueeBanner;
