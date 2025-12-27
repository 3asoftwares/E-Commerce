import axios from 'axios';

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';

export const graphqlClient = axios.create({
  baseURL: GRAPHQL_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests

graphqlClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const graphqlRequest = async (query: string, variables?: any) => {
  const response = await graphqlClient.post('', {
    query,
    variables,
  });
  return response.data.data;
};
