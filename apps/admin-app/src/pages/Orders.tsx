import React, { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '../api/queries';

export const Orders: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useOrders(page, 10);
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">Error loading orders</div>;

  const orders = data?.orders?.orders || [];

  const handleStatusChange = async (orderId: string, status: string) => {
    await updateStatus.mutateAsync({ orderId, status });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Orders</h1>

      <div className="card bg-white dark:bg-neutral-800 shadow overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td className="font-mono">#{order.id.slice(0, 8)}</td>
                <td>{order.userId}</td>
                <td className="font-bold">${order.total}</td>
                <td>
                  <select
                    className="select select-sm select-bordered"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-ghost">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <div className="btn-group">
          <button
            className="btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            «
          </button>
          <button className="btn">Page {page}</button>
          <button
            className="btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={orders.length < 10}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};
