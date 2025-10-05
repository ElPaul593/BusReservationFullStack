const UserService = require('../services/userService');

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
    // 👇 Detectar error por cédula duplicada (Mongo code 11000)
    if (err?.code === 11000 && err?.keyPattern?.cedula) {
      return res.status(409).json({ error: 'La cédula ya está registrada' });
    }

    // 👇 Si el error viene de tu validación manual
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
};exports.update = async (req, res) => {
  try {
    const updated = await UserService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(updated);
  } catch (err) {
    // Duplicado (p.ej., si algún día permites cambiar cédula)
    if (err?.code === 11000 && err?.keyPattern?.cedula) {
      return res.status(409).json({ error: 'La cédula ya está registrada' });
    }
    // Errores de validación (minlength, match, etc.)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    // CastError (ObjectId inválido)
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
