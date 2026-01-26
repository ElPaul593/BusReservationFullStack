import api from './api';

// Función para obtener headers de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Obtiene todas las reservas del sistema (Admin)
 * Endpoint: GET /api/reservas
 */
export async function getAllReservations(page = 1, limit = 10, filters = {}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    const response = await api.get(`/reservas?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching all reservations:', err);
    throw new Error(err.response?.data?.error || err.message || 'Error al obtener todas las reservas');
  }
}

/**
 * Obtiene las reservas del usuario autenticado
 * Endpoint: GET /api/reservas/mine
 */
export async function getUserReservations(page = 1, limit = 10) {
  try {
    const response = await api.get(`/reservas/mine?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching reservations:', err);
    throw new Error(err.response?.data?.error || err.message || 'Error al obtener mis reservas');
  }
}

/**
 * Crea una nueva reserva
 * Endpoint: POST /api/reservas
 */
export async function createReserva(reservaData) {
  try {
    const response = await api.post('/reservas', reservaData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    console.error('Error creating reservation:', err);
    throw new Error(err.response?.data?.error || err.message || 'Error al crear la reserva');
  }
}

/**
 * Cancela una reserva existente
 * Endpoint: DELETE /api/reservas/:id
 */
export async function cancelReserva(id) {
  try {
    const response = await api.delete(`/reservas/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    console.error('Error cancelling reservation:', err);
    throw new Error(err.response?.data?.error || err.message || 'Error al cancelar la reserva');
  }
}
