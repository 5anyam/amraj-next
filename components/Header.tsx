'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useIsMobile } from "../hooks/use-mobile";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useTypewriter } from 'react-simple-typewriter';

const navItems = [
  { name: "Home", to: "/" },
  { name: "Shop", to: "/shop" },
];

export default function Header() {
  const location = usePathname();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();

  const [text] = useTypewriter({
    words: ['Search products…', 'Weight loss', 'Multivitamins', 'Prostate'],
    loop: 0,
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 1500,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowMobileSearch(false); // Hide input on mobile after submit
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-blue-100 shadow-sm backdrop-blur supports-backdrop-blur:bg-white/80 q transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        {/* Left: Logo and Nav */}
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <img className='h-16' src="/amraj-logo.jpg" alt='amraj logo' height={100}/>
            <span className="pl-0 text-black">AMRAJ</span>
          </Link>
          {!isMobile && (
            <nav className="ml-8 flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.to}
                  className={`font-medium transition-colors ${location === item.to
                    ? "text-green-600"
                    : "text-gray-900 hover:text-green-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right: Cart + Search */}
        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          {!isMobile && (
            <form className="flex border rounded-xl items-center mr-4 relative" onSubmit={handleSearch}>
              <input
                type="text"
                className="px-3 py-2 text-black focus:outline-none focus:ring-2 text-base w-52 transition-all"
                placeholder={text}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gray-100 text-black px-4 py-2 rounded-r-md font-semibold transition-colors"
              >
                <FiSearch />
              </button>
            </form>
          )}

          {/* Mobile Search */}
          {isMobile && (
            <>
              {!showMobileSearch ? (
                <button
                  className="text-2xl text-black p-2"
                  onClick={() => setShowMobileSearch(true)}
                >
                  <FiSearch />
                </button>
              ) : (
                <form className="flex border rounded-xl items-center" onSubmit={handleSearch}>
                  <input
                    type="text"
                    className="px-3 py-2 text-black focus:outline-none focus:ring-2 text-base w-40 transition-all"
                    placeholder={text}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="border-l border-gray-100 text-black px-3 py-2 rounded-r-md font-semibold transition-colors"
                  >
                    <FiSearch />
                  </button>
                </form>
              )}
            </>
          )}

          <CartIcon />
        </div>
      </div>
    </header>
  );
}
