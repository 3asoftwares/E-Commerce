'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@repo/ui-library';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((sum:number, item:{price:number, quantity:number}) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {items.length > 0 && (
            <p className="text-gray-600 mt-1">{items.length} item(s) in cart</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <Button onClick={() => router.push('/products')}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-700">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                {/* Items */}
                {items.map((item:any, index:number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition"
                  >
                    {/* Product Info */}
                    <div className="col-span-5 flex gap-4">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded bg-gray-200"
                      />
                      <div className="flex flex-col justify-center">
                        <a
                          href={`/products/${item.productId}`}
                          className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                        >
                          {item.name}
                        </a>
                        <p className="text-sm text-gray-600 mt-1">
                          Seller: {item.sellerId}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="col-span-2 flex items-center justify-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e:any) =>
                          updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                        }
                        min="1"
                        className="w-12 text-center border border-gray-300 rounded py-1"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 flex items-center justify-end text-gray-900 font-medium">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Total */}
                    <div className="col-span-3 flex items-center justify-between">
                      <span className="text-gray-900 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <div className="p-4 text-right border-t">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear the cart?')) {
                        clearCart();
                      }
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Continue Shopping */}
              <button
                onClick={() => router.push('/products')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                ← Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      <span>${shipping.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Free Shipping Note */}
                {shipping > 0 && subtotal < 100 && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">Free Shipping Available!</p>
                    <p>
                      Add ${(100 - subtotal).toFixed(2)} more to get free shipping.
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-gray-700 font-semibold">Total</span>
                  <span className="text-3xl font-bold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={() => router.push('/checkout')}
                  className="w-full mb-3"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                {/* Payment Methods Info */}
                <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
                  <p className="font-semibold text-gray-700 mb-2">We Accept:</p>
                  <div className="flex gap-2">
                    <span className="bg-white px-2 py-1 rounded border">💳 Card</span>
                    <span className="bg-white px-2 py-1 rounded border">🏦 Bank</span>
                    <span className="bg-white px-2 py-1 rounded border">📱 UPI</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t text-xs text-gray-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✓</span>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✓</span>
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">✓</span>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
