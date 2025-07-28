'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useIsMobile } from "../hooks/use-mobile";
import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { BiChevronDown } from "react-icons/bi";
import { useTypewriter } from 'react-simple-typewriter';

const navItems = [
  { name: "Home", to: "/" },
  { 
    name: "Shop", 
    to: "/shop",
    submenu: [
      { name: "Prostate Care", to: "https://www.amraj.in/product/advanced-prostate-care" },
      { name: "Weight Management", to: "https://www.amraj.in/product/weight-management-pro" },
      { name: "Detox", to: "https://www.amraj.in/product/advanced-liver-detox" },
      { name: "Diabetes Care", to: "https://www.amraj.in/product/diabetes-care-coming-soon" },
    ]
  },
  { name: "About Us", to: "/about" },
  { name: "Contact", to: "/contact" },
];

export default function Header() {
  const location = usePathname();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopSubmenuOpen, setShopSubmenuOpen] = useState(false);
  const [mobileShopSubmenuOpen, setMobileShopSubmenuOpen] = useState(false);
  const router = useRouter();
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [text] = useTypewriter({
    words: ['Search products…', 'Weight loss supplements', 'Multivitamins', 'Prostate health', 'Detox products', 'Diabetes care'],
    loop: 0,
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 2000,
  });

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setShopSubmenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowMobileSearch(false);
    }
  }

  const handleShopMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShopSubmenuOpen(true);
  };

  const handleShopMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShopSubmenuOpen(false);
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-blue-100 shadow-sm backdrop-blur-md supports-backdrop-blur:bg-white/95 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center justify-between py-3">
          {/* Left: Logo and Nav */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <img className="h-12 md:h-16 transition-transform group-hover:scale-105" src="/amraj-logo.jpg" alt='amraj logo' />
              <img className="h-6 w-10 md:h-8 md:w-full" src="/amraj-text.png" alt='amraj text' />
            </Link>

            {/* Desktop Nav */}
            {!isMobile && (
              <nav className="ml-8 flex items-center gap-4">
                {navItems.map((item) => (
                  <div key={item.name} className="relative" ref={item.name === "Shop" ? shopMenuRef : undefined}>
                    {item.submenu ? (
                      <div
                        className="relative"
                        onMouseEnter={handleShopMouseEnter}
                        onMouseLeave={handleShopMouseLeave}
                      >
                        <button
                          className={`font-medium transition-all duration-300 flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-green-50 group ${
                            location.startsWith(item.to) ? "text-green-600" : "text-gray-900 hover:text-green-600"
                          }`}
                        >
                          {item.name}
                          <BiChevronDown className={`transition-transform duration-200 ${shopSubmenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Submenu */}
                        <div className={`absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 min-w-48 transition-all duration-300 ${
                          shopSubmenuOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                        }`}>
                          <div className="py-2">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.to}
                                className={`block px-4 py-2 text-sm transition-colors duration-200 hover:bg-green-50 hover:text-green-600 ${
                                  location === subItem.to ? 'text-green-600 bg-green-50' : 'text-gray-700'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.to}
                        className={`font-medium transition-all duration-300 py-2 px-3 rounded-lg hover:bg-green-50 relative group ${
                          location === item.to ? "text-green-600" : "text-gray-900 hover:text-green-600"
                        }`}
                      >
                        {item.name}
                        <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-green-600 transform transition-all duration-300 ${
                          location === item.to ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>

          {/* Right: Search + Cart + Hamburger */}
          <div className="flex items-center gap-2">
          {/* Desktop Search */}
          {!isMobile && (
            <form className="flex border-2 rounded-xl items-center mr-4 relative overflow-hidden group focus-within:border-green-500 transition-all duration-300" onSubmit={handleSearch}>
              <input
                type="text"
                className="px-4 py-2 text-black focus:outline-none text-base w-60 bg-gray-50 group-focus-within:bg-white transition-all duration-300"
                placeholder={text}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="border-l-2 border-gray-200 text-black px-4 py-2 bg-gray-50 hover:bg-green-600 hover:text-white transition-all duration-300 group-focus-within:bg-green-600 group-focus-within:text-white"
              >
                <FiSearch className="text-lg" />
              </button>
            </form>
          )}

          {/* Mobile Search */}
          {isMobile && (
            <>
              {!showMobileSearch ? (
                <button
                  className="text-2xl text-black p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  onClick={() => setShowMobileSearch(true)}
                >
                  <FiSearch />
                </button>
              ) : (
                <form className="flex border-2 rounded-xl items-center overflow-hidden focus-within:border-green-500 transition-all duration-300" onSubmit={handleSearch}>
                  <input
                    type="text"
                    className="px-3 py-2 text-black focus:outline-none text-base w-40 bg-gray-50 focus:bg-white transition-all duration-300"
                    placeholder={text}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="border-l-2 border-gray-200 text-black px-3 py-2 bg-gray-50 hover:bg-green-600 hover:text-white transition-all duration-300"
                  >
                    <FiSearch />
                  </button>
                </form>
              )}
            </>
          )}

          <CartIcon />

          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2 text-3xl text-black p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
            >
              {mobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
            </button>
          )}
        </div>

          {/* Mobile Menu Dropdown */}
          {isMobile && (
            <div className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 z-40 transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-4'
            }`}>
              <nav className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <div>
                        <button
                          className={`font-medium text-lg px-2 py-2 rounded transition-colors duration-200 flex items-center justify-between w-full ${
                            location.startsWith(item.to) ? "text-green-600" : "text-gray-800 hover:text-green-600"
                          }`}
                          onClick={() => setMobileShopSubmenuOpen(!mobileShopSubmenuOpen)}
                        >
                          {item.name}
                          <BiChevronDown className={`transition-transform duration-200 ${mobileShopSubmenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Mobile Submenu */}
                        <div className={`ml-4 mt-2 space-y-1 transition-all duration-300 ${
                          mobileShopSubmenuOpen ? 'opacity-100 visible max-h-96' : 'opacity-0 invisible max-h-0'
                        }`}>
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.to}
                              className={`block px-3 py-2 text-base rounded transition-colors duration-200 ${
                                location === subItem.to ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                              }`}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileShopSubmenuOpen(false);
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.to}
                        className={`font-medium text-lg px-2 py-2 rounded transition-colors duration-200 block ${
                          location === item.to ? "text-green-600" : "text-gray-800 hover:text-green-600"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}