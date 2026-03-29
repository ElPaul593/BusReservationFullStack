const PagoRepo = require('../repositories/pagoRepo');
const ReservaRepo = require('../repositories/reservaRepo');
const AppError = require('../utils/AppError');
const axios = require('axios');

const PRICING_API = process.env.PRICING_API || 'https://apiconsumidorac.onrender.com';

/**
 * PATRÓN DE DISEÑO: Service Layer Pattern
 * Encapsula la lógica de negocio para pagos.
 *
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: lógica de negocio para pagos.
 *
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de abstracciones PagoRepo y ReservaRepo.
 *
 * Integra con:
 * - ReservaRepo: valida que la reserva existe y pertenece al usuario
 * - Pricing API externa: obtiene desglose de precios actualizado
 */

/**
 * Obtiene todos los pagos (Admin)
 */
exports.getAll = async (options = {}) => {
  return PagoRepo.findAll(options);
};

/**
 * Obtiene los pagos de un usuario específico
 */
exports.getMine = async (userId, options = {}) => {
  return PagoRepo.findAll({ ...options, userId });
};

/**
 * Obtiene un pago por ID
 */
exports.getById = async (id) => {
  return PagoRepo.findById(id);
};

/**
 * Crea un nuevo pago para una reserva.
 * Integra con la API de pricing para calcular el monto final.
 *
 * @param {object} data
 * @param {string} data.reservaId - ID de la reserva a pagar
 * @param {string} data.metodoPago - Método de pago
 * @param {string} data.userId - ID del usuario autenticado
 */
exports.create = async ({ reservaId, metodoPago, userId }) => {
  // 1. Verificar que la reserva existe y pertenece al usuario
  const reserva = await ReservaRepo.findById(reservaId);
  if (!reserva) {
    throw new AppError('Reserva no encontrada', 404);
  }
  if (String(reserva.user._id || reserva.user) !== String(userId)) {
    throw new AppError('No tienes permiso para pagar esta reserva', 403);
  }
  if (reserva.status === 'cancelled') {
    throw new AppError('No se puede pagar una reserva cancelada', 400);
  }

  // 2. Verificar que no existe ya un pago completado para esta reserva
  const existing = await PagoRepo.findAll({ userId });
  const yaCompletado = existing.data.some(
    (p) => String(p.reserva?._id || p.reserva) === String(reservaId) && p.estado === 'completado'
  );
  if (yaCompletado) {
    throw new AppError('Esta reserva ya tiene un pago completado', 400);
  }

  // 3. Calcular precio usando la API de pricing (o fallback local)
  const cantidad = reserva.seatNumbers?.length || (reserva.seatNumber ? 1 : 1);
  const rutaId = reserva.ruta?._id || reserva.ruta;
  const precioUnitarioBase = reserva.ruta?.price || 50000;

  let pricing = null;
  try {
    const response = await axios.post(
      `${PRICING_API}/calcular-precio`,
      { cantidad: Number(cantidad) },
      { timeout: 10000, headers: { 'Content-Type': 'application/json' } }
    );
    const apiData = response.data;
    const porcentajeDescuento = apiData.porcentajeDescuento || 0;
    const subtotal = cantidad * precioUnitarioBase;
    const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
    const total = subtotal - montoDescuento;

    pricing = {
      cantidad,
      precioUnitario: precioUnitarioBase,
      subtotal,
      porcentajeDescuento,
      montoDescuento,
      total,
      ahorros: montoDescuento
    };
  } catch {
    // Fallback local si la API externa no responde
    const subtotal = cantidad * precioUnitarioBase;
    let porcentajeDescuento = 0;
    if (cantidad >= 5) porcentajeDescuento = 15;
    else if (cantidad >= 4) porcentajeDescuento = 10;
    else if (cantidad >= 3) porcentajeDescuento = 7;
    else if (cantidad >= 2) porcentajeDescuento = 5;

    const montoDescuento = Math.round(subtotal * (porcentajeDescuento / 100));
    const total = subtotal - montoDescuento;

    pricing = {
      cantidad,
      precioUnitario: precioUnitarioBase,
      subtotal,
      porcentajeDescuento,
      montoDescuento,
      total,
      ahorros: montoDescuento
    };
  }

  // Usar pricing almacenado en la reserva si existe y es más preciso
  if (reserva.pricing && reserva.pricing.total) {
    pricing = {
      cantidad: reserva.pricing.cantidad || cantidad,
      precioUnitario: reserva.pricing.precioUnitario || precioUnitarioBase,
      subtotal: reserva.pricing.subtotal || pricing.subtotal,
      porcentajeDescuento: reserva.pricing.porcentajeDescuento || 0,
      montoDescuento: reserva.pricing.montoDescuento || 0,
      total: reserva.pricing.total,
      ahorros: reserva.pricing.ahorros || 0
    };
  }

  // 4. Crear el pago en estado "pendiente"
  const pago = await PagoRepo.create({
    reserva: reservaId,
    user: userId,
    monto: pricing.total,
    metodoPago,
    estado: 'pendiente',
    pricing
  });

  return pago;
};

/**
 * Actualiza el estado de un pago (Admin)
 */
exports.updateEstado = async (id, estado) => {
  const pago = await PagoRepo.findById(id);
  if (!pago) {
    throw new AppError('Pago no encontrado', 404);
  }
  return PagoRepo.updateEstado(id, estado);
};

/**
 * Confirma un pago (cambia de pendiente a completado)
 * Solo el dueño del pago puede confirmar
 */
exports.confirmar = async (id, userId) => {
  const pago = await PagoRepo.findById(id);
  if (!pago) {
    throw new AppError('Pago no encontrado', 404);
  }
  if (String(pago.user._id || pago.user) !== String(userId)) {
    throw new AppError('No tienes permiso para confirmar este pago', 403);
  }
  if (pago.estado !== 'pendiente') {
    throw new AppError(`No se puede confirmar un pago en estado "${pago.estado}"`, 400);
  }
  return PagoRepo.updateEstado(id, 'completado');
};
