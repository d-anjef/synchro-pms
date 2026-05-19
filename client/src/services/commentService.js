import api from '../api/axios';

export const commentService = {
  getByTask: (taskId) => api.get(`/comments/task/${taskId}`),
  create: (data) => api.post('/comments', data),
  update: (id, content) => api.put(`/comments/${id}`, { content }),
  delete: (id) => api.delete(`/comments/${id}`),
};