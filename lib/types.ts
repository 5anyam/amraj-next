// lib/types.ts
export interface ImageData {
    src: string;
  }
  
  export interface Attribute {
    option: string;
  }
  
  export interface Product {
    id: number | string;
  name: string;
  slug: string;
  price: string | number; // Sale price
  regular_price?: string | number; // Original price
  images?: { src: string }[];
  short_description?: string;
  category?: string;
  average_rating?: string; // WooCommerce gives rating as string
  rating_count?: number;
  badge?: "New" | "Sale";
  }
  