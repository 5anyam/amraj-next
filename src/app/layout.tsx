import './styles/globals.css';
import ReactQueryProvider from '../../components/ReactQueryProvider';
//import {ThemeProvider} from "../../components/ThemeProvider";
import { CartProvider } from '../../lib/cart';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Amraj - Rooted in Tradition, Backed by Science',
  description: 'An innovative fusion of modern nutraceuticals and ancient herbal wisdom-for results you can feel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className="overflow-x-hidden overflow-y-scroll">
      <ReactQueryProvider>
        <CartProvider>
          <Header/>
        {children}
        <Footer/>
        </CartProvider>
      </ReactQueryProvider>
    </body>
  </html>
  );
}
