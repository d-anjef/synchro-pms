import api from '../api/axios';

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getProject: (id) => api.get(`/analytics/project/${id}`),
};