import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Badge, Button, Spinner } from '@e-commerce/ui-library';
import { Order, OrderStatus } from '@e-commerce/types';

export const SellerOrders: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['seller-orders', statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      const response = await fetch(`/api/seller/orders?${params}`);
      return response.json();
    },
  });

  const handleConfirmShipment = async (orderId: string) => {
    try {
      await fetch(`/api/seller/orders/${orderId}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: prompt('Enter tracking number:') }),
      });
      refetch();
    } catch (error) {
      console.error('Failed to confirm shipment:', error);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await fetch(`/api/seller/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const statusColors: Record<OrderStatus, any> = {
    [OrderStatus.PENDING]: 'warning',
    [OrderStatus.CONFIRMED]: 'info',
    [OrderStatus.PROCESSING]: 'info',
    [OrderStatus.SHIPPED]: 'primary',
    [OrderStatus.OUT_FOR_DELIVERY]: 'primary',
    [OrderStatus.DELIVERED]: 'success',
    [OrderStatus.CANCELLED]: 'error',
    [OrderStatus.RETURNED]: 'warning',
    [OrderStatus.REFUNDED]: 'secondary',
  };

  const columns = [
    { key: 'orderNumber', label: 'Order #' },
    { key: 'customerName', label: 'Customer' },
    { key: 'items', label: 'Items', render: (order: Order) => order.items.length },
    { key: 'total', label: 'Total', render: (order: Order) => `$${order.total.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (order: Order) => <Badge variant={statusColors[order.status]}>{order.status}</Badge>,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (order: Order) => new Date(order.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: Order) => (
        <div className="flex gap-2">
          {order.status === OrderStatus.CONFIRMED && (
            <Button size="sm" onClick={() => handleUpdateStatus(order.id, OrderStatus.PROCESSING)}>
              Start Processing
            </Button>
          )}
          {order.status === OrderStatus.PROCESSING && (
            <Button size="sm" onClick={() => handleConfirmShipment(order.id)}>
              Ship Order
            </Button>
          )}
          {order.status === OrderStatus.SHIPPED && (
            <Button
              size="sm"
              onClick={() => handleUpdateStatus(order.id, OrderStatus.OUT_FOR_DELIVERY)}
            >
              Out for Delivery
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Orders</option>
          <option value="confirmed">New Orders</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">New Orders</div>
          <div className="text-3xl font-bold text-yellow-600">{data?.newCount || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Processing</div>
          <div className="text-3xl font-bold text-blue-600">{data?.processingCount || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Shipped</div>
          <div className="text-3xl font-bold text-purple-600">{data?.shippedCount || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-3xl font-bold text-green-600">{data?.completedCount || 0}</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <Table columns={columns} data={orders} />
        )}
      </div>
    </div>
  );
};
