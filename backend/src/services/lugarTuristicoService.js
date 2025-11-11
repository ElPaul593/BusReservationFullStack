const LugarTuristicoRepo = require('../repositories/lugarTuristicoRepo');

exports.getAll = async (filters = {}) => {
  return LugarTuristicoRepo.findAll(filters);
};

exports.getByCiudad = async (ciudad) => {
  return LugarTuristicoRepo.findByCiudad(ciudad);
};

exports.getById = async (id) => {
  const lugar = await LugarTuristicoRepo.findById(id);
  if (!lugar) throw new Error('Lugar turístico no encontrado');
  return lugar;
};

exports.create = async (data) => {
  return LugarTuristicoRepo.create(data);
};

exports.update = async (id, data) => {
  const lugar = await LugarTuristicoRepo.findById(id);
  if (!lugar) throw new Error('Lugar turístico no encontrado');
  return LugarTuristicoRepo.updateById(id, data);
};

exports.delete = async (id) => {
  const lugar = await LugarTuristicoRepo.findById(id);
  if (!lugar) throw new Error('Lugar turístico no encontrado');
  return LugarTuristicoRepo.deleteById(id);
};

