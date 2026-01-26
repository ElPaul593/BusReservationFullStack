const Joi = require('joi');

/**
 * Schemas de validación para Auth
 */
const authSchemas = {
  register: Joi.object({
    cedula: Joi.string().min(6).max(10).pattern(/^\d+$/).optional(),
    pasaporte: Joi.string().min(6).max(20).optional(),
    nombre: Joi.string().required().min(2).max(50),
    apellido: Joi.string().required().min(2).max(50),
    telefono: Joi.string().required().min(10).max(15).pattern(/^\d+$/),
    paisOrigen: Joi.string().required().min(2).max(50),
    provincia: Joi.string().optional().max(50),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('ADMIN', 'USER').optional()
  }).or('cedula', 'pasaporte'),

  login: Joi.object({
    cedula: Joi.string().optional(),
    pasaporte: Joi.string().optional(),
    password: Joi.string().required()
  }).or('cedula', 'pasaporte')
};

/**
 * Schemas de validación para Reservas
 */
const reservaSchemas = {
  create: Joi.object({
    ruta: Joi.string().required(),
    // Soporta un solo asiento o múltiples
    seatNumber: Joi.number().integer().min(1).optional(),
    seatNumbers: Joi.array().items(Joi.number().integer().min(1)).optional(),
    status: Joi.string().valid('reserved', 'cancelled').optional(),
    isQuickReservation: Joi.boolean().optional(),
    tipo: Joi.string().valid('NORMAL', 'RAPIDA').optional(),
    fecha: Joi.string().optional(),
    pricing: Joi.object({
      cantidad: Joi.number().optional(),
      precioUnitario: Joi.number().optional(),
      subtotal: Joi.number().optional(),
      porcentajeDescuento: Joi.number().optional(),
      montoDescuento: Joi.number().optional(),
      total: Joi.number().optional(),
      ahorros: Joi.number().optional(),
      // Campos legacy
      precioBase: Joi.number().optional(),
      descuento: Joi.number().optional(),
      recargo: Joi.number().optional(),
      totalPagar: Joi.number().optional(),
      motivoDescuento: Joi.string().allow(null, '').optional(),
      motivoRecargo: Joi.string().allow(null, '').optional()
    }).optional()
  }).or('seatNumber', 'seatNumbers'), // Requiere uno de los dos

  query: Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    status: Joi.string().valid('reserved', 'cancelled').optional(),
    userId: Joi.string().optional(),
    from: Joi.date().optional(),
    to: Joi.date().optional()
  })
};

/**
 * Schemas de validación para Boletos
 */
const boletoSchemas = {
  create: Joi.object({
    reserva: Joi.string().required(),
    seatNumber: Joi.number().integer().min(1).required(),
    price: Joi.number().positive().required()
  })
};

/**
 * Schemas de validación para Rutas
 */
const rutaSchemas = {
  create: Joi.object({
    from: Joi.string().required().min(2).max(50),
    to: Joi.string().required().min(2).max(50),
    price: Joi.number().positive().required(),
    duration: Joi.string().optional(),
    seats: Joi.number().integer().min(1).optional(),
    departureTime: Joi.string().optional()
  }),

  query: Joi.object({
    from: Joi.string().optional(),
    to: Joi.string().optional(),
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10)
  })
};

/**
 * Schemas de validación para Calificaciones
 */
const calificacionSchemas = {
  create: Joi.object({
    tipo: Joi.string().required(),
    referencia: Joi.string().required(),
    puntuacion: Joi.number().integer().min(1).max(5).required(),
    comentario: Joi.string().optional().max(500)
  }),

  update: Joi.object({
    puntuacion: Joi.number().integer().min(1).max(5).optional(),
    comentario: Joi.string().optional().max(500)
  }),

  query: Joi.object({
    tipo: Joi.string().optional(),
    referencia: Joi.string().optional(),
    usuario: Joi.string().optional()
  })
};

module.exports = {
  authSchemas,
  reservaSchemas,
  boletoSchemas,
  rutaSchemas,
  calificacionSchemas
};

