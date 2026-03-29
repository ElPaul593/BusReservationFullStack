import api from './api';

/**
 * Servicio de pagos
 * Integra con la API de pagos del backend, que a su vez conecta con:
 * - El sistema de reservas (valida la reserva)
 * - La API de pricing (calcula el monto con descuentos)
 *
 * Endpoints:
 * - POST /api/pagos          → crear pago (estado: pendiente)
 * - POST /api/pagos/:id/confirmar → confirmar pago
 * - GET  /api/pagos/mine     → mis pagos
 * - GET  /api/pagos/:id      → detalle de un pago
 * - GET  /api/pagos          → todos los pagos (Admin)
 * - PATCH /api/pagos/:id/estado → actualizar estado (Admin)
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Crea un pago en estado "pendiente" para una reserva.
 * El backend calcula el monto final usando la API de pricing.
 *
 * @param {string} reservaId - ID de la reserva a pagar
 * @param {string} metodoPago - Método: 'tarjeta' | 'efectivo' | 'transferencia' | 'paypal'
 * @returns {Promise<{data: object}>}
 */
export async function createPago(reservaId, metodoPago) {
  try {
    const response = await api.post(
      '/pagos',
      { reservaId, metodoPago },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Error al crear el pago');
  }
}

/**
 * Confirma un pago pendiente (cambia a "completado").
 *
 * @param {string} pagoId - ID del pago
 * @returns {Promise<{message: string, data: object}>}
 */
export async function confirmarPago(pagoId) {
  try {
    const response = await api.post(
      `/pagos/${pagoId}/confirmar`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Error al confirmar el pago');
  }
}

/**
 * Obtiene los pagos del usuario autenticado.
 *
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{data: Array, pagination: object}>}
 */
export async function getMyPagos(page = 1, limit = 10) {
  try {
    const response = await api.get(`/pagos/mine?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Error al obtener mis pagos');
  }
}

/**
 * Obtiene un pago específico por ID.
 *
 * @param {string} pagoId
 * @returns {Promise<{data: object}>}
 */
export async function getPagoById(pagoId) {
  try {
    const response = await api.get(`/pagos/${pagoId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Error al obtener el pago');
  }
}

/**
 * Obtiene todos los pagos del sistema (Admin).
 *
 * @param {number} page
 * @param {number} limit
 * @param {object} filters - { estado?, userId? }
 * @returns {Promise<{data: Array, pagination: object}>}
 */
export async function getAllPagos(page = 1, limit = 10, filters = {}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    const response = await api.get(`/pagos?${params.toString()}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Error al obtener los pagos');
  }
}

/**
 * Actualiza el estado de un pago (Admin).
 *
 * @param {string} pagoId
 * @param {string} estado - 'pendiente' | 'completado' | 'fallido' | 'reembolsado'
 * @returns {Promise<{message: string, data: object}>}
 */
export async function updateEstadoPago(pagoId, estado) {
  try {
    const response = await api.patch(
      `/pagos/${pagoId}/estado`,
      { estado },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message || 'Error al actualizar el estado del pago');
  }
}

export default {
  createPago,
  confirmarPago,
  getMyPagos,
  getPagoById,
  getAllPagos,
  updateEstadoPago
};
