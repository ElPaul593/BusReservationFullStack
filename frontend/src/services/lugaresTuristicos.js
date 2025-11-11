import api from './api';

export async function getLugaresTuristicos(ciudad = null) {
  try {
    const url = ciudad ? `/lugares-turisticos?ciudad=${ciudad}` : '/lugares-turisticos';
    const resp = await api.get(url);
    return resp.data;
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || 'Error al obtener lugares turísticos';
    throw new Error(message);
  }
}

export async function getLugarTuristicoById(id) {
  try {
    const resp = await api.get(`/lugares-turisticos/${id}`);
    return resp.data;
  } catch (err) {
    const message = err?.response?.data?.error || err?.message || 'Error al obtener lugar turístico';
    throw new Error(message);
  }
}

