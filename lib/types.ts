// lib/types.ts
export interface ImageData {
    src: string;
  }
  
  export interface Attribute {
    option: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    price: string;
    description?: string;
    short_description?: string;
    images?: ImageData[];
    attributes?: Attribute[];
  }
  