'use client';

const MarqueeBanner = () => {
  return (
    <div className="overflow-hidden bg-yellow-300 py-3 text-green-600 font-semibold whitespace-nowrap relative">
      <div className="animate-marquee inline-block min-w-full text-lg tracking-wide space-x-6">
        <span className="inline-block">✹ Soy Free</span>
        <span className="inline-block">✹ Plant-Based</span>
        <span className="inline-block">✹ Gluten Free</span>
        <span className="inline-block">✹ Non-GMO</span>
        <span className="inline-block">✹ Soy Free</span>
        <span className="inline-block">✹ Plant-Based</span>
        <span className="inline-block">✹ Gluten Free</span>
        <span className="inline-block">✹ Non-GMO</span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
