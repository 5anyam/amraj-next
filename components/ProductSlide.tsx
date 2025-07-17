'use client'

import Slider from "react-slick";

const badgeItems = [
  { label: '🌿 100% Natural', color: 'bg-yellow-500/80' },
  { label: '🔬 Clinically Tested', color: 'bg-orange-500/80' },
  { label: '✨ GMP Certified', color: 'bg-teal-500/80' },
  { label: '🍃 Plant Based', color: 'bg-blue-500/80' },
  { label: '🧪 Lab Verified', color: 'bg-purple-500/80' },
  { label: '🛡️ Immunity Boost', color: 'bg-green-500/80' }
];

const sliderSettings = {
  infinite: true,
  speed: 3000,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 0,
  cssEase: "linear",
  arrows: false,
  pauseOnHover: false,
  variableWidth: true,
};

export default function ProductSlide() {
  return (
    <>
      {/* Product title with gradient text */}
      {/* Carousel of badges */}
      <div className="px-2 mb-4">
        <Slider {...sliderSettings} className="flex items-center">
          {badgeItems.map((item, idx) => (
            <div key={idx} className="px-1">
              <div
                className={`${item.color} px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 flex-shrink-0 backdrop-blur-sm whitespace-nowrap`}
              >
                <span className="text-xs sm:text-sm font-medium text-white">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
}
