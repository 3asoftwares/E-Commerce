import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white mt-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <FontAwesomeIcon icon={faShoppingBag} />
              </div>
              <h3 className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-pink-300">ShopHub</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted online marketplace for quality products at competitive prices. Shop with confidence and style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?featured=true"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  Featured Items
                </Link>
              </li>
              <li>
                <Link
                  href="/products?discount=true"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-indigo-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-purple-400 transition-colors inline-flex items-center gap-2 group"
                >
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:support@shophub.com" className="hover:text-blue-400 transition-colors">
                  support@shophub.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:1-800-4567" className="hover:text-blue-400 transition-colors">
                  1-800-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>123 Commerce St, City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex gap-4 mb-6 sm:mb-0">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                𝕏
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                in
              </a>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-gray-400 text-sm mb-2">© 2025 ShopHub. All rights reserved.</p>
              <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-xs">
                <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
