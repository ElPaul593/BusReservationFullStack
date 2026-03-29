const PagoService = require('../services/pagoService');
const asyncHandler = require('../utils/asyncHandler');
const { serializePago } = require('../utils/serializers');

/**
 * PATRÓN DE DISEÑO: Service Layer Pattern (Controlador)
 * Controlador para manejar requests HTTP de pagos.
 *
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: manejar HTTP requests/responses para pagos.
 */

/**
 * GET /api/pagos - Admin: obtiene todos los pagos
 */
exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit, estado, userId } = req.query;
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    estado,
    userId
  };
  const result = await PagoService.getAll(options);
  res.json({
    data: result.data.map(serializePago),
    pagination: result.pagination
  });
});

/**
 * GET /api/pagos/mine - Usuario: obtiene sus propios pagos
 */
exports.getMine = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10
  };
  const result = await PagoService.getMine(req.user.id, options);
  res.json({
    data: result.data.map(serializePago),
    pagination: result.pagination
  });
});

/**
 * GET /api/pagos/:id - Obtiene un pago específico
 */
exports.getById = asyncHandler(async (req, res) => {
  const pago = await PagoService.getById(req.params.id);
  if (!pago) {
    return res.status(404).json({ error: 'Pago no encontrado' });
  }
  res.json({ data: serializePago(pago) });
});

/**
 * POST /api/pagos - Crea un nuevo pago para una reserva
 */
exports.create = asyncHandler(async (req, res) => {
  const { reservaId, metodoPago } = req.body;
  const pago = await PagoService.create({
    reservaId,
    metodoPago,
    userId: req.user.id
  });
  res.status(201).json({ data: serializePago(pago) });
});

/**
 * POST /api/pagos/:id/confirmar - Confirma un pago pendiente
 */
exports.confirmar = asyncHandler(async (req, res) => {
  const pago = await PagoService.confirmar(req.params.id, req.user.id);
  res.json({
    message: 'Pago confirmado exitosamente',
    data: serializePago(pago)
  });
});

/**
 * PATCH /api/pagos/:id/estado - Admin: actualiza estado de un pago
 */
exports.updateEstado = asyncHandler(async (req, res) => {
  const { estado } = req.body;
  const pago = await PagoService.updateEstado(req.params.id, estado);
  res.json({
    message: 'Estado de pago actualizado',
    data: serializePago(pago)
  });
});
