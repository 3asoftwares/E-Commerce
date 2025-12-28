'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api/service';
import { Button } from '@e-commerce/ui-library';

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  estimatedDelivery?: string;
}

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📋' },
  { key: 'confirmed', label: 'Confirmed', icon: '✓' },
  { key: 'processing', label: 'Processing', icon: '⚙️' },
  { key: 'shipped', label: 'Shipped', icon: '📦' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = params;
  const router = useRouter();

  const { data: order, isLoading, error } = useQuery<OrderDetail>({
    queryKey: ['order', id],
    queryFn: () => apiService.getOrderById(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find this order.</p>
          <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((step) => step.key === order.status);
  const isCompleted = (stepIndex: number) => stepIndex <= currentStepIndex;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/orders')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-2"
          >
            ← Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>

              <div className="relative">
                {/* Timeline */}
                <div className="flex items-center">
                  {STATUS_STEPS.map((step, idx) => (
                    <div key={step.key} className="flex-1">
                      {/* Step Circle */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition ${
                            isCompleted(idx)
                              ? 'bg-green-500 text-white'
                              : idx === currentStepIndex
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-900 mt-2 text-center">
                          {step.label}
                        </p>
                      </div>

                      {/* Connector Line */}
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute top-6 left-1/2 right-0 h-0.5 ${
                            isCompleted(idx + 1) ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          style={{ width: 'calc(100% - 24px)' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Delivery */}
              {order.estimatedDelivery && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Estimated Delivery: </span>
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h2>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl">
                      📦
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-600">SKU: {item.productId}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${item.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Address</h2>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{order.shippingAddress.street}</p>
                <p className="text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zip}
                </p>
                <p className="text-gray-700">{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              {/* Order Information */}
              <div className="space-y-3 text-sm text-gray-600 pt-6 border-t">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Order Number</p>
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <p className="font-medium text-gray-900 capitalize">{order.status}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <Button onClick={() => router.push('/products')} className="w-full">
                  Continue Shopping
                </Button>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition">
                  Print Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
