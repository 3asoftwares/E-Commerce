import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from './client';

// Dashboard Stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const query = `
        query {
          dashboardStats {
            totalUsers
            totalOrders
            totalRevenue
            pendingOrders
          }
        }
      `;
      return graphqlRequest(query);
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// Get All Users
export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: async () => {
      const query = `
        query GetUsers($page: Int, $limit: Int) {
          users(page: $page, limit: $limit) {
            users {
              id
              name
              email
              role
              createdAt
            }
            total
            page
            limit
          }
        }
      `;
      return graphqlRequest(query, { page, limit });
    },
  });
};

// Get All Products
export const useProducts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: async () => {
      const query = `
        query GetProducts($page: Int, $limit: Int) {
          products(page: $page, limit: $limit) {
            products {
              id
              name
              price
              stock
              category
              sellerId
            }
            total
            page
            limit
          }
        }
      `;
      return graphqlRequest(query, { page, limit });
    },
  });
};

// Get All Orders
export const useOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: async () => {
      const query = `
        query GetOrders($page: Int, $limit: Int) {
          orders(page: $page, limit: $limit) {
            orders {
              id
              userId
              items {
                productId
                quantity
                price
              }
              total
              status
              createdAt
            }
            total
            page
            limit
          }
        }
      `;
      return graphqlRequest(query, { page, limit });
    },
  });
};

// Update Order Status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const query = `
        mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
          updateOrderStatus(orderId: $orderId, status: $status) {
            id
            status
          }
        }
      `;
      return graphqlRequest(query, { orderId, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

// Delete User
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const query = `
        mutation DeleteUser($userId: ID!) {
          deleteUser(userId: $userId)
        }
      `;
      return graphqlRequest(query, { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};
