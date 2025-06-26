'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useIsMobile } from "../hooks/use-mobile";
import React from "react";
import { useTheme } from "../components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const navItems = [
  { name: "Home", to: "/" },
  { name: "Shop", to: "/shop" },
];

export default function Header() {
  const location = usePathname();
  const isMobile = useIsMobile();
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      // ✅ Yaha navigate ke jagah router.push istemaal kiya
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#18172b] border-b border-blue-100 dark:border-blue-950 shadow-sm backdrop-blur supports-backdrop-blur:bg-white/80 dark:supports-backdrop-blur:bg-[#191833]/70 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-6">
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <img className='h-20 w-28' src="amraj-logo.jpg" alt='amraj logo' height={100}/><span className="pl-0">AMRAJ</span>
          </Link>
          {!isMobile && (
            <nav className="ml-8 flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.to}
                  className={`font-medium transition-colors ${location === item.to
                    ? "text-green-600 dark:text-blue-200"
                    : "text-gray-700 hover:text-green-600 dark:text-blue-200/80 dark:hover:green-blue-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
        {!isMobile && (
          <form className="flex items-center mr-4" onSubmit={handleSearch}>
            <input
              type="text"
              className="px-3 py-2 rounded-l-md border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-[#232144] dark:text-white text-base w-52 transition-colors"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-r-md font-semibold transition-colors"
            >
              Search
            </button>
          </form>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition bg-blue-50 dark:bg-[#232144] hover:bg-blue-100 dark:hover:bg-blue-900 focus:outline-none border border-gray-200 dark:border-blue-900"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-blue-700" size={20} />
            )}
          </button>
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
