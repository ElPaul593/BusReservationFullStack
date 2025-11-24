const RutaRepo = require('../repositories/rutaRepo');
const Ruta = require('../models/rutaModel');
const { rutas } = require('../data/seedData');

exports.getAll = async () => {
  return RutaRepo.findAll();
};

exports.create = async (data) => {
  return RutaRepo.create(data);
};

exports.seedRutas = async (clearExisting = false) => {
  try {
    if (clearExisting) {
      await Ruta.deleteMany({});
    }

    const rutasInsertadas = [];
    for (const rutaData of rutas) {
      const ruta = await RutaRepo.create(rutaData);
      rutasInsertadas.push(ruta);
    }

    return {
      success: true,
      count: rutasInsertadas.length,
      rutas: rutasInsertadas
    };
  } catch (error) {
    throw new Error(`Error al poblar rutas: ${error.message}`);
  }
};
