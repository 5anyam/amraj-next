import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Transactional / account pages carry no search value and shouldn't be crawled.
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/order-confirmation',
          '/login',
          '/register',
          '/my-account',
          '/dashboard',
          '/search',
        ],
      },
    ],
    sitemap: 'https://www.amraj.in/sitemap.xml',
  };
}
