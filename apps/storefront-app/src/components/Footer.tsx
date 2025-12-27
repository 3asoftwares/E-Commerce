import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Your trusted online marketplace for quality products at competitive prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>📧 support@store.com</li>
              <li>📞 1-800-STORE</li>
              <li>📍 123 Commerce St</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-700 mt-8 pt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <p>© 2025 3A SoftwaresStore. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-primary-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
