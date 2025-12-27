'use client';


import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Badge, Spinner } from '@e-commerce/ui-library';
import { Order, OrderStatus, TrackingEvent } from '@e-commerce/types';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;

  // Fetch order details
  const { data: orderData, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      return response.json();
    },
  });

  // Fetch tracking details
  const { data: trackingData } = useQuery({
    queryKey: ['tracking', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}/tracking`);
      return response.json();
    },
    enabled: !!orderData?.order.trackingNumber,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const order: Order = orderData?.order;
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <a href="/orders" className="text-primary-600 hover:text-primary-700">
            View all orders
          </a>
        </div>
      </div>
    );
  }

  const trackingEvents: TrackingEvent[] = trackingData?.tracking?.events || [];

  const orderSteps = [
    { status: OrderStatus.CONFIRMED, label: 'Order Confirmed', icon: '✓' },
    { status: OrderStatus.PROCESSING, label: 'Processing', icon: '⚙' },
    { status: OrderStatus.SHIPPED, label: 'Shipped', icon: '📦' },
    { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: '🚚' },
    { status: OrderStatus.DELIVERED, label: 'Delivered', icon: '🏠' },
  ];

  const currentStepIndex = orderSteps.findIndex((step) => step.status === order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={order.status === OrderStatus.DELIVERED ? 'success' : 'primary'}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div className="bg-gray-50 rounded p-4">
              <div className="text-sm text-gray-600">Tracking Number</div>
              <div className="text-lg font-semibold text-gray-900 mt-1">{order.trackingNumber}</div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
                >
                  Track on carrier website →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-6">Order Progress</h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200" />
            <div
              className="absolute left-6 top-0 w-1 bg-primary-600 transition-all duration-500"
              style={{
                height: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%`,
              }}
            />

            {/* Steps */}
            <div className="relative space-y-8">
              {orderSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.status} className="flex items-start">
                    <div
                      className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                        isCompleted
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className="text-2xl">{step.icon}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div
                        className={`font-semibold ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      {isCurrent && order.estimatedDelivery && (
                        <div className="text-sm text-gray-600 mt-1">
                          Estimated delivery:{' '}
                          {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </div>
                      )}
                      {step.status === OrderStatus.DELIVERED && order.deliveredAt && (
                        <div className="text-sm text-green-600 mt-1">
                          Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tracking History */}
        {trackingEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Tracking History</h2>
            <div className="space-y-4">
              {trackingEvents.map((event, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="text-sm text-gray-600 min-w-[120px]">
                    {new Date(event.timestamp).toLocaleDateString()}
                    <br />
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{event.status}</div>
                    <div className="text-sm text-gray-600">{event.description}</div>
                    {event.location && (
                      <div className="text-sm text-gray-500 mt-1">📍 {event.location}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          <div className="text-gray-700">
            <div className="font-semibold">{order.shippingAddress.fullName}</div>
            <div className="text-sm mt-1">
              {order.shippingAddress.addressLine1}
              <br />
              {order.shippingAddress.addressLine2 && (
                <>
                  {order.shippingAddress.addressLine2}
                  <br />
                </>
              )}
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </div>
            <div className="text-sm mt-2">📞 {order.shippingAddress.phone}</div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{item.productName}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  <div className="text-sm text-gray-600">Seller: {item.sellerName}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${item.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-6 border-t space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <a
            href="/orders"
            className="flex-1 py-3 text-center border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back to Orders
          </a>
          {order.status === OrderStatus.DELIVERED && (
            <a
              href={`/orders/${orderId}/review`}
              className="flex-1 py-3 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Write Review
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
