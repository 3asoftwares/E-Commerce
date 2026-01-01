'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useCreateOrder } from '@/lib/hooks';
import { Button, Input } from '@e-commerce/ui-library';
import { useToast } from '@/lib/hooks/useToast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faLock, faShippingFast } from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '@/lib/utils/currency';
import { PageHeader } from '@/components';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, userProfile } = useCartStore();
  const { mutateAsync: createOrder, isPending: loading } = useCreateOrder();
  const { showToast } = useToast();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');

  // Form state for new address
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  // Calculate totals
  const subtotal = items.reduce((sum:number, item:{price:number, quantity:number}) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = deliveryMethod === 'express' ? 25 : subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleSubmitOrder = async () => {
    // Validation
    if (!userProfile) {
      showToast('Please log in to place an order', 'error');
      router.push('/login');
      return;
    }

    const shippingAddressId = useNewAddress ? null : selectedAddressId;
    if (!shippingAddressId && !useNewAddress) {
      showToast('Please select or add a shipping address', 'warning');
      return;
    }

    if (!paymentMethod) {
      showToast('Please select a payment method', 'warning');
      return;
    }

    try {
      const orderData = {
        customerId: userProfile.id,
        customerEmail: userProfile.email,
        items: items.map((item:any) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: useNewAddress
          ? newAddress
          : (userProfile.addresses?.find((a: Address) => a.id === shippingAddressId) || {
              street: '',
              city: '',
              state: '',
              zip: '',
              country: ''
            }),
        paymentMethod,
        notes: orderNotes,
      };

      const order = await createOrder(orderData);
      showToast('Order placed successfully!', 'success');
      
      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      showToast('Error creating order. Please try again.', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center border border-gray-200">
          <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
            <FontAwesomeIcon icon={faShoppingCart} className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Cart is Empty</h1>
          <p className="text-gray-600 mb-8 text-lg">Add items to your cart before checking out.</p>
          <Button onClick={() => router.push('/products')} className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold hover:shadow-2xl">Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={faLock}
        title="Secure Checkout"
        subtitle="SSL Encrypted • Safe & Secure"
        iconGradient="from-gray-700 to-gray-900"
        titleGradient="from-gray-900 to-black"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <FontAwesomeIcon icon={faShippingFast} className="text-indigo-600" />
                Shipping Address
              </h2>

              {userProfile?.addresses && userProfile.addresses.length > 0 && !useNewAddress && (
                <div className="space-y-3 mb-4">
                  {userProfile.addresses.map((address: Address) => (
                    <label
                      key={address.id}
                      className="flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all hover:bg-indigo-50 hover:scale-[1.02]"
                      style={{
                        borderColor: selectedAddressId === address.id ? 'rgb(99, 102, 241)' : '#e5e7eb',
                        backgroundColor: selectedAddressId === address.id ? 'rgb(238, 242, 255)' : 'white',
                      }}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1 w-5 h-5 text-indigo-600"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">
                          {address.street}, {address.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.state}, {address.zip}, {address.country}
                        </p>
                        {address.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <button
                onClick={() => setUseNewAddress(!useNewAddress)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
              >
                {useNewAddress ? '← Use saved address' : '+ Add new address'}
              </button>

              {useNewAddress && (
                <div className="space-y-4 pt-4 border-t">
                  <Input
                    type="text"
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={(e: any) => setNewAddress({ ...newAddress, street: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e: any) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e: any) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="ZIP Code"
                      value={newAddress.zip}
                      onChange={(e: any) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e: any) =>
                        setNewAddress({ ...newAddress, country: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Method</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-blue-300 rounded-lg cursor-pointer bg-blue-50">
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliveryMethod === 'standard'}
                    onChange={(e: any) => setDeliveryMethod(e.target.value)}
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Standard Delivery</p>
                    <p className="text-sm text-gray-600">5-7 business days</p>
                  </div>
                  <span className="ml-auto font-semibold text-gray-900">
                    {subtotal > 100 ? 'FREE' : '₹100'}
                  </span>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={deliveryMethod === 'express'}
                    onChange={(e: any) => setDeliveryMethod(e.target.value)}
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Express Delivery</p>
                    <p className="text-sm text-gray-600">2-3 business days</p>
                  </div>
                  <span className="ml-auto font-semibold text-gray-900">₹250</span>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
                  { value: 'upi', label: 'UPI', icon: '📱' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === method.value
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e: any) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-3 text-xl">{method.icon}</span>
                    <span className="ml-2 font-medium text-gray-900">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
              <textarea
                value={orderNotes}
                onChange={(e: any) => setOrderNotes(e.target.value)}
                placeholder="Add any special instructions for delivery..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Items Summary */}
              <div className="space-y-2 mb-6 pb-6 border-b max-h-48 overflow-y-auto">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-700">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    <span>{formatPrice(shipping)}</span>
                  )}
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-3xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="w-full mb-3"
                size="lg"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>

              <button
                onClick={() => router.push('/cart')}
                className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm py-2"
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
