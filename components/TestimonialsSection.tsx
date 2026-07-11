'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { Star, CheckCircle, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Vanshika',
    role: 'Verified Buyer',
    quote:
      "I've made Amraj Weight Management Pro+ part of my daily routine alongside cleaner eating and workouts. The capsules are easy to take and it's helped me stay consistent.",
    image: '/users/vanshika.jpeg',
    rating: 5,
  },
  {
    name: 'Dr. Abhinav Rana',
    role: 'Verified Buyer',
    quote:
      "What I like about Amraj Advanced Liver Detox is the transparency — well-known ingredients like Milk Thistle, TUDCA and NAC at clearly labelled doses. A clean, good-quality formulation.",
    image: '/users/dr-abhinav-rana.jpeg',
    rating: 5,
  },
  {
    name: 'Anil Tyagi',
    role: 'Verified Buyer',
    quote: "I bought this for my father as part of his daily wellness routine. He's been taking it consistently and finds the capsules easy to take. Good quality and quick delivery.",
    image: '/users/anil-tyagi.jpeg',
    rating: 5,
  },
  {
    name: 'Savita P.',
    role: 'Verified Buyer',
    quote: "I've been taking Amraj Advanced Liver Detox as part of my wellness routine and really like it. Great quality and the delivery was quick. Loved it!",
    image: '/users/savita.webp',
    rating: 5,
  }
];

const TestimonialsCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
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
          centerMode: true, // App-like peek effect
          centerPadding: '20px',
        }
      }
    ]
  };

  return (
    <section className="relative bg-gray-50 py-20 px-4 overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-teal-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header - Left Aligned for modern look */}
        <div className="mb-10 px-2 sm:px-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Loved by Thousands
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Real experiences from our wellness community.
            </p>
          </div>
          
          {/* Trust Badge */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
             <div className="flex -space-x-2">
                {['/users/vanshika.jpeg','/users/ankit.jpeg','/users/parul.avif'].map((src, i) => (
                   <div key={i} className="relative w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                     <Image src={src} alt="Customer" fill style={{ objectFit: 'cover' }} sizes="24px" />
                   </div>
                ))}
             </div>
             <div className="text-sm font-semibold text-gray-700">
                4.9/5 Rating
             </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="testimonials-slider pb-10">
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="px-3 py-2">
                <div className="bg-white rounded-[2rem] p-6 md:p-8 h-full min-h-[340px] flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gray-200 transition-all duration-300 relative group">
                  
                  {/* Quote Icon Background */}
                  <Quote className="absolute top-8 right-8 w-10 h-10 text-gray-100 rotate-180 group-hover:text-orange-50 transition-colors" />

                  {/* Header: User Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-shrink-0">
                       <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={56}
                          height={56}
                          className="rounded-full object-cover w-14 h-14 border-2 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full border-2 border-white">
                           <CheckCircle className="w-3 h-3" />
                        </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
                       <span className="text-xs text-gray-400 font-medium uppercase tracking-wide flex items-center gap-1">
                         {testimonial.role}
                       </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                     {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                     ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1">
                    {testimonial.quote}
                  </p>
                  
                  {/* Date/Footer (Optional) */}
                  <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                     <span className="text-xs text-gray-400">Posted on Google</span>
                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style jsx>{`
        /* Custom Dots Modernization */
        .testimonials-slider .slick-dots {
          bottom: -20px;
          text-align: left;
          padding-left: 20px;
        }
        @media (min-width: 768px) {
           .testimonials-slider .slick-dots {
             text-align: center;
             padding-left: 0;
           }
        }
        .testimonials-slider .custom-dots li {
          margin: 0 4px;
          width: auto;
          height: auto;
        }
        .testimonials-slider .custom-dots li button {
          width: 8px;
          height: 8px;
          border-radius: 99px;
          background: #cbd5e1; /* Slate-300 */
          transition: all 0.3s ease;
        }
        .testimonials-slider .custom-dots li.slick-active button {
          background: #0D9488;
          width: 24px;
        }
        .testimonials-slider .custom-dots li button:before {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;
