const BoletoRepo = require('../repositories/boletoRepo');

/**
 * PATRÓN DE DISEÑO: Service Layer Pattern
 * Servicio que encapsula la lógica de negocio para boletos.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: lógica de negocio para boletos.
 * 
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de la abstracción BoletoRepo.
 */

exports.getAll = async () => {
  return BoletoRepo.findAll();
};

exports.create = async (data) => {
  return BoletoRepo.create(data);
};
