import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT
});

// Interceptor para añadir el token a todas las peticiones
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

export default api;
