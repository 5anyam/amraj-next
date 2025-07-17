import React from 'react';

const SmoothMarquee = () => {
  const items = [
    { label: '🌿 100% Natural', color: 'bg-yellow-500/80' },
    { label: '🔬 Clinically Tested', color: 'bg-orange-500/80' },
    { label: '✨ GMP Certified', color: 'bg-teal-500/80' },
    { label: '🍃 Plant Based', color: 'bg-blue-500/80' },
  ];

  return (
    <div className="relative overflow-hidden w-full">
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 12s linear infinite;
        }
      `}</style>
      
      <div className="animate-scroll flex gap-2 w-max">
        {/* Duplicate items multiple times for seamless loop */}
        {Array(3).fill(items).flat().map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} px-2 py-1.5 sm:px-2 sm:py-1 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 flex-shrink-0 backdrop-blur-sm`}
          >
            <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmoothMarquee;