"use client"
import React, { useState } from 'react';
import { Leaf, Shield, Users, Award, ChevronRight, X } from 'lucide-react';

// Modal Component for Consultation
function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
      >
        Get Free Consultation
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Free Consultation</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="tel"
                placeholder="Your Phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <textarea
                placeholder="Tell us about your health goals..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AboutPage() {
  return (
    <main className="max-w-6xl mt-24 lg:mt-0 mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center">
        <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full text-sm font-medium mb-6">
          <Leaf className="w-4 h-4 mr-2" />
          Trusted Wellness Partner
        </div>
        <h1 className="text-5xl font-bold mb-6 text-gray-800">About Amraj Wellness</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          An innovative fusion of modern nutraceuticals and ancient herbal wisdom - for results you can feel.
        </p>
      </section>
      
      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="w-full h-96 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <Leaf className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-emerald-800">Natural Wellness</h3>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 text-yellow-700" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Trusted Wellness Partner</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            At Amraj Wellness LLP, we bridge the gap between time-tested herbal traditions and cutting-edge nutraceutical science. Our commitment is to provide you with premium wellness solutions that deliver measurable results while honoring the wisdom of nature.
          </p>
          <div className="flex items-center text-emerald-600 font-semibold">
            <span>Discover Our Story</span>
            <ChevronRight className="w-5 h-5 ml-2" />
          </div>
        </div>
      </section>

      {/* Why Choose Amraj */}
      <section className="bg-gradient-to-r from-emerald-50 to-yellow-50 p-10 rounded-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Why Choose Amraj?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Ancient Wisdom</h3>
            <p className="text-gray-600">Traditional herbal knowledge passed down through generations</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Modern Science</h3>
            <p className="text-gray-600">Research-backed formulations with proven efficacy</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Personalized Care</h3>
            <p className="text-gray-600">Tailored wellness solutions for your unique needs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-800">Premium Quality</h3>
            <p className="text-gray-600">Highest standards in sourcing and manufacturing</p>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Vision</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            To become India&apos;s most trusted wellness brand, empowering millions to achieve optimal health through the perfect harmony of nature and science.
          </p>
          <div className="bg-emerald-50 p-6 rounded-2xl border-l-4 border-emerald-500">
            <h3 className="font-bold text-emerald-800 mb-2">Our Promise</h3>
            <p className="text-emerald-700">
              Every product we create is a testament to our commitment to your well-being, combining the best of both worlds for results you can truly feel.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="w-full h-96 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-yellow-800">Trusted Quality</h3>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-400 rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-emerald-700" />
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Our Wellness Journey</h2>
        <div className="grid md:grid-cols-5 gap-8">
          {[
            { step: "01", title: "Consultation", desc: "Understanding your unique wellness needs and goals" },
            { step: "02", title: "Analysis", desc: "Comprehensive health assessment and lifestyle evaluation" },
            { step: "03", title: "Formulation", desc: "Custom blend of herbs and nutraceuticals for you" },
            { step: "04", title: "Delivery", desc: "Premium products delivered to your doorstep" },
            { step: "05", title: "Support", desc: "Ongoing guidance and wellness monitoring" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                {item.step}
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Detailed */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="w-full h-96 bg-gradient-to-br from-emerald-300 to-yellow-300 rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Nature + Science</h3>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Choose Amraj?</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            We combine the wisdom of ancient Ayurveda with modern scientific research to create products that are both effective and safe. Our team of experts ensures every formulation meets the highest quality standards.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700">ISO certified manufacturing facilities</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700">100% natural and organic ingredients</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700">Clinically tested formulations</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-700">Personalized wellness solutions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-emerald-600 to-emerald-700 p-12 rounded-3xl text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Wellness?</h2>
        <p className="text-xl mb-8 text-emerald-100">
          Experience the perfect fusion of ancient wisdom and modern science. Let us guide you on your journey to optimal health.
        </p>
        <ConsultationModal />
      </section>
    </main>
  );
}