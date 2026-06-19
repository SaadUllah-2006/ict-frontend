import api from './axios';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllStudents: (params) => api.get('/admin/students', { params }),
  getReports: () => api.get('/admin/reports'),
};

export const studentService = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  changePassword: (data) => api.put('/students/change-password', data),
};
