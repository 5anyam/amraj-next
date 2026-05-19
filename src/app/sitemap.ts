import type { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `https://www.amraj.in/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `https://www.amraj.in/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/returns-and-refunds-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/product/advanced-prostate-care`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/product/weight-management-pro`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `https://www.amraj.in/product/advanced-liver-detox`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];

  return [...staticPages];
}
