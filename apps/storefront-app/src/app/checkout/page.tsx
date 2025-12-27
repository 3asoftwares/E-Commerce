'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button, Badge, Spinner } from '@e-commerce/ui-library';
import { Address, CartItem, ShippingMethod, PaymentMethod } from '@e-commerce/types';

export default function CheckoutPage() {
  const [step, setStep] = useState<'address' | 'shipping' | 'payment' | 'review'>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(ShippingMethod.STANDARD);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [customerNotes, setCustomerNotes] = useState('');

  // Fetch cart
  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart');
      return response.json();
    },
  });

  // Fetch user addresses
  const { data: addressesData } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await fetch('/api/user/addresses');
      return response.json();
    },
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to order confirmation
      window.location.href = `/orders/${data.orderId}`;
    },
  });

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    const orderData = {
      items: cartData.cart.items.map((item: CartItem) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      shippingAddressId: selectedAddressId,
      billingAddressId: selectedAddressId,
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      customerNotes,
    };

    placeOrderMutation.mutate(orderData);
  };

  const shippingOptions = [
    { value: ShippingMethod.STANDARD, label: 'Standard Shipping', time: '5-7 days', price: 5.99 },
    { value: ShippingMethod.EXPRESS, label: 'Express Shipping', time: '2-3 days', price: 12.99 },
    { value: ShippingMethod.NEXT_DAY, label: 'Next Day Delivery', time: '1 day', price: 19.99 },
  ];

  const paymentOptions = [
    { value: PaymentMethod.CREDIT_CARD, label: 'Credit/Debit Card', icon: '💳' },
    { value: PaymentMethod.PAYPAL, label: 'PayPal', icon: 'P' },
    { value: PaymentMethod.CASH_ON_DELIVERY, label: 'Cash on Delivery', icon: '💵' },
    { value: PaymentMethod.UPI, label: 'UPI', icon: '📱' },
  ];

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const cart = cartData?.cart;
  const addresses = addressesData?.addresses || [];
  const shippingCost = shippingOptions.find((opt) => opt.value === selectedShipping)?.price || 0;
  const total = cart ? cart.subtotal + cart.tax + shippingCost - cart.discount : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Indicator */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                {['address', 'shipping', 'payment', 'review'].map((s, index) => (
                  <React.Fragment key={s}>
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          step === s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="ml-2 hidden sm:inline capitalize">{s}</span>
                    </div>
                    {index < 3 && <div className="flex-1 h-1 bg-gray-200 mx-4" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Address Selection */}
            {step === 'address' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  {addresses.map((address: Address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer ${
                        selectedAddressId === address.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mr-3"
                      />
                      <div className="inline-block">
                        <div className="font-semibold">{address.fullName}</div>
                        <div className="text-sm text-gray-600">
                          {address.addressLine1},{' '}
                          {address.addressLine2 && `${address.addressLine2}, `}
                          {address.city}, {address.state} {address.postalCode}
                        </div>
                        <div className="text-sm text-gray-600">Phone: {address.phone}</div>
                        {address.isDefault && (
                          <Badge variant="primary" size="sm" className="mt-2">
                            Default
                          </Badge>
                        )}
                      </div>
                    </label>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-primary-600 hover:bg-gray-50">
                    + Add New Address
                  </button>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => setStep('shipping')}
                    disabled={!selectedAddressId}
                    className="w-full"
                  >
                    Continue to Shipping
                  </Button>
                </div>
              </div>
            )}

            {/* Shipping Method */}
            {step === 'shipping' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
                <div className="space-y-4">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`block p-4 border-2 rounded-lg cursor-pointer ${
                        selectedShipping === option.value
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={option.value}
                        checked={selectedShipping === option.value}
                        onChange={() => setSelectedShipping(option.value)}
                        className="mr-3"
                      />
                      <div className="inline-block flex-1">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.time}</div>
                      </div>
                      <div className="inline-block float-right font-semibold">
                        ${option.price.toFixed(2)}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={() => setStep('address')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep('payment')} className="flex-1">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Method */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-4">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`block p-4 border-2 rounded-lg cursor-pointer ${
                        selectedPayment === option.value
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={selectedPayment === option.value}
                        onChange={() => setSelectedPayment(option.value)}
                        className="mr-3"
                      />
                      <span className="text-2xl mr-3">{option.icon}</span>
                      <span className="font-semibold">{option.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={() => setStep('shipping')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep('review')} className="flex-1">
                    Continue to Review
                  </Button>
                </div>
              </div>
            )}

            {/* Order Review */}
            {step === 'review' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Review Order</h2>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Items ({cart.items.length})</h3>
                  <div className="space-y-3">
                    {cart.items.map((item: CartItem) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{item.productName}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                          <div className="font-semibold">${item.total.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">Order Notes (Optional)</label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Any special instructions..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                </div>

                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={() => setStep('payment')} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={placeOrderMutation.isPending}
                    className="flex-1"
                  >
                    {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${cart?.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${cart?.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                </div>
                {cart?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${cart.discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Free Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
