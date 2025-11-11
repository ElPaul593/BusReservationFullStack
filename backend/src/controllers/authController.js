const AuthService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json({ id: user._id, cedula: user.cedula, nombre: user.nombre, apellido: user.apellido, telefono: user.telefono, paisOrigen: user.paisOrigen, password: user.password });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await AuthService.login(req.body);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
