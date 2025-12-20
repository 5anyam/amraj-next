// app/loading.tsx
import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-orange-50">
      <div className="relative flex flex-col items-center p-8">
        {/* Premium Animated Logo */}
        <div className="relative w-24 h-24 mb-6 group">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-orange-400/20 rounded-3xl blur-xl animate-pulse group-hover:animate-ping"></div>
          
          {/* Main Logo Ring */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-teal-500/90 to-orange-500/90 rounded-2xl shadow-2xl border-4 border-white/50 backdrop-blur-xl flex items-center justify-center">
            
            {/* Inner Spinning Ring */}
            <div className="absolute inset-2 border-2 border-t-teal-400 border-r-orange-400 border-b-transparent border-l-transparent rounded-xl animate-spin-slow"></div>
            
            {/* Logo Icon */}
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-orange-600 rounded-xl shadow-lg flex items-center justify-center animate-bounce-slow">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Brand Text */}
        <div className="text-center space-y-3 animate-float">
          <div className="space-y-1">
            <h2 className="bg-gradient-to-r from-teal-600 via-orange-500 to-teal-600 bg-clip-text text-transparent font-bold text-2xl md:text-3xl tracking-wider drop-shadow-lg">
              AMRAJ
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-teal-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
          
          <p className="text-teal-700 font-semibold text-sm md:text-base tracking-wider uppercase bg-gradient-to-r from-teal-100/50 to-orange-100/50 px-4 py-2 rounded-full backdrop-blur-sm border border-teal-200/50">
            Loading Wellness...
          </p>
        </div>

        {/* Subtle Progress Bar */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 max-w-xs bg-white/30 backdrop-blur-sm rounded-full p-1 border border-teal-200/50 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full animate-indeterminate shadow-md"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes indeterminate {
          0% { transform: translateX(-100%) scaleX(0.7); }
          40% { transform: translateX(-100%) scaleX(0.7); }
          100% { transform: translateX(400%) scaleX(0.7); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-indeterminate {
          animation: indeterminate 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
