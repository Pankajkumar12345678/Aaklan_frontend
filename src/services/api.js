// src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://aaklan-erp-backend.onrender.com/api';

// const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status !== 422) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Templates API
export const templateService = {
  getAll: () => api.get('/templates'),
  getByKey: (key) => api.get(`/templates/${key}`),
};

// AI API
export const aiService = {
  generate: (data) => api.post('/ai/generate', data),
  regenerate: (data) => api.post('/ai/regenerate', data),
  getUsage: () => api.get('/ai/usage'),
  test: () => api.get('/ai/test'),
};

// Lessons API
export const lessonService = {
  create: (data) => api.post('/lessons', data),
  getById: (id) => api.get(`/lessons/${id}`),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`),
  getAll: (params) => api.get('/lessons', { params }),
  publish: (id, published) => api.patch(`/lessons/${id}/publish`, { published }),
  duplicate: (id) => api.post(`/lessons/${id}/duplicate`),
};

// Creations API
export const creationService = {
  getAll: (params) => api.get('/my-creations', { params }),
  getById: (id) => api.get(`/my-creations/${id}`),
  update: (id, data) => api.put(`/my-creations/${id}`, data),
  duplicate: (id) => api.post(`/my-creations/${id}/duplicate`),
  share: (id) => api.post(`/my-creations/${id}/share`),
  getVersions: (id) => api.get(`/my-creations/${id}/versions`),
  delete: (id) => api.delete(`/my-creations/${id}`),
};

// Export API
export const exportService = {
  docx: (id) => api.post(`/export/docx/${id}`, {}, { responseType: 'blob' }),
  pdf: (id) => api.post(`/export/pdf/${id}`, {}, { responseType: 'blob' }),
  pptx: (id) => api.post(`/export/pptx/${id}`, {}, { responseType: 'blob' }),
  getFormats: () => api.get('/export/formats'),
};

// Admin API
export const adminService = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Permissions
  getPermissions: () => api.get('/admin/permissions'),
  getPermission: (id) => api.get(`/admin/permissions/${id}`),
  updatePermission: (role, data) => api.put(`/admin/permissions/${role}`, data),
  createCustomPermission: (data) => api.post('/admin/permissions/custom', data),
  deletePermission: (id) => api.delete(`/admin/permissions/${id}`),
  
  // Activities
  getActivities: (params) => api.get('/admin/activities', { params }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
};

// Curriculum API
export const curriculumService = {
  getAll: (params) => api.get('/curriculum', { params }),
  getByParams: (curriculum, grade, subject) => 
    api.get(`/curriculum/${curriculum}/${grade}/${subject || ''}`),
  getCompetencies: (params) => api.get('/curriculum/competencies/suggest', { params }),
};

export default api;