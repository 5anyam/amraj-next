export interface ProductIngredient {
  name: string;
  dose: string;
  benefit: string;
}

export interface StaticProduct {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  regularPrice: number;
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

export const PRODUCTS: StaticProduct[] = [
  {
    id: 86,
    slug: 'advanced-prostate-care',
    name: 'Advanced Prostate Care',
    shortName: 'Prostate Care',
    tagline: 'Clinically studied formula for prostate health & urinary comfort',
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
      'Supports healthy urinary flow & reduces urgency',
      'Clinically studied Saw Palmetto at 320mg dose',
      'Beta-Sitosterol manages prostate size naturally',
      'Reduces frequent night-time bathroom trips',
      'No artificial fillers — 60 pure capsules',
    ],
    ingredients: [
      { name: 'Saw Palmetto Extract', dose: '320mg', benefit: 'Core prostate & urinary health' },
      { name: 'Beta-Sitosterol', dose: '100mg', benefit: 'Reduces urinary symptoms' },
      { name: 'Stinging Nettle Root', dose: '200mg', benefit: 'Anti-inflammatory support' },
    ],
    howToUse:
      'Take 2 capsules daily with meals, or as directed by your healthcare provider. Best results seen after 4–6 weeks of consistent use.',
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
    tagline: 'Premium detox formula to cleanse, protect & revitalise your liver',
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
      'Milk Thistle supports natural liver regeneration',
      'TUDCA promotes healthy bile flow & liver cells',
      'NAC boosts glutathione — the master antioxidant',
      'Reduces liver inflammation & fatty liver symptoms',
      'No artificial fillers — 60 pure capsules',
    ],
    ingredients: [
      { name: 'Milk Thistle (Silymarin 80%)', dose: '300mg', benefit: 'Liver regeneration & protection' },
      { name: 'TUDCA', dose: '250mg', benefit: 'Bile flow & hepatocyte health' },
      { name: 'N-Acetyl L-Cysteine (NAC)', dose: '200mg', benefit: 'Glutathione precursor & antioxidant' },
    ],
    howToUse:
      'Take 2 capsules daily with meals, or as directed by your healthcare provider. Use for a minimum of 30 days for best results.',
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
    tagline: 'Advanced formula to boost metabolism, burn fat & control appetite',
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
      'Garcinia Cambogia naturally suppresses appetite',
      'Green Coffee Extract accelerates fat metabolism',
      'L-Carnitine converts stored fat into usable energy',
      'Supports healthy, sustainable weight management',
      'No artificial fillers — 60 pure capsules',
    ],
    ingredients: [
      { name: 'Garcinia Cambogia (60% HCA)', dose: '400mg', benefit: 'Appetite suppression & fat inhibition' },
      { name: 'Green Coffee Extract (50% CGA)', dose: '300mg', benefit: 'Metabolism & fat oxidation' },
      { name: 'L-Carnitine Tartrate', dose: '200mg', benefit: 'Fat-to-energy conversion' },
    ],
    howToUse:
      'Take 2 capsules 30 minutes before meals with a glass of water. Combine with a balanced diet and regular exercise for best results.',
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
