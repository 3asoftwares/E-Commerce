import React, { useState } from 'react';
import { useSellerOrders } from '../api/queries';

export const Orders: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSellerOrders(page, 10);

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">Error loading orders</div>;

  const orders = data?.sellerOrders?.orders || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Orders</h1>

      <div className="grid gap-4">
        {orders.map((order: any) => (
          <div key={order.id} className="card bg-white dark:bg-neutral-800 shadow">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="card-title">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`badge ${
                    order.status === 'pending'
                      ? 'badge-warning'
                      : order.status === 'shipped'
                      ? 'badge-info'
                      : order.status === 'delivered'
                      ? 'badge-success'
                      : 'badge-neutral'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="divider"></div>

              <div className="space-y-2">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>Product ID: {item.productId}</span>
                    <span>
                      Qty: {item.quantity} × ${item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divider"></div>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total: ${order.total}</span>
                <div className="space-x-2">
                  <button className="btn btn-sm btn-primary">Process</button>
                  <button className="btn btn-sm btn-ghost">Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
