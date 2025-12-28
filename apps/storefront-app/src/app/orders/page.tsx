'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api/service';
import { Button } from '@repo/ui-library';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
  pending: '⏳',
  confirmed: '✓',
  processing: '⚙️',
  shipped: '📦',
  delivered: '🎉',
  cancelled: '❌',
};

export default function OrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => apiService.getOrders(page, 10),
  });

  const orders = data?.orders || [];
  const totalPages = data?.pages || 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Orders</h2>
            <p className="text-red-700 mb-4">Failed to load your orders. Please try again later.</p>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">{orders.length} order(s) found</p>
            </div>
            <Button onClick={() => router.push('/products')} variant="outline">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to create your first order!</p>
            <Button onClick={() => router.push('/products')}>Browse Products</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: Order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          STATUS_COLORS[order.status]
                        }`}
                      >
                        {STATUS_ICONS[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pb-6 border-b">
                    <div>
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Items ({order.items.length})</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded"
                        >
                          <span className="font-medium">Product #{item.productId}</span>
                          <span className="text-gray-500">× {item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          <span className="font-medium">+{order.items.length - 3} more</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="flex-1"
                      size="sm"
                    >
                      View Details
                    </Button>
                    {order.status === 'shipped' || order.status === 'processing' ? (
                      <Button
                        onClick={() => router.push(`/orders/${order.id}/track`)}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Track Package
                      </Button>
                    ) : null}
                    {order.status === 'delivered' ? (
                      <Button
                        onClick={() => router.push(`/products?reorder=${order.id}`)}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Reorder
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    variant={page === i + 1 ? 'primary' : 'outline'}
                    size="sm"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
