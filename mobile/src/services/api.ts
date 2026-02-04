import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.API_URL || 'https://api.goldenpassage.com/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          
          await SecureStore.setItemAsync('token', accessToken);
          api.defaults.headers.Authorization = `Bearer ${accessToken}`;
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        await SecureStore.deleteItemAsync('user');
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refreshToken');
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const tradesApi = {
  getAll: (params?: any) => api.get('/trades', { params }),
  getById: (id: string) => api.get(`/trades/${id}`),
  create: (data: any) => api.post('/trades', data),
  update: (id: string, data: any) => api.put(`/trades/${id}`, data),
  delete: (id: string) => api.delete(`/trades/${id}`),
  getStats: () => api.get('/trades/stats/summary'),
};

export const journalApi = {
  getAll: (params?: any) => api.get('/journals', { params }),
  getById: (id: string) => api.get(`/journals/${id}`),
  create: (data: any) => api.post('/journals', data),
  update: (id: string, data: any) => api.put(`/journals/${id}`, data),
  delete: (id: string) => api.delete(`/journals/${id}`),
  getToday: () => api.get('/journals/today'),
};

export const analyticsApi = {
  getOverview: (period?: string) => api.get('/analytics/overview', { params: { period } }),
  getByInstrument: (params?: any) => api.get('/analytics/by-instrument', { params }),
  getByStrategy: (params?: any) => api.get('/analytics/by-strategy', { params }),
  getEquityCurve: (params?: any) => api.get('/analytics/equity-curve', { params }),
  getStreaks: () => api.get('/analytics/streaks'),
};

export const aiApi = {
  generateDailyStrategy: (data?: any) => api.post('/ai/daily-strategy', data),
  analyzeSetup: (data: any) => api.post('/ai/analyze-setup', data),
  getTradingInsights: () => api.get('/ai/trading-insights'),
};

export const calculatorApi = {
  positionSize: (data: any) => api.post('/calculators/position-size', data),
  riskReward: (data: any) => api.post('/calculators/risk-reward', data),
  pipValue: (data: any) => api.post('/calculators/pip-value', data),
  margin: (data: any) => api.post('/calculators/margin', data),
  compound: (data: any) => api.post('/calculators/compound', data),
};

export default api;
