import { useState, useEffect } from 'react';
import { Spinner } from '@e-commerce/ui-library';
import { orderApi, handleApiError } from '../api/client';

interface Earning {
  period: string;
  revenue: number;
  orders: number;
  commission: number;
  payout: number;
}

export const SellerEarnings: React.FC = () => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getAll(1, 100);
        const orders = response.data.data.orders || [];

        // Calculate earnings from orders
        const totalRev = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        setTotalRevenue(totalRev);

        // Group by month
        const earningsByMonth: { [key: string]: Earning } = {};
        orders.forEach((order: any) => {
          const date = new Date(order.createdAt);
          const period = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

          if (!earningsByMonth[period]) {
            earningsByMonth[period] = {
              period,
              revenue: 0,
              orders: 0,
              commission: 0,
              payout: 0,
            };
          }

          earningsByMonth[period].revenue += order.total || 0;
          earningsByMonth[period].orders += 1;
          earningsByMonth[period].commission = earningsByMonth[period].revenue * 0.1; // 10% commission
          earningsByMonth[period].payout = earningsByMonth[period].revenue - earningsByMonth[period].commission;
        });

        setEarnings(Object.values(earningsByMonth).reverse());
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Sales & Earnings</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(2)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{earnings.reduce((sum, e) => sum + e.orders, 0)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Commission (10%)</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                ${(totalRevenue * 0.1).toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-medium">Payout</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${(totalRevenue * 0.9).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Earnings Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earnings.map((earning, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{earning.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${earning.revenue.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{earning.orders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">${earning.commission.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${earning.payout.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
