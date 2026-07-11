'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  productSlug: string;
  productName: string;
}

// FAQ Data for different products
const faqData: Record<string, FAQ[]> = {
  'prostate-care': [
    {
      question: "What is Amraj Advanced Prostate Care?",
      answer: "It's a herbal & nutraceutical dietary supplement formulated to support prostate health and everyday urinary comfort in men. It combines Saw Palmetto extract (320mg), Beta-Sitosterol (100mg) and Stinging Nettle Root (200mg) in easy-to-take vegetarian capsules."
    },
    {
      question: "What makes it different from other prostate supplements?",
      answer: "Rather than a single ingredient, it brings together three well-studied botanicals traditionally used to support men's urinary and prostate wellness — at meaningful, clearly labelled doses, with no proprietary-blend guesswork."
    },
    {
      question: "How do the ingredients work?",
      answer: "Each ingredient is included for its supportive role in everyday wellness:\n• Saw Palmetto — traditionally used to support prostate & urinary health\n• Beta-Sitosterol — a plant sterol that supports normal urinary function\n• Stinging Nettle Root — a herbal root with natural antioxidant properties"
    },
    {
      question: "Who is this product for?",
      answer: "It's designed for adult men who want to support their prostate and urinary wellness as part of a healthy lifestyle. If you have a medical condition or take medication, please consult your doctor before use."
    },
    {
      question: "Is it safe for daily use?",
      answer: "The ingredients are plant-based, non-hormonal and free from synthetic drugs and harmful additives. Use as directed on the label, and consult a healthcare professional if you are pregnant, nursing, on medication or have a health condition."
    },
    {
      question: "How should I take it?",
      answer: "Take 2 capsules daily with a meal, or as directed by your healthcare provider. For best results, use consistently as part of a balanced lifestyle."
    },
    {
      question: "Are there any side effects?",
      answer: "It's generally well-tolerated. It's made from high-quality, globally sourced ingredients and is free from harmful additives. Discontinue use and consult a doctor if you notice any discomfort."
    },
    {
      question: "When might I notice a difference?",
      answer: "Dietary supplements work gradually and results vary from person to person. Many people use it consistently for 8–12 weeks alongside a healthy lifestyle. This product is not intended to diagnose, treat, cure or prevent any disease."
    },
    {
      question: "Is it vegetarian and quality-tested?",
      answer: "Yes — 100% vegetarian capsules made with standardised extracts, manufactured in GMP-certified, ISO-approved and FSSAI-licensed facilities, with every batch lab-tested for purity."
    }
  ],
  'liver-detox': [
    {
      question: "What is Amraj Advanced Liver Detox?",
      answer: "It's a herbal & nutraceutical dietary supplement formulated to support healthy liver function and everyday wellness. It combines Milk Thistle (Silymarin 80%, 300mg), TUDCA (250mg) and N-Acetyl L-Cysteine / NAC (200mg) in vegetarian capsules."
    },
    {
      question: "What makes it different from other liver supplements?",
      answer: "It pairs well-studied nutraceuticals (TUDCA and NAC) with the time-honoured herb Milk Thistle, at meaningful, clearly labelled doses — no proprietary-blend guesswork."
    },
    {
      question: "How do the ingredients work?",
      answer: "Each ingredient is included for its supportive role:\n• Milk Thistle (Silymarin) — supports healthy liver function & cell protection\n• TUDCA — supports healthy bile flow & liver cell wellness\n• NAC — supports glutathione, the body's natural antioxidant"
    },
    {
      question: "Who is this product for?",
      answer: "It's designed for adults who want to support their liver health and overall wellness as part of a balanced lifestyle. If you have a medical condition or take medication, please consult your doctor before use."
    },
    {
      question: "How should I take it?",
      answer: "Take 2 capsules daily with a meal, or as directed by your healthcare provider. For best results, use consistently for at least 30 days as part of a balanced lifestyle."
    },
    {
      question: "Is it safe?",
      answer: "The ingredients are standardised and free from harmful additives, and it's generally well-tolerated. Consult a healthcare professional if you are pregnant, nursing, on medication or have a health condition."
    },
    {
      question: "Are there any side effects?",
      answer: "It's made from high-quality, globally sourced ingredients and is generally well tolerated. Discontinue use and consult a doctor if you notice any discomfort."
    },
    {
      question: "When might I notice a difference?",
      answer: "Supplements support the body gradually and results vary from person to person. Many people use it consistently for 4–12 weeks alongside a healthy diet and lifestyle. This product is not intended to diagnose, treat, cure or prevent any disease."
    },
    {
      question: "Is this product vegetarian and quality-tested?",
      answer: "Yes — 100% vegetarian capsules with standardised extracts, made in GMP-certified, ISO-approved and FSSAI-licensed facilities and lab-tested for purity."
    }
  ],
  'weight-management': [
    {
      question: "What is Amraj Weight Management Pro+?",
      answer: "It's a herbal metabolism dietary supplement formulated to support your healthy weight-management journey alongside a balanced diet and an active lifestyle. It combines Garcinia Cambogia (60% HCA, 400mg), Green Coffee extract (50% CGA, 300mg) and L-Carnitine (200mg) in vegetarian capsules."
    },
    {
      question: "How do the ingredients work?",
      answer: "Each ingredient supports everyday metabolism and wellness:\n• Garcinia Cambogia — a herbal extract that supports a healthy appetite\n• Green Coffee — an antioxidant that supports metabolism\n• L-Carnitine — an amino acid that supports energy metabolism"
    },
    {
      question: "What makes it different?",
      answer: "It brings together three well-studied ingredients at meaningful, clearly labelled doses to complement your diet and exercise — no proprietary blends, no harsh stimulants and no crash-diet promises."
    },
    {
      question: "Is it suitable for both men and women?",
      answer: "Yes — it's suitable for adults over 18. If you are pregnant, nursing, on medication or have a health condition, please consult your doctor before use."
    },
    {
      question: "How should I take it?",
      answer: "Take 2 capsules about 30 minutes before meals with a glass of water. It works best alongside balanced nutrition and regular activity."
    },
    {
      question: "When might I notice a difference?",
      answer: "A supplement is one part of a healthy routine — results depend on your diet, activity and consistency, and vary from person to person. Use it as part of a balanced lifestyle over several weeks. This product is not intended to diagnose, treat, cure or prevent any disease."
    },
    {
      question: "Is it safe for regular use?",
      answer: "All ingredients are plant-based and naturally sourced, with no hormones and no banned substances. Use as directed and consult a healthcare professional if needed."
    },
    {
      question: "Are there any side effects?",
      answer: "It's generally well tolerated and made from high-quality, globally sourced ingredients free from harmful additives. Discontinue use and consult a doctor if you notice any discomfort."
    },
    {
      question: "Can I take it on an empty stomach?",
      answer: "It's best taken about 30 minutes before meals with a glass of water."
    },
    {
      question: "Is it vegetarian and quality-tested?",
      answer: "Yes — 100% vegetarian capsules, made in GMP-certified, ISO-approved and FSSAI-licensed facilities and lab-tested for purity."
    }
  ]
};

const defaultFAQs: FAQ[] = [
  {
    question: "How should I take this product?",
    answer: "Follow the dosage instructions on the product label. Generally, take with water after meals for best absorption."
  },
  {
    question: "Is this product safe?",
    answer: "Yes, our products are made with high-quality, natural ingredients and are manufactured in GMP-certified facilities."
  },
  {
    question: "How long before I see results?",
    answer: "Results may vary, but most customers notice benefits within 2-4 weeks of consistent use. For best results, use for at least 8-12 weeks."
  },
  {
    question: "Are there any side effects?",
    answer: "Our products are generally well-tolerated. However, if you experience any adverse reactions, discontinue use and consult your healthcare provider."
  }
];

const ProductFAQ: React.FC<ProductFAQProps> = ({ productSlug, productName }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getFAQs = (): FAQ[] => {
    if (faqData[productSlug]) {
      return faqData[productSlug];
    }

    const slugKey = Object.keys(faqData).find(key => 
      productSlug.includes(key) || key.includes(productSlug.split('-')[0])
    );

    if (slugKey) {
      return faqData[slugKey];
    }

    return defaultFAQs;
  };

  const faqs = getFAQs();

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
