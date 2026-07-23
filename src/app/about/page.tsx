"use client"
import React, { useState } from 'react';
import { X, Sprout, FlaskConical, HeartHandshake, Award, Check, Sparkles, Leaf, ShieldCheck, BadgeCheck } from 'lucide-react';

const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';
const ACCENT_SOFT = '#eef7f5';
const BG_SOFT = '#f6f8f7';
const CARD_SHADOW = '0 2px 16px rgba(16,24,40,0.05)';
const RADIUS = 20;

function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{ background: '#fff', color: INK, padding: '15px 34px', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Get a free consultation →
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,17,23,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 30px 70px rgba(16,24,40,0.25)', width: '100%', maxWidth: 460, overflow: 'hidden' }}>
            <div style={{ padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${LINE}` }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: INK }}>Free consultation</h3>
              <button onClick={() => setIsOpen(false)} style={{ background: BG_SOFT, border: `1px solid ${LINE}`, borderRadius: 10, width: 36, height: 36, color: INK, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Your name', 'Your email', 'Your phone'].map((ph, i) => (
                <input key={i} type={i === 1 ? 'email' : i === 2 ? 'tel' : 'text'} placeholder={ph}
                  style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${LINE}`, background: '#fff', color: INK, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', borderRadius: 12 }} />
              ))}
              <textarea placeholder="Tell us about your health goals..." rows={4}
                style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${LINE}`, background: '#fff', color: INK, fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', borderRadius: 12 }} />
              <button onClick={() => setIsOpen(false)}
                style={{ background: ACCENT, color: '#fff', padding: '14px 20px', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 20px rgba(13,148,136,0.28)' }}
              >
                Book consultation →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 44px' }}>
      <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>{eyebrow}</span>
      <h2 style={{ fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 700, letterSpacing: '-0.025em', color: INK, lineHeight: 1.12 }}>{title}</h2>
      {sub && <p style={{ fontSize: 15.5, color: INK_SOFT, lineHeight: 1.7, marginTop: 14 }}>{sub}</p>}
    </div>
  );
}

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: INK }}>

      {/* Hero */}
      <section className="about-hero" style={{ background: 'linear-gradient(170deg,#ffffff 0%,#f2faf8 60%,#f6f8f7 100%)', padding: '72px 24px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT_SOFT, color: ACCENT_DK, fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 999, marginBottom: 22 }}>
            <Sparkles size={14} /> Our story
          </span>
          <h1 style={{ fontSize: 'clamp(38px,5.4vw,60px)', fontWeight: 700, letterSpacing: '-0.03em', color: INK, lineHeight: 1.06, marginBottom: 20 }}>
            Rooted in tradition,<br />backed by science.
          </h1>
          <p style={{ fontSize: 17, color: INK_SOFT, lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
            An innovative fusion of modern nutraceuticals and ancient herbal wisdom — for wellness results you can feel.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 12px', marginTop: 28 }}>
            {[
              { icon: Award, label: 'FSSAI Licensed' },
              { icon: ShieldCheck, label: 'GMP Certified' },
              { icon: Leaf, label: '100% Natural' },
              { icon: FlaskConical, label: 'Lab Tested' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 500, color: INK }}>
                <Icon style={{ width: 15, height: 15, color: ACCENT }} /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section style={{ background: '#fff', borderBottom: `1px solid ${LINE}` }}>
        <div className="about-stats" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { num: '10,000+', label: 'Happy customers' },
            { num: '4.8★', label: 'Average rating' },
            { num: '3', label: 'Focused formulas' },
            { num: '100%', label: 'Vegetarian & natural' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', color: ACCENT_DK, lineHeight: 1 }}>{s.num}</p>
              <p style={{ fontSize: 13, color: INK_SOFT, marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="about-container" style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 24px' }}>

        {/* Mission */}
        <section className="about-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 96 }}>
          <div style={{ position: 'relative', borderRadius: 24, background: 'linear-gradient(150deg,#0D9488,#0a7a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3', boxShadow: '0 20px 50px rgba(13,148,136,0.22)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 78% 22%, rgba(255,255,255,0.16), transparent 45%), radial-gradient(circle at 15% 85%, rgba(255,255,255,0.1), transparent 40%)', pointerEvents: 'none' }} />
            <div style={{ textAlign: 'center', padding: 32, color: '#fff', position: 'relative', zIndex: 2 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <Leaf style={{ width: 28, height: 28, color: '#fff' }} />
              </div>
              <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Nature <span style={{ opacity: 0.72 }}>+</span> Science</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)', marginTop: 8 }}>The heart of every Amraj formula</p>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 12 }}>Our mission</span>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', color: INK, lineHeight: 1.15, marginBottom: 18 }}>Your trusted wellness partner</h2>
            <p style={{ fontSize: 15.5, color: INK_SOFT, lineHeight: 1.8 }}>
              At Amraj Wellness LLP, we bridge the gap between time-tested herbal traditions and cutting-edge nutraceutical science. Our commitment is to provide premium wellness solutions with meaningful, well-researched ingredients — while honouring the wisdom of nature.
            </p>
          </div>
        </section>

        {/* Why Choose */}
        <section style={{ marginBottom: 96 }}>
          <SectionHeading eyebrow="Our advantages" title="Why choose Amraj?" />
          <div className="about-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
            {[
              { icon: Sprout, title: 'Ancient wisdom', desc: 'Traditional herbal knowledge passed down through generations.' },
              { icon: FlaskConical, title: 'Modern science', desc: 'Research-backed formulations at meaningful, effective dosages.' },
              { icon: HeartHandshake, title: 'Honest care', desc: 'Clear labels, real ingredients — no proprietary-blend guesswork.' },
              { icon: Award, title: 'Premium quality', desc: 'FSSAI-licensed, GMP-certified sourcing and manufacturing.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: RADIUS, border: `1px solid ${LINE}`, padding: '28px 24px', boxShadow: CARD_SHADOW }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <item.icon style={{ width: 23, height: 23, color: ACCENT_DK }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 9 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="about-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 96 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 12 }}>Our vision</span>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', color: INK, lineHeight: 1.15, marginBottom: 18 }}>India&apos;s most trusted wellness brand</h2>
            <p style={{ fontSize: 15.5, color: INK_SOFT, lineHeight: 1.8, marginBottom: 24 }}>
              To empower millions to support their everyday health through the perfect harmony of nature and science.
            </p>
            <div style={{ background: BG_SOFT, borderRadius: 16, border: `1px solid ${LINE}`, borderLeft: `4px solid ${ACCENT}`, padding: '20px 22px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT_DK, marginBottom: 8 }}>Our promise</p>
              <p style={{ fontSize: 14.5, color: INK_SOFT, lineHeight: 1.7 }}>
                Every product we create reflects our commitment to your well-being — combining the best of both worlds for results you can genuinely feel.
              </p>
            </div>
          </div>
          <div style={{ position: 'relative', borderRadius: 24, background: 'linear-gradient(150deg,#17191f,#2a2e3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3', boxShadow: '0 20px 50px rgba(16,24,40,0.18)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(13,148,136,0.28), transparent 45%)', pointerEvents: 'none' }} />
            <div style={{ textAlign: 'center', padding: 32, position: 'relative', zIndex: 2 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(13,148,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <BadgeCheck style={{ width: 28, height: 28, color: ACCENT }} />
              </div>
              <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#fff' }}>Trusted <span style={{ color: ACCENT }}>quality</span></p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>FSSAI-licensed · GMP-certified · lab-tested</p>
            </div>
          </div>
        </section>

        {/* Edge / checklist */}
        <section className="about-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 96 }}>
          <div style={{ position: 'relative', borderRadius: 24, background: 'linear-gradient(150deg,#f0fdf9,#e6f3ef)', border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3', overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', padding: 32, position: 'relative', zIndex: 2 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fff', boxShadow: CARD_SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <Sparkles style={{ width: 28, height: 28, color: ACCENT_DK }} />
              </div>
              <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2, color: INK }}>Ancient <span style={{ color: ACCENT }}>wisdom.</span><br />Modern <span style={{ color: ACCENT }}>results.</span></p>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, display: 'block', marginBottom: 12 }}>Our edge</span>
            <h2 style={{ fontSize: 'clamp(26px,3.2vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', color: INK, lineHeight: 1.15, marginBottom: 18 }}>Held to a higher standard</h2>
            <p style={{ fontSize: 15.5, color: INK_SOFT, lineHeight: 1.8, marginBottom: 24 }}>
              We combine the wisdom of traditional Ayurveda with modern research to create products that are effective, safe and honest. Every formulation is held to strict quality standards.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['ISO-approved, GMP-certified facilities', 'Standardised natural ingredients', 'Meaningful, research-backed dosages', 'Every batch lab-tested for purity'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 24, height: 24, borderRadius: 999, background: ACCENT_SOFT, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check style={{ width: 13, height: 13, color: ACCENT_DK }} strokeWidth={3} />
                  </span>
                  <p style={{ fontSize: 15, color: INK }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta" style={{ background: 'linear-gradient(135deg,#0D9488,#0a7a6e)', borderRadius: 32, padding: '72px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 40%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.12, marginBottom: 16 }}>
              Ready to transform your wellness?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 34 }}>
              Experience the fusion of ancient wisdom and modern science. Let us guide you on your journey to better everyday health.
            </p>
            <ConsultationModal />
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-container { padding: 56px 18px !important; }
          .about-hero { padding: 52px 18px !important; }
          .about-2col { grid-template-columns: 1fr !important; gap: 28px !important; }
          .about-4col { grid-template-columns: 1fr 1fr !important; }
          .about-cta { padding: 52px 22px !important; }
        }
        @media (max-width: 560px) {
          .about-4col { grid-template-columns: 1fr !important; }
          .about-stats { grid-template-columns: 1fr 1fr !important; gap: 28px 20px !important; }
        }
      `}</style>
    </main>
  );
}
