import api from './axios';

export const eventService = {
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateEvent: (id, data) => api.put(`/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};
