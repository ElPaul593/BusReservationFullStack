import api from './api';

export async function login({ cedula, password }) {
  try {
    const resp = await api.post('/auth/login', { cedula, password });
    return resp.data;
  } catch (err) {
    
    const message = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Error al conectar';
    throw new Error(message);
  }
}

export async function register(payload) {
  try {
    const resp = await api.post('/auth/register', payload);
    return resp.data;
  } catch (err) {
    const message = err?.response?.data?.error || err?.response?.data?.message || err.message || 'Error al conectar';
    throw new Error(message);
  }
}

export function logout() {
  localStorage.removeItem('token');
}
