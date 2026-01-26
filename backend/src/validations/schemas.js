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
    seatNumber: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('reserved', 'cancelled').optional()
  }),

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

