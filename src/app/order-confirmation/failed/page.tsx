"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function FailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-lg text-gray-600">Your payment could not be processed</p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          
          {orderId && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6">
              <p className="text-sm text-red-600 mb-1">Order ID</p>
              <p className="text-xl font-bold text-red-700">#{orderId}</p>
            </div>
          )}

          {error && (
            <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-xl p-5 mb-6">
              <p className="text-sm font-semibold text-orange-800 mb-1">Error Details:</p>
              <p className="text-orange-700">{decodeURIComponent(error)}</p>
            </div>
          )}

          {/* Reasons */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💡</span> Common Reasons for Payment Failure
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-500 mt-1">•</span>
                <span>Insufficient balance in your account</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-500 mt-1">•</span>
                <span>Incorrect card details or CVV</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-500 mt-1">•</span>
                <span>Network connectivity issues</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-500 mt-1">•</span>
                <span>Transaction declined by your bank</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-red-500 mt-1">•</span>
                <span>Daily transaction limit exceeded</span>
              </li>
            </ul>
          </div>

          {/* What to Do */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span>🔄</span> What Should You Do?
            </h3>
            <ol className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">1.</span>
                <span>Check your bank balance and card details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">2.</span>
                <span>Try using a different payment method</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">3.</span>
                <span>Contact your bank if the issue persists</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">4.</span>
                <span>Retry the payment after resolving the issue</span>
              </li>
            </ol>
          </div>

          {/* Support Contact */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <span>📞</span> Need Assistance?
            </h3>
            <p className="text-emerald-800 mb-4">
              Our support team is ready to help you complete your purchase
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:care@amraj.in?subject=Payment%20Failed%20-%20Order%20%23${orderId || 'N/A'}"
                className="flex items-center gap-3 bg-white p-4 rounded-lg hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email Support</p>
                  <p className="text-sm text-emerald-600">care@amraj.in</p>
                </div>
              </a>
              
              <a 
                href="https://wa.me/919818400981?text=Hi,%20I%20need%20help%20with%20my%20payment"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white p-4 rounded-lg hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp Support</p>
                  <p className="text-sm text-green-600">+91 98184 00981</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.back()}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🔄 Retry Payment
          </button>
          
          <Link
            href="/"
            className="block w-full bg-white border-2 border-gray-300 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 font-semibold py-4 rounded-xl transition-all text-center"
          >
            🏠 Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderFailed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
      </div>
    }>
      <FailedContent />
    </Suspense>
  );
}
