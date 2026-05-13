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
          <Link href="/" className="flex items-center">
            <img src="/images/cngeeker-logo.png" alt="CN Geeker" className="h-10 w-auto" />
          </Link>
          
          {/* Desktop: social icons + dropdown */}
          <div className="hidden md:flex items-center gap-2">
            {/* Social icons */}
            <a href="https://x.com/CNGeeker" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors p-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://facebook.com/CNGeeker" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors p-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://instagram.com/CNGeeker" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors p-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="/api/rss.xml" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors p-2" title="RSS Feed">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="6.18" cy="17.82" r="2.18"/>
                <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
              </svg>
            </a>

            {/* Dropdown */}
            <div className="relative group">
            <button className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="uppercase tracking-wider text-xs">{currentLabel}</span>
              <svg className={`w-3 h-3 transition-transform group-hover:rotate-180`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1">
                <Link
                  href="/"
                  className={`block px-4 py-2.5 text-sm text-right transition-colors ${
                    currentCategory === 'all'
                      ? 'bg-primary-50 text-primary-500 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ALL
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.key}
                    href={`/?category=${category.key}`}
                    className={`block px-4 py-2.5 text-sm text-right transition-colors ${
                      currentCategory === category.key
                        ? 'bg-primary-50 text-primary-500 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.label.toUpperCase()}
                  </Link>
                ))}
              </div>
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
