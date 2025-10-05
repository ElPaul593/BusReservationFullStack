import api from './api';

export async function listUsers() {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error al obtener usuarios';
    throw new Error(message);
  }
}

export async function createUser(userData) {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error al crear usuario';
    throw new Error(message);
  }
}

export async function updateUser(id, userData) {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error al actualizar usuario';
    throw new Error(message);
  }
}

export async function deleteUser(id) {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error al eliminar usuario';
    throw new Error(message);
  }
}

export async function getUserById(id) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || err.message || 'Error al obtener usuario';
    throw new Error(message);
  }
}