'use client';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ background: '#0f1117', borderTop: '4px solid #0D9488' }}>

      {/* ── Manifesto belt ── */}
      <div style={{ overflow: 'hidden', borderBottom: '3px solid rgba(255,255,255,0.08)', padding: '14px 0' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'mq-fwd 22s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'inline-flex' }}>
              {['ROOTED IN TRADITION', 'BACKED BY SCIENCE', 'FEEL THE DIFFERENCE', 'PURE. POTENT. PROVEN.'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 24px', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                  {t}
                  <span style={{ color: '#0D9488', fontSize: 6 }}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '40px 32px' }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 44, lineHeight: 1, letterSpacing: '0.04em', color: '#fff', marginBottom: 4 }}>
                AMRAJ <span style={{ color: '#0D9488' }}>·</span>
              </div>
            </Link>
            <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
              WELLNESS
            </p>
            <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, marginBottom: 24 }}>
              An innovative fusion of modern nutraceuticals and ancient herbal wisdom — for results you can feel.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { href: 'https://www.facebook.com/share/171nqqCNnk/?mibextid=wwXIfr', icon: <FaFacebookF size={13} /> },
                { href: '#', icon: <FaTwitter size={13} /> },
                { href: 'https://www.instagram.com/amraj_wellness?igsh=NXhjNHVvNDVlMHJr&utm_source=qr', icon: <FaInstagram size={13} /> },
                { href: 'https://www.youtube.com/@amraj-wellness', icon: <FaYoutube size={13} /> },
              ].map(({ href, icon }, i) => (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 34, height: 34, border: '2px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.45)', textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0D9488'; e.currentTarget.style.color = '#0D9488'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.12em', color: '#0D9488', marginBottom: 20 }}>SHOP</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Prostate Care', to: '/product/advanced-prostate-care' },
                { name: 'Liver Detox', to: '/product/advanced-liver-detox' },
                { name: 'Weight Management', to: '/product/weight-management-pro' },
                { name: 'All Products', to: '/shop' },
              ].map(({ name, to }) => (
                <li key={name}>
                  <Link href={to} style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0D9488')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.12em', color: '#0D9488', marginBottom: 20 }}>LEGAL</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Privacy Policy', to: '/privacy-policy' },
                { name: 'Terms & Conditions', to: '/terms-and-conditions' },
                { name: 'Returns & Refunds', to: '/returns-and-refunds-policy' },
                { name: 'Disclaimer', to: '/disclaimer' },
              ].map(({ name, to }) => (
                <li key={name}>
                  <Link href={to} style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0D9488')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.12em', color: '#0D9488', marginBottom: 20 }}>CONTACT</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'care@amraj.in',
                '+91 92116 19009',
                'D5/204, Chintpurni House, Central Market, Prashant Vihar, New Delhi – 110085',
              ].map((t, i) => (
                <li key={i} style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, letterSpacing: '0.03em' }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '2px solid rgba(255,255,255,0.08)', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.18)' }}>
          © {new Date().getFullYear()} Amraj Wellness LLP. All rights reserved.
        </p>
        <img src="/badges.png" alt="Payment badges" style={{ height: 36, opacity: 0.6 }} />
        <p style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(13,148,136,0.4)' }}>
          SCIENCE-BACKED. INDIA-MADE. ◆
        </p>
      </div>

      <style>{`
        @keyframes mq-fwd { from { transform: translateX(0); } to { transform: translateX(-50%); } }
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
