'use client';

import Link from 'next/link';
import HeaderWrapper from '../components/HeaderWrapper';
import FooterWrapper from '../components/FooterWrapper';
import { useFeaturedProducts } from '../lib/api/queries';
import { useCartStore } from '../store/cartStore';

export default function HomePage() {
  const { data, isLoading } = useFeaturedProducts();
  const { addItem } = useCartStore();

  const featuredProducts = data?.featuredProducts || [];

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <>
      <HeaderWrapper />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Welcome to ShopHub
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Discover amazing products at unbeatable prices. Fast shipping, secure checkout, and 30-day returns.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link
                    href="/products"
                    className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl hover:shadow-blue-400/50 transition-all transform hover:scale-105"
                  >
                    Shop Now →
                  </Link>
                  <Link
                    href="/products?featured=true"
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
                  >
                    View Featured
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-9xl">🛍️</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-3">🚚</div>
                <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure transactions</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">↩️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
                <p className="text-sm text-gray-600">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
            <p className="text-lg text-gray-600">Handpicked items just for you</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden bg-white shadow-md animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 mb-3 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 8).map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                  >
                    {/* Product Image */}
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-blue-100 transition-colors">
                      <div className="text-6xl">📦</div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 mb-4">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="flex-1 px-3 py-2 text-center text-sm font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 px-3 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/products"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Explore All Products →
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Categories */}
        <section className="bg-white border-t border-gray-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
              <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Electronics', emoji: '💻', color: 'from-orange-100 to-orange-50' },
                { name: 'Clothing', emoji: '👕', color: 'from-pink-100 to-pink-50' },
                { name: 'Home & Garden', emoji: '🏡', color: 'from-green-100 to-green-50' },
                { name: 'Sports', emoji: '⚽', color: 'from-blue-100 to-blue-50' },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={`/products?category=${category.name.toLowerCase()}`}
                  className={`bg-gradient-to-br ${category.color} rounded-lg p-8 text-center hover:shadow-xl transition-all transform hover:scale-105 group`}
                >
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {category.emoji}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Get exclusive deals, early access to new products, and special offers delivered to your inbox.
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition-all">
              Subscribe Now
            </button>
          </div>
        </section>
      </main>
      <FooterWrapper />
    </>
  );
}
