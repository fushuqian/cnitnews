import Link from 'next/link';
import { categories } from '@/types/article';
import { useState } from 'react';

interface NavbarProps {
  currentCategory?: string;
}

export default function Navbar({ currentCategory = 'all' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentLabel = currentCategory === 'all' 
    ? 'Categories' 
    : categories.find(c => c.key === currentCategory)?.label || 'Categories';

  return (
    <nav className="bg-primary-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-white text-2xl font-bold hover:text-gray-200 transition-colors">
            CN Geeker
          </Link>
          
          {/* Desktop: dropdown on hover */}
          <div className="hidden md:block relative group">
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{currentLabel}</span>
              <svg className={`w-3 h-3 transition-transform group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <Link
                  href="/"
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    currentCategory === 'all'
                      ? 'bg-primary-50 text-primary-500 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.key}
                    href={`/?category=${category.key}`}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      currentCategory === category.key
                        ? 'bg-primary-50 text-primary-500 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: hamburger */}
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

        {/* Mobile menu */}
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
