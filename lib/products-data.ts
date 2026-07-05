export interface ProductIngredient {
  name: string;
  dose: string;
  benefit: string;
  /** Optional ingredient image. Add a WordPress URL (https://cms.amraj.in/...) or a
   *  local path in /public (e.g. '/ingredients/saw-palmetto.jpg'). Falls back to a
   *  styled gradient placeholder when empty. */
  image?: string;
}

export interface StaticProduct {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  regularPrice: number;
  /** Product photos + infographic banners. Any URL containing "Info" is treated as a
   *  full-width landing banner; the rest render as gallery photos. */
  images: string[];
  benefits: string[];
  ingredients: ProductIngredient[];
  howToUse: string;
  category: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  capsules: number;
}

/** Compliance disclaimer shown on every product page. Keeps copy within
 *  Google Merchant Center health & supplement policy. */
export const HEALTH_DISCLAIMER =
  'This is a dietary supplement and is not intended to diagnose, treat, cure, or prevent any disease. Results may vary from person to person. Always consult a qualified healthcare professional before use, especially if you are pregnant, nursing, under medication, or have a pre-existing medical condition.';

export const PRODUCTS: StaticProduct[] = [
  {
    id: 86,
    slug: 'advanced-prostate-care',
    name: 'Advanced Prostate Care',
    shortName: 'Prostate Care',
    tagline: 'Herbal & nutraceutical formula that supports prostate health and everyday urinary comfort',
    price: 999,
    regularPrice: 1849,
    images: [
      'https://cms.amraj.in/wp-content/uploads/2025/06/prostate1-2-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/06/IMG_6765-1-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/06/Info-1-Copy-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/07/Info-3-1-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/07/Info-2-1-scaled.jpg',
    ],
    benefits: [
      'Supports healthy urinary flow and everyday comfort',
      'Made with Saw Palmetto extract at a 320mg serving',
      'Includes Beta-Sitosterol to support normal prostate function',
      'Formulated with herbal extracts for men’s wellness',
      'No artificial fillers — 60 pure vegetarian capsules',
    ],
    ingredients: [
      { name: 'Saw Palmetto Extract', dose: '320mg', benefit: 'Traditionally used to support prostate & urinary health', image: '/ingredients/saw-palmetto.jpg' },
      { name: 'Beta-Sitosterol', dose: '100mg', benefit: 'Plant sterol that supports normal urinary function', image: '/ingredients/beta-sitosterol.jpg' },
      { name: 'Stinging Nettle Root', dose: '200mg', benefit: 'Herbal root with natural antioxidant properties', image: '/ingredients/nettle.jpg' },
    ],
    howToUse:
      'Take 2 capsules daily with meals, or as directed by your healthcare provider. For best results, use consistently as part of a balanced lifestyle.',
    category: "Men's Health",
    badge: 'Best Seller',
    rating: 4.8,
    reviewCount: 342,
    capsules: 60,
  },
  {
    id: 85,
    slug: 'advanced-liver-detox',
    name: 'Advanced Liver Detox',
    shortName: 'Liver Detox',
    tagline: 'Herbal formula with Milk Thistle to support healthy liver function and everyday wellness',
    price: 699,
    regularPrice: 1599,
    images: [
      'https://cms.amraj.in/wp-content/uploads/2025/07/IMG_6762-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/07/Info-1-2-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/07/Info-2-2-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/07/Info-3-2-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/07/Info-4-1-scaled.jpg',
    ],
    benefits: [
      'Milk Thistle (Silymarin) supports healthy liver function',
      'TUDCA helps support healthy bile flow',
      'NAC supports the body’s natural antioxidant, glutathione',
      'Formulated to support the liver’s natural cleansing process',
      'No artificial fillers — 60 pure vegetarian capsules',
    ],
    ingredients: [
      { name: 'Milk Thistle (Silymarin 80%)', dose: '300mg', benefit: 'Supports healthy liver function & cell protection', image: '/ingredients/milk-thistle.jpg' },
      { name: 'TUDCA', dose: '250mg', benefit: 'Supports healthy bile flow & liver cell wellness', image: '/ingredients/tudca.png' },
      { name: 'N-Acetyl L-Cysteine (NAC)', dose: '200mg', benefit: 'Supports glutathione, the body’s master antioxidant', image: '/ingredients/nac.png' },
    ],
    howToUse:
      'Take 2 capsules daily with meals, or as directed by your healthcare provider. For best results, use consistently for at least 30 days as part of a balanced lifestyle.',
    category: 'Liver Health',
    badge: 'Trending',
    rating: 4.7,
    reviewCount: 218,
    capsules: 60,
  },
  {
    id: 60,
    slug: 'weight-management-pro',
    name: 'Weight Management Pro+',
    shortName: 'Weight Pro+',
    tagline: 'Herbal metabolism formula to support your healthy weight management journey',
    price: 699,
    regularPrice: 2499,
    images: [
      'https://cms.amraj.in/wp-content/uploads/2025/06/IMG_6768-1-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/06/Info-1-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/06/Info-2-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/07/Info-3-scaled.jpg',
      'https://cms.amraj.in/wp-content/uploads/2025/07/Info-4-scaled.jpg',
    ],
    benefits: [
      'Garcinia Cambogia to help support a healthy appetite',
      'Green Coffee extract to support metabolism',
      'L-Carnitine to support everyday energy metabolism',
      'Designed to complement a balanced diet & active lifestyle',
      'No artificial fillers — 60 pure vegetarian capsules',
    ],
    ingredients: [
      { name: 'Garcinia Cambogia (60% HCA)', dose: '400mg', benefit: 'Herbal extract that supports a healthy appetite', image: '/ingredients/garcinia.jpg' },
      { name: 'Green Coffee Extract (50% CGA)', dose: '300mg', benefit: 'Antioxidant that supports metabolism', image: '/ingredients/green-coffee.png' },
      { name: 'L-Carnitine Tartrate', dose: '200mg', benefit: 'Amino acid that supports energy metabolism', image: '/ingredients/l-carnitine.jpg' },
    ],
    howToUse:
      'Take 2 capsules 30 minutes before meals with a glass of water. Best used alongside a balanced diet and regular exercise.',
    category: 'Weight Management',
    badge: 'Top Value',
    rating: 4.6,
    reviewCount: 189,
    capsules: 60,
  },
];

export function getProductBySlug(slug: string): StaticProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
