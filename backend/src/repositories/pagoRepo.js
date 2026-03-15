const Pago = require('../models/pagoModel');

/**
 * PATRÓN DE DISEÑO: Repository Pattern
 * Abstrae el acceso a datos para pagos.
 *
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: acceso a datos de pagos.
 */

/**
 * Obtiene todos los pagos con paginación y filtros opcionales
 * @param {object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {string} options.estado
 * @param {string} options.userId
 */
exports.findAll = async (options = {}) => {
  const { page = 1, limit = 10, estado, userId } = options;

  const query = {};
  if (estado) query.estado = estado;
  if (userId) query.user = userId;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Pago.find(query)
      .populate('user', 'nombre apellido cedula pasaporte')
      .populate({
        path: 'reserva',
        populate: { path: 'ruta', select: 'from to price duration' }
      })
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Pago.countDocuments(query)
  ]);

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Busca un pago por ID
 * @param {string} id
 */
exports.findById = async (id) => {
  return Pago.findById(id)
    .populate('user', 'nombre apellido cedula pasaporte')
    .populate({
      path: 'reserva',
      populate: { path: 'ruta', select: 'from to price duration' }
    });
};

/**
 * Crea un nuevo pago
 * @param {object} data
 */
exports.create = async (data) => {
  const pago = new Pago(data);
  return pago.save();
};

/**
 * Actualiza el estado de un pago
 * @param {string} id
 * @param {string} estado
 */
exports.updateEstado = async (id, estado) => {
  const update = { estado };
  if (estado === 'completado') update.fechaPago = new Date();
  return Pago.findByIdAndUpdate(id, update, { new: true })
    .populate('user', 'nombre apellido cedula pasaporte')
    .populate({
      path: 'reserva',
      populate: { path: 'ruta', select: 'from to price duration' }
    });
};
