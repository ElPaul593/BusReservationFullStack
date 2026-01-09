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

exports.findAll = async () => Reserva.find().lean();
exports.create = async (data) => {
  const r = new Reserva(data);
  return r.save();
};
