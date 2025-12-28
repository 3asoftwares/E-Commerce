import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from './client';
import {
  // Types
  CreateProductInput,
  UpdateProductInput,
  PaymentStatus,
  OrderStatus,
  DASHBOARD_STATS_QUERY,
  GET_USERS_QUERY,
  GET_PRODUCTS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_ORDERS_QUERY,
  GET_ORDER_QUERY,
  // Mutations
  UPDATE_USER_ROLE_MUTATION,
  DELETE_USER_MUTATION,
  CREATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
  UPDATE_ORDER_STATUS_MUTATION,
  UPDATE_PAYMENT_STATUS_MUTATION,
  CANCEL_ORDER_MUTATION,
} from '@e-commerce/types';

// Dashboard Stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      return graphqlRequest(DASHBOARD_STATS_QUERY);
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};

// Get All Users
export const useUsers = (page: number = 1, limit: number = 10, search?: string) => {
  return useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: async () => {
      return graphqlRequest(GET_USERS_QUERY, { page, limit, search });
    },
  });
};

// Get All Products
export const useProducts = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  category?: string
) => {
  return useQuery({
    queryKey: ['products', page, limit, search, category],
    queryFn: async () => {
      return graphqlRequest(GET_PRODUCTS_QUERY, { page, limit, search, category });
    },
  });
};

// Get All Orders
export const useOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['orders', page, limit],
    queryFn: async () => {
      return graphqlRequest(GET_ORDERS_QUERY, { page, limit });
    },
  });
};

// Update Order Status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      return graphqlRequest(UPDATE_ORDER_STATUS_MUTATION, { id, status });
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
    mutationFn: async (id: string) => {
      return graphqlRequest(DELETE_USER_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

// Update User Role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      return graphqlRequest(UPDATE_USER_ROLE_MUTATION, { id, role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Product Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      return graphqlRequest(CREATE_PRODUCT_MUTATION, { input });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateProductInput }) => {
      return graphqlRequest(UPDATE_PRODUCT_MUTATION, { id, input });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return graphqlRequest(DELETE_PRODUCT_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Get Product Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return graphqlRequest(GET_CATEGORIES_QUERY);
    },
  });
};

// Order Status Update
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      return graphqlRequest(UPDATE_PAYMENT_STATUS_MUTATION, { id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return graphqlRequest(CANCEL_ORDER_MUTATION, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });
};

// Get Single Order
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      return graphqlRequest(GET_ORDER_QUERY, { id });
    },
    enabled: !!id,
  });
};
