import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60s timeout for audio AI processing
});

// Request interceptor to attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sales_ai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error parsing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  demoLogin: (role) => api.post('/auth/demo-login', { role }),
  getMe: () => api.get('/auth/me'),
};

export const meetingsAPI = {
  getAll: (params) => api.get('/meetings', { params }),
  getById: (id) => api.get(`/meetings/${id}`),
  uploadAudio: (formData, onUploadProgress) =>
    api.post('/meetings/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  analyzeText: (data) => api.post('/meetings/analyze-text', data),
  updateActionItem: (meetingId, itemId, data) =>
    api.patch(`/meetings/${meetingId}/action-items/${itemId}`, data),
  addActionItem: (meetingId, itemData) =>
    api.post(`/meetings/${meetingId}/action-items`, itemData),
  deleteActionItem: (meetingId, itemId) =>
    api.delete(`/meetings/${meetingId}/action-items/${itemId}`),
  deleteMeeting: (id) => api.delete(`/meetings/${id}`),
  seedDemoData: () => api.post('/meetings/seed'),
};

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
};

export default api;
