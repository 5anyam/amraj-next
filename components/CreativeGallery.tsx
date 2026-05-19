'use client';

import React from 'react';
import Image from 'next/image';

interface ProductCreativesProps {
  productSlug: string;
}

// Image URLs for different products - Bas yahan links add karo
const creativesData: Record<string, string[]> = {
  'prostate-care': [
    'https://cms.amraj.in/wp-content/uploads/2025/10/1-scaled.jpg',
    'https://cms.amraj.in/wp-content/uploads/2025/10/2-scaled.jpg',
  ]
  // Aur products yahan add karo...
};

const ProductCreatives: React.FC<ProductCreativesProps> = ({ productSlug }) => {
  // Get images based on product slug
  const getImages = (): string[] => {
    if (creativesData[productSlug]) {
      return creativesData[productSlug];
    }

    // Check for partial matches
    const slugKey = Object.keys(creativesData).find(key => 
      productSlug.includes(key) || key.includes(productSlug.split('-')[0])
    );

    if (slugKey) {
      return creativesData[slugKey];
    }

    return []; // No creatives found
  };

  const images = getImages();

  // Agar images nahi hain to kuch display mat karo
  if (images.length === 0) return null;

  return (
    <div className="w-full">
      {images.map((imageUrl, index) => (
        <div key={index} className="w-full">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={imageUrl}
              alt={`Product creative ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0} // First image loads faster
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCreatives;
