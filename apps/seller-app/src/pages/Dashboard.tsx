import React from 'react';
import { useSellerStats } from '../api/queries';

export const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useSellerStats();

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">Error loading dashboard</div>;

  const stats = data?.sellerStats || {};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Seller Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {stats.totalProducts || 0}
            </p>
          </div>
        </div>

        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
              {stats.totalOrders || 0}
            </p>
          </div>
        </div>

        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-accent-600 dark:text-accent-400">
              ${stats.totalRevenue || 0}
            </p>
          </div>
        </div>

        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Low Stock Items
            </h3>
            <p className="text-3xl font-bold text-warning">{stats.lowStockProducts || 0}</p>
          </div>
        </div>
      </div>

      <div className="card bg-white dark:bg-neutral-800 shadow">
        <div className="card-body">
          <h3 className="card-title dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <button className="btn btn-primary">Upload New Product</button>
            <button className="btn btn-secondary">Manage Inventory</button>
            <button className="btn btn-accent">View Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};
