const bcrypt = require('bcrypt');
const UserRepo = require('../repositories/userRepo');

/**
 * PATRÓN DE DISEÑO: Service Layer Pattern
 * Esta capa de servicio encapsula la lógica de negocio para usuarios.
 * Actúa como intermediario entre los controladores y los repositorios.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: lógica de negocio para usuarios (validación, normalización,
 * hash de contraseñas). No maneja HTTP ni acceso directo a base de datos.
 * 
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de la abstracción UserRepo, no de implementaciones concretas.
 * Esto permite cambiar la implementación del repositorio sin afectar el servicio.
 */

exports.getAll  = async () => UserRepo.findAll();
exports.getById = async (id) => UserRepo.findById(id);

/**
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Este método tiene una única responsabilidad: crear usuarios con validación
 * y normalización de datos. La lógica de hash de contraseñas está encapsulada aquí.
 */
exports.create = async (data) => {
  // server-side normalization (never trust frontend)
  const payload = {
    cedula: String(data.cedula || '').replace(/\D/g, '').slice(0, 10),
    nombre: String(data.nombre || '').trim(),
    apellido:String(data.apellido|| '').trim(),
    telefono:String(data.telefono||'').replace(/\D/g,'').slice(0,15),
    password: String(data.password || ''),
  };

  // Duplicate check
  const exist = await UserRepo.findByCedula(payload.cedula, '_id');
  if (exist) throw new Error('La cédula ya está registrada');

  // Hash
  const saltRounds = 10;
  payload.password = await bcrypt.hash(payload.password, saltRounds);

  return UserRepo.create(payload);
};

/**
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Método dedicado exclusivamente a actualizar usuarios con validación
 * y normalización de datos.
 */
exports.update = async (id, data = {}) => {
  const update = {};

  if (data.nombre   !== undefined) update.nombre   = String(data.nombre).trim();
  if (data.apellido !== undefined) update.apellido = String(data.apellido).trim();
  if (data.telefono !== undefined) update.telefono = String(data.telefono).replace(/\D/g,'').slice(0,15);

  // Optional: DO NOT allow changing cedula (safer). If you want to allow it, also re-check duplicates.
  // if (data.cedula !== undefined) { ... duplicate check + normalization ... }

  if (data.password && data.password.trim() !== '') {
    const saltRounds = 10;
    update.password = await bcrypt.hash(String(data.password), saltRounds);
  }

  return UserRepo.updateById(id, update);
};

exports.remove = async (id) => UserRepo.deleteById(id);
