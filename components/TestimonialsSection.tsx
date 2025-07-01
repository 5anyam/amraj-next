'use client';

import Slider from 'react-slick';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Parul S.',
    quote:
      'The Blue range totally improved my energy — delivery was so fast, checkout simple, and products are really high quality.',
    image: '/users/parul.avif',
    rating: 5,
  },
  {
    name: 'Ankit T.',
    quote:
      'I needed vegan supplements I could trust and the website experience was perfectly smooth.',
    image: '/users/ankit.jpeg',
    rating: 5,
  },
  {
    name: 'Savita P.',
    quote: 'Loved the easy navigation and beautiful design. Will shop again!',
    image: '/users/savita.webp',
    rating: 5,
  },
];

const TestimonialsCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    cssEase: 'cubic-bezier(0.87, 0, 0.13, 1)',
    dotsClass: 'slick-dots custom-dots',
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < rating ? 'text-orange-500' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-teal-50 py-20 px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-teal-300 rounded-full opacity-10 blur-lg"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-12">
          <span className="inline-block px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium mb-4">
            Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real stories from real customers who have transformed their wellness journey with us
          </p>
        </div>

        <div className="testimonials-slider">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-4">
                <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 md:p-12 mx-auto max-w-3xl group">
                  {/* Quote decoration */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-teal-500 to-orange-500 p-3 rounded-full shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col items-center pt-4">
                    <div className="relative mb-6">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover h-20 w-20 ring-4 ring-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-teal-500 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    <StarRating rating={testimonial.rating} />

                    <blockquote className="text-gray-700 text-xl md:text-2xl leading-relaxed mb-6 font-medium italic max-w-2xl">
                      {testimonial.quote}
                    </blockquote>

                    <div className="flex items-center">
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent font-bold text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-500 text-sm">Verified Customer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>1000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.9/5 Average Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>100% Verified Reviews</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonials-slider .custom-dots {
          bottom: -50px;
        }
        .testimonials-slider .custom-dots li button:before {
          color: #14b8a6;
          font-size: 12px;
          opacity: 0.5;
        }
        .testimonials-slider .custom-dots li.slick-active button:before {
          opacity: 1;
          color: #f97316;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;