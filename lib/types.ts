// lib/types.ts
export interface Product {
    id: number;
    name: string;
    price: string;
    description?: string;
    short_description?: string;
    images?: { src: string }[];
    attributes?: { option: string }[];
  }
  