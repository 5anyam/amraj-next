import { motion } from 'framer-motion';
import { Sparkles, Leaf, CheckCircle, ShieldCheck, ThumbsUp, FlaskConical } from 'lucide-react';

export default function AboutUsSection() {
  return (
    <section className="relative bg-teal-50 py-24 overflow-hidden">
      <div className="absolute top-0 left-0 w-48 h-48 bg-orange-500 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 animate-bounce" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-4xl text-teal-600 mb-6"
        >
          Rooted in Tradition, Backed by Science
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-gray-700 max-w-3xl mx-auto mb-14"
        >
          At <span className="text-orange-500 font-semibold">Amraj Wellness</span>, we blend ancient Ayurvedic wisdom with modern science to create clean, effective wellness solutions. Our mission is to help you lead a naturally healthier life using ingredients you can trust and results you can feel.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Leaf className="text-teal-500 w-8 h-8" />, 
              title: 'Plant-Based Formulas', 
              desc: 'Pure herbs like Jamun, Kutki, Milk Thistle, and more — no nasties.'
            },
            {
              icon: <CheckCircle className="text-orange-500 w-8 h-8" />, 
              title: 'Science-Backed', 
              desc: 'Clinically studied ingredients, GMP-certified production, and clean labels.'
            },
            {
              icon: <Sparkles className="text-teal-500 w-8 h-8 animate-spin-slow" />, 
              title: 'Modern + Ayurvedic', 
              desc: 'A bridge between timeless traditions and the needs of today’s lifestyle.'
            }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold text-teal-700 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.h3 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-3xl text-teal-500 mb-6"
        >
          Why Trust Amraj Wellness?
        </motion.h3>

        <motion.p 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-md text-gray-700 max-w-2xl mx-auto mb-14"
        >
          We are committed to delivering transparency, quality, and results you can count on. Whether you are taking your first step toward wellness or upgrading your routine, Amraj is your trusted partner.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="text-teal-500 w-8 h-8" />, 
              title: 'Trusted Manufacturing', 
              desc: 'Made in GMP-certified, ISO-compliant facilities with stringent quality checks.'
            },
            {
              icon: <ThumbsUp className="text-orange-500 w-8 h-8" />, 
              title: 'Customer First', 
              desc: 'Fast delivery, secure payment, and dedicated support to make your journey seamless.'
            },
            {
              icon: <FlaskConical className="text-teal-500 w-8 h-8" />, 
              title: 'Clean & Transparent', 
              desc: 'No hidden fillers or chemicals. Only ingredients that work and labels you can read.'
            }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-semibold text-teal-700 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
