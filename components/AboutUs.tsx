import React from 'react';
import { 
  Sparkles, Leaf, CheckCircle, ShieldCheck, ThumbsUp, 
  FlaskConical, ArrowRight 
} from 'lucide-react';

type Feature = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  bg: string;
};

// Widget Card Component
const FeatureCard = ({ item }: { item: Feature }) => (
  <div className="group bg-white rounded-[2rem] p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col items-start">
    
    {/* Icon Widget */}
    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
      {item.icon}
    </div>
    
    {/* Content */}
    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black">
      {item.title}
    </h3>
    <p className="text-gray-500 leading-relaxed text-sm lg:text-base mb-4 flex-1">
      {item.desc}
    </p>

    {/* 'Learn More' Arrow (App style interaction) */}
    <div className="flex items-center text-sm font-semibold text-gray-400 group-hover:text-gray-900 transition-colors mt-auto">
      <span>Learn more</span>
      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

export default function AboutUsSection() {
  
  const features: Feature[] = [
    {
      icon: <Leaf className="w-7 h-7" />,
      title: 'Plant-Based',
      desc: '100% natural formulas using pure herbs like Moringa & Green Tea.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: <CheckCircle className="w-7 h-7" />,
      title: 'Science-Backed',
      desc: 'Clinically studied ingredients with verified clean labels.',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      icon: <Sparkles className="w-7 h-7" />,
      title: 'Modern Ayurveda',
      desc: 'Ancient wisdom optimized for your modern lifestyle.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  const trustFactors: Feature[] = [
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: 'Certified Safe',
      desc: 'GMP & ISO compliant facilities ensuring top quality.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: <ThumbsUp className="w-7 h-7" />,
      title: 'Customer First',
      desc: '24/7 support and secure, lightning-fast delivery.',
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    {
      icon: <FlaskConical className="w-7 h-7" />,
      title: 'Clean Label',
      desc: 'Zero hidden fillers. What you read is what you get.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <section className="py-20 bg-gray-50/50 relative overflow-hidden font-sans">
      
      {/* Subtle App-like Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl mix-blend-multiply" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl mix-blend-multiply" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* -- SECTION 1: Brand Story -- */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block mb-4">
             <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 shadow-sm">
                Who We Are
             </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
             Rooted in Tradition. <br/>
             <span className="text-gray-400">Verified by Science.</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            At <span className="font-semibold text-black">Amraj</span>, we bridge the gap between ancient herbal wisdom and modern nutraceuticals. 
            Designed for the <span className="font-semibold text-black">modern you</span>.
          </p>
        </div>

        {/* -- WIDGET GRID 1 -- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {features.map((item, index) => (
            <FeatureCard key={index} item={item} />
          ))}
        </div>

        {/* -- SECTION 2: Trust Signals -- */}
        <div className="bg-black rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
           
           {/* Dark Mode App Card Vibe */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-gray-800 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 text-orange-400 font-bold tracking-wide uppercase text-xs mb-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span>The Amraj Promise</span>
                 </div>
                 <h3 className="text-3xl md:text-4xl font-bold mb-6">
                    Why 10,000+ people <br/> trust us daily.
                 </h3>
                 <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md">
                    Transparency is not just a buzzword for us. It is our entire business model. From farm to bottle, we ensure purity you can verify.
                 </p>
                 <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg active:scale-95 transform duration-200">
                    Explore Our Standards
                 </button>
              </div>

              {/* Dark Mode Widgets */}
              <div className="grid gap-4">
                 {trustFactors.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5 hover:bg-white/15 transition-colors cursor-default">
                       <div className={`p-3 rounded-xl bg-white/10 text-white`}>
                          {item.icon}
                       </div>
                       <div>
                          <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
