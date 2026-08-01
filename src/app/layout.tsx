import './styles/globals.css';
import ReactQueryProvider from '../../components/ReactQueryProvider';
import { CartProvider } from '../../lib/cart';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FacebookPixel from '../../components/FacebookPixel';
import Script from 'next/script';
import AnnouncementBar from '../../components/anouncement';
import { Suspense } from 'react';
import Whatsapp from '../../components/Whatsapp';
import Loading from './loading'; // Import the new loading component
import { AuthProvider } from '../../lib/auth-context';

export const metadata = {
  metadataBase: new URL('https://www.amraj.in'),
  title: {
    default: 'Amraj — Ayurvedic & Nutraceutical Wellness Supplements, Made in India',
    template: '%s | Amraj',
  },
  description:
    'Amraj blends ancient herbal wisdom with modern nutraceuticals — FSSAI-certified, GMP-made, lab-tested supplements for prostate care, liver detox and weight management. COD & pan-India delivery.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Amraj',
    url: 'https://www.amraj.in',
    title: 'Amraj — Ayurvedic & Nutraceutical Wellness Supplements',
    description:
      'FSSAI-certified, lab-tested supplements for prostate care, liver detox and weight management. Rooted in tradition, backed by science.',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amraj — Ayurvedic & Nutraceutical Wellness Supplements',
    description:
      'FSSAI-certified, lab-tested supplements for prostate care, liver detox and weight management.',
  },
  robots: { index: true, follow: true },
};

/* Sitewide entity data for search engines. Rendered once in <head>. */
const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.amraj.in/#org',
  name: 'Amraj Wellness',
  url: 'https://www.amraj.in',
  logo: 'https://www.amraj.in/amraj-logo.svg',
  slogan: 'Rooted in Tradition, Backed by Science',
  email: 'mailto:care@amraj.in',
  telephone: '+91-92116-19009',
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Amraj',
  url: 'https://www.amraj.in',
  publisher: { '@id': 'https://www.amraj.in/#org' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fbPixelId = '821676473858360';
  const gtagId = 'AW-17423083060';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cms.amraj.in" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Facebook Pixel Script - Updated */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Google Analytics - Cleaned Up */}
        <Script 
          src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtagId}');
          `}
        </Script>

        {/* Facebook Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
            alt="facebook pixel"
          />
        </noscript>
      </head>
      <body className="overflow-x-hidden overflow-y-scroll antialiased">
        <ReactQueryProvider>
          <CartProvider>
            <AuthProvider>
            {/* 
              Flex Layout Structure:
              Ensures Footer stays at bottom and Content takes remaining space
            */}
            <div className="flex flex-col min-h-screen">
              <AnnouncementBar />
              <Header />
              
              {/* Main Content Area */}
              <main className="flex-grow">
                {/* Suspense Wrapper keeps Header/Footer visible while loading content */}
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
              </main>

              <Footer />
            </div>
            
            <Whatsapp/>
            
            {/* Facebook Pixel Route Tracking */}
            <Suspense fallback={null}>
              <FacebookPixel pixelId={1648859765778662} />
            </Suspense>
            </AuthProvider>
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
