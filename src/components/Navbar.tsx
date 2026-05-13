import Link from 'next/link';
import { categories } from '@/types/article';
import { useState } from 'react';

interface NavbarProps {
  currentCategory?: string;
}

export default function Navbar({ currentCategory = 'all' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-white text-2xl font-bold hover:text-gray-200 transition-colors">
            China IT News
          </Link>
          
          <div className="hidden md:flex space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentCategory === 'all'
                  ? 'bg-white text-primary-500'
                  : 'text-white hover:bg-primary-400'
              }`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.key}
                href={`/?category=${category.key}`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentCategory === category.key
                    ? 'bg-white text-primary-500'
                    : 'text-white hover:bg-primary-400'
                }`}
              >
                {category.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-white hover:text-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentCategory === 'all'
                  ? 'bg-white text-primary-500'
                  : 'text-white hover:bg-primary-400'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.key}
                href={`/?category=${category.key}`}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentCategory === category.key
                    ? 'bg-white text-primary-500'
                    : 'text-white hover:bg-primary-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
