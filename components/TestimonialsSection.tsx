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
    color: 'teal',
    bgColor: 'bg-teal-500',
  },
  {
    name: 'Ankit T.',
    quote:
      'I needed vegan supplements I could trust and the website experience was perfectly smooth.',
    image: '/users/ankit.jpeg',
    rating: 5,
    color: 'orange',
    bgColor: 'bg-orange-500',
  },
  {
    name: 'Savita P.',
    quote: 'Loved the easy navigation and beautiful design. Will shop again!',
    image: '/users/savita.webp',
    rating: 5,
    color: 'yellow',
    bgColor: 'bg-yellow-600',
  },
  {
    name: 'Rahul M.',
    quote: 'Amazing product quality and customer service. Highly recommended!',
    image: '/users/ankit.jpeg',
    rating: 5,
    color: 'teal',
    bgColor: 'bg-teal-500',
  },
  {
    name: 'Priya K.',
    quote: 'Fast shipping and excellent customer support. Very satisfied!',
    image: '/users/savita.webp',
    rating: 5,
    color: 'orange',
    bgColor: 'bg-orange-500',
  },
];

const TestimonialsCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    dotsClass: 'slick-dots custom-dots',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const StarRating = ({ rating, color }: { rating: number; color: string }) => {
    const starColor = color === 'teal' ? 'text-teal-600' : 
                     color === 'orange' ? 'text-orange-600' : 'text-yellow-700';
    
    return (
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 mx-0.5 ${
              i < rating ? starColor : 'text-gray-300'
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
    <section className="relative bg-white py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real stories from real customers who have transformed their wellness journey
          </p>
        </div>

        <div className="testimonials-slider">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-3">
                <div className={`relative ${testimonial.bgColor} rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 p-8 mx-2 group min-h-96`}>
                  
                  {/* Quote mark */}
                  <div className="text-white/30 text-6xl font-bold mb-4 leading-none">"</div>
                  
                  {/* Profile Image */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-white/20 p-1">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="rounded-full object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Main heading */}
                  <h3 className="text-white text-xl font-bold mb-4 italic">
                    Go to fitness drink
                  </h3>

                  {/* Quote */}
                  <blockquote className="text-white text-sm leading-relaxed mb-6">
                    {testimonial.quote}
                  </blockquote>

                  {/* Name */}
                  <div className="text-white font-semibold mb-3">
                    {testimonial.name}
                  </div>

                  {/* Stars */}
                  <StarRating rating={testimonial.rating} color={testimonial.color} />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style jsx>{`
        .testimonials-slider .custom-dots {
          bottom: -50px;
        }
        .testimonials-slider .custom-dots li {
          margin: 0 6px;
        }
        .testimonials-slider .custom-dots li button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e5e7eb;
          transition: all 0.3s ease;
        }
        .testimonials-slider .custom-dots li button:before {
          display: none;
        }
        .testimonials-slider .custom-dots li.slick-active button {
          background: #14b8a6;
          transform: scale(1.2);
        }
        .testimonials-slider .custom-dots li button:hover {
          background: #9ca3af;
          transform: scale(1.1);
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;