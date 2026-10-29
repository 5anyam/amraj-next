'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { Star, BadgeCheck, Quote } from 'lucide-react';

/* Matches the token set used across the site (see src/app/page.tsx). */
const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_SOFT = '#eef7f5';
const CARD_SHADOW = '0 2px 16px rgba(16,24,40,0.05)';
const RADIUS = 20;
const STAR = '#f5a623';

const testimonials = [
  {
    name: 'Vanshika',
    product: 'Weight Management Pro+',
    quote:
      "I've made Amraj Weight Management Pro+ part of my daily routine alongside cleaner eating and workouts. The capsules are easy to take and it's helped me stay consistent.",
    image: '/users/vanshika.jpeg',
    rating: 5,
  },
  {
    name: 'Dr. Abhinav Rana',
    product: 'Advanced Liver Detox',
    quote:
      'What I like about Amraj Advanced Liver Detox is the transparency — well-known ingredients like Milk Thistle, TUDCA and NAC at clearly labelled doses. A clean, good-quality formulation.',
    image: '/users/dr-abhinav-rana.jpeg',
    rating: 5,
  },
  {
    name: 'Anil Tyagi',
    product: 'Advanced Prostate Care',
    quote:
      "I bought this for my father as part of his daily wellness routine. He's been taking it consistently and finds the capsules easy to take. Good quality and quick delivery.",
    image: '/users/anil-tyagi.jpeg',
    rating: 5,
  },
  {
    name: 'Savita P.',
    product: 'Advanced Liver Detox',
    quote:
      "I've been taking Amraj Advanced Liver Detox as part of my wellness routine and really like it. Great quality and the delivery was quick. Loved it!",
    image: '/users/savita.webp',
    rating: 5,
  },
];

const AVATARS = ['/users/vanshika.jpeg', '/users/dr-abhinav-rana.jpeg', '/users/anil-tyagi.jpeg', '/users/savita.webp'];

const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  autoplay: true,
  autoplaySpeed: 4500,
  pauseOnHover: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,
  cssEase: 'cubic-bezier(0.16, 1, 0.3, 1)',
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 1, centerMode: true, centerPadding: '24px' } },
  ],
};

export default function TestimonialsCarousel() {
  return (
    <div className="amraj-testimonials">
      {/* Rating summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 34 }}>
        <div style={{ display: 'flex' }}>
          {AVATARS.map((src, i) => (
            <div
              key={src}
              style={{ position: 'relative', width: 34, height: 34, borderRadius: '50%', border: '2.5px solid #fff', overflow: 'hidden', marginLeft: i > 0 ? -11 : 0, flexShrink: 0, boxShadow: '0 2px 6px rgba(16,24,40,0.12)' }}
            >
              <Image src={src} alt="" aria-hidden fill style={{ objectFit: 'cover' }} sizes="34px" />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} style={{ width: 15, height: 15, fill: STAR, color: STAR }} />
            ))}
          </div>
          <span style={{ fontSize: 14, color: INK_SOFT }}>
            <strong style={{ color: INK, fontWeight: 700 }}>4.9/5</strong> from 10,000+ customers
          </span>
        </div>
      </div>

      <Slider {...settings}>
        {testimonials.map((t) => (
          <div key={t.name} className="amraj-testimonial-slide">
            <article
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: '#fff',
                borderRadius: RADIUS,
                border: `1px solid ${LINE}`,
                boxShadow: CARD_SHADOW,
                padding: '28px 26px 24px',
              }}
            >
              <Quote style={{ position: 'absolute', top: 24, right: 24, width: 30, height: 30, color: ACCENT_SOFT, transform: 'rotate(180deg)' }} />

              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} style={{ width: 15, height: 15, fill: i <= t.rating ? STAR : '#e4e6eb', color: i <= t.rating ? STAR : '#e4e6eb' }} />
                ))}
              </div>

              <p style={{ position: 'relative', zIndex: 1, fontSize: 14.5, color: INK_SOFT, lineHeight: 1.75, flex: 1, marginBottom: 22 }}>
                {t.quote}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 18, borderTop: `1px solid ${LINE}` }}>
                <div style={{ position: 'relative', width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: ACCENT_SOFT }}>
                  <Image src={t.image} alt={t.name} fill style={{ objectFit: 'cover' }} sizes="44px" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: INK, lineHeight: 1.3 }}>{t.name}</p>
                  <p style={{ fontSize: 12.5, color: INK_SOFT, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.product}</p>
                </div>
                <span
                  style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, background: ACCENT_SOFT, color: ACCENT, fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 999, flexShrink: 0 }}
                >
                  <BadgeCheck style={{ width: 13, height: 13 }} /> Verified
                </span>
              </div>
            </article>
          </div>
        ))}
      </Slider>

      {/* Plain <style> on purpose — styled-jsx cannot reach the markup react-slick renders. */}
      <style>{`
        .amraj-testimonials .slick-list { margin: 0 -11px; padding-bottom: 4px; }
        .amraj-testimonial-slide { height: 100%; padding: 0 11px; }

        /* Stretch every card to the tallest in the row instead of leaving them ragged. */
        .amraj-testimonials .slick-track { display: flex !important; align-items: stretch; }
        .amraj-testimonials .slick-slide { height: auto !important; float: none; }
        .amraj-testimonials .slick-slide > div { height: 100%; }

        .amraj-testimonials .slick-dots { position: static; margin-top: 30px; display: flex !important; justify-content: center; gap: 7px; }
        .amraj-testimonials .slick-dots li { width: auto; height: auto; margin: 0; }
        .amraj-testimonials .slick-dots li button {
          width: 8px;
          height: 8px;
          padding: 0;
          border-radius: 999px;
          background: #d3d8dd;
          transition: width 0.3s, background 0.3s;
        }
        .amraj-testimonials .slick-dots li button:before { display: none; }
        .amraj-testimonials .slick-dots li.slick-active button { width: 26px; background: ${ACCENT}; }

        @media (max-width: 768px) {
          .amraj-testimonials .slick-list { margin: 0 -7px; }
          .amraj-testimonial-slide { padding: 0 7px; }
        }
      `}</style>
    </div>
  );
}
