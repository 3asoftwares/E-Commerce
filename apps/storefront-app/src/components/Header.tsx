'use client';

import Link from 'next/link';
import { useCartStore } from '../store/cartStore';

export default function Header() {
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            🛒 Store
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Categories
            </Link>
            <Link
              href="/deals"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition"
            >
              Deals
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="btn btn-ghost btn-sm btn-circle">🔍</button>

            {/* Cart */}
            <Link href="/cart" className="btn btn-ghost btn-sm btn-circle relative">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <button className="btn btn-ghost btn-sm">Account</button>
          </div>
        </div>
      </div>
    </header>
  );
}
