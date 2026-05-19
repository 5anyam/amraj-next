'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import CartIcon from './CartIcon';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../lib/auth-context';
import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { BiChevronDown } from 'react-icons/bi';
import { useTypewriter } from 'react-simple-typewriter';

const navItems = [
  { name: 'Home', to: '/' },
  {
    name: 'Shop',
    to: '/shop',
    submenu: [
      { name: 'Prostate Care', to: '/product/advanced-prostate-care' },
      { name: 'Weight Management', to: '/product/weight-management-pro' },
      { name: 'Detox', to: '/product/advanced-liver-detox' },
    ],
  },
  { name: 'About Us', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

export default function Header() {
  const location = usePathname();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
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

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
  }, [mobileMenuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowMobileSearch(false);
    }
  }

  return (
    <>
      {/* ── DESKTOP HEADER ── */}
      <header
        style={{ borderBottom: '3px solid #0f1117', background: '#ffffff', position: 'sticky', top: 0, zIndex: 500 }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img
                src="/amraj-logo.jpg"
                alt="Amraj Logo"
                style={{ height: 40, width: 'auto', objectFit: 'contain', border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117' }}
              />
              <img
                src="/amraj-text.png"
                alt="Amraj"
                style={{ height: 24, width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            {/* Desktop Nav */}
            {!isMobile && (
              <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {navItems.map((item) => (
                  <div key={item.name} style={{ position: 'relative' }} ref={item.name === 'Shop' ? shopMenuRef : undefined}>
                    {item.submenu ? (
                      <div
                        onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setShopSubmenuOpen(true); }}
                        onMouseLeave={() => { timeoutRef.current = setTimeout(() => setShopSubmenuOpen(false), 200); }}
                      >
                        <button
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '6px 14px', fontSize: 11, fontWeight: 600,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: location.startsWith(item.to) ? '#0D9488' : '#0f1117',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            borderBottom: location.startsWith(item.to) ? '2px solid #0D9488' : '2px solid transparent',
                            transition: 'color 0.2s, border-color 0.2s',
                          }}
                        >
                          {item.name}
                          <BiChevronDown style={{ transition: 'transform 0.2s', transform: shopSubmenuOpen ? 'rotate(180deg)' : 'none' }} />
                        </button>

                        {shopSubmenuOpen && (
                          <div style={{
                            position: 'absolute', top: '100%', left: 0, paddingTop: 8, zIndex: 100,
                          }}>
                            <div style={{
                              background: '#ffffff', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117',
                              minWidth: 200, overflow: 'hidden',
                            }}>
                              {item.submenu.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.to}
                                  style={{
                                    display: 'block', padding: '10px 16px', fontSize: 11,
                                    fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                                    color: location === sub.to ? '#0D9488' : '#0f1117',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid rgba(15,17,23,0.08)',
                                    transition: 'background 0.15s',
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.background = '#faf7f2')}
                                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.to}
                        style={{
                          display: 'block', padding: '6px 14px', fontSize: 11, fontWeight: 600,
                          letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none',
                          color: location === item.to ? '#0D9488' : '#0f1117',
                          borderBottom: location === item.to ? '2px solid #0D9488' : '2px solid transparent',
                          transition: 'color 0.2s, border-color 0.2s',
                        }}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

              {/* Desktop Search */}
              {!isMobile && (
                <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    border: '2px solid #0f1117', background: '#faf7f2',
                    padding: '6px 14px', gap: 8, width: 220,
                  }}>
                    <FiSearch style={{ color: '#0f1117', flexShrink: 0 }} size={14} />
                    <input
                      type="text"
                      placeholder={text}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        background: 'transparent', border: 'none', outline: 'none',
                        fontSize: 11, color: '#0f1117', width: '100%',
                        letterSpacing: '0.05em',
                      }}
                    />
                  </div>
                </form>
              )}

              {/* User (Desktop) */}
              {!isMobile && (
                <div style={{ position: 'relative' }} ref={userMenuRef}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        style={{
                          width: 36, height: 36, background: '#0f1117', color: '#0D9488',
                          border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 800, cursor: 'pointer',
                          fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em',
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </button>
                      {userMenuOpen && (
                        <div style={{
                          position: 'absolute', top: '100%', right: 0, marginTop: 8,
                          background: '#fff', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117',
                          minWidth: 180, zIndex: 200,
                        }}>
                          <div style={{ padding: '10px 14px', borderBottom: '2px solid #0f1117' }}>
                            <p style={{ fontWeight: 700, fontSize: 12, color: '#0f1117' }}>{user.name}</p>
                            <p style={{ fontSize: 10, color: '#888', marginTop: 2, letterSpacing: '0.04em' }}>{user.email}</p>
                          </div>
                          <Link
                            href="/my-account"
                            onClick={() => setUserMenuOpen(false)}
                            style={{ display: 'block', padding: '10px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0f1117', textDecoration: 'none', borderBottom: '1px solid rgba(15,17,23,0.08)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#faf7f2')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            My Account
                          </Link>
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            style={{ display: 'block', width: '100%', padding: '10px 14px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d95f1a', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf9')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '2px solid #0f1117', boxShadow: '2px 2px 0 #0f1117', color: '#0f1117', textDecoration: 'none', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = '#faf7f2')} onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                      <FiUser size={16} />
                    </Link>
                  )}
                </div>
              )}

              {/* Cart */}
              <div style={{ borderLeft: '2px solid rgba(15,17,23,0.12)', paddingLeft: 12 }}>
                <CartIcon />
              </div>

              {/* Mobile Search */}
              {isMobile && !showMobileSearch && (
                <button onClick={() => setShowMobileSearch(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f1117', padding: 6 }}>
                  <FiSearch size={20} />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    background: '#0f1117', color: '#0D9488', border: '2px solid #0f1117',
                    boxShadow: '2px 2px 0 rgba(15,17,23,0.3)', padding: '6px 8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FiMenu size={20} />
                </button>
              )}
            </div>

            {/* Mobile Search Overlay */}
            {isMobile && showMobileSearch && (
              <div style={{
                position: 'absolute', inset: 0, background: '#fff', zIndex: 50,
                display: 'flex', alignItems: 'center', padding: '0 16px',
                borderBottom: '3px solid #0f1117',
              }}>
                <form style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }} onSubmit={handleSearch}>
                  <FiSearch style={{ color: '#0f1117' }} size={16} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#0f1117', background: 'transparent' }}
                  />
                  <button type="button" onClick={() => setShowMobileSearch(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0f1117' }}>
                    <FiX size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {isMobile && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15,17,23,0.6)',
              zIndex: 600, opacity: mobileMenuOpen ? 1 : 0,
              visibility: mobileMenuOpen ? 'visible' : 'hidden', transition: 'opacity 0.3s',
            }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '82%', maxWidth: 340,
            background: '#faf7f2', zIndex: 700,
            border: '3px solid #0f1117', borderRight: 'none',
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.32s cubic-bezier(.16,1,.3,1)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '3px solid #0f1117', background: '#0f1117' }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: '0.06em' }}>AMRAJ MENU</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: '#0D9488', border: '2px solid #fff', color: '#fff', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '2px 2px 0 rgba(255,255,255,0.3)' }}>
                <FiX size={18} />
              </button>
            </div>

            {/* Nav items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div style={{ borderBottom: '2px solid rgba(15,17,23,0.08)' }}>
                      <button
                        onClick={() => setMobileShopSubmenuOpen(!mobileShopSubmenuOpen)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '14px 20px', fontFamily: 'Bebas Neue, sans-serif', fontSize: 20,
                          letterSpacing: '0.06em', color: '#0f1117', background: 'none', border: 'none', cursor: 'pointer',
                        }}
                      >
                        {item.name}
                        <BiChevronDown style={{ transition: 'transform 0.2s', transform: mobileShopSubmenuOpen ? 'rotate(180deg)' : 'none' }} />
                      </button>
                      {mobileShopSubmenuOpen && (
                        <div style={{ paddingLeft: 20, paddingBottom: 8 }}>
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.to}
                              onClick={() => setMobileMenuOpen(false)}
                              style={{ display: 'block', padding: '8px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: location === sub.to ? '#0D9488' : '#555', textDecoration: 'none', borderLeft: '2px solid #0f1117', marginBottom: 4 }}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: 'block', padding: '14px 20px',
                        fontFamily: 'Bebas Neue, sans-serif', fontSize: 20,
                        letterSpacing: '0.06em', color: location === item.to ? '#0D9488' : '#0f1117',
                        textDecoration: 'none', borderBottom: '2px solid rgba(15,17,23,0.08)',
                        borderLeft: location === item.to ? '3px solid #0D9488' : '3px solid transparent',
                      }}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Auth footer */}
            <div style={{ padding: 20, borderTop: '3px solid #0f1117', background: '#fff' }}>
              {user ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '10px 14px', background: '#faf7f2', border: '2px solid #0f1117' }}>
                    <div style={{ width: 36, height: 36, background: '#0f1117', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, flexShrink: 0, border: '2px solid #0D9488' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: '#0f1117' }}>{user.name}</p>
                      <p style={{ fontSize: 10, color: '#888', letterSpacing: '0.04em' }}>{user.email}</p>
                    </div>
                  </div>
                  <Link href="/my-account" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '12px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f1117', textDecoration: 'none', border: '2.5px solid #0f1117', boxShadow: '3px 3px 0 #0f1117', marginBottom: 10, background: '#faf7f2' }}>
                    My Account
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ width: '100%', padding: '12px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', background: '#0f1117', border: '2.5px solid #0f1117', boxShadow: '3px 3px 0 #0D9488', cursor: 'pointer' }}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '14px 16px', textAlign: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: '0.08em', color: '#fff', textDecoration: 'none', background: '#0f1117', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0D9488' }}>
                  LOG IN / SIGN UP →
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
