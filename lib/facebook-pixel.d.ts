// types/facebook-pixel.d.ts
declare global {
    interface Window {
      fbq: (action: string, eventName: string, parameters?: Record<string, unknown>) => void;
      _fbq?: (action: string, eventName: string, parameters?: Record<string, unknown>) => void;
      gtag: (command: string, ...args: unknown[]) => void;
      dataLayer: unknown[];
    }
  }
  
  export interface FacebookPixelParams {
    [key: string]: unknown; // ✅ Add this index signature
    content_ids?: string[];
    content_name?: string;
    content_type?: 'product' | 'product_group';
    value?: number;
    currency?: string;
    num_items?: number;
    order_id?: string;
  }
  
  export interface Product {
    id: number | string;
    name: string;
    price: string | number;
    quantity?: number;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  export {};
  