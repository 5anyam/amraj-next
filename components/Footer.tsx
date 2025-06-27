import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white pt-12 pb-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between md:items-start">
        {/* Brand Section */}
        <div className="mb-6 items-center justify-around md:mb-0">
        <div className="flex items-center mb-2">
          <img className="h-24" src="/amraj-dark-logo.png" alt="amraj dark logo" />
        </div>
          <p className="max-w-xs text-sm leading-relaxed">
          An innovative fusion of modern nutraceuticals and ancient herbal wisdom-for results
          <br/>you can feel.
          </p>
          {/* Social Media Icons */}
          <div className="flex gap-4 mt-4">
            <Link href="#" className="text-white hover:underline transition duration-200">
              <FaFacebookF />
            </Link>
            <Link href="#" className="text-white hover:underline transition duration-200">
              <FaTwitter />
            </Link>
            <Link href="#" className="text-white hover:underline transition duration-200">
              <FaInstagram />
            </Link>
            <Link href="#" className="text-white hover:underline transition duration-200">
              <FaLinkedinIn />
            </Link>
            <Link href="#" className="text-white hover:underline transition duration-200">
              <FaYoutube />
            </Link>
          </div>
        </div>
        {/* Links Section */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <div>
            <h4 className="text-xl font-semibold mb-4">Links</h4>
            <ul>
              <li>
                <Link href="/" className="text-white hover:underline block mb-3 transition duration-200">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="text-white hover:underline block mb-3 transition duration-200">Shop</Link>
              </li>
              <li>
                <Link href="/cart" className="text-white hover:underline block mb-3 transition duration-200">Cart</Link>
              </li>
              <li>
                <Link href="/checkout" className="text-white hover:underline block transition duration-200">Checkout</Link>
              </li>
            </ul>
        
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <ul>
              <li>support@amraj.in</li>
              <li className="mt-2">+91-00000-00000</li>
              <li className="mt-2">Prashant Vihar, India</li>
            </ul>
          </div>

          {/* Useful Links Section */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Useful Links</h4>
            <ul>
              <li>
                <Link href="/privacy-policy" className="text-white hover:underline block mb-3 transition duration-200">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-white hover:underline block mb-3 transition duration-200">Disclaimer</Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-white hover:underline block mb-3 transition duration-200">Return Policies</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white hover:underline block mb-3 transition duration-200">Shipping</Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-white hover:underline block transition duration-200">Sitemap</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-white flex justify-between items-center border-t mt-8 p-4 text-green-600 text-center text-sm">
       <div>© {new Date().getFullYear()} Amraj Wellness. All rights reserved. Developed By{" "}
        <span className="text-green-700 font-bold">
          <Link href="https://www.proshala.com">Proshala Tech</Link>
        </span></div>
        <img className="h-10" src="/badges.png" alt="badges" />
      </div>
    </footer>
  );
}
