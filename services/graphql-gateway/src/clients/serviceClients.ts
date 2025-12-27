/**
 * Service Clients for REST API Communication
 */

import axios, { AxiosInstance } from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3010';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3011';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3012';

// Auth Service Client
export const authClient: AxiosInstance = axios.create({
  baseURL: AUTH_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product Service Client
export const productClient: AxiosInstance = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order Service Client
export const orderClient: AxiosInstance = axios.create({
  baseURL: ORDER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to add auth token to requests
export const addAuthHeader = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});
