const Reserva = require('../models/reservaModel');

/**
 * PATRÓN DE DISEÑO: Repository Pattern
 * Repositorio que encapsula el acceso a datos de reservas.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: operaciones CRUD para reservas.
 * 
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de la abstracción del modelo Reserva.
 */

/**
 * Busca todas las reservas con paginación y filtros
 * @param {object} options - Opciones de paginación y filtros
 * @param {number} options.page - Número de página (default: 1)
 * @param {number} options.limit - Límite de resultados por página (default: 10)
 * @param {string} options.status - Filtrar por status (reserved, cancelled)
 * @param {string} options.userId - Filtrar por ID de usuario
 * @param {Date} options.from - Fecha desde
 * @param {Date} options.to - Fecha hasta
 * @returns {Promise<{data: Array, pagination: Object}>}
 */
exports.findAll = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    userId,
    from,
    to
  } = options;

  // Construir query de filtros
  const query = {};

  if (status) {
    query.status = status;
  }

  if (userId) {
    query.user = userId;
  }

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  // Calcular skip
  const skip = (page - 1) * limit;

  // Ejecutar consulta con paginación
  const [data, total] = await Promise.all([
    Reserva.find(query)
      .populate('user', 'nombre apellido cedula pasaporte')
      .populate('ruta', 'from to price duration')
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Reserva.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages
    }
  };
};

exports.create = async (data) => {
  const r = new Reserva(data);
  return r.save();
};

exports.findById = async (id) => {
  return Reserva.findById(id).populate('user').populate('ruta');
};

exports.cancel = async (id) => {
  return Reserva.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
};
