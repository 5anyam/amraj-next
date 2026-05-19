'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { Star, CheckCircle, Quote } from 'lucide-react'; // Assuming you have lucide-react, or we can use SVG

const testimonials = [
  {
    name: 'Vanshika',
    role: 'Verified Buyer',
    quote:
      "I've been struggling with weight for years, but AMRAJ Weight Management Pro+ really helped me break the plateau. Within the first month, I felt more energetic and less bloated.",
    image: '/users/vanshika.jpeg',
    rating: 5,
  },
  {
    name: 'Dr. Abhinav Rana',
    role: 'Medical Professional',
    quote:
      "AMRAJ Advanced Liver Detox combines modern science and time-tested ingredients like Milk Thistle & TUDCA. I've recommended it to several patients with fatty liver, and many reported positive outcomes within 2-3 weeks.",
    image: '/users/dr-abhinav-rana.jpeg',
    rating: 5,
  },
  {
    name: 'Anil Tyagi',
    role: 'Verified Buyer',
    quote: 'I purchased this for my father who was experiencing frequent urination issues. After about 3 weeks, he reported noticeable improvement in both frequency and comfort.',
    image: '/users/anil-tyagi.jpeg',
    rating: 5,
  },
  {
    name: 'Savita P.',
    role: 'Verified Buyer',
    quote: 'Amraj advanced liver detox not only helps my fatty grade liver but also helps my skin glow and boost metabolism. Thanks for this amazing product. Loved it',
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
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50" />
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
              See how Amraj is changing lives daily.
            </p>
          </div>
          
          {/* Trust Badge */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />
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
          background: #f97316; /* Orange-500 */
          width: 24px; /* Pill shape for active state */
        }
        .testimonials-slider .custom-dots li button:before {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;
