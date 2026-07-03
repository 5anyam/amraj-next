"use client"
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Calendar, Sparkles } from 'lucide-react';

const INK = '#17191f';
const INK_SOFT = '#5c6470';
const LINE = '#e9eaee';
const ACCENT = '#0D9488';
const ACCENT_DK = '#0a7a6e';
const ACCENT_SOFT = '#eef7f5';
const BG_SOFT = '#f6f8f7';
const CARD_SHADOW = '0 2px 16px rgba(16,24,40,0.05)';
const RADIUS = 20;

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', border: `1.5px solid ${LINE}`, background: '#fff',
    color: INK, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', borderRadius: 12,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginBottom: 7,
  };

  return (
    <main style={{ minHeight: '100vh', background: '#fff', color: INK }}>

      {/* Hero */}
      <section className="contact-hero" style={{ background: 'linear-gradient(170deg,#ffffff 0%,#f2faf8 60%,#f6f8f7 100%)', padding: '72px 24px', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: ACCENT_SOFT, color: ACCENT_DK, fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 999, marginBottom: 22 }}>
            <Sparkles size={14} /> We&apos;re here to help
          </span>
          <h1 style={{ fontSize: 'clamp(38px,5.4vw,60px)', fontWeight: 700, letterSpacing: '-0.03em', color: INK, lineHeight: 1.06, marginBottom: 20 }}>Get in touch</h1>
          <p style={{ fontSize: 17, color: INK_SOFT, lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Have questions about our wellness range? We&apos;d love to hear from you and help you choose the right formula.
          </p>
        </div>
      </section>

      <div className="contact-container" style={{ maxWidth: 1080, margin: '0 auto', padding: '72px 24px' }}>

        {/* Contact Cards */}
        <section className="contact-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 64 }}>
          {[
            { icon: <Mail size={22} />, title: 'Email us', sub: 'Response within 24 hours', value: 'care@amraj.in', href: 'mailto:care@amraj.in' },
            { icon: <Phone size={22} />, title: 'Call us', sub: 'Speak with our team', value: '+91 92116 19009', href: 'tel:+919211619009' },
            { icon: <MapPin size={22} />, title: 'Visit us', sub: 'By appointment', value: 'Prashant Vihar, New Delhi', href: null },
          ].map((card, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: RADIUS, border: `1px solid ${LINE}`, padding: '32px 28px', textAlign: 'center', boxShadow: CARD_SHADOW }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: ACCENT_DK }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 6 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: INK_SOFT, marginBottom: 14 }}>{card.sub}</p>
              {card.href
                ? <a href={card.href} style={{ fontSize: 14.5, fontWeight: 600, color: ACCENT_DK, textDecoration: 'none' }}>{card.value}</a>
                : <address style={{ fontSize: 14, color: INK_SOFT, fontStyle: 'normal', lineHeight: 1.6 }}>{card.value}</address>
              }
            </div>
          ))}
        </section>

        {/* Form + Office Info */}
        <section className="contact-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32, marginBottom: 72 }}>

          {/* Form */}
          <div style={{ borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
            <div style={{ padding: '22px 28px', borderBottom: `1px solid ${LINE}` }}>
              <h2 style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', color: INK }}>Send us a message</h2>
            </div>
            <div style={{ padding: 28 }}>
              <div className="contact-form-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" style={inputStyle} />
                </div>
              </div>
              <div className="contact-form-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Phone number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleInputChange}
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%235c6470\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General inquiry</option>
                    <option value="consultation">Wellness consultation</option>
                    <option value="products">Product information</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Customer support</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Message</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5}
                  placeholder="Tell us about your wellness goals or any questions you have..."
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button onClick={handleSubmit}
                style={{ width: '100%', background: isSubmitted ? INK : ACCENT, color: '#fff', padding: '15px 20px', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: isSubmitted ? 'none' : '0 8px 20px rgba(13,148,136,0.25)', transition: 'background 0.2s' }}
              >
                {isSubmitted ? (<><CheckCircle size={17} /> Message sent!</>) : (<><Send size={16} /> Send message</>)}
              </button>
            </div>
          </div>

          {/* Office Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', boxShadow: CARD_SHADOW, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: `1px solid ${LINE}` }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: INK }}>Our office</h3>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { icon: <MapPin size={18} />, label: 'Address', content: 'D5/204, Chintpurni House,\nCentral Market, Prashant Vihar,\nNew Delhi-110085' },
                  { icon: <Clock size={18} />, label: 'Business hours', content: 'Mon–Fri: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM\nSunday: Closed' },
                  { icon: <Calendar size={18} />, label: 'Consultations', content: 'By appointment only\nCall us to schedule your session' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: ACCENT_DK }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: INK_SOFT, marginBottom: 6 }}>{item.label}</p>
                      <p style={{ fontSize: 14, color: INK, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: RADIUS, background: 'linear-gradient(150deg,#0D9488,#0a7a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', flex: 1, boxShadow: '0 12px 30px rgba(13,148,136,0.18)' }}>
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <MapPin size={34} style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Find us here</h4>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Prashant Vihar, New Delhi</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 44px' }}>
            <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>Quick answers</span>
            <h2 style={{ fontSize: 'clamp(28px,3.6vw,42px)', fontWeight: 700, letterSpacing: '-0.025em', color: INK, lineHeight: 1.12 }}>Frequently asked</h2>
          </div>
          <div className="contact-faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {[
              { q: 'How quickly will I receive a response?', a: 'We typically respond to emails within 24 hours, and phone calls are answered during business hours.' },
              { q: 'Do you offer free consultations?', a: 'Yes — we offer free initial consultations to understand your wellness needs and recommend suitable products.' },
              { q: 'Can I visit your office without an appointment?', a: 'We recommend scheduling an appointment so our team is available to give you personalised attention.' },
              { q: 'What should I include in my inquiry?', a: 'Please share your health goals, any specific concerns, and current routine so we can give the best recommendations.' },
            ].map((faq, i) => (
              <div key={i} style={{ borderRadius: RADIUS, border: `1px solid ${LINE}`, background: '#fff', padding: '26px 28px', boxShadow: CARD_SHADOW }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: INK, marginBottom: 10, lineHeight: 1.3 }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: INK_SOFT, lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="contact-cta" style={{ background: 'linear-gradient(135deg,#0D9488,#0a7a6e)', borderRadius: 32, padding: '72px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12), transparent 40%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1.12, marginBottom: 16 }}>
              Ready to start your wellness journey?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 34 }}>
              Reach out today and let our team help you choose the right formula for your goals.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+919211619009" style={{ display: 'inline-block', background: '#fff', color: INK, padding: '15px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                Call now →
              </a>
              <a href="mailto:care@amraj.in" style={{ display: 'inline-block', background: 'transparent', color: '#fff', padding: '15px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.5)' }}>
                Email us →
              </a>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .contact-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .contact-container { padding: 56px 18px !important; }
          .contact-hero { padding: 52px 18px !important; }
          .contact-cards { grid-template-columns: 1fr !important; }
          .contact-faq-grid { grid-template-columns: 1fr !important; }
          .contact-form-inner { grid-template-columns: 1fr !important; }
          .contact-cta { padding: 52px 22px !important; }
        }
      `}</style>
    </main>
  );
}
