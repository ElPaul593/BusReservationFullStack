const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para verificar JWT token
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Lista de cédulas con acceso administrativo
const adminCedulas = ['1724643976', '1705746483'];

// Middleware para verificar si el usuario tiene acceso administrativo
exports.requireAdminAccess = (req, res, next) => {
  if (!adminCedulas.includes(req.user.cedula)) {
    return res.status(403).json({ 
      error: 'Acceso denegado. No tienes permisos para acceder a esta sección.' 
    });
  }
  next();
};