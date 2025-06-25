
const benefits = [
  {
    title: "Scientifically Formulated",
    desc: "All products are made with quality ingredients, evidence-based research, and quality assurance.",
    icon: "🧬",
  },
  {
    title: "Vegan & Cruelty-Free",
    desc: "Blue wellness means sustainable choices — vegan, cruelty-free, and eco-packaging.",
    icon: "🌱",
  },
  {
    title: "Fast Delivery",
    desc: "We ship pan-India with speedy, reliable doorstep delivery.",
    icon: "🚚",
  },
  {
    title: "Secure Payment",
    desc: "All payments secured by Razorpay & SSL encryption.",
    icon: "🔐",
  },
];

export default function BenefitSection() {
  return (
    <section className="bg-blue-50 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        {benefits.map((b) => (
          <div key={b.title} className="flex flex-col items-center">
            <span className="text-4xl mb-3">{b.icon}</span>
            <div className="font-bold text-blue-700 mb-1">{b.title}</div>
            <div className="text-gray-700 text-center text-sm">{b.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
