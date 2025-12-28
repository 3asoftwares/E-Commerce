/**
 * Analytics Types
 * Consolidated analytics and dashboard types
 */

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders?: any[];
  topProducts?: any[];
}

// Sales Analytics
export interface SalesAnalytics {
  daily: SalesData[];
  weekly: SalesData[];
  monthly: SalesData[];
  yearly: SalesData[];
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}
