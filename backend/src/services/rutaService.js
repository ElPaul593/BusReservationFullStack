const RutaRepo = require('../repositories/rutaRepo');
const Ruta = require('../models/rutaModel');
const { rutas } = require('../data/seedData');

/**
 * PATRÓN DE DISEÑO: Service Layer Pattern
 * Servicio que encapsula la lógica de negocio para rutas.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: lógica de negocio para rutas (incluyendo seeding).
 * 
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de la abstracción RutaRepo, no de implementaciones concretas.
 */

exports.getAll = async () => {
  return RutaRepo.findAll();
};

exports.create = async (data) => {
  return RutaRepo.create(data);
};

/**
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Método dedicado exclusivamente a poblar la base de datos con rutas iniciales.
 */
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
