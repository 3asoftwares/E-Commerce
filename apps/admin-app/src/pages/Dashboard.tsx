import { useDashboardStats } from '../api/queries';

export const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">Error loading dashboard</div>;

  const stats = data?.dashboardStats || {};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {stats.totalUsers || 0}
            </p>
            <p className="text-sm text-neutral-500">↗︎ 12% increase</p>
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
            <p className="text-sm text-neutral-500">↗︎ 8% increase</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Revenue</h3>
            <p className="text-3xl font-bold text-accent-600 dark:text-accent-400">
              ${stats.totalRevenue || 0}
            </p>
            <p className="text-sm text-neutral-500">↗︎ 15% increase</p>
          </div>
        </div>

        <div className="card bg-white dark:bg-neutral-800 shadow">
          <div className="card-body">
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Pending Orders
            </h3>
            <p className="text-3xl font-bold text-warning dark:text-warning">
              {stats.pendingOrders || 0}
            </p>
            <p className="text-sm text-neutral-500">Requires attention</p>
          </div>
        </div>
      </div>

      <div className="card bg-white dark:bg-neutral-800 shadow">
        <div className="card-body">
          <h3 className="card-title dark:text-white">Recent Activity</h3>
          <div className="divider"></div>
          <p className="text-neutral-500 dark:text-neutral-400">Loading recent activity...</p>
        </div>
      </div>
    </div>
  );
};
