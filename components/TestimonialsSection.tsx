'use client';

import Slider from 'react-slick';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Parul S.',
    quote:
      'The Blue range totally improved my energy — delivery was so fast, checkout simple, and products are really high quality.',
    image: '/users/parul.avif',
  },
  {
    name: 'Ankit T.',
    quote:
      'I needed vegan supplements I could trust and the website experience was perfectly smooth.',
    image: '/users/ankit.jpeg',
  },
  {
    name: 'Savita P.',
    quote: 'Loved the easy navigation and beautiful design. Will shop again!',
    image: '/users/savita.webp',
  },
];

const TestimonialsCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">What Our Customers Say</h2>
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div key={index}>
              <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-6 mx-4">
                <div className="flex flex-col items-center">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={64}
                    height={64}
                    className="rounded-full mb-4 object-cover h-10 w-10"
                  />
                  <p className="text-gray-700 italic text-lg mb-4">“{t.quote}”</p>
                  <div className="text-teal-500 font-semibold">{t.name}</div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
