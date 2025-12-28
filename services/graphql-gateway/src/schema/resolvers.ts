/**
 * GraphQL Resolvers
 */

import { authClient, productClient, orderClient, addAuthHeader } from '../clients/serviceClients';

export const resolvers = {
  Query: {
    // Analytics Queries
    dashboardStats: async (_: any, __: any, context: any) => {
      try {
        // Fetch data from multiple services
        const [ordersRes, authRes] = await Promise.all([
          orderClient.get('/api/orders', { params: { page: 1, limit: 1 } }),
          authClient.get('/api/auth/stats', addAuthHeader(context.token)).catch(() => ({ data: { data: { totalUsers: 0 } } }))
        ]);

        const ordersData = ordersRes.data.data;
        const orders = ordersData.orders || [];
        
        // Calculate stats
        const totalOrders = ordersData.pagination?.total || 0;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
        const pendingOrders = orders.filter((order: any) => order.orderStatus === 'PENDING').length;
        const totalUsers = authRes.data.data?.totalUsers || 0;

        return {
          totalUsers,
          totalOrders,
          totalRevenue,
          pendingOrders
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0
        };
      }
    },

    // Product Queries
    products: async (_: any, args: any) => {
      const { page, limit, search, category, minPrice, maxPrice } = args;
      const response = await productClient.get('/api/products', {
        params: { page, limit, search, category, minPrice, maxPrice },
      });
      return response.data.data;
    },

    product: async (_: any, { id }: any) => {
      const response = await productClient.get(`/api/products/${id}`);
      return response.data.data.product;
    },

    productsBySeller: async (_: any, { sellerId }: any) => {
      const response = await productClient.get(`/api/products/seller/${sellerId}`);
      return response.data.data.products;
    },

    categories: async () => {
      const response = await productClient.get('/api/products/categories');
      return response.data.data.categories;
    },

    // Order Queries
    orders: async (_: any, args: any) => {
      const { page, limit } = args;
      const response = await orderClient.get('/api/orders', {
        params: { page, limit },
      });
      return response.data.data;
    },

    order: async (_: any, { id }: any) => {
      const response = await orderClient.get(`/api/orders/${id}`);
      return response.data.data.order;
    },

    ordersByCustomer: async (_: any, { customerId }: any) => {
      const response = await orderClient.get(`/api/orders/customer/${customerId}`);
      return response.data.data.orders;
    },

    // Auth Query
    me: async (_: any, __: any, context: any) => {
      if (!context.token) {
        throw new Error('Not authenticated');
      }
      const response = await authClient.get('/api/auth/me', addAuthHeader(context.token));
      return response.data.data.user;
    },

    // User Queries
    users: async (_: any, args: any, context: any) => {
      if (!context.token) {
        throw new Error('Not authenticated');
      }
      const { page, limit, search } = args;
      const response = await authClient.get('/api/users', {
        params: { page, limit, search },
        ...addAuthHeader(context.token)
      });
      return response.data.data;
    },
  },

  Mutation: {
    // Auth Mutations
    login: async (_: any, { input }: any) => {
      const response = await authClient.post('/api/auth/login', input);
      return response.data.data;
    },

    register: async (_: any, { input }: any) => {
      const response = await authClient.post('/api/auth/register', input);
      return response.data.data;
    },

    logout: async (_: any, __: any, context: any) => {
      if (!context.token) {
        throw new Error('Not authenticated');
      }
      await authClient.post('/api/auth/logout', {}, addAuthHeader(context.token));
      return true;
    },

    // Product Mutations
    createProduct: async (_: any, { input }: any) => {
      const response = await productClient.post('/api/products', input);
      return response.data.data.product;
    },

    updateProduct: async (_: any, { id, input }: any) => {
      const response = await productClient.put(`/api/products/${id}`, input);
      return response.data.data.product;
    },

    deleteProduct: async (_: any, { id }: any) => {
      await productClient.delete(`/api/products/${id}`);
      return true;
    },

    // Order Mutations
    createOrder: async (_: any, { input }: any) => {
      const response = await orderClient.post('/api/orders', input);
      return response.data.data.order;
    },

    updateOrderStatus: async (_: any, { id, status }: any) => {
      const response = await orderClient.patch(`/api/orders/${id}/status`, {
        orderStatus: status,
      });
      return response.data.data.order;
    },

    updatePaymentStatus: async (_: any, { id, status }: any) => {
      const response = await orderClient.patch(`/api/orders/${id}/payment`, {
        paymentStatus: status,
      });
      return response.data.data.order;
    },

    cancelOrder: async (_: any, { id }: any) => {
      const response = await orderClient.post(`/api/orders/${id}/cancel`);
      return response.data.data.order;
    },

    // User Mutations
    updateUserRole: async (_: any, { id, role }: any, context: any) => {
      if (!context.token) {
        throw new Error('Not authenticated');
      }
      const response = await authClient.patch(
        `/api/users/${id}/role`, 
        { role },
        addAuthHeader(context.token)
      );
      return response.data.data.user;
    },

    deleteUser: async (_: any, { id }: any, context: any) => {
      if (!context.token) {
        throw new Error('Not authenticated');
      }
      await authClient.delete(`/api/users/${id}`, addAuthHeader(context.token));
      return true;
    },
  },
};
