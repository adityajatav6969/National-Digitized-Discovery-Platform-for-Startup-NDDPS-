import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Endpoints
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);

// Startup Endpoints
export const getStartups = (params) => api.get('/startups', { params });
export const getStartupById = (id) => api.get(`/startups/${id}`);
export const createStartup = (data) => api.post('/startups', data);
export const updateStartup = (id, data) => api.put(`/startups/${id}`, data);
export const deleteStartup = (id) => api.delete(`/startups/${id}`);

// Admin Moderation Endpoints
export const getPendingStartups = () => api.get('/admin/startups/pending');
export const verifyStartup = (id, data) => api.patch(`/admin/startups/${id}/verify`, data);

// Government Schemes & Recommendation Mapping
export const getSchemes = (params) => api.get('/schemes', { params });
export const getSchemeById = (id) => api.get(`/schemes/${id}`);
export const mapSchemes = (startupId) => api.get(`/schemes/map/${startupId}`);

// Ecosystem Analytics
export const getAnalytics = () => api.get('/analytics/overview');

export default api;
