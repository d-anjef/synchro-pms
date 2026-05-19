import api from '../api/axios';

export const taskService = {
  getAll: (params) => api.get('/tasks', { params }),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, data) => api.patch(`/tasks/${id}/status`, data),
  reorder: (tasks) => api.patch('/tasks/reorder', { tasks }),
  delete: (id) => api.delete(`/tasks/${id}`),
  addSubtask: (id, title) => api.post(`/tasks/${id}/subtasks`, { title }),
  toggleSubtask: (id, subId) => api.patch(`/tasks/${id}/subtasks/${subId}`),
  deleteSubtask: (id, subId) => api.delete(`/tasks/${id}/subtasks/${subId}`),
};