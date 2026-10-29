'use client';
import Link from 'next/link';
import { Home, Compass, Search, Settings } from 'lucide-react';

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 block md:hidden bg-white shadow-lg rounded-t-2xl border-t border-gray-100 z-50">
      <div className="flex justify-around">
        <div className="flex-1 group">
          <Link
            href="/"
            className="flex flex-col items-center justify-center p-3 text-gray-400 group-hover:text-indigo-500"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
        </div>

        <div className="flex-1 group">
          <Link
            href="/explore"
            className="flex flex-col items-center justify-center p-3 text-gray-400 group-hover:text-indigo-500"
          >
            <Compass className="h-5 w-5" />
            <span className="text-xs mt-1">Explore</span>
          </Link>
        </div>

        <div className="flex-1 group">
          <Link
            href="/search"
            className="flex flex-col items-center justify-center p-3 text-gray-400 group-hover:text-indigo-500"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </Link>
        </div>

        <div className="flex-1 group">
          <Link
            href="/settings"
            className="flex flex-col items-center justify-center p-3 text-gray-400 group-hover:text-indigo-500"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
