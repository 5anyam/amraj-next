'use client';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Mail, Phone, MapPin } from 'lucide-react';

const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';
const BG_SOFT = '#f6f8f7';

export default function Footer() {
  const year = 2026;
  return (
    <footer style={{ background: BG_SOFT, borderTop: `1px solid ${LINE}`, color: INK }}>
      {/* ── Main content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '40px 32px' }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <img src="/amraj-logo.jpg" alt="Amraj" style={{ height: 40, width: 'auto', borderRadius: 10 }} />
              <img src="/amraj-text.png" alt="Amraj" style={{ height: 22, width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.75, margin: '20px 0 24px', maxWidth: 320 }}>
              An innovative fusion of modern nutraceuticals and ancient herbal wisdom — for results you can feel.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: 'https://www.facebook.com/share/171nqqCNnk/?mibextid=wwXIfr', icon: <FaFacebookF size={14} /> },
                { href: 'https://www.instagram.com/amraj_wellness?igsh=NXhjNHVvNDVlMHJr&utm_source=qr', icon: <FaInstagram size={14} /> },
                { href: 'https://www.youtube.com/@amraj-wellness', icon: <FaYoutube size={14} /> },
              ].map(({ href, icon }, i) => (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${LINE}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK_SOFT, textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = ACCENT; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = INK_SOFT; e.currentTarget.style.borderColor = LINE; }}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT_DK, marginBottom: 18 }}>Shop</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Prostate Care', to: '/product/advanced-prostate-care' },
                { name: 'Liver Detox', to: '/product/advanced-liver-detox' },
                { name: 'Weight Management', to: '/product/weight-management-pro' },
                { name: 'All Products', to: '/shop' },
              ].map(({ name, to }) => (
                <li key={name}>
                  <Link href={to} style={{ fontSize: 14, color: INK_SOFT, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = ACCENT_DK)}
                    onMouseLeave={e => (e.currentTarget.style.color = INK_SOFT)}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT_DK, marginBottom: 18 }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'About Us', to: '/about' },
                { name: 'Contact', to: '/contact' },
                { name: 'Privacy Policy', to: '/privacy-policy' },
                { name: 'Terms & Conditions', to: '/terms-and-conditions' },
                { name: 'Returns & Refunds', to: '/returns-and-refunds-policy' },
                { name: 'Disclaimer', to: '/disclaimer' },
              ].map(({ name, to }) => (
                <li key={name}>
                  <Link href={to} style={{ fontSize: 14, color: INK_SOFT, textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = ACCENT_DK)}
                    onMouseLeave={e => (e.currentTarget.style.color = INK_SOFT)}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT_DK, marginBottom: 18 }}>Get in touch</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: INK_SOFT }}>
                <Mail size={16} style={{ color: ACCENT, flexShrink: 0 }} />
                <a href="mailto:care@amraj.in" style={{ color: 'inherit', textDecoration: 'none' }}>care@amraj.in</a>
              </li>
              <li style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: INK_SOFT }}>
                <Phone size={16} style={{ color: ACCENT, flexShrink: 0 }} />
                <a href="tel:+919211619009" style={{ color: 'inherit', textDecoration: 'none' }}>+91 92116 19009</a>
              </li>
              <li style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: INK_SOFT, lineHeight: 1.6 }}>
                <MapPin size={16} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} />
                <span>D5/204, Chintpurni House, Central Market, Prashant Vihar, New Delhi – 110085</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: `1px solid ${LINE}`, padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: INK_SOFT }}>© {year} Amraj Wellness LLP. All rights reserved.</p>
          <img src="/badges.png" alt="Payment methods" style={{ height: 30, opacity: 0.7 }} />
          <p style={{ fontSize: 13, color: ACCENT_DK, fontWeight: 500 }}>Science-backed · Made in India</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
