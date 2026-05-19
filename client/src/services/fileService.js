import api from '../api/axios';

export const fileService = {
  upload: (formData) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: (params) => api.get('/files', { params }),
  delete: (id) => api.delete(`/files/${id}`),
};