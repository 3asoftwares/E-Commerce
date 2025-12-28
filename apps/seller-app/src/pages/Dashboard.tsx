import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@e-commerce/ui-library';
import { useSellerAuthStore } from '../store/authStore';
import { authApi, orderApi, handleApiError } from '../api/client';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSellerAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [, ordersRes] = await Promise.all([
          authApi.getStats(),
          orderApi.getAll(1, 100),
        ]);

        const orders = ordersRes.data.data.orders || [];
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const pendingOrders = orders.filter((o: any) => o.orderStatus === 'pending' || o.orderStatus === 'PENDING').length;
        const completedOrders = orders.filter((o: any) => o.orderStatus === 'delivered' || o.orderStatus === 'DELIVERED').length;

        setStats({
          totalRevenue,
          totalOrders: ordersRes.data.data.pagination?.total || 0,
          pendingOrders,
          completedOrders,
        });
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [])

  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Here's what's happening with your business today.</p>
          </div>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      ) : stats ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingOrders}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completed Orders</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedOrders}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate('/products/new')}
                className="w-full justify-center"
              >
                ➕ Add New Product
              </Button>
              <Button
                onClick={() => navigate('/orders')}
                variant="secondary"
                className="w-full justify-center"
              >
                📋 View Orders
              </Button>
              <Button
                onClick={() => navigate('/earnings')}
                variant="secondary"
                className="w-full justify-center"
              >
                💵 View Earnings
              </Button>
            </div>
          </div>
        </>
      ) : null}
      </div>
    </div>
  );
};
