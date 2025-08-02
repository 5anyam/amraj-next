import './styles/globals.css';
import ReactQueryProvider from '../../components/ReactQueryProvider';
import { CartProvider } from '../../lib/cart';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Script from 'next/script';
import AnnouncementBar from '../../components/anouncement';

export const metadata = {
  title: 'Amraj - Rooted in Tradition, Backed by Science',
  description: 'An innovative fusion of modern nutraceuticals and ancient herbal wisdom—for results you can feel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Facebook Pixel Script */}
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
            fbq('init', '1648859765778662');
            fbq('track', 'PageView');
            fbq('track', 'AddToCart');
            fbq('track', 'Contact');
            fbq('track', 'InitiateCheckout');
            fbq('track', 'ViewContent');
            fbq('track', 'AddPaymentInfo');
            fbq('track', 'AddToWishlist');
            fbq('track', 'Purchase');
            fbq('track', 'Search');
            fbq('track', 'Subscribe');
          `}
        </Script>

        {/* Facebook Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1648859765778662&ev=PageView&noscript=1"
          />
        </noscript>
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17423083060">
</script>
<script>
  {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());}

  gtag('config', 'AW-17423083060');`}
</script>
      </head>
      <body className="overflow-x-hidden overflow-y-scroll">
        <ReactQueryProvider>
          <CartProvider>
            <AnnouncementBar/>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
