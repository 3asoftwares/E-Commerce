/**
 * Order Hooks
 * Using Apollo Client with TanStack Query for orders
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apolloClient } from '../apollo/client';
import {
  GET_ORDERS_QUERY,
  GET_ORDER_QUERY,
  CREATE_ORDER_MUTATION,
} from '../apollo/queries/orders';
import type { OrderGraphQL } from '@e-commerce/types';

interface OrdersResponse {
  orders: {
    orders: OrderGraphQL[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface OrderResponse {
  order: OrderGraphQL;
}

interface CreateOrderResponse {
  createOrder: OrderGraphQL;
}

interface CreateOrderInput {
  customerId: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    sellerId: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
}

/**
 * Hook to fetch orders with pagination
 */
export function useOrders(page: number = 1, limit: number = 10, customerId?: string) {
  return useQuery({
    queryKey: ['orders', page, limit, customerId],
    queryFn: async () => {
      const { data } = await apolloClient.query<OrdersResponse>({
        query: GET_ORDERS_QUERY,
        variables: { page, limit, customerId },
        fetchPolicy: 'network-only',
      });

      return data.orders;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await apolloClient.query<OrderResponse>({
        query: GET_ORDER_QUERY,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return data.order;
    },
    enabled: !!id,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const { data } = await apolloClient.mutate<CreateOrderResponse>({
        mutation: CREATE_ORDER_MUTATION,
        variables: { input },
      });

      if (!data?.createOrder) {
        throw new Error('Failed to create order');
      }

      return data.createOrder;
    },
    onSuccess: () => {
      // Invalidate orders list to refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
