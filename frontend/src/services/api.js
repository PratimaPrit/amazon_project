import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - AI processing took too long');
    }
    if (!error.response) {
      throw new Error('Network error - Please check your connection');
    }
    throw error;
  }
);

export const optimizeProduct = async asin => {
  const response = await api.post('/optimize', { asin });
  return response.data;
};

export const getAllHistory = async (limit = 10, offset = 0) => {
  const response = await api.get(`/history?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getHistory = getAllHistory;

export const getHistoryByAsin = async asin => {
  const response = await api.get(`/history/asin/${asin}`);
  return response.data;
};

export const searchHistoryByAsin = getHistoryByAsin;

export const getOptimizationById = async id => {
  const response = await api.get(`/history/${id}`);
  return response.data;
};

export default api;
