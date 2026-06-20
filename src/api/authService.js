import api from './axios';

export const authService = {
  register: (data) => api.post('https://ict-backend-dlhz.onrender.com/auth/register', data),
  login: (data) => api.post('https://ict-backend-dlhz.onrender.com/auth/login', data),
  getMe: () => api.get('/auth/me'),
};
