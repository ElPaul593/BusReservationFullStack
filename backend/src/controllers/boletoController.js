const BoletoService = require('../services/boletoService');

/**
 * PATRÓN DE DISEÑO: Service Layer Pattern (Controlador)
 * Controlador que maneja requests HTTP para boletos.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: manejar HTTP requests/responses para boletos.
 * 
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de la abstracción BoletoService.
 */

exports.getAll = async (req, res) => {
  try {
    const boletos = await BoletoService.getAll();
    res.json(boletos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const boleto = await BoletoService.create(req.body);
    res.status(201).json(boleto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
