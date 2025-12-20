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
  title: 'Amraj - Rooted in Tradition, Backed by Science',
  description: 'An innovative fusion of modern nutraceuticals and ancient herbal wisdom—for results you can feel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fbPixelId = '821676473858360';
  const gtagId = 'AW-17423083060';

  return (
    <html lang="en">
      <head>
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
