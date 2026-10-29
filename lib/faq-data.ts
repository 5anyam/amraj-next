/** Product FAQ content, keyed by short product family. Also serves the FAQPage
 *  JSON-LD on product pages, so keep questions/answers plain text. */

export interface FAQ {
  question: string;
  answer: string;
}

export const faqData: Record<string, FAQ[]> = {
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
      answer: "Dietary supplements work gradually and results vary from person to person. Herbal formulas like this are best used consistently for at least 3 months alongside a healthy lifestyle — that's when steady routines show their real value. This product is not intended to diagnose, treat, cure or prevent any disease."
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

export const defaultFAQs: FAQ[] = [
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
    answer: "Results may vary from person to person. For best results, use consistently for at least 3 months as part of a balanced lifestyle."
  },
  {
    question: "Are there any side effects?",
    answer: "Our products are generally well-tolerated. However, if you experience any adverse reactions, discontinue use and consult your healthcare provider."
  }
];

/** Resolves a product slug like "advanced-prostate-care" to its FAQ set. */
export function getFaqsForSlug(productSlug: string): FAQ[] {
  if (faqData[productSlug]) return faqData[productSlug];
  const key = Object.keys(faqData).find(
    (k) => productSlug.includes(k) || k.includes(productSlug.split('-')[0]),
  );
  return key ? faqData[key] : defaultFAQs;
}
