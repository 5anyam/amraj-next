'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import CartIcon from './CartIcon';
import { useAuth } from '../lib/auth-context';
import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { BiChevronDown } from 'react-icons/bi';
import { useTypewriter } from 'react-simple-typewriter';

/* ── PREMIUM TOKENS ── */
const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';
const ACCENT_SOFT = '#eef7f5';
const BG_SOFT = '#f6f8f7';

const navItems = [
  { name: 'Home', to: '/' },
  {
    name: 'Shop',
    to: '/shop',
    submenu: [
      { name: 'Prostate Care', to: '/product/advanced-prostate-care' },
      { name: 'Weight Management', to: '/product/weight-management-pro' },
      { name: 'Liver Detox', to: '/product/advanced-liver-detox' },
    ],
  },
  { name: 'About Us', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

export default function Header() {
  const location = usePathname();
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
    words: ['Search wellness...', 'Weight loss...', 'Liver detox...'],
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
    // Only lock vertical scroll — leave the body's `overflow-x: hidden` intact,
    // otherwise off-screen fixed drawers (nav / cart) create a horizontal scroll.
    document.body.style.overflowY = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflowY = ''; };
  }, [mobileMenuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowMobileSearch(false);
    }
  }

  const navLinkBase: React.CSSProperties = {
    display: 'block', padding: '8px 14px', fontSize: 14, fontWeight: 500,
    textDecoration: 'none', borderRadius: 10, transition: 'color 0.2s, background 0.2s',
  };

  return (
    <>
      {/* ── HEADER ── */}
      <header style={{ borderBottom: `1px solid ${LINE}`, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 500 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 66 }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <img src="/amraj-logo.jpg" alt="Amraj Logo" style={{ height: 38, width: 'auto', objectFit: 'contain', borderRadius: 10 }} />
              <img src="/amraj-text.png" alt="Amraj" style={{ height: 22, width: 'auto', objectFit: 'contain' }} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hdr-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {navItems.map((item) => {
                  const active = item.submenu ? location.startsWith(item.to) : location === item.to;
                  return (
                    <div key={item.name} style={{ position: 'relative' }} ref={item.name === 'Shop' ? shopMenuRef : undefined}>
                      {item.submenu ? (
                        <div
                          onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setShopSubmenuOpen(true); }}
                          onMouseLeave={() => { timeoutRef.current = setTimeout(() => setShopSubmenuOpen(false), 200); }}
                        >
                          <button
                            style={{ ...navLinkBase, display: 'flex', alignItems: 'center', gap: 4, color: active ? ACCENT_DK : INK, background: active ? ACCENT_SOFT : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = BG_SOFT; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {item.name}
                            <BiChevronDown style={{ transition: 'transform 0.2s', transform: shopSubmenuOpen ? 'rotate(180deg)' : 'none' }} />
                          </button>
                          {shopSubmenuOpen && (
                            <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 10, zIndex: 100 }}>
                              <div style={{ background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, boxShadow: '0 12px 32px rgba(16,24,40,0.12)', minWidth: 220, overflow: 'hidden', padding: 6 }}>
                                {item.submenu.map((sub) => (
                                  <Link
                                    key={sub.name}
                                    href={sub.to}
                                    style={{ display: 'block', padding: '11px 14px', fontSize: 14, fontWeight: 500, borderRadius: 10, color: location === sub.to ? ACCENT_DK : INK, textDecoration: 'none', transition: 'background 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = BG_SOFT)}
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
                          style={{ ...navLinkBase, color: active ? ACCENT_DK : INK, background: active ? ACCENT_SOFT : 'transparent' }}
                          onMouseEnter={e => { if (!active) e.currentTarget.style.background = BG_SOFT; }}
                          onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

              {/* Desktop Search */}
              <form className="hdr-desktop" onSubmit={handleSearch} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${LINE}`, background: BG_SOFT, borderRadius: 999, padding: '9px 16px', gap: 8, width: 220 }}>
                    <FiSearch style={{ color: INK_SOFT, flexShrink: 0 }} size={15} />
                    <input
                      type="text"
                      placeholder={text}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: INK, width: '100%' }}
                    />
                  </div>
                </form>

              {/* User (Desktop) */}
              <div className="hdr-desktop" style={{ position: 'relative' }} ref={userMenuRef}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        style={{ width: 40, height: 40, background: ACCENT, color: '#fff', border: 'none', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </button>
                      {userMenuOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 10, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, boxShadow: '0 12px 32px rgba(16,24,40,0.12)', minWidth: 200, zIndex: 200, overflow: 'hidden', padding: 6 }}>
                          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${LINE}`, marginBottom: 4 }}>
                            <p style={{ fontWeight: 700, fontSize: 14, color: INK }}>{user.name}</p>
                            <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 2 }}>{user.email}</p>
                          </div>
                          <Link
                            href="/my-account"
                            onClick={() => setUserMenuOpen(false)}
                            style={{ display: 'block', padding: '11px 14px', fontSize: 14, fontWeight: 500, borderRadius: 10, color: INK, textDecoration: 'none' }}
                            onMouseEnter={e => (e.currentTarget.style.background = BG_SOFT)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            My Account
                          </Link>
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            style={{ display: 'block', width: '100%', padding: '11px 14px', fontSize: 14, fontWeight: 500, borderRadius: 10, color: '#c2410c', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 999, border: `1px solid ${LINE}`, color: INK, textDecoration: 'none', transition: 'background 0.15s' }} onMouseEnter={e => (e.currentTarget.style.background = BG_SOFT)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <FiUser size={18} />
                    </Link>
                  )}
                </div>

              {/* Cart */}
              <CartIcon />

              {/* Mobile Search */}
              {!showMobileSearch && (
                <button className="hdr-mobile" onClick={() => setShowMobileSearch(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: INK, padding: 6 }}>
                  <FiSearch size={20} />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="hdr-mobile"
                onClick={() => setMobileMenuOpen(true)}
                style={{ background: BG_SOFT, color: INK, border: `1px solid ${LINE}`, borderRadius: 10, padding: '8px 10px', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
              >
                <FiMenu size={20} />
              </button>
            </div>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
              <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 50, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: `1px solid ${LINE}` }}>
                <form style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }} onSubmit={handleSearch}>
                  <FiSearch style={{ color: INK_SOFT }} size={17} />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: INK, background: 'transparent' }}
                  />
                  <button type="button" onClick={() => setShowMobileSearch(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: INK }}>
                    <FiX size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER (visibility controlled by state; nav trigger is CSS-hidden on desktop) ── */}
      <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,17,23,0.5)', zIndex: 600, opacity: mobileMenuOpen ? 1 : 0, visibility: mobileMenuOpen ? 'visible' : 'hidden', transition: 'opacity 0.3s' }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '84%', maxWidth: 340,
            background: '#fff', zIndex: 700, boxShadow: '-8px 0 40px rgba(16,24,40,0.2)',
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.32s cubic-bezier(.16,1,.3,1)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: `1px solid ${LINE}` }}>
              <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: INK }}>Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: BG_SOFT, border: `1px solid ${LINE}`, borderRadius: 10, color: INK, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <FiX size={18} />
              </button>
            </div>

            {/* Nav items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {navItems.map((item) => {
                const active = item.submenu ? location.startsWith(item.to) : location === item.to;
                return (
                  <div key={item.name}>
                    {item.submenu ? (
                      <div>
                        <button
                          onClick={() => setMobileShopSubmenuOpen(!mobileShopSubmenuOpen)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 14px', fontSize: 16, fontWeight: 600, borderRadius: 12, color: active ? ACCENT_DK : INK, background: active ? ACCENT_SOFT : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          {item.name}
                          <BiChevronDown style={{ transition: 'transform 0.2s', transform: mobileShopSubmenuOpen ? 'rotate(180deg)' : 'none' }} />
                        </button>
                        {mobileShopSubmenuOpen && (
                          <div style={{ paddingLeft: 12, paddingBottom: 6 }}>
                            {item.submenu.map((sub) => (
                              <Link
                                key={sub.name}
                                href={sub.to}
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ display: 'block', padding: '11px 14px', fontSize: 14, fontWeight: 500, borderRadius: 10, color: location === sub.to ? ACCENT_DK : INK_SOFT, textDecoration: 'none' }}
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
                        style={{ display: 'block', padding: '14px 14px', fontSize: 16, fontWeight: 600, borderRadius: 12, color: active ? ACCENT_DK : INK, background: active ? ACCENT_SOFT : 'transparent', textDecoration: 'none' }}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Auth footer */}
            <div style={{ padding: 16, borderTop: `1px solid ${LINE}` }}>
              {user ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '12px 14px', background: BG_SOFT, borderRadius: 14 }}>
                    <div style={{ width: 40, height: 40, background: ACCENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, flexShrink: 0, borderRadius: 999 }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: INK }}>{user.name}</p>
                      <p style={{ fontSize: 12, color: INK_SOFT }}>{user.email}</p>
                    </div>
                  </div>
                  <Link href="/my-account" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '13px 16px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: INK, textDecoration: 'none', border: `1.5px solid ${LINE}`, borderRadius: 12, marginBottom: 10 }}>
                    My Account
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ width: '100%', padding: '13px 16px', fontSize: 14, fontWeight: 600, color: '#fff', background: INK, border: 'none', borderRadius: 12, cursor: 'pointer' }}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '15px 16px', textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none', background: ACCENT, borderRadius: 14, boxShadow: '0 8px 20px rgba(13,148,136,0.28)' }}>
                  Log in / Sign up
                </Link>
              )}
            </div>
          </div>
      </>

      <style>{`
        .hdr-mobile { display: none; }
        @media (max-width: 767px) {
          .hdr-desktop { display: none !important; }
          .hdr-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
