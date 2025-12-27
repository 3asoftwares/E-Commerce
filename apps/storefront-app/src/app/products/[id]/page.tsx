'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useProduct } from '../../../lib/api/queries';
import { useCartStore } from '../../../store/cartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { data, isLoading } = useProduct(productId);
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const product = data?.product;

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
      alert('Product added to cart!');
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Link href="/products" className="btn btn-primary">
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>{product.name}</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-neutral-200 dark:bg-neutral-700 rounded-lg h-96 flex items-center justify-center">
            <div className="text-9xl">📦</div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                ${product.price}
              </span>
              <span
                className={`badge badge-lg ${product.stock > 0 ? 'badge-success' : 'badge-error'}`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            <div className="divider"></div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Description</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {product.description || 'No description available.'}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Category</h3>
              <span className="badge badge-lg badge-outline">{product.category}</span>
            </div>

            <div className="divider"></div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quantity</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-sm btn-circle"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="input input-bordered w-20 text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    className="btn btn-sm btn-circle"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg flex-1"
                disabled={product.stock === 0}
              >
                🛒 Add to Cart
              </button>
              <button className="btn btn-outline btn-lg">❤️</button>
            </div>

            <div className="mt-8 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
              <h4 className="font-bold mb-2">🚚 Shipping Information</h4>
              <ul className="text-sm space-y-1 text-neutral-600 dark:text-neutral-400">
                <li>✓ Free shipping on orders over $50</li>
                <li>✓ Ships within 1-2 business days</li>
                <li>✓ 30-day return policy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">You Might Also Like</h2>
          <div className="text-center text-neutral-500 py-8">Related products will appear here</div>
        </section>
      </main>
      <Footer />
    </>
  );
}
