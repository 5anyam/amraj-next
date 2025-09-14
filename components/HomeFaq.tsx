'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
}

const HomeFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Static FAQ data for home page
  const faqs: FAQ[] = [
    {
      question: "What is Amraj and why should I choose it over other brands?",
      answer: "Amraj is where ancient Ayurvedic wisdom meets modern nutraceutical science. We don't just sell supplements we deliver result driven wellness programs backed by premium ingredients, and measurable outcomes."
    },
    {
      question: "Are your products actually effective or just another wellness hype?",
      answer: "Every formula is scientifically crafted with clinically backed extracts and in therapeutic dosages, so you don't just feel better, you see and track real progress within the first few weeks."
    },
    {
      question: "What makes your products premium?",
      answer: "We source highest-grade herbal extracts (standardized for active compounds), combine them with pure nutraceutical actives, and produce them in GMP-certified, ISO-approved facilities — ensuring unmatched potency, purity, and safety."
    },
    {
      question: "Can I trust your safety standards?",
      answer: "Yes all Amraj products are 100% vegetarian, free from steroids, banned substances, artificial hormones, and heavy metals, with lab-tested quality assurance."
    },
    {
      question: "Will I see quick results or do I have to wait months?",
      answer: "We design our formulas for noticeable results in 2–4 weeks, while recommending 90 day programs for complete transformation."
    },
    {
      question: "Which problems do your products solve?",
      answer: "Our range covers weight loss, liver detox, prostate care, gut health, and immunity boost all in non-hormonal, plant-based, science-backed formulas."
    },
    {
      question: "Are your supplements habit-forming?",
      answer: "No. All our products are non-addictive, non-habit forming, and safe for long-term wellness routines when taken as recommended."
    },
    {
      question: "Can I combine different Amraj products for better results?",
      answer: "Yes — our formulas are synergistically designed to complement each other. For example, pairing our Advanced Liver Detox with Weight Management Pro+ can accelerate fat loss, improve digestion, and boost overall wellness."
    },
    {
      question: "Do you ship Pan-India?",
      answer: "Yes — we deliver across India with safe, hygienic and premium packaging, and most orders arrive within 3–5 working days."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white px-4 rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-white text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-teal-100 text-center mt-2">
          Everything you need to know about Amraj
        </p>
      </div>

      {/* FAQ Items */}
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index} className="group">
            <button
              className="w-full px-6 py-5 text-left hover:bg-gradient-to-r hover:from-teal-50 hover:to-orange-50 transition-all duration-300 focus:outline-none focus:bg-teal-50"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 text-sm lg:text-base pr-4 leading-relaxed">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-teal-600 transition-transform duration-300" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400 group-hover:text-teal-600 transition-all duration-300" />
                  )}
                </div>
              </div>
            </button>
            
            {/* Answer */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              <div className="px-6 pb-5">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border-l-4 border-teal-500">
                  <p className="text-gray-700 text-sm lg:text-base leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 text-center border-t border-gray-200">
        <p className="text-gray-600 text-sm mb-3">
          Ready to start your wellness journey?
        </p>
        <div className="flex justify-center">
          <a
            href="https://www.amazon.in/s?k=AMRAJ&ref=bl_dp_s_web_0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Amazon icon (inline SVG) */}
            <img className='h-8 w-8' src="/Amazon_icon.png" alt='amazon-img' height={100} width={100}/>
            Buy now on Amazon
          </a>
        </div>
      </div>

    </div>
  );
};

export default HomeFAQ;
