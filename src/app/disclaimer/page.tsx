'use client';

import React from 'react';
import { HEALTH_DISCLAIMER } from '../../../lib/products-data';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white text-[#17191f] py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-3">Good to know</span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Disclaimer</h1>
        <div className="bg-[#f6f8f7] border border-[#e9eaee] rounded-2xl p-6 md:p-8 text-left">
          <p className="text-[15px] leading-7 text-[#5c6470]">{HEALTH_DISCLAIMER}</p>
          <p className="text-[15px] leading-7 text-[#5c6470] mt-4">
            These statements have not been evaluated by the Food and Drug Administration (FDA) or FSSAI. Our products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any supplement.
          </p>
        </div>
      </div>
    </div>
  );
}
