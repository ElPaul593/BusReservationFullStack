const Calificacion = require('../models/calificacionModel');

/**
 * PATRÓN DE DISEÑO: Repository Pattern
 * Repositorio que encapsula el acceso a datos de calificaciones.
 * Proporciona múltiples métodos especializados de búsqueda y filtrado.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: acceso a datos de calificaciones con múltiples criterios.
 * 
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de la abstracción del modelo Calificacion.
 */

exports.findAll = async (filters = {}) => {
  return Calificacion.find(filters).populate('usuario', 'nombre apellido paisOrigen provincia').sort({ fecha: -1 }).lean();
};

exports.findByTipoYReferencia = async (tipo, referencia) => {
  return Calificacion.find({ tipo, referencia })
    .populate('usuario', 'nombre apellido paisOrigen provincia')
    .sort({ fecha: -1 })
    .lean();
};

exports.findByUsuario = async (usuarioId) => {
  return Calificacion.find({ usuario: usuarioId })
    .populate('usuario', 'nombre apellido paisOrigen provincia')
    .sort({ fecha: -1 })
    .lean();
};

exports.findById = async (id) => {
  return Calificacion.findById(id).populate('usuario', 'nombre apellido paisOrigen provincia').lean();
};

exports.create = async (data) => {
  const calificacion = new Calificacion(data);
  return calificacion.save();
};

exports.updateById = async (id, data) => {
  return Calificacion.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).populate('usuario', 'nombre apellido paisOrigen').lean();
};

exports.deleteById = async (id) => {
  return Calificacion.findByIdAndDelete(id).lean();
};

/**
 * PATRÓN REPOSITORY: Método especializado de búsqueda
 * Encapsula la búsqueda de calificaciones con información de nacionalidad.
 */
// Método para obtener calificaciones agrupadas por nacionalidad
exports.findByTipoYReferenciaConNacionalidad = async (tipo, referencia) => {
  return Calificacion.find({ tipo, referencia })
    .populate('usuario', 'nombre apellido paisOrigen provincia')
    .sort({ fecha: -1 })
    .lean();
};

/**
 * PATRÓN REPOSITORY: Método especializado de búsqueda con filtro temporal
 * Encapsula la lógica de búsqueda de calificaciones del mes actual.
 */
// Método para obtener calificaciones del mes actual
exports.findCalificacionesMesActual = async (tipo, referencia) => {
  const ahora = new Date();
  const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  
  return Calificacion.find({ 
    tipo, 
    referencia,
    fecha: { $gte: inicioMes }
  })
    .populate('usuario', 'nombre apellido paisOrigen provincia')
    .sort({ fecha: -1 })
    .lean();
};

/**
 * PATRÓN REPOSITORY: Método especializado de búsqueda con filtro por provincia
 * Encapsula la lógica de búsqueda y filtrado por provincia del usuario.
 */
// Método para obtener calificaciones filtradas por provincia de usuario
exports.findByTipoYReferenciaYProvincia = async (tipo, referencia, provincia) => {
  const calificaciones = await Calificacion.find({ tipo, referencia })
    .populate('usuario', 'nombre apellido paisOrigen provincia')
    .sort({ fecha: -1 })
    .lean();
  
  // Filtrar por provincia del usuario
  return calificaciones.filter(c => c.usuario && c.usuario.provincia === provincia);
};

