/**
 * Dashboard GraphQL Queries
 * Analytics and dashboard-related queries
 */

// Query: Get Dashboard Stats
export const DASHBOARD_STATS_QUERY = `
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      totalOrders
      totalRevenue
      pendingOrders
    }
  }
`;

// Query: Get Sales Analytics
export const SALES_ANALYTICS_QUERY = `
  query GetSalesAnalytics($period: String!) {
    salesAnalytics(period: $period) {
      daily {
        date
        sales
        orders
        revenue
      }
      weekly {
        date
        sales
        orders
        revenue
      }
      monthly {
        date
        sales
        orders
        revenue
      }
    }
  }
`;
