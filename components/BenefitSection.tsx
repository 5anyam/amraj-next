'use client';

import { motion } from 'framer-motion';
import { FaLeaf, FaLock, FaTruck, FaDna } from 'react-icons/fa';

const features = [
  {
    title: 'Scientifically Formulated',
    description:
      'All products are made with quality ingredients, evidence-based research, and quality assurance.',
    icon: <FaDna className="text-teal-500 text-4xl mb-4" />,
  },
  {
    title: 'Vegan & Cruelty-Free',
    description:
      'Blue wellness means sustainable choices — vegan, cruelty-free, and eco-packaging.',
    icon: <FaLeaf className="text-teal-500 text-4xl mb-4" />,
  },
  {
    title: 'Fast Delivery',
    description:
      'We ship pan-India with speedy, reliable doorstep delivery.',
    icon: <FaTruck className="text-teal-500 text-4xl mb-4" />,
  },
  {
    title: 'Secure Payment',
    description:
      'All payments secured by Razorpay & SSL encryption.',
    icon: <FaLock className="text-teal-500 text-4xl mb-4" />,
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
          >
            <div className="flex justify-center">{f.icon}</div>
            <h3 className="text-orange-500 font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
