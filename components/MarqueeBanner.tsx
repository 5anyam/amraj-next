'use client';

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
    <div className="overflow-hidden bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 py-2 sm:py-4 text-green-700 font-bold whitespace-nowrap relative border-y-2 border-green-200">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      
      <div className="animate-marquee inline-block min-w-full text-sm sm:text-lg tracking-wide relative z-10">
        {/* First set of items */}
        {bannerItems.map((item, index) => (
          <span 
            key={`first-${index}`} 
            className="inline-flex items-center gap-1 sm:gap-2 mx-3 sm:mx-8 bg-white/30 px-2 sm:px-4 py-1 rounded-full shadow-sm backdrop-blur-sm"
          >
            <span className="text-base sm:text-xl" role="img" aria-label={`${item.text} icon`}>
              {item.icon}
            </span>
            <span className="font-semibold text-xs sm:text-base">{item.text}</span>
          </span>
        ))}
        
        {/* Duplicate set for seamless loop */}
        {bannerItems.map((item, index) => (
          <span 
            key={`second-${index}`} 
            className="inline-flex items-center gap-1 sm:gap-2 mx-3 sm:mx-8 bg-white/30 px-2 sm:px-4 py-1 rounded-full shadow-sm backdrop-blur-sm"
          >
            <span className="text-base sm:text-xl" role="img" aria-label={`${item.text} icon`}>
              {item.icon}
            </span>
            <span className="font-semibold text-xs sm:text-base">{item.text}</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        
        /* Slower animation on mobile for better readability */
        @media (max-width: 640px) {
          .animate-marquee {
            animation: marquee 35s linear infinite;
          }
        }
        
        /* Pause on hover for desktop */
        @media (min-width: 641px) {
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        }
        
        /* Touch-friendly pause on mobile */
        @media (max-width: 640px) {
          .animate-marquee:active {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeBanner;