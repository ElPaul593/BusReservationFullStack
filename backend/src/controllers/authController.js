const AuthService = require('../services/authService');

exports.register = async (req, res) => {
  try {

    const user = await AuthService.register(req.body);

    res.status(201).json({ 
      id: user._id,
      cedula: user.cedula || null,
      pasaporte: user.pasaporte || null,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      paisOrigen: user.paisOrigen,
      role: user.role, 
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);

    // result = { token, role }
    res.json({ 
      token: result.token,
      role: result.role  
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
