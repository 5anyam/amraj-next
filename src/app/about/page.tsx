"use client"
import React, { useState } from 'react';
import { X } from 'lucide-react';

function ConsultationModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{ background: '#F07B32', color: '#fff', padding: '14px 36px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'transform 0.15s, box-shadow 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #0f1117'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #0f1117'; }}
      >
        GET FREE CONSULTATION →
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,17,23,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', border: '3px solid #0f1117', boxShadow: '8px 8px 0 #0f1117', width: '100%', maxWidth: 480, overflow: 'hidden' }}>
            <div style={{ background: '#0f1117', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#F07B32', letterSpacing: '0.06em' }}>FREE CONSULTATION</h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Your Name', 'Your Email', 'Your Phone'].map((ph, i) => (
                <input key={i} type={i === 1 ? 'email' : i === 2 ? 'tel' : 'text'} placeholder={ph}
                  style={{ width: '100%', padding: '12px 16px', border: '2px solid #0f1117', background: '#faf7f2', color: '#0f1117', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              ))}
              <textarea placeholder="Tell us about your health goals..." rows={4}
                style={{ width: '100%', padding: '12px 16px', border: '2px solid #0f1117', background: '#faf7f2', color: '#0f1117', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              <button onClick={() => setIsOpen(false)}
                style={{ background: '#0f1117', color: '#fff', padding: '13px 20px', border: '2.5px solid #0f1117', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F07B32')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0f1117')}
              >
                BOOK CONSULTATION →
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
    <main style={{ minHeight: '100vh', background: '#faf7f2' }}>

      {/* Hero */}
      <section style={{ background: '#0f1117', padding: '64px 32px', borderBottom: '4px solid #F07B32', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(240,123,50,0.04) 40px, rgba(240,123,50,0.04) 41px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 16 }}>◆ Our Story</span>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(60px,10vw,120px)', color: '#fff', lineHeight: 0.9, marginBottom: 20, letterSpacing: '0.02em' }}>
            ABOUT<br /><span style={{ color: '#F07B32' }}>AMRAJ.</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
            An innovative fusion of modern nutraceuticals and ancient herbal wisdom — for results you can feel.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}>

        {/* Mission */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', marginBottom: 80 }}>
          <div style={{ border: '3px solid #0f1117', boxShadow: '6px 6px 0 #0f1117', background: '#F07B32', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3' }}>
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 80, lineHeight: 1, color: '#0f1117', letterSpacing: '0.02em' }}>NATURE<br />+<br />SCIENCE</div>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 12 }}>◆ Our Mission</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, letterSpacing: '0.02em', color: '#0f1117', lineHeight: 1, marginBottom: 20 }}>YOUR TRUSTED WELLNESS PARTNER</h2>
            <p style={{ fontSize: 14, color: 'rgba(15,17,23,0.65)', lineHeight: 1.8, marginBottom: 24 }}>
              At Amraj Wellness LLP, we bridge the gap between time-tested herbal traditions and cutting-edge nutraceutical science. Our commitment is to provide you with premium wellness solutions that deliver measurable results while honoring the wisdom of nature.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F07B32' }}>
              DISCOVER OUR STORY →
            </div>
          </div>
        </section>

        {/* Why Choose */}
        <section style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 12 }}>◆ Our Advantages</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 1 }}>WHY CHOOSE AMRAJ?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: '3px solid #0f1117', boxShadow: '6px 6px 0 #0f1117' }}>
            {[
              { num: '01', title: 'ANCIENT WISDOM', desc: 'Traditional herbal knowledge passed down through generations' },
              { num: '02', title: 'MODERN SCIENCE', desc: 'Research-backed formulations with clinically proven efficacy' },
              { num: '03', title: 'PERSONALIZED CARE', desc: 'Tailored wellness solutions for your unique needs' },
              { num: '04', title: 'PREMIUM QUALITY', desc: 'Highest standards in sourcing and manufacturing' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '36px 28px', borderRight: i < 3 ? '3px solid #0f1117' : 'none', background: i % 2 === 0 ? '#fff' : '#faf7f2', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 56, color: 'rgba(240,123,50,0.15)', lineHeight: 1, marginBottom: 12 }}>{item.num}</div>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: '0.04em', color: '#0f1117', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: 'rgba(15,17,23,0.55)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', marginBottom: 80 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 12 }}>◆ Our Vision</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, letterSpacing: '0.02em', color: '#0f1117', lineHeight: 1, marginBottom: 20 }}>INDIA&apos;S MOST TRUSTED WELLNESS BRAND</h2>
            <p style={{ fontSize: 14, color: 'rgba(15,17,23,0.65)', lineHeight: 1.8, marginBottom: 24 }}>
              To empower millions to achieve optimal health through the perfect harmony of nature and science.
            </p>
            <div style={{ borderLeft: '4px solid #F07B32', paddingLeft: 20, background: '#fff', border: '2px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', padding: '20px 20px 20px 24px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#F07B32', marginBottom: 8 }}>OUR PROMISE</p>
              <p style={{ fontSize: 13, color: 'rgba(15,17,23,0.7)', lineHeight: 1.7 }}>
                Every product we create is a testament to our commitment to your well-being, combining the best of both worlds for results you can truly feel.
              </p>
            </div>
          </div>
          <div style={{ border: '3px solid #0f1117', boxShadow: '6px 6px 0 #0f1117', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3' }}>
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 72, lineHeight: 1, color: '#F07B32', letterSpacing: '0.02em' }}>TRUSTED<br />QUALITY</div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 12 }}>◆ How We Work</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 1 }}>OUR WELLNESS JOURNEY</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', border: '3px solid #0f1117', boxShadow: '6px 6px 0 #0f1117' }}>
            {[
              { step: '01', title: 'CONSULT', desc: 'Understanding your unique wellness needs and goals' },
              { step: '02', title: 'ANALYSE', desc: 'Comprehensive health assessment and lifestyle evaluation' },
              { step: '03', title: 'FORMULATE', desc: 'Custom blend of herbs and nutraceuticals for you' },
              { step: '04', title: 'DELIVER', desc: 'Premium products delivered to your doorstep' },
              { step: '05', title: 'SUPPORT', desc: 'Ongoing guidance and wellness monitoring' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '36px 20px', borderRight: i < 4 ? '3px solid #0f1117' : 'none', background: i % 2 !== 0 ? '#fff' : '#faf7f2', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, background: '#F07B32', border: '2.5px solid #0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '3px 3px 0 #0f1117' }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, color: '#fff', letterSpacing: '0.04em' }}>{item.step}</span>
                </div>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 16, letterSpacing: '0.06em', color: '#0f1117', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 11, color: 'rgba(15,17,23,0.55)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Detailed */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', marginBottom: 80 }}>
          <div style={{ border: '3px solid #0f1117', boxShadow: '6px 6px 0 #0f1117', background: '#faf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '4/3' }}>
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 64, lineHeight: 1.1, color: '#0f1117', letterSpacing: '0.02em' }}>ANCIENT<br /><span style={{ color: '#F07B32' }}>WISDOM.</span><br />MODERN<br /><span style={{ color: '#F07B32' }}>RESULTS.</span></div>
            </div>
          </div>
          <div>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 12 }}>◆ Our Edge</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, letterSpacing: '0.02em', color: '#0f1117', lineHeight: 1, marginBottom: 20 }}>WHY CHOOSE AMRAJ?</h2>
            <p style={{ fontSize: 14, color: 'rgba(15,17,23,0.65)', lineHeight: 1.8, marginBottom: 24 }}>
              We combine the wisdom of ancient Ayurveda with modern scientific research to create products that are both effective and safe. Our team of experts ensures every formulation meets the highest quality standards.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['ISO certified manufacturing facilities', '100% natural and organic ingredients', 'Clinically tested formulations', 'Personalized wellness solutions'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, background: '#F07B32', border: '2px solid #0f1117', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>✓</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(15,17,23,0.7)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0f1117', padding: '64px 48px', border: '3px solid #0f1117', boxShadow: '8px 8px 0 #F07B32', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(240,123,50,0.06) 40px, rgba(240,123,50,0.06) 41px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 16 }}>◆ Take Action</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,7vw,88px)', color: '#fff', lineHeight: 0.9, marginBottom: 20, letterSpacing: '0.02em' }}>
              READY TO TRANSFORM<br /><span style={{ color: '#F07B32' }}>YOUR WELLNESS?</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.8 }}>
              Experience the perfect fusion of ancient wisdom and modern science. Let us guide you on your journey to optimal health.
            </p>
            <ConsultationModal />
          </div>
        </section>

      </div>

      <style>{`
        @media (max-width: 900px) {
          section[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: repeat(4,1fr)"] { grid-template-columns: 1fr 1fr !important; }
          section[style*="grid-template-columns: repeat(4,1fr)"] > div { border-right: 3px solid #0f1117 !important; border-bottom: 3px solid #0f1117 !important; }
          section[style*="grid-template-columns: repeat(5,1fr)"] { grid-template-columns: 1fr 1fr !important; }
          section[style*="grid-template-columns: repeat(5,1fr)"] > div { border-right: 3px solid #0f1117 !important; border-bottom: 3px solid #0f1117 !important; }
        }
        @media (max-width: 560px) {
          section[style*="grid-template-columns: repeat(4,1fr)"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: repeat(5,1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
