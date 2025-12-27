/**
 * Analytics Entity Types
 */

export interface DashboardStats {
  period: 'today' | 'week' | 'month' | 'year';
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  products: {
    total: number;
    active: number;
    pending: number;
  };
  topProducts: {
    id: string;
    name: string;
    image: string;
    sales: number;
    revenue: number;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    createdAt: Date;
  }[];
  salesChart: {
    date: string;
    revenue: number;
    orders: number;
  }[];
}

export interface AdminNotification {
  id: string;
  type: 'order' | 'product' | 'seller' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  link?: string;
  createdAt: Date;
}
