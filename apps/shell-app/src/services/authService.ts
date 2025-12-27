import axios from 'axios';

const API_BASE = import.meta.env.VITE_AUTH_API_BASE || 'http://localhost:3010/api/auth';

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  return res.data;
};

export const register = async (email: string, password: string, role: string, name?: string) => {
  const res = await axios.post(`${API_BASE}/register`, {
    email,
    password: password,
    role,
    name,
  });
  return res.data;
};
