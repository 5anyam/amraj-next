import { useState, useEffect } from 'react';

export default function CustomProductSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  const products = [
    { id: 1, name: "Prostate Care", image: "/prostate-ingredients.jpg" },
    { id: 2, name: "Weight Management", image: "/weight-management.jpg" },
    { id: 3, name: "Liver Detox", image: "/liver-ingredients.jpg" }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setSlidesToShow(1); // Mobile: 1 slide
      else if (window.innerWidth < 1024) setSlidesToShow(2); // Tablet: 2 slides
      else setSlidesToShow(3); // Desktop: 3 slides
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (slidesToShow === 1) {
        return prev >= products.length - 1 ? 0 : prev + 1;
      } else {
        return prev >= products.length - slidesToShow ? 0 : prev + 1;
      }
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (slidesToShow === 1) {
        return prev <= 0 ? products.length - 1 : prev - 1;
      } else {
        return prev <= 0 ? products.length - slidesToShow : prev - 1;
      }
    });
  };

  useEffect(() => {
    if (slidesToShow === 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [slidesToShow, currentSlide]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-4">
          Key Ingredients - In Our Products
        </h2>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: slidesToShow === 1 
              ? `translateX(-${currentSlide * 100}%)` 
              : `translateX(-${currentSlide * (100 / slidesToShow)}%)`
          }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 px-1"
              style={{ 
                width: slidesToShow === 1 
                  ? '100%' 
                  : '33.333333%'
              }}
            >
              <div className="bg-gradient-to-br from-teal-50 to-orange-50 rounded-2xl p-2 text-center border border-teal-200 h-full">
                <h3 className="text-teal-700 font-bold text-xl md:text-2xl mb-3">
                  {product.name}
                </h3>
                <div className="mb-3">
                  <div className="w-full h-full mx-auto rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Only on mobile */}
        <button
          onClick={prevSlide}
          className="md:hidden absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-teal-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-teal-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {slidesToShow === 1 ? (
          products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentSlide === index 
                  ? 'bg-teal-600 scale-110' 
                  : 'bg-teal-200 hover:bg-teal-400'
              }`}
            />
          ))
        ) : (
          Array.from({ length: Math.ceil(products.length / slidesToShow) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentSlide === index 
                  ? 'bg-teal-600 scale-110' 
                  : 'bg-teal-200 hover:bg-teal-400'
              }`}
            />
          ))
        )}
      </div>

      {/* Mobile swipe instruction */}
      <div className="md:hidden text-center mt-4">
        <p className="text-sm text-gray-500">← Swipe or use arrows to navigate →</p>
      </div>
    </div>
  );
}
