// Configuración de la API
// Si hay una variable de entorno, úsala; si no, detecta automáticamente
// En producción (Docker/build), usa URL relativa. En desarrollo, usa localhost
let baseURL = '/api'; // Por defecto, URL relativa (funciona en producción)

if (import.meta.env.VITE_API_URL) {
  // Si hay una variable de entorno configurada, úsala
  baseURL = import.meta.env.VITE_API_URL;
} else if (import.meta.env.DEV || (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
  // Solo en desarrollo local usa localhost
  baseURL = 'http://localhost:5000/api';
}

export const API_BASE_URL = baseURL;
export const API_TIMEOUT = 5000;

