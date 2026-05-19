"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const total = searchParams.get('total');

  useEffect(() => {
    // Prevent back button
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href);
    });
  }, []);

  if (!orderId) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Icon Animation */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg className="w-14 h-14 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="text-2xl font-bold text-emerald-600">#{orderId}</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5">
                <p className="text-sm text-gray-600 mb-1">Order Amount</p>
                <p className="text-2xl font-bold text-blue-600">₹{total}</p>
              </div>
            </div>

            {paymentId && (
              <div className="mt-4 bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                <p className="text-sm font-mono text-gray-700 break-all">{paymentId}</p>
              </div>
            )}
          </div>

          {/* Delivery Timeline */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📦</span> Delivery Timeline
            </h3>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚚</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">Expected Delivery</p>
                  <p className="text-emerald-600 font-semibold text-xl">4-5 Business Days</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Your order will be carefully packaged and dispatched within 24 hours. 
                You will receive tracking details soon.
              </p>
            </div>
          </div>

          {/* WhatsApp Updates */}
          <div className="mb-6">
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-900 mb-2">WhatsApp Updates</h3>
                  <p className="text-green-700 mb-3">
                    You will receive order confirmation, tracking details, and delivery updates directly on your WhatsApp number.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    <span>Order Confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-800 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    <span>Tracking Details</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-800 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    <span>Delivery Updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span>✨</span> What Happens Next?
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">1.</span>
                <span>You will receive an order confirmation email within 5 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">2.</span>
                <span>WhatsApp message with order details will be sent shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">3.</span>
                <span>Your order will be dispatched within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">4.</span>
                <span>Tracking link will be shared once shipped</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl transition-all text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🛍️ Continue Shopping
          </Link>
          
          <a
            href="mailto:care@amraj.in?subject=Order%20Inquiry%20-%20%23${orderId}"
            className="block w-full bg-white border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 font-semibold py-4 rounded-xl transition-all text-center"
          >
            📧 Contact Support
          </a>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to assist you with any questions
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <a 
              href="mailto:care@amraj.in" 
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              <span>📧</span>
              care@amraj.in
            </a>
            <span className="hidden sm:block text-gray-400">|</span>
            <a 
              href="https://wa.me/919818400981" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              <span>💬</span>
              WhatsApp Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
