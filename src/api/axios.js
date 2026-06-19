import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const api = axios.create({
  baseURL: 'process.env.VITE_API_URL',
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ssuet_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ssuet_token');
      localStorage.removeItem('ssuet_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
