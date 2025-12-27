import React from 'react';
import { useSellerStats } from '../api/queries';

export const Earnings: React.FC = () => {
  const { data, isLoading } = useSellerStats();

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;

  const stats = data?.sellerStats || {};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-success">${stats.totalRevenue || 0}</p>
            <p className="text-sm text-neutral-500">All time</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              This Month
            </h3>
            <p className="text-3xl font-bold text-primary-600">$12,450</p>
            <p className="text-sm text-success">↗︎ 24% increase</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Pending Payout
            </h3>
            <p className="text-3xl font-bold text-warning">$3,250</p>
            <p className="text-sm text-neutral-500">Available on 1st</p>
          </div>
        </div>
      </div>

      <div className="card bg-white dark:bg-neutral-800 shadow">
        <div className="card-body">
          <h3 className="card-title dark:text-white">Revenue Chart</h3>
          <div className="h-64 flex items-center justify-center text-neutral-400">
            Chart placeholder - Integrate charting library
          </div>
        </div>
      </div>
    </div>
  );
};
