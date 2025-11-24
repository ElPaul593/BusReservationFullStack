const LugarTuristicoRepo = require('../repositories/lugarTuristicoRepo');
const LugarTuristico = require('../models/lugarTuristicoModel');
const { lugaresTuristicos } = require('../data/seedData');

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

exports.seedLugaresTuristicos = async (clearExisting = false) => {
  try {
    if (clearExisting) {
      await LugarTuristico.deleteMany({});
    }

    const lugaresInsertados = [];
    for (const lugarData of lugaresTuristicos) {
      const lugar = await LugarTuristicoRepo.create(lugarData);
      lugaresInsertados.push(lugar);
    }

    return {
      success: true,
      count: lugaresInsertados.length,
      lugares: lugaresInsertados
    };
  } catch (error) {
    throw new Error(`Error al poblar lugares turísticos: ${error.message}`);
  }
};

