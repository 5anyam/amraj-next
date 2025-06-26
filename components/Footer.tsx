
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-700 via-green-900 to-green-900 dark:from-[#232144] dark:via-[#18172b] dark:to-[#18172b] text-white pt-10 pb-6 mt-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 md:flex md:justify-between md:items-start">
        <div className="mb-6 md:mb-0">
          <div className="flex items-center gap-2 mb-1">
            <img className="h-24" src="/amraj-dark-logo.png" alt="amraj dark logo"></img><span className="font-playfair font-bold text-3xl tracking-wide text-white">AMRAJ</span>
          </div>
          <p className="max-w-xs text-blue-100 dark:text-green-300 text-sm">
            Feel better, live better. Premium wellness essentials, crafted by science and care.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h4 className="text-lg font-semibold mb-3">Links</h4>
            <ul>
              <li>
                <Link href="/" className="text-blue-100 hover:text-white dark:text-blue-200 dark:hover:text-white block mb-2">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="text-blue-100 hover:text-white dark:text-blue-200 dark:hover:text-white block mb-2">Shop</Link>
              </li>
              <li>
                <Link href="/cart" className="text-blue-100 hover:text-white dark:text-blue-200 dark:hover:text-white block mb-2">Cart</Link>
              </li>
              <li>
                <Link href="/checkout" className="text-blue-100 hover:text-white dark:text-blue-200 dark:hover:text-white block">Checkout</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <ul>
              <li className="text-blue-100 dark:text-blue-300">support@plixblue.com</li>
              <li className="text-blue-100 mt-1 dark:text-blue-300">+91-00000-00000</li>
              <li className="text-blue-100 mt-1 dark:text-blue-300">Mumbai, India</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-blue-800 dark:border-blue-600 mt-8 pt-4 text-center text-blue-200 dark:text-blue-400 text-sm">
        © {new Date().getFullYear()} PlixBlue. All rights reserved.
      </div>
    </footer>
  );
}
