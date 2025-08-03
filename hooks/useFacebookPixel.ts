// hooks/useFacebookPixel.ts
'use client';

import { useCallback } from 'react';
import type { FacebookPixelParams, Product, CartItem } from '../lib/facebook-pixel';

export const useFacebookPixel = () => {
  const trackEvent = useCallback((eventName: string, parameters: FacebookPixelParams = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
      // ✅ Type assertion fix
      window.fbq('track', eventName, parameters as Record<string, unknown>);
      console.log(`FB Pixel: ${eventName}`, parameters);
    }
  }, []);

  const trackViewContent = useCallback((product: Product) => {
    trackEvent('ViewContent', {
      content_ids: [product.id.toString()],
      content_name: product.name,
      content_type: 'product',
      value: parseFloat(product.price.toString()),
      currency: 'INR',
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback((product: Product, quantity: number = 1) => {
    trackEvent('AddToCart', {
      content_ids: [product.id.toString()],
      content_name: product.name,
      content_type: 'product',
      value: parseFloat(product.price.toString()) * quantity,
      currency: 'INR',
      num_items: quantity,
    });
  }, [trackEvent]);

  const trackInitiateCheckout = useCallback((cartItems: CartItem[], total: number) => {
    trackEvent('InitiateCheckout', {
      content_ids: cartItems.map(item => item.id.toString()),
      content_type: 'product',
      value: parseFloat(total.toString()),
      currency: 'INR',
      num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  }, [trackEvent]);

  const trackAddPaymentInfo = useCallback((cartItems: CartItem[], total: number) => {
    trackEvent('AddPaymentInfo', {
      content_ids: cartItems.map(item => item.id.toString()),
      content_type: 'product',
      value: parseFloat(total.toString()),
      currency: 'INR',
    });
  }, [trackEvent]);

  const trackPurchase = useCallback((orderItems: CartItem[], total: number, orderId: string) => {
    trackEvent('Purchase', {
      content_ids: orderItems.map(item => item.id.toString()),
      content_name: 'Amraj Wellness Order',
      content_type: 'product',
      value: parseFloat(total.toString()),
      currency: 'INR',
      order_id: orderId,
      num_items: orderItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  }, [trackEvent]);

  const trackContact = useCallback(() => {
    trackEvent('Contact');
  }, [trackEvent]);

  const trackSubscribe = useCallback((value?: number) => {
    trackEvent('Subscribe', value ? { value, currency: 'INR' } : {});
  }, [trackEvent]);

  const trackSearch = useCallback((searchString: string) => {
    trackEvent('Search', { content_name: searchString });
  }, [trackEvent]);

  const trackAddToWishlist = useCallback((product: Product) => {
    trackEvent('AddToWishlist', {
      content_ids: [product.id.toString()],
      content_name: product.name,
      content_type: 'product',
      value: parseFloat(product.price.toString()),
      currency: 'INR',
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackContact,
    trackSubscribe,
    trackSearch,
    trackAddToWishlist,
  };
};
