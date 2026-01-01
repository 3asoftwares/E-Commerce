'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button, Input } from '@e-commerce/ui-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faHeart,
  faShoppingCart,
  faUser,
  faCaretDown,
  faSignOutAlt,
  faBox,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { items, wishlist } = useCartStore();

  // Handle auth token from query params
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Load user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-lg border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto py-2">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 group flex-shrink-0">
            <div className="">
              <img
                src={'https://res.cloudinary.com/dpdfyou3r/image/upload/v1767265363/3A_gczh29.png'}
                alt={'3A Softwares'}
                className="object-contain w-16"
              />
            </div>
            <span className="hidden xs:block text-lg sm:text-2xl font-extrabold text-black">
              3A Softwares
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 mx-8">
            <div className="w-full relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, and more..."
                className="mb-0"
                rightIcon={
                  <button
                    type="submit"
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                  </button>
                }
              />
            </div>
          </form>

          <div className="flex items-center gap-1 xs:gap-2.5 sm:gap-4">
            <Link
              href="/wishlist"
              className="relative pt-2 p-1.5 xs:p-2 sm:pt-5 sm:p-2.5 text-gray-600 hover:text-pink-600 transition-all rounded-lg sm:rounded-xl hover:bg-pink-50 group"
              title="Wishlist"
            >
              <FontAwesomeIcon
                icon={faHeart}
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
              />
              {wishlist.length > 0 && (
                <span className="absolute top-2 -right-1 w-4 h-4 xs:w-5 xs:h-5 bg-gradient-to-br from-pink-500 to-red-500 text-white text-[10px] xs:text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative pt-2 p-1.5 xs:p-2 sm:pt-5 sm:p-2.5 text-gray-600 hover:text-indigo-600 transition-all rounded-lg sm:rounded-xl hover:bg-indigo-50 group"
              title="Shopping Cart"
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
              />
              {items.length > 0 && (
                <span className="absolute top-2 -right-1 w-4 h-4 xs:w-5 xs:h-5 bg-gray-400 text-white text-[10px] xs:text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {items.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <Button variant="outline" size="sm" fullWidth={false}>
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="text-xs xs:text-sm font-bold text-gray-800 truncate max-w-xs">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                  <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 xs:w-5 xs:h-5" />
                </Button>
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  variant="outline"
                  size="sm"
                  fullWidth={false}
                >
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                  >
                    <FontAwesomeIcon icon={faBox} className="mr-2" />
                    My Orders
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                  >
                    <FontAwesomeIcon icon={faBox} className="mr-2" />
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-b border-gray-100"
                  >
                    <FontAwesomeIcon icon={faBox} className="mr-2" />
                    Contact
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    fullWidth={true}
                    className="text-red-600 hover:bg-red-50 justify-start"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block px-4 xs:px-6 py-2 xs:py-2.5 border-2 border-black text-gray-800 font-bold rounded-md hover:shadow-lg transition-all text-xs xs:text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              fullWidth={false}
              className="md:hidden p-1.5 xs:p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-3 sm:pb-4">
          <div className="w-full relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="mb-0"
              rightIcon={
                <button
                  type="submit"
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
                </button>
              }
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <Link
            href="/"
            className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 border-b border-gray-100 font-medium"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 border-b border-gray-100 font-medium"
          >
            Products
          </Link>
          <Link
            href="/orders"
            className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 border-b border-gray-100 font-medium"
          >
            Orders
          </Link>
          <Link
            href="/about"
            className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 border-b border-gray-100 font-medium"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 border-b border-gray-100 font-medium"
          >
            Contact
          </Link>
          <Link
            href="/cart"
            className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 border-b border-gray-100 font-medium"
          >
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            Cart ({items.length})
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 border-b border-gray-100 font-medium"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Profile
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="md"
                fullWidth={true}
                className="text-red-600 hover:bg-red-50 justify-start font-medium"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className="block px-4 py-3 text-indigo-600 font-medium hover:bg-indigo-50"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
