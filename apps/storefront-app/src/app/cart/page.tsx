'use client';

import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCartStore } from '../../store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-8xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Add some products to your cart to get started!
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              Continue Shopping
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <button onClick={clearCart} className="btn btn-ghost btn-sm">
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card bg-white dark:bg-neutral-800 shadow">
                <div className="card-body">
                  <div className="flex gap-4">
                    {/* Image Placeholder */}
                    <div className="w-24 h-24 bg-neutral-200 dark:bg-neutral-700 rounded flex items-center justify-center">
                      📦
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-primary-600 dark:text-primary-400 font-bold">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="btn btn-xs btn-circle"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          className="btn btn-xs btn-circle"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Item Total & Remove */}
                    <div className="text-right">
                      <p className="font-bold text-xl">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="btn btn-ghost btn-sm text-error mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-white dark:bg-neutral-800 shadow sticky top-24">
              <div className="card-body">
                <h2 className="card-title">Order Summary</h2>

                <div className="divider"></div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold">{total >= 50 ? 'FREE' : '$5.99'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-bold">${(total * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    ${(total + (total >= 50 ? 0 : 5.99) + total * 0.1).toFixed(2)}
                  </span>
                </div>

                {total >= 50 && (
                  <div className="alert alert-success mt-4">
                    <span className="text-sm">🎉 You qualify for free shipping!</span>
                  </div>
                )}

                <button className="btn btn-primary btn-block btn-lg mt-4">
                  Proceed to Checkout
                </button>

                <Link href="/products" className="btn btn-ghost btn-block mt-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
