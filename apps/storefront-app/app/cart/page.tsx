'use client';

import HeaderWrapper from '@/components/HeaderWrapper';
import FooterWrapper from '@/components/FooterWrapper';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((sum:number, item:{price:number, quantity:number}) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <>
      <HeaderWrapper />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          {items.length > 0 && (
            <p className="text-gray-600 mt-2">{items.length} item(s) in your cart</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-16 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything yet. Start shopping!</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Items */}
                {items.map((item:any, index:number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-4 p-6 border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl">
                        📦
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow min-w-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 block mb-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600 mb-3">SKU: {item.productId}</p>
                      <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Quantity Control */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-700 hover:text-blue-600 font-semibold"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-semibold text-gray-900 min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-700 hover:text-blue-600 font-semibold"
                        >
                          +
                        </button>
                      </div>

                      {/* Total & Remove */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 text-right">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear the cart?')) {
                        clearCart();
                      }
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Pricing Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">FREE ✓</span>
                    ) : (
                      <span className="font-semibold">${shipping.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Free Shipping Note */}
                {shipping > 0 && subtotal < 100 && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                    <p className="font-semibold text-blue-900 mb-1">🎉 Free Shipping Alert!</p>
                    <p className="text-sm text-blue-800">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping.
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-gray-700 text-sm font-medium mb-1">Total Amount</p>
                  <p className="text-4xl font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all mb-3"
                >
                  Proceed to Checkout
                </button>

                {/* Payment Methods Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="font-semibold text-gray-900 text-sm mb-2">We Accept:</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">💳 Card</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">🏦 Bank</span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">📱 UPI</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      <FooterWrapper />
    </>
  );
}
