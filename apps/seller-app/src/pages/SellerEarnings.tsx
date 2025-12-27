import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@e-commerce/ui-library';
import { SellerPayout, SellerStats } from '@ecommerce/types';

export const SellerEarnings: React.FC = () => {
  const { data: statsData, isLoading: statsLoading } = useQuery<{ stats: SellerStats }>({
    queryKey: ['seller-stats'],
    queryFn: async () => {
      const response = await fetch('/api/seller/stats');
      return response.json();
    },
  });

  const { data: payoutsData, isLoading: payoutsLoading } = useQuery<{ payouts: SellerPayout[] }>({
    queryKey: ['seller-payouts'],
    queryFn: async () => {
      const response = await fetch('/api/seller/payouts');
      return response.json();
    },
  });

  if (statsLoading || payoutsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = statsData?.stats;
  const payouts = payoutsData?.payouts || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Earnings & Payouts</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Revenue</div>
          <div className="text-3xl font-bold text-green-600">
            ${stats?.totalRevenue.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">This Month</div>
          <div className="text-3xl font-bold text-primary-600">
            ${(stats?.totalRevenue || 0).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Current month</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</div>
          <div className="text-xs text-gray-500 mt-1">All time</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Avg Order Value</div>
          <div className="text-3xl font-bold text-purple-600">
            ${stats?.averageOrderValue.toFixed(2) || '0.00'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Per order</div>
        </div>
      </div>

      {/* Top Products */}
      {stats?.topProducts && stats.topProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div>
                    <div className="font-semibold">{product.productName}</div>
                    <div className="text-sm text-gray-600">{product.sales} sales</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-green-600">
                    ${product.revenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payout History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Payout History</h2>

        {payouts.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <p>No payouts yet</p>
            <p className="text-sm mt-2">Payouts are processed monthly</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <div className="font-semibold">
                    {new Date(payout.period.start).toLocaleDateString()} -{' '}
                    {new Date(payout.period.end).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{payout.orders.length} orders</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {payout.status === 'completed' && payout.completedAt && (
                      <>Paid on {new Date(payout.completedAt).toLocaleDateString()}</>
                    )}
                    {payout.status === 'pending' && <>Pending payment</>}
                    {payout.status === 'processing' && <>Processing</>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${payout.amount.toFixed(2)}
                  </div>
                  <div className="mt-1">
                    {payout.status === 'completed' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        Paid
                      </span>
                    )}
                    {payout.status === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                        Pending
                      </span>
                    )}
                    {payout.status === 'processing' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        Processing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
