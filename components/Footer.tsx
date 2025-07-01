import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white pt-12 pb-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img className="h-24" src="/amraj-dark-logo.png" alt="amraj dark logo" />
            </div>
            <p className="text-sm leading-relaxed mb-4">
              An innovative fusion of modern nutraceuticals and ancient herbal wisdom-for results you can feel.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/share/171nqqCNnk/?mibextid=wwXIfr" className="text-white hover:underline transition duration-200">
                <FaFacebookF />
              </Link>
              <Link href="#" className="text-white hover:underline transition duration-200">
                <FaTwitter />
              </Link>
              <Link href="https://www.instagram.com/amraj_wellness?igsh=NXhjNHVvNDVlMHJr&utm_source=qr" className="text-white hover:underline transition duration-200">
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
          <div className="md:col-span-1">
            <h4 className="text-xl font-semibold mb-4">Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white hover:underline transition duration-200">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="text-white hover:underline transition duration-200">Shop</Link>
              </li>
              <li>
                <Link href="/cart" className="text-white hover:underline transition duration-200">Cart</Link>
              </li>
              <li>
                <Link href="/checkout" className="text-white hover:underline transition duration-200">Checkout</Link>
              </li>
            </ul>
          </div>

          {/* Useful Links Section */}
          <div className="md:col-span-1">
            <h4 className="text-xl font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-white hover:underline transition duration-200">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-white hover:underline transition duration-200">Terms and Conditions</Link>
              </li>
              <li>
                <Link href="/returns-and-refunds-policy" className="text-white hover:underline transition duration-200">Return and Refund Policies</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white hover:underline transition duration-200">Shipping</Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-white hover:underline transition duration-200">Sitemap</Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-1">
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>support@amraj.in</li>
              <li>+91 92116 19009</li>
              <li>D5/204, Chintpurni House, Central Market, Prashant Vihar, New Delhi-110085</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-white flex flex-col sm:flex-row justify-between items-center border-t mt-8 p-4 text-green-600 text-center text-sm gap-4 sm:gap-0">
        <div>
          © {new Date().getFullYear()} Amraj Wellness LLP. All rights reserved. Developed By{" "}
          <span className="text-green-700 font-bold">
            <Link href="https://www.proshala.com">Proshala Tech</Link>
          </span>
        </div>
        <img className="h-10" src="/badges.png" alt="badges" />
      </div>
    </footer>
  );
}