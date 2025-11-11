import api from './api';

// Función para obtener el token del localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para configurar headers con token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function listUsers() {
  try {
    const response = await api.get('/users', { 
      headers: getAuthHeaders() 
    });
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.error || err.message || 'Error al obtener usuarios';
    throw new Error(message);
  }
}

export async function createUser(userData) {
  try {
    const response = await api.post('/users', userData, { 
      headers: getAuthHeaders() 
    });
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.error || err.message || 'Error al crear usuario';
    throw new Error(message);
  }
}

export async function updateUser(id, userData) {
  try {
    const response = await api.put(`/users/${id}`, userData, { 
      headers: getAuthHeaders() 
    });
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.error || err.message || 'Error al actualizar usuario';
    throw new Error(message);
  }
}

export async function deleteUser(id) {
  try {
    const response = await api.delete(`/users/${id}`, { 
      headers: getAuthHeaders() 
    });
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error al eliminar usuario';
    throw new Error(message);
  }
}

export async function getUserById(id) {
  try {
    const response = await api.get(`/users/${id}`, { 
      headers: getAuthHeaders() 
    });
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error al obtener usuario';
    throw new Error(message);
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get('/users/me', { headers: getAuthHeaders() });
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Error al obtener usuario actual';
    throw new Error(message);
  }
}