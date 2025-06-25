
const testimonials = [
  {
    name: "Parul S.",
    feedback: "The Blue range totally improved my energy — delivery was so fast, checkout simple, and products are really high quality.",
  },
  {
    name: "Ankit T.",
    feedback: "I needed vegan supplements I could trust and the website experience was perfectly smooth.",
  },
  {
    name: "Savita P.",
    feedback: "Loved the easy navigation and beautiful design. Will shop again!",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl text-blue-800 font-bold mb-6">What Our Customers Say</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={t.name}
              className="shadow-lg rounded-xl px-6 py-6 bg-blue-50 flex flex-col items-center animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-blue-600 text-2xl mb-2">“</div>
              <div className="text-md text-blue-900 mb-3 italic">{t.feedback}</div>
              <div className="font-semibold text-blue-700">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
