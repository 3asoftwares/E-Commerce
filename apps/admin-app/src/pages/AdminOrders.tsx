import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Badge, Button, Modal, Spinner } from '@e-commerce/ui-library';
import { Order, OrderStatus } from '@ecommerce/types';

export const AdminOrders: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });
      const response = await fetch(`/api/admin/orders?${params}`);
      return response.json();
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      refetch();
    } catch (error) {
      console.error('Failed to update order status:', error);
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
          <Button
            size="sm"
            variant="outline"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedOrder(order);
              setShowModal(true);
            }}
          >
            View
          </Button>
          {order.status === OrderStatus.PENDING && (
            <Button
              size="sm"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleStatusChange(order.id, OrderStatus.CONFIRMED);
              }}
            >
              Confirm
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
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-3xl font-bold text-primary-600">{data?.total || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{data?.pendingCount || 0}</div>
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
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-3xl font-bold text-green-600">
            ${data?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={orders} />
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          title={`Order #${selectedOrder.orderNumber}`}
        >
          <div className="space-y-6">
            {/* Order Status */}
            <div>
              <label className="block text-sm font-semibold mb-2">Order Status</label>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                <option value={OrderStatus.PROCESSING}>Processing</option>
                <option value={OrderStatus.SHIPPED}>Shipped</option>
                <option value={OrderStatus.OUT_FOR_DELIVERY}>Out for Delivery</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-gray-600">Name:</span> {selectedOrder.customerName}
                </div>
                <div>
                  <span className="text-gray-600">Email:</span> {selectedOrder.customerEmail}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="text-sm">
                <div>{selectedOrder.shippingAddress.fullName}</div>
                <div>{selectedOrder.shippingAddress.addressLine1}</div>
                {selectedOrder.shippingAddress.addressLine2 && (
                  <div>{selectedOrder.shippingAddress.addressLine2}</div>
                )}
                <div>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </div>
                <div>{selectedOrder.shippingAddress.phone}</div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item: any) => (
                  <div key={item.id} className="flex gap-3 border-b pb-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded"
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
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${selectedOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
