'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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
      answer: "It's a premium Ayurvedic + nutraceutical formula crafted to support prostate health, improve urinary function, and promote male vitality. It blends clinically backed ingredients like Beta Sitosterol, Saw Palmetto, Stinging Nettle Root, Lycopene, and Pumpkin Seed Extract with time-tested herbs like Gokshura, Varuna, Chandraprabha Vati. And this formulation is powered by Shilajit to promote male vitality."
    },
    {
      question: "What makes it different from other prostate supplements?",
      answer: "Most products use single action formulas. Amraj Advanced Prostate Care is a multi-target approach - it reduces prostate inflammation, supports healthy urine flow, improves bladder emptying, and boosts overall male wellness."
    },
    {
      question: "How does it work?",
      answer: "• Reduces inflammation: Beta Sitosterol, Stinging Nettle, and Curcumin\n• Supports prostate size & function: Saw Palmetto, Pumpkin Seed, Pygeum Bark\n• Improves urinary flow: Varuna, Punarnava, Neem\n• Boosts energy & vitality: Shilajit, Gokshura, Lycopene"
    },
    {
      question: "Why combine modern science with Ayurvedic herbs?",
      answer: "Modern nutraceuticals deliver precision and clinical results, while Ayurveda offers safe, holistic support. This combination gives both fast relief and long-term protection for prostate health."
    },
    {
      question: "Who should take this product?",
      answer: "Men over 40, or younger men experiencing:\n• Frequent night urination\n• Weak urine stream or incomplete bladder emptying\n• Prostate enlargement symptoms\n• Reduced vitality or energy levels"
    },
    {
      question: "Is it safe for long-term use?",
      answer: "Yes. All ingredients are plant-based, non-hormonal, and safe for daily use under recommended dosage. It's free from synthetic drugs and harmful additives."
    },
    {
      question: "How should I take it?",
      answer: "Take 1 capsule twice daily after meals, with water. For best results, use consistently for 3 months and maintain a healthy lifestyle."
    },
    {
      question: "Are there any side effects?",
      answer: "It's generally well-tolerated. Our Product is made from high quality globally sourced ingredients and is free from harmful additives."
    },
    {
      question: "How soon can I expect results?",
      answer: "Most users notice improved urine flow and reduced night-time urination within 2–4 weeks. Full benefits for prostate health are typically seen over 8–12 weeks."
    },
    {
      question: "Is it vegetarian and premium quality?",
      answer: "Yes. It's 100% vegetarian, made with pharmaceutical-grade extracts, and produced in GMP-certified, ISO-approved facilities for maximum purity and effectiveness."
    }
  ],
  'liver-detox': [
  {
    question: "What is Amraj Advanced Liver Detox?",
    answer: "It's a premium Ayurvedic + nutraceutical formula designed to support healthy liver function, aid detoxification, and promote overall wellness."
  },
  {
    question: "What makes Amraj Advanced Liver Detox different from other liver supplements?",
    answer: "Unlike generic products, our formula is an innovative fusion of clinically backed nutraceuticals like TUDCA, NAC, and Glutathione with time-tested herbs like Milk Thistle, Triphala, and Turmeric, delivering both rapid and long-term liver health benefits."
  },
  {
    question: "How does it work?",
    answer: "Our formula supports the liver's natural detox pathways by:\n• Protecting liver cells from oxidative stress\n• Promoting bile flow and fat metabolism\n• Helping flush out toxins and metabolic waste\n• Supporting energy and digestion"
  },
  {
    question: "Why combine modern science with Ayurveda?",
    answer: "Modern science offers precision, standardised potency, and targeted action, while Ayurveda brings holistic healing and centuries of safe, proven herbal wisdom. Together, they offer complete liver protection, detox, and regeneration."
  },
  {
    question: "Who should take this product?",
    answer: "It's ideal for adults who:\n• Want to maintain liver health despite lifestyle, alcohol, or processed food consumption\n• Have fatty liver or sluggish digestion\n• Are undergoing detox or weight management programs\n• Want to protect their liver from daily environmental toxins"
  },
  {
    question: "How does it support liver health?",
    answer: "• Protects: Milk Thistle, NAC, and Glutathione shield liver cells from oxidative stress\n• Cleanses: Triphala, Turmeric, and Green Tea Extract help flush toxins\n• Regenerates: TUDCA and L-Ornithine support cell repair and bile flow\n• Energises: Ginseng, Ginkgo, and Astragalus boost energy & metabolism"
  },
  {
    question: "How should I take it?",
    answer: "Take 1 capsule twice daily with water, preferably after meals, or as directed by your healthcare provider. For best results, use consistently for 90 days for full body detox."
  },
  {
    question: "Are there any side effects?",
    answer: "Our product is made from high-quality, globally sourced ingredients and is free from harmful additives. It is generally well tolerated."
  },
  {
    question: "How long before I notice results?",
    answer: "Some users feel lighter, more energetic, and experience improved digestion within 7–10 days. However, noticeable liver health improvements usually occur over 4–12 weeks of consistent use."
  },
  {
    question: "Is this product vegetarian and premium quality?",
    answer: "Yes. It's 100% vegetarian, formulated with pharmaceutical-grade nutraceuticals, standardised herbal extracts, and manufactured in GMP-certified, ISO-approved facilities for maximum purity and effectiveness."
  }
],
  'weight-management': [
  {
    question: "What is Amraj Weight Management Pro+?",
    answer: "A scientifically formulated weight management capsule that combines clinically backed nutraceuticals like Garcinia Cambogia, Green Coffee Bean, L-Carnitine, and Apple Cider Vinegar with time-tested Ayurvedic herbs like Moringa, Guggal, Fenugreek, Shilajit, and Cinnamon for effective and natural weight support."
  },
  {
    question: "How does it work for weight management?",
    answer: "• Blocks excess fat formation (HCA from Garcinia Cambogia)\n• Boosts metabolism & energy (Green Coffee Bean, L-Carnitine, Shilajit)\n• Controls appetite & cravings (Fenugreek, Caralluma)\n• Improves digestion & detox (Moringa, Apple Cider Vinegar, Cinnamon)"
  },
  {
    question: "What makes it different from other weight loss supplements?",
    answer: "Most formulas focus only on fat burning. Amraj Weight Management Pro+ uses a 4-in-1 approach — burn fat, block fat, suppress appetite, and detox — ensuring sustainable results without crash diets or fatigue."
  },
  {
    question: "Is it suitable for both men and women?",
    answer: "Yes, it's safe and effective for both men and women over the age of 18."
  },
  {
    question: "How should I take it for best results?",
    answer: "Take 1 capsule twice daily, 30 minutes before meals, with water. Combine with balanced nutrition and regular activity for maximum results."
  },
  {
    question: "How soon can I expect to see changes?",
    answer: "Many users notice reduced bloating and improved energy in the first 2 weeks. Visible weight and inch loss usually occur within 4–6 weeks with consistent use."
  },
  {
    question: "Is it safe for long-term use?",
    answer: "Yes, all ingredients are plant based and naturally sourced. It contains no synthetic fat burners, no hormones, or no banned substances."
  },
  {
    question: "Does it have any side effects?",
    answer: "It's generally well tolerated. Our Product is made from high quality, globally sourced ingredients and is free from harmful additives."
  },
  {
    question: "Can I take it on an empty stomach?",
    answer: "Yes, it's best taken 30 minutes before meals for optimal absorption and appetite control."
  },
  {
    question: "Is it vegetarian and premium quality?",
    answer: "Yes, it's 100% vegetarian, made from pharmaceutical grade nutraceutical, and manufactured in GMP-certified, ISO-approved facilities for purity and effectiveness."
  }
]
};

// Default FAQs for products not specifically listed
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

  // Get FAQs based on product slug
  const getFAQs = (): FAQ[] => {
    // Check for exact slug match
    if (faqData[productSlug]) {
      return faqData[productSlug];
    }

    // Check for partial matches (for products with variations)
    const slugKey = Object.keys(faqData).find(key => 
      productSlug.includes(key) || key.includes(productSlug.split('-')[0])
    );

    if (slugKey) {
      return faqData[slugKey];
    }

    // Return default FAQs if no match found
    return defaultFAQs;
  };

  const faqs = getFAQs();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-white text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-teal-100 text-center mt-2">
          Everything you need to know about {productName}
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

      {/* Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 text-center border-t border-gray-200">
        <p className="text-gray-600 text-sm mb-3">
          Still have questions? We are here to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold px-6 py-2 rounded-full text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            📱 WhatsApp Support
          </button>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-full text-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            📧 Email Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFAQ;
