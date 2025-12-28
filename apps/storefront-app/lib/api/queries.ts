import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from './client';

// Get All Products
export const useProducts = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: async () => {
      const query = `
        query GetProducts($page: Int, $limit: Int) {
          products(page: $page, limit: $limit) {
            products {
              id
              name
              description
              price
              stock
              category
              images
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
    staleTime: 60000, // 1 minute
  });
};

// Get Product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const query = `
        query GetProduct($id: ID!) {
          product(id: $id) {
            id
            name
            description
            price
            stock
            category
            images
            sellerId
            createdAt
          }
        }
      `;
      return graphqlRequest(query, { id });
    },
    enabled: !!id,
  });
};

// Get Featured Products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const query = `
        query {
          featuredProducts {
            id
            name
            description
            price
            stock
            category
            images
          }
        }
      `;
      return graphqlRequest(query);
    },
    staleTime: 300000, // 5 minutes
  });
};

// Get Products by Category
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['productsByCategory', category],
    queryFn: async () => {
      const query = `
        query GetProductsByCategory($category: String!) {
          productsByCategory(category: $category) {
            id
            name
            price
            stock
            category
            images
          }
        }
      `;
      return graphqlRequest(query, { category });
    },
    enabled: !!category && category !== 'all',
  });
};

// Create Order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const query = `
        mutation CreateOrder($input: OrderInput!) {
          createOrder(input: $input) {
            id
            total
            status
            createdAt
          }
        }
      `;
      return graphqlRequest(query, { input: orderData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Search Products
export const useSearchProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: ['searchProducts', searchTerm],
    queryFn: async () => {
      const query = `
        query SearchProducts($search: String!) {
          searchProducts(search: $search) {
            id
            name
            description
            price
            stock
            category
            images
          }
        }
      `;
      return graphqlRequest(query, { search: searchTerm });
    },
    enabled: searchTerm.length > 2,
  });
};
