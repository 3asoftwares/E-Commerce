import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from './client';

// Seller Dashboard Stats
export const useSellerStats = () => {
  return useQuery({
    queryKey: ['sellerStats'],
    queryFn: async () => {
      const query = `
        query {
          sellerStats {
            totalProducts
            totalOrders
            totalRevenue
            lowStockProducts
          }
        }
      `;
      return graphqlRequest(query);
    },
    staleTime: 30000,
  });
};

// Get Seller's Products
export const useSellerProducts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['sellerProducts', page, limit],
    queryFn: async () => {
      const query = `
        query GetSellerProducts($page: Int, $limit: Int) {
          sellerProducts(page: $page, limit: $limit) {
            products {
              id
              name
              price
              stock
              category
              status
            }
            total
          }
        }
      `;
      return graphqlRequest(query, { page, limit });
    },
  });
};

// Get Seller's Orders
export const useSellerOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['sellerOrders', page, limit],
    queryFn: async () => {
      const query = `
        query GetSellerOrders($page: Int, $limit: Int) {
          sellerOrders(page: $page, limit: $limit) {
            orders {
              id
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
          }
        }
      `;
      return graphqlRequest(query, { page, limit });
    },
  });
};

// Create Product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) => {
      const query = `
        mutation CreateProduct($input: ProductInput!) {
          createProduct(input: $input) {
            id
            name
            price
          }
        }
      `;
      return graphqlRequest(query, { input: productData });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
      queryClient.invalidateQueries({ queryKey: ['sellerStats'] });
    },
  });
};

// Update Product Stock
export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, stock }: { productId: string; stock: number }) => {
      const query = `
        mutation UpdateStock($productId: ID!, $stock: Int!) {
          updateStock(productId: $productId, stock: $stock) {
            id
            stock
          }
        }
      `;
      return graphqlRequest(query, { productId, stock });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts'] });
    },
  });
};
