'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { FAQ, getFaqsForSlug } from '../lib/faq-data';

interface ProductFAQProps {
  productSlug: string;
  productName: string;
}

const ProductFAQ: React.FC<ProductFAQProps> = ({ productSlug, productName }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = getFaqsForSlug(productSlug);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Modern Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center gap-3 mb-2">
          <QuestionMarkCircleIcon className="h-8 w-8 text-emerald-600" />
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-gray-600 text-center text-sm lg:text-base">
          Everything you need to know about {productName}
        </p>
      </div>

      {/* FAQ Items */}
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div key={index} className="group">
              <button
                className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:bg-gray-50"
                onClick={() => toggleFAQ(index)}
                aria-expanded={isOpen}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
                      isOpen 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-200 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                    }`}>
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base leading-relaxed pr-2">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon className={`h-5 w-5 transition-colors duration-200 ${
                      isOpen ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-600'
                    }`} />
                  </div>
                </div>
              </button>
              
              {/* Answer with Smooth Animation */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen 
                  ? 'max-h-[800px] opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="ml-9 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-4 border-l-4 border-emerald-500">
                    <p className="text-gray-700 text-sm lg:text-base leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
        <p className="text-gray-700 text-sm mb-3">
          Still have questions? We are here to help!
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default ProductFAQ;
