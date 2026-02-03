'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useIsMobile } from "../hooks/use-mobile";
import { useAuth } from "../lib/auth-context";
import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiUser, FiMenu, FiX } from "react-icons/fi"; // Switched to Feather icons for cleaner look
import { BiChevronDown } from "react-icons/bi";
import { useTypewriter } from 'react-simple-typewriter';

const navItems = [
  { name: "Home", to: "/" },
  { 
    name: "Shop", 
    to: "/shop",
    submenu: [
      { name: "Prostate Care", to: "/product/advanced-prostate-care" },
      { name: "Weight Management", to: "/product/weight-management-pro" },
      { name: "Detox", to: "/product/advanced-liver-detox" },
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
  
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [text] = useTypewriter({
    words: ['Search wellness...', 'Weight loss...', 'Detox...'],
    loop: 0,
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 2000,
  });

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setShopSubmenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowMobileSearch(false);
    }
  }

  const handleShopMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShopSubmenuOpen(true);
  };

  const handleShopMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShopSubmenuOpen(false), 200);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* 1. Left: Logo Area */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <img className="h-10 md:h-12 w-auto object-contain" src="/amraj-logo.jpg" alt='Amraj Logo' />
                <img className="h-6 md:h-8 w-auto object-contain" src="/amraj-text.png" alt='Amraj Text' />
              </Link>

              {/* Desktop Nav - Centered relative to left block */}
              {!isMobile && (
                <nav className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => (
                    <div key={item.name} className="relative" ref={item.name === "Shop" ? shopMenuRef : undefined}>
                      {item.submenu ? (
                        <div
                          className="relative"
                          onMouseEnter={handleShopMouseEnter}
                          onMouseLeave={handleShopMouseLeave}
                        >
                          <button
                            className={`flex items-center gap-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                              location.startsWith(item.to) 
                                ? "text-black bg-gray-50" 
                                : "text-gray-600 hover:text-black hover:bg-gray-50"
                            }`}
                          >
                            {item.name}
                            <BiChevronDown className={`transition-transform duration-200 ${shopSubmenuOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Dropdown Menu */}
                          <div className={`absolute top-full left-0 pt-2 w-56 transition-all duration-200 ${
                            shopSubmenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                          }`}>
                            <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden py-2">
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.to}
                                  className={`block px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-black transition-colors ${
                                    location === subItem.to ? 'text-black font-semibold bg-gray-50' : 'text-gray-500'
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
                          className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                            location === item.to 
                              ? "text-black bg-gray-50" 
                              : "text-gray-600 hover:text-black hover:bg-gray-50"
                          }`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              )}
            </div>

            {/* 2. Right: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Desktop Search */}
              {!isMobile && (
                <form className="relative group" onSubmit={handleSearch}>
                  <div className="flex items-center bg-gray-100/80 hover:bg-gray-100 rounded-full px-4 py-2.5 transition-colors w-64 focus-within:w-72 focus-within:ring-1 focus-within:ring-black/5 duration-300">
                    <FiSearch className="text-gray-400 group-focus-within:text-black transition-colors" />
                    <input
                      type="text"
                      className="ml-2 bg-transparent border-none outline-none text-sm w-full text-black placeholder:text-gray-400"
                      placeholder={text}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </form>
              )}

              {/* User Account (Desktop) */}
              {!isMobile && (
                <div className="relative" ref={userMenuRef}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                      >
                         <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {user.name.charAt(0).toUpperCase()}
                         </div>
                      </button>

                      {userMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-50 mb-1">
                             <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                             <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/my-account"
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            Log Out
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/login" className="text-gray-600 hover:text-black p-2 transition-colors">
                      <FiUser className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              )}

              {/* Cart Icon */}
              <div className="border-l border-gray-100 pl-2 md:pl-4">
                 <CartIcon />
              </div>

              {/* Mobile Search Toggle */}
              {isMobile && !showMobileSearch && (
                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="p-2 text-gray-600"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 text-gray-900 ml-1"
                >
                  <FiMenu className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Mobile Search Overlay */}
            {isMobile && showMobileSearch && (
               <div className="absolute inset-0 bg-white z-50 flex items-center px-4 animate-in fade-in slide-in-from-top-2">
                  <form className="w-full flex items-center gap-2" onSubmit={handleSearch}>
                     <FiSearch className="text-gray-400" />
                     <input
                        type="text"
                        className="flex-1 h-10 bg-transparent outline-none text-base"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        autoFocus
                     />
                     <button type="button" onClick={() => setShowMobileSearch(false)}>
                        <FiX className="text-gray-500 w-5 h-5" />
                     </button>
                  </form>
               </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer (App Style) */}
      {isMobile && (
         <>
            {/* Backdrop */}
            <div 
               className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
                  mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
               }`} 
               onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${
               mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
               <div className="flex flex-col h-full">
                  
                  {/* Drawer Header */}
                  <div className="p-5 flex items-center justify-between border-b border-gray-100">
                     <span className="font-bold text-lg">Menu</span>
                     <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                        <FiX className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-1">
                     {navItems.map((item) => (
                        <div key={item.name}>
                           {item.submenu ? (
                              <div className="border-b border-gray-50 last:border-0 pb-2 mb-2">
                                 <button
                                    className="flex items-center justify-between w-full p-3 text-left font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setMobileShopSubmenuOpen(!mobileShopSubmenuOpen)}
                                 >
                                    {item.name}
                                    <BiChevronDown className={`transition-transform ${mobileShopSubmenuOpen ? 'rotate-180' : ''}`} />
                                 </button>
                                 <div className={`space-y-1 pl-4 overflow-hidden transition-all duration-300 ${mobileShopSubmenuOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                    {item.submenu.map((subItem) => (
                                       <Link
                                          key={subItem.name}
                                          href={subItem.to}
                                          className="block p-2 text-sm text-gray-500 hover:text-black rounded-md"
                                          onClick={() => setMobileMenuOpen(false)}
                                       >
                                          {subItem.name}
                                       </Link>
                                    ))}
                                 </div>
                              </div>
                           ) : (
                              <Link
                                 href={item.to}
                                 className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                                 onClick={() => setMobileMenuOpen(false)}
                              >
                                 {item.name}
                              </Link>
                           )}
                        </div>
                     ))}
                  </div>

                  {/* Drawer Footer (Auth) */}
                  <div className="p-5 border-t border-gray-100 bg-gray-50">
                     {user ? (
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                 {user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-semibold">{user.name}</p>
                                 <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                           </div>
                           <Link 
                              href="/my-account" 
                              className="block w-full py-2.5 text-center bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                           >
                              My Account
                           </Link>
                           <button 
                              onClick={() => { logout(); setMobileMenuOpen(false); }}
                              className="block w-full py-2.5 text-center bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                           >
                              Sign Out
                           </button>
                        </div>
                     ) : (
                        <Link
                           href="/login"
                           className="block w-full py-3 text-center bg-black text-white rounded-xl font-medium shadow-lg hover:bg-gray-900 transition-colors"
                           onClick={() => setMobileMenuOpen(false)}
                        >
                           Log In / Sign Up
                        </Link>
                     )}
                  </div>

               </div>
            </div>
         </>
      )}
    </>
  );
}
