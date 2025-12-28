import React, { useState } from 'react';
import {
  useOrders,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
  useCancelOrder,
  useOrder,
} from '../api/queries';
import { Button, Modal, Badge, Table, Spinner, Pagination, Select } from '@e-commerce/ui-library';
import type { OrderGraphQL as Order, OrderStatus, PaymentStatus } from '@e-commerce/types';

export const Orders: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data, isLoading } = useOrders(page, 10);
  const { data: orderDetail } = useOrder(selectedOrder || '');
  const updateOrderStatus = useUpdateOrderStatus();
  const updatePaymentStatus = useUpdatePaymentStatus();
  const cancelOrder = useCancelOrder();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusChange = async (id: string, status: PaymentStatus) => {
    try {
      await updatePaymentStatus.mutateAsync({ id, status });
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder.mutateAsync(id);
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(orderId);
    setIsDetailModalOpen(true);
  };

  const orders = data?.orders.orders || [];
  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order: Order) => order.orderStatus.toLowerCase() === statusFilter);

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order #',
      render: (order: Order) => (
        <span className="font-mono">#{order.orderNumber || order.id.substring(0, 8)}</span>
      ),
    },
    {
      key: 'customerEmail',
      header: 'Customer',
      render: (order: Order) => order.customerEmail,
    },
    {
      key: 'total',
      header: 'Total',
      render: (order: Order) => <span className="font-semibold">${order.total.toFixed(2)}</span>,
    },
    {
      key: 'orderStatus',
      header: 'Order Status',
      render: (order: Order) => (
        <select
          value={order.orderStatus}
          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (order: Order) => (
        <Badge
          variant={
            order.paymentStatus === 'PAID'
              ? 'success'
              : order.paymentStatus === 'FAILED'
              ? 'error'
              : order.paymentStatus === 'REFUNDED'
              ? 'warning'
              : 'info'
          }
        >
          {order.paymentStatus}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (order: Order) => new Date(order.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order: Order) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleViewDetails(order.id)}>
            View
          </Button>
          {order.orderStatus !== 'CANCELLED' && (
            <Button size="sm" variant="outline" onClick={() => handleCancelOrder(order.id)}>
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All Orders' },
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          className="w-48"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Table data={filteredOrders} columns={columns} />
      </div>

      {/* Pagination */}
      {data?.orders.pagination && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={data.orders.pagination.pages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Order Details Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
        <div className="p-6">
          {orderDetail && orderDetail.order ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Order #{orderDetail.order.orderNumber || orderDetail.order.id.substring(0, 8)}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(orderDetail.order.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge
                  variant={
                    orderDetail.order.orderStatus === 'DELIVERED'
                      ? 'success'
                      : orderDetail.order.orderStatus === 'CANCELLED'
                      ? 'error'
                      : 'info'
                  }
                >
                  {orderDetail.order.orderStatus}
                </Badge>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Customer Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Email: {orderDetail.order.customerEmail}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  Shipping Address:
                  <br />
                  {orderDetail.order.shippingAddress.street}
                  <br />
                  {orderDetail.order.shippingAddress.city}, {orderDetail.order.shippingAddress.state}{' '}
                  {orderDetail.order.shippingAddress.zip}
                  <br />
                  {orderDetail.order.shippingAddress.country}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
                <div className="space-y-2">
                  {orderDetail.order.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal:</span>
                    <span>${orderDetail.order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Tax:</span>
                    <span>${orderDetail.order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Shipping:</span>
                    <span>${orderDetail.order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Total:</span>
                    <span>${orderDetail.order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Method: {orderDetail.order.paymentMethod}
                </p>
                <div className="flex gap-2 mt-3">
                  <select
                    value={orderDetail.order.paymentStatus}
                    onChange={(e) =>
                      handlePaymentStatusChange(orderDetail.order.id, e.target.value as PaymentStatus)
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-8">
              <Spinner />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
