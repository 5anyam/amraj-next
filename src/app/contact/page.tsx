"use client"
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Calendar } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
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
    width: '100%', padding: '12px 16px', border: '2px solid #0f1117', background: '#fff',
    color: '#0f1117', fontSize: 13, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit', boxShadow: '2px 2px 0 #0f1117',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
    textTransform: 'uppercase', color: 'rgba(15,17,23,0.5)', marginBottom: 8,
  };

  return (
    <main style={{ minHeight: '100vh', background: '#faf7f2' }}>

      {/* Hero */}
      <section style={{ background: '#0f1117', padding: '64px 32px', borderBottom: '4px solid #F07B32', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(240,123,50,0.04) 40px, rgba(240,123,50,0.04) 41px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 16 }}>◆ We&apos;re Here to Help</span>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(60px,10vw,120px)', color: '#fff', lineHeight: 0.9, marginBottom: 20, letterSpacing: '0.02em' }}>
            GET IN<br /><span style={{ color: '#F07B32' }}>TOUCH.</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
            Have questions about our wellness solutions? We&apos;d love to hear from you and guide you toward better health.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}>

        {/* Contact Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', border: '3px solid #0f1117', boxShadow: '6px 6px 0 #0f1117', marginBottom: 64 }}>
          {[
            { icon: <Mail size={22} />, title: 'EMAIL US', sub: 'Response within 24 hours', value: 'care@amraj.in', href: 'mailto:care@amraj.in' },
            { icon: <Phone size={22} />, title: 'CALL US', sub: 'Speak with our experts', value: '+91 92116 19009', href: 'tel:+919211619009' },
            { icon: <MapPin size={22} />, title: 'VISIT US', sub: 'Personal consultation', value: 'Prashant Vihar, New Delhi', href: null },
          ].map((card, i) => (
            <div key={i} style={{ padding: '40px 32px', borderRight: i < 2 ? '3px solid #0f1117' : 'none', background: i === 1 ? '#0f1117' : '#fff', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, background: i === 1 ? '#F07B32' : '#F07B32', border: '2.5px solid #0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '3px 3px 0 rgba(15,17,23,0.2)', color: '#fff' }}>
                {card.icon}
              </div>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, letterSpacing: '0.06em', color: i === 1 ? '#F07B32' : '#0f1117', marginBottom: 8 }}>{card.title}</h3>
              <p style={{ fontSize: 11, color: i === 1 ? 'rgba(255,255,255,0.45)' : 'rgba(15,17,23,0.45)', marginBottom: 14, letterSpacing: '0.04em' }}>{card.sub}</p>
              {card.href
                ? <a href={card.href} style={{ fontSize: 13, fontWeight: 600, color: '#F07B32', textDecoration: 'none', borderBottom: '2px solid #F07B32', paddingBottom: 2 }}>{card.value}</a>
                : <address style={{ fontSize: 12, color: i === 1 ? 'rgba(255,255,255,0.6)' : 'rgba(15,17,23,0.6)', fontStyle: 'normal', lineHeight: 1.6 }}>{card.value}</address>
              }
            </div>
          ))}
        </section>

        {/* Form + Office Info */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40, marginBottom: 64 }}>

          {/* Form */}
          <div style={{ border: '3px solid #0f1117', background: '#fff', boxShadow: '6px 6px 0 #0f1117', overflow: 'hidden' }}>
            <div style={{ padding: '18px 28px', borderBottom: '3px solid #0f1117', background: '#0f1117' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#F07B32', letterSpacing: '0.08em' }}>SEND US A MESSAGE</h2>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleInputChange}
                    style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%230f1117\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="consultation">Wellness Consultation</option>
                    <option value="products">Product Information</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Customer Support</option>
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
                style={{ width: '100%', background: isSubmitted ? '#0f1117' : '#F07B32', color: '#fff', padding: '14px 20px', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!isSubmitted) (e.currentTarget as HTMLElement).style.background = '#0f1117'; }}
                onMouseLeave={e => { if (!isSubmitted) (e.currentTarget as HTMLElement).style.background = '#F07B32'; }}
              >
                {isSubmitted ? (<><CheckCircle size={16} /> MESSAGE SENT!</>) : (<><Send size={16} /> SEND MESSAGE →</>)}
              </button>
            </div>
          </div>

          {/* Office Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ border: '3px solid #0f1117', background: '#fff', boxShadow: '4px 4px 0 #0f1117', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '3px solid #0f1117', background: '#0f1117' }}>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 20, color: '#F07B32', letterSpacing: '0.08em' }}>OUR OFFICE</h3>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { icon: <MapPin size={18} />, label: 'ADDRESS', content: 'D5/204, Chintpurni House,\nCentral Market, Prashant Vihar,\nNew Delhi-110085' },
                  { icon: <Clock size={18} />, label: 'BUSINESS HOURS', content: 'Mon–Fri: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM\nSunday: Closed' },
                  { icon: <Calendar size={18} />, label: 'CONSULTATIONS', content: 'By Appointment Only\nCall us to schedule your session' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, background: '#F07B32', border: '2px solid #0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(15,17,23,0.4)', marginBottom: 6 }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: 'rgba(15,17,23,0.7)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{ border: '3px solid #0f1117', background: '#0f1117', boxShadow: '4px 4px 0 #F07B32', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', flex: 1 }}>
              <div style={{ textAlign: 'center' }}>
                <MapPin size={36} style={{ color: '#F07B32', marginBottom: 12 }} />
                <h4 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22, color: '#fff', letterSpacing: '0.06em', marginBottom: 8 }}>FIND US HERE</h4>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>PRASHANT VIHAR, NEW DELHI</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 12 }}>◆ Quick Answers</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,5vw,64px)', letterSpacing: '0.02em', color: '#0f1117', lineHeight: 1 }}>FREQUENTLY ASKED</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { q: 'How quickly will I receive a response?', a: 'We typically respond to emails within 24 hours and phone calls are answered during business hours.' },
              { q: 'Do you offer free consultations?', a: 'Yes, we offer free initial consultations to understand your wellness needs and recommend suitable products.' },
              { q: 'Can I visit your office without an appointment?', a: 'We recommend scheduling an appointment to ensure our wellness experts are available for personalized attention.' },
              { q: 'What information should I include in my inquiry?', a: 'Please include your health goals, any specific concerns, and current wellness routine to help us provide the best recommendations.' },
            ].map((faq, i) => (
              <div key={i} style={{ border: '2.5px solid #0f1117', background: '#fff', padding: '24px 28px', boxShadow: '3px 3px 0 #0f1117' }}>
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 18, letterSpacing: '0.03em', color: '#0f1117', marginBottom: 10, lineHeight: 1.2 }}>{faq.q}</h3>
                <p style={{ fontSize: 12, color: 'rgba(15,17,23,0.6)', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: '#0f1117', padding: '64px 48px', border: '3px solid #0f1117', boxShadow: '8px 8px 0 #F07B32', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(240,123,50,0.06) 40px, rgba(240,123,50,0.06) 41px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#F07B32', display: 'block', marginBottom: 16 }}>◆ Start Today</span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,7vw,88px)', color: '#fff', lineHeight: 0.9, marginBottom: 20, letterSpacing: '0.02em' }}>
              READY TO START YOUR<br /><span style={{ color: '#F07B32' }}>WELLNESS JOURNEY?</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.8 }}>
              Contact us today and let our experts guide you towards optimal health with personalized solutions.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+919211619009"
                style={{ display: 'inline-block', background: '#fff', color: '#0f1117', padding: '13px 32px', border: '2.5px solid #fff', boxShadow: '4px 4px 0 rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 rgba(255,255,255,0.3)'; }}
              >
                CALL NOW →
              </a>
              <a href="mailto:care@amraj.in"
                style={{ display: 'inline-block', background: '#F07B32', color: '#fff', padding: '13px 32px', border: '2.5px solid #F07B32', boxShadow: '4px 4px 0 rgba(240,123,50,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 rgba(240,123,50,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 rgba(240,123,50,0.4)'; }}
              >
                EMAIL US →
              </a>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          section[style*="grid-template-columns: 1fr 420px"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          section[style*="grid-template-columns: repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: repeat(3,1fr)"] > div { border-right: none !important; border-bottom: 3px solid #0f1117 !important; }
          section[style*="grid-template-columns: repeat(3,1fr)"] > div:last-child { border-bottom: none !important; }
          section[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"]:not(section) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
