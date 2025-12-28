import { useState, useEffect } from 'react';
import { Button, Spinner } from '@e-commerce/ui-library';
import { orderApi, handleApiError } from '../api/client';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

export const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getAll(1, 20);
        setOrders(response.data.data.orders || []);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)));
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Order Fulfillment</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-600">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}>
                    Confirm
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}>
                    Ship
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}>
                    Deliver
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
