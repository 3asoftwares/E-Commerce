import axios from 'axios';

const AUTH_API = 'http://localhost:3010';
const PRODUCT_API = 'http://localhost:3011';
const ORDER_API = 'http://localhost:3012';

const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config) => {
    // Use global accessToken from shell-app
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

const authClient = createApiClient(AUTH_API);
const productClient = createApiClient(PRODUCT_API);
const orderClient = createApiClient(ORDER_API);

// ==================== AUTH ENDPOINTS ====================
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    businessName?: string;
  }) => authClient.post('/api/auth/register', data),

  login: (email: string, password: string) =>
    authClient.post('/api/auth/login', { email, password }),

  logout: () => authClient.post('/api/auth/logout'),

  getProfile: () => authClient.get('/api/auth/profile'),

  updateProfile: (data: any) => authClient.put('/api/auth/profile', data),

  getStats: () => authClient.get('/api/auth/stats'),
};

// ==================== PRODUCT ENDPOINTS ====================
export const productApi = {
  getAll: (page = 1, limit = 10) =>
    productClient.get('/api/products', { params: { page, limit } }),

  getBySeller: (sellerId: string) =>
    productClient.get('/api/products', {
      params: { sellerId, limit: 1000 }
    }).then(response => response.data),

  getById: (id: string) => productClient.get(`/api/products/${id}`),

  create: (data: any) => productClient.post('/api/products', data),

  update: (id: string, data: any) => productClient.put(`/api/products/${id}`, data),

  delete: (id: string) => productClient.delete(`/api/products/${id}`),

  search: (query: string, page = 1, limit = 10) =>
    productClient.get('/api/products', {
      params: { search: query, page, limit },
    }),

  getCategories: () => productClient.get('/api/products/categories'),
};

// ==================== ORDER ENDPOINTS ====================
export const orderApi = {
  getAll: (page = 1, limit = 10) =>
    orderClient.get('/api/orders', { params: { page, limit } }),

  getById: (id: string) => orderClient.get(`/api/orders/${id}`),

  create: (data: any) => orderClient.post('/api/orders', data),

  updateStatus: (id: string, status: string) =>
    orderClient.put(`/api/orders/${id}/status`, { orderStatus: status }),

  updatePaymentStatus: (id: string, status: string) =>
    orderClient.put(`/api/orders/${id}/payment`, { paymentStatus: status }),

  cancel: (id: string) => orderClient.post(`/api/orders/${id}/cancel`, {}),
};

export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (
      error.response?.data?.message ===
      'Invalid or expired token'
    ) {
      window.location.href = 'http://localhost:3000?logout=true';
    }
    return error.response?.data?.message || error.message;
  }
  return 'An error occurred';
};
