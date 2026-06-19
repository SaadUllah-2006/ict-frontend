import api from './axios';

export const registrationService = {
  register: (eventId) => api.post('/registrations', { eventId }),
  getMyRegistrations: () => api.get('/registrations/my'),
  cancelRegistration: (id) => api.delete(`/registrations/${id}`),
  getEventParticipants: (eventId, params) => api.get(`/registrations/event/${eventId}`, { params }),
  updateStatus: (id, status) => api.put(`/registrations/${id}/status`, { status }),
  getAllRegistrations: (params) => api.get('/registrations', { params }),
};
