import React, { useState } from 'react'; // ✅ React import zaroori hai for types
import { 
  Sparkles, Leaf, CheckCircle, ShieldCheck, ThumbsUp, 
  FlaskConical, ArrowRight 
} from 'lucide-react';

type Feature = {
  icon: React.ReactNode; // ✅ safe for JSX
  title: string;
  desc: string;
  gradient: string;
};

type FeatureCardProps = {
  item: Feature;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  className?: string;
};

const FeatureCard = ({ item, isHovered, onHover, onLeave, className = "" }: FeatureCardProps) => (
  <div 
    className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 lg:p-8 transition-all duration-500 cursor-pointer
      ${isHovered ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-lg hover:shadow-xl'}
      border border-white/20 ${className}`}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    style={{
      transform: `translateY(${isHovered ? '-8px' : '0px'})`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    }}
  >
    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    
    <div className="relative z-10">
      <div className="mb-4 lg:mb-6 flex justify-center">
        <div className="p-3 lg:p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/30">
          {item.icon}
        </div>
      </div>
      <h3 className="text-lg lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4 text-center group-hover:text-gray-900 transition-colors">
        {item.title}
      </h3>
      <p className="text-sm lg:text-base text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors">
        {item.desc}
      </p>
      <div className="mt-4 lg:mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <ArrowRight className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  </div>
);

export default function AboutUsSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features: Feature[] = [
    {
      icon: <Leaf className="text-emerald-500 w-10 h-10" />,
      title: 'Plant-Based Formulas',
      desc: 'Pure herbs like Jamun, Kutki, Milk Thistle, and more — completely natural ingredients.',
      gradient: 'from-emerald-500/10 to-green-500/10'
    },
    {
      icon: <CheckCircle className="text-orange-500 w-10 h-10" />,
      title: 'Science-Backed',
      desc: 'Clinically studied ingredients with GMP-certified production and clean labels.',
      gradient: 'from-orange-500/10 to-red-500/10'
    },
    {
      icon: <Sparkles className="text-purple-500 w-10 h-10" />,
      title: 'Modern + Ayurvedic',
      desc: 'Perfect blend of ancient wisdom and modern lifestyle requirements.',
      gradient: 'from-purple-500/10 to-pink-500/10'
    }
  ];

  const trustFactors: Feature[] = [
    {
      icon: <ShieldCheck className="text-blue-500 w-10 h-10" />,
      title: 'Trusted Manufacturing',
      desc: 'Made in GMP-certified, ISO-compliant facilities with rigorous quality control.',
      gradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: <ThumbsUp className="text-green-500 w-10 h-10" />,
      title: 'Customer First',
      desc: 'Lightning-fast delivery, secure payments, and 24/7 dedicated support.',
      gradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      icon: <FlaskConical className="text-indigo-500 w-10 h-10" />,
      title: 'Clean & Transparent',
      desc: 'Zero hidden fillers or chemicals. Pure ingredients with readable labels.',
      gradient: 'from-indigo-500/10 to-purple-500/10'
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 py-20 overflow-hidden">
      {/* Background animations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-3xl opacity-15 animate-bounce" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 mb-8">
            <Sparkles className="w-5 h-5 text-teal-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">Trusted by 10,000+ customers</span>
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-orange-500 to-purple-600 mb-8 leading-tight">
            Rooted in Tradition,<br />
            <span className="text-4xl sm:text-5xl lg:text-6xl">Backed by Science</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            At <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Amraj</span>, 
            we create an innovative fusion of <span className='font-bold'> modern nutraceuticals and ancient herbal wisdom. </span>
            Our mission is to help you lead a naturally healthier life using ingredients you can trust and results you can feel.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {['🌿 100% Natural', '🔬 Clinically Tested', '✨ GMP Certified'].map((label, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                <span className="text-xl font-semibold text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features - Mobile optimized grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {features.map((item, index) => (
            <FeatureCard 
              key={index}
              item={item}
              isHovered={hoveredCard === `feature-${index}`}
              onHover={() => setHoveredCard(`feature-${index}`)}
              onLeave={() => setHoveredCard(null)}
              className={index === 2 ? "col-span-2 lg:col-span-1 max-w-md mx-auto lg:max-w-none" : ""}
            />
          ))}
        </div>

        {/* Trust Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 mb-8">
            <ShieldCheck className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-medium text-gray-600">Your trusted wellness partner</span>
          </div>
          <h3 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 mb-6">
            Why Trust Amraj?
          </h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
            We are committed to delivering transparency, quality, and results you can count on. 
            Whether you are taking your first step toward wellness or upgrading your routine, 
            Amraj is your trusted partner in the journey to better health.
          </p>
        </div>

        {/* Trust Factors - Mobile optimized grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {trustFactors.map((item, index) => (
            <FeatureCard 
              key={index}
              item={item}
              isHovered={hoveredCard === `trust-${index}`}
              onHover={() => setHoveredCard(`trust-${index}`)}
              onLeave={() => setHoveredCard(null)}
              className={index === 2 ? "col-span-2 lg:col-span-1 max-w-md mx-auto lg:max-w-none" : ""}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-teal-500 to-orange-500 p-1 rounded-2xl inline-block">
            <div className="bg-white rounded-xl px-8 py-6">
              <h4 className="text-2xl font-bold text-gray-800 mb-2">Ready to Transform Your Health?</h4>
              <p className="text-gray-600 mb-4">Join thousands who trust Amraj for their wellness journey</p>
              <button className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                Explore Our Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}