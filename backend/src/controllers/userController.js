const UserService = require('../services/userService');

/**
 * PATRÓN DE DISEÑO: Service Layer Pattern (Controlador)
 * Los controladores delegan la lógica de negocio a los servicios.
 * Solo se encargan de manejar requests HTTP y responses.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: manejar HTTP requests/responses y delegar a servicios.
 * No contiene lógica de negocio ni acceso directo a datos.
 * 
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de la abstracción UserService, no de implementaciones concretas.
 */

exports.getAll = async (req, res) => {
  try {
    const users = await UserService.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.cedula) {
      return res.status(409).json({ error: 'La cédula ya está registrada' });
    }

    if (err.message?.toLowerCase().includes('cedula')) {
      return res.status(400).json({ error: err.message });
    }

    res.status(400).json({ error: 'Error al crear el usuario' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const user = await UserService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await UserService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.cedula) {
      return res.status(409).json({ error: 'La cédula ya está registrada' });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID inválido' });
    }

    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await UserService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
