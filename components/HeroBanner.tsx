
import React from "react";
import HeroCarousel from "./HeroCarousel";

// Branding mascot or decorative Avocado if desired
const AVOCADO_IMG =
  "https://static.vecteezy.com/system/resources/thumbnails/021/017/855/small/realistic-avocado-fruit-with-shadow-on-transparent-background-png.png";

export default function HeroBanner() {
  return (
    <section className="relative w-full bg-gradient-to-br from-green-100 via-lime-100 to-green-200 overflow-hidden animate-fade-in py-10 md:py-0">
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 md:px-12 min-h-[420px]">
        {/* Left pane (headline & CTA) */}
        <div className="w-full md:w-[43%] flex flex-col items-start pt-6 md:pt-0 z-20 md:pr-6">
          <span className="uppercase text-xs md:text-sm font-bold text-green-700 tracking-wide mb-2 animate-fade-in">Heat Up Your Shopping Cart</span>
          <h1 className="text-[2.2rem] md:text-5xl font-extrabold leading-tight mb-3 animate-fade-in" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#9a1cbf] bg-gradient-to-r from-[#9a1cbf] to-[#6ad796] bg-clip-text text-transparent">
              At Best Price!
            </span>
          </h1>
          <p className="text-lg text-green-900 font-medium mb-6 animate-fade-in">
            <span className="bg-green-50 px-2 py-1 rounded">India&apos;s Leading <span className="font-bold text-green-700">Beauty&nbsp;&amp;&nbsp;Wellness Brand</span></span>
          </p>
          <a
            href="/shop"
            className="inline-block bg-white border-2 border-green-600 text-green-800 hover:bg-green-100 hover:shadow-lg font-semibold px-8 py-3 rounded-lg text-lg shadow transition mt-2 animate-scale-in"
            style={{ boxShadow: "0 4px 16px #23ae601a" }}
          >
            <span className="font-bold">Shop Now</span>
          </a>
        </div>
        {/* Right pane (carousel and mascot/icon) */}
        <div className="w-full md:w-[57%] flex flex-col items-center justify-center z-10 mt-6 md:mt-0 relative min-h-[340px] px-2">
          <div className="absolute -top-3 left-4 md:-top-7 md:left-0 z-10 hidden md:block">
            <img
              src={AVOCADO_IMG}
              alt="Avocado"
              className="w-16 md:w-24 h-auto drop-shadow-xl"
              loading="lazy"
            />
          </div>
          <div className="relative flex items-center justify-center w-full">
            <HeroCarousel />
          </div>
        </div>
        {/* T&C note, styled */}
        <div className="absolute left-4 bottom-1 text-xs text-gray-500 z-30">
          *T&amp;C Apply
        </div>
      </div>
    </section>
  );
}
