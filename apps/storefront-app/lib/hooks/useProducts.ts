/**
 * Product Hooks
 * Using Apollo Client with TanStack Query for products
 */

import { useQuery } from '@tanstack/react-query';
import { apolloClient } from '../apollo/client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  GET_CATEGORIES_QUERY,
} from '../apollo/queries/products';
import type { ProductGraphQL } from '@e-commerce/types';

interface ProductsResponse {
  products: {
    products: ProductGraphQL[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface ProductResponse {
  product: ProductGraphQL;
}

interface CategoriesResponse {
  categories: string[];
}

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Hook to fetch products with filters
 */
export function useProducts(
  page: number = 1,
  limit: number = 20,
  filters?: ProductFilters
) {
  return useQuery({
    queryKey: ['products', page, limit, filters],
    queryFn: async () => {
      const { data } = await apolloClient.query<ProductsResponse>({
        query: GET_PRODUCTS_QUERY,
        variables: {
          page,
          limit,
          ...filters,
        },
        fetchPolicy: 'network-only',
      });

      return data.products;
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await apolloClient.query<ProductResponse>({
        query: GET_PRODUCT_QUERY,
        variables: { id },
        fetchPolicy: 'cache-first',
      });

      return data.product;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch available categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apolloClient.query<CategoriesResponse>({
        query: GET_CATEGORIES_QUERY,
        fetchPolicy: 'cache-first',
      });

      return data.categories;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
