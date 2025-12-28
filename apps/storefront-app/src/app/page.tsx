'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
            <p className="text-xl mb-8">Discover amazing products at unbeatable prices</p>
            <div className="space-x-4">
              <Link
                href="/products"
                className="btn btn-lg bg-white text-primary-600 hover:bg-neutral-100"
              >
                Shop Now
              </Link>
              <Link
                href="/deals"
                className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-600"
              >
                View Deals
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-neutral-600 dark:text-neutral-400">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-neutral-600 dark:text-neutral-400">100% secure transactions</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">↩️</div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-neutral-600 dark:text-neutral-400">30-day return policy</p>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card bg-white dark:bg-neutral-800 shadow">
                  <div className="skeleton h-48 w-full"></div>
                  <div className="card-body">
                    <div className="skeleton h-4 w-3/4"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product: any) => (
                <div
                  key={product.id}
                  className="card bg-white dark:bg-neutral-800 shadow hover:shadow-lg transition"
                >
                  <figure className="h-48 bg-neutral-200 dark:bg-neutral-700">
                    <div className="text-6xl pt-12">📦</div>
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-base">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ${product.price}
                    </p>
                    <div className="card-actions justify-between items-center mt-4">
                      <Link href={`/products/${product.id}`} className="btn btn-sm btn-ghost">
                        View
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-sm btn-primary"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/products" className="btn btn-primary btn-lg">
              View All Products →
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white dark:bg-neutral-800 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Electronics', 'Clothing', 'Home & Garden', 'Sports'].map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${category.toLowerCase()}`}
                  className="card bg-neutral-100 dark:bg-neutral-700 hover:shadow-lg transition text-center p-8"
                >
                  <div className="text-5xl mb-4">
                    {category === 'Electronics' && '💻'}
                    {category === 'Clothing' && '👕'}
                    {category === 'Home & Garden' && '🏡'}
                    {category === 'Sports' && '⚽'}
                  </div>
                  <h3 className="text-xl font-bold">{category}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
