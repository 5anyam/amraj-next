'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
}

const HomeFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first one by default for engagement

  const faqs: FAQ[] = [
    {
      question: "What makes Amraj different from others?",
      answer: "We blend traditional herbal wisdom with modern nutraceutical science. Our formulas use well-researched, standardised ingredients at meaningful, clearly labelled doses — no proprietary-blend guesswork."
    },
    {
      question: "What quality standards do you follow?",
      answer: "Every formula uses standardised herbal extracts and pure nutraceuticals, manufactured in GMP-certified, ISO-approved and FSSAI-licensed facilities, with every batch lab-tested for purity."
    },
    {
      question: "What defines your 'Premium' quality?",
      answer: "We source standardised herbal extracts (for consistent active compounds), pair them with pure nutraceuticals, and manufacture in GMP-certified, ISO-approved facilities to a high quality standard."
    },
    {
      question: "Is it safe for regular use?",
      answer: "Our products are 100% vegetarian, non-hormonal, steroid-free and heavy-metal tested. Use as directed on the label, and consult a healthcare professional if you are pregnant, nursing, on medication or have a health condition."
    },
    {
      question: "When might I notice a difference?",
      answer: "Dietary supplements support the body gradually and results vary from person to person. For best results, use consistently as part of a balanced lifestyle. These products are not intended to diagnose, treat, cure or prevent any disease."
    },
    {
      question: "Do you ship Pan-India?",
      answer: "Yes, we deliver across India with premium, hygienic packaging. Most orders arrive within 3-5 business days via secure courier partners."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      
      {/* Minimal Header */}
      <div className="text-center mb-10">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 mb-4">
            <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Support</span>
         </div>
         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Common Questions
         </h2>
      </div>

      {/* Modern Accordion Stack */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`
               group rounded-2xl transition-all duration-300 border
               ${openIndex === index 
                 ? 'bg-white border-gray-200 shadow-lg scale-[1.01]' 
                 : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50'}
            `}
          >
            <button
              className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className={`font-semibold text-base lg:text-lg transition-colors ${openIndex === index ? 'text-black' : 'text-gray-600 group-hover:text-black'}`}>
                {faq.question}
              </span>
              <span className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                {openIndex === index ? (
                   <ChevronUpIcon className="h-4 w-4" />
                ) : (
                   <ChevronDownIcon className="h-4 w-4" />
                )}
              </span>
            </button>
            
            {/* Smooth Expand Answer */}
            <div 
               className={`overflow-hidden transition-all duration-300 ease-in-out ${
                 openIndex === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
               }`}
            >
              <div className="px-6 pb-6 pt-0">
                <p className="text-gray-500 leading-relaxed text-base border-t border-gray-100 pt-4 mt-2">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Bottom CTA */}
      <div className="mt-12 text-center">
         <p className="text-gray-500 mb-4 text-sm">Still have questions? We are here to help.</p>
         <a
            href="https://www.amazon.in/s?k=AMRAJ&ref=bl_dp_s_web_0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
         >
            <span className="text-sm">Buy on Amazon</span>
            <img className='h-5 w-auto brightness-0 invert' src="/Amazon_icon.png" alt='amazon' />
         </a>
      </div>

    </div>
  );
};

export default HomeFAQ;
