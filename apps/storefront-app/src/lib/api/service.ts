'use client';

import axios, { AxiosInstance } from 'axios';

const GATEWAY_URL = 'http://localhost:4000/graphql';
const API_URL = 'http://localhost:3011';

class APIService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.axiosInstance.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  // Products
  async getProducts(page = 1, limit = 20, filters?: any) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
        ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      });

      const response = await this.axiosInstance.get(`/api/products?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  async getProductById(id: string) {
    try {
      const response = await this.axiosInstance.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  }

  async getProductsByCategory(category: string, page = 1, limit = 20) {
    try {
      const response = await this.axiosInstance.get(
        `/api/products?category=${category}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      throw error;
    }
  }

  // Orders
  async createOrder(orderData: any) {
    try {
      const response = await this.axiosInstance.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  async getOrders(page = 1, limit = 10) {
    try {
      const response = await this.axiosInstance.get(`/api/orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  async getOrderById(id: string) {
    try {
      const response = await this.axiosInstance.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: string) {
    try {
      const response = await this.axiosInstance.patch(`/api/orders/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  }

  // Categories
  async getCategories() {
    try {
      const response = await this.axiosInstance.get('/api/products/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  // User
  async getUserProfile() {
    try {
      const response = await this.axiosInstance.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(data: any) {
    try {
      const response = await this.axiosInstance.put('/api/auth/profile', data);
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }
}

export const apiService = new APIService();
