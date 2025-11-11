const CalificacionRepo = require('../repositories/calificacionRepo');
const User = require('../models/userModel');

exports.getAll = async (filters = {}) => {
  return CalificacionRepo.findAll(filters);
};

exports.getByTipoYReferencia = async (tipo, referencia) => {
  return CalificacionRepo.findByTipoYReferencia(tipo, referencia);
};

exports.getByUsuario = async (usuarioId) => {
  return CalificacionRepo.findByUsuario(usuarioId);
};

exports.getById = async (id) => {
  const calificacion = await CalificacionRepo.findById(id);
  if (!calificacion) throw new Error('Calificación no encontrada');
  return calificacion;
};

exports.create = async (data) => {
  // Verificar que el usuario existe
  const user = await User.findById(data.usuario);
  if (!user) throw new Error('Usuario no encontrado');
  
  return CalificacionRepo.create(data);
};

exports.update = async (id, data) => {
  const calificacion = await CalificacionRepo.findById(id);
  if (!calificacion) throw new Error('Calificación no encontrada');
  return CalificacionRepo.updateById(id, data);
};

exports.delete = async (id) => {
  const calificacion = await CalificacionRepo.findById(id);
  if (!calificacion) throw new Error('Calificación no encontrada');
  return CalificacionRepo.deleteById(id);
};

