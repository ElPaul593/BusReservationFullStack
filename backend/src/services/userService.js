const bcrypt = require('bcrypt');
const UserRepo = require('../repositories/userRepo');

exports.getAll  = async () => UserRepo.findAll();
exports.getById = async (id) => UserRepo.findById(id);

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
