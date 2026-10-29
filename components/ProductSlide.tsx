import React from 'react';

const SmoothMarquee = () => {
  const items = [
    { icon: '🌿', label: '100% Natural' },
    { icon: '🔬', label: 'Clinically Tested' },
    { icon: '✨', label: 'GMP Certified' },
    { icon: '🍃', label: 'Plant Based' },
    { icon: '🛡️', label: 'Quality Assured' },
    { icon: '💯', label: 'Authentic' },
  ];

  return (
    <div className="relative overflow-hidden w-full my-4">
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-teal-600/10 to-teal-500/10 rounded-2xl" />
      
      {/* Gradient Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div className="relative py-3">
        <div className="animate-scroll flex gap-3 w-max px-4">
          {Array(4).fill(items).flat().map((item, idx) => (
            <div
              key={idx}
              className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0 overflow-hidden"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              
              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-teal-300/0 group-hover:border-teal-300/50 transition-all duration-300" />
              
              <div className="relative flex items-center gap-2.5">
                <span className="text-lg filter drop-shadow-sm">{item.icon}</span>
                <span className="text-sm font-bold text-white whitespace-nowrap tracking-wide drop-shadow-sm">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmoothMarquee;
