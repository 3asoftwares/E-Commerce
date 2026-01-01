'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import Link from 'next/link';
import { useToast } from '@/lib/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBox } from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '@/lib/utils/currency';

export const dynamic = 'force-dynamic';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { showToast } = useToast();

  const subtotal = items.reduce((sum:number, item:{price:number, quantity:number}) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/40 to-purple-50/40">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Shopping Cart</h1>
          {items.length > 0 && (
            <p className="text-gray-700 mt-3 text-lg font-medium flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{items.length}</span>
              {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-20 text-center border border-gray-200">
            <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
              <FontAwesomeIcon icon={faShoppingCart} className="w-20 h-20 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-10 text-lg max-w-md mx-auto">Looks like you haven’t added anything yet. Discover amazing products now!</p>
            <Link
              href="/products"
              className="inline-block px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 hover:-translate-y-1"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {/* Items */}
                {items.map((item:any, index:number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-4 p-6 border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={faBox} className="w-10 h-10 text-gray-400" />
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
                      <p className="text-lg font-bold text-blue-600">{formatPrice(item.price)}</p>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col items-end justify-between">
                      {/* Quantity Control */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => {
                            updateQuantity(item.id, Math.max(1, item.quantity - 1));
                            if (item.quantity > 1) {
                              showToast('Quantity updated', 'info');
                            }
                          }}
                          className="px-2 py-1 text-gray-700 hover:text-blue-600 font-semibold"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-semibold text-gray-900 min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            updateQuantity(item.id, item.quantity + 1);
                            showToast('Quantity updated', 'info');
                          }}
                          className="px-2 py-1 text-gray-700 hover:text-blue-600 font-semibold"
                        >
                          +
                        </button>
                      </div>

                      {/* Total & Remove */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            showToast('Item removed from cart', 'success');
                          }}
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
                        showToast('Cart cleared', 'success');
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
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Tax (8%)</span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">FREE ✓</span>
                    ) : (
                      <span className="font-semibold">{formatPrice(shipping)}</span>
                    )}
                  </div>
                </div>

                {/* Free Shipping Note */}
                {shipping > 0 && subtotal < 100 && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                    <p className="font-semibold text-blue-900 mb-1">🎉 Free Shipping Alert!</p>
                    <p className="text-sm text-blue-800">
                      Add {formatPrice(100 - subtotal)} more for free shipping.
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-gray-700 text-sm font-medium mb-1">Total Amount</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {formatPrice(total)}
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
    </>)
}
