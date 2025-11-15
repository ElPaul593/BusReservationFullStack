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
// NOTE: Se ha eliminado la comprobación por cédula para evitar bloqueos
// de acceso desde otros usuarios. Actualmente permitimos que cualquier
// usuario autenticado (pasa por `authenticateToken`) acceda a las rutas
// que antes requerían admin. Si más adelante quieres controlar acceso
// por rol, añade un campo `role` al modelo `User` y reemplaza esta
// función por una comprobación como `if (req.user.role !== 'admin') ...`.
exports.requireAdminAccess = (req, res, next) => {
  // Restricción administrativa deshabilitada intencionalmente.
  return next();
};

// Middleware para restringir acceso al dashboard de gestión de usuarios
// Solo permite acceso a usuarios con cédulas específicas (nacionales) o pasaportes específicos (extranjeros)
exports.requireDashboardAccess = (req, res, next) => {
  // Lista de cédulas autorizadas para acceder al dashboard (usuarios nacionales)
  const authorizedCedulas = ['1722108188', '1724643976'];
  // Lista de pasaportes autorizados (si se necesita para extranjeros)
  const authorizedPasaportes = [];
  
  // Verificar que el usuario esté autenticado (debe pasar por authenticateToken primero)
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  
  // Verificar que la cédula o pasaporte del usuario esté en la lista de autorizados
  const userCedula = String(req.user.cedula || '').trim();
  const userPasaporte = String(req.user.pasaporte || '').trim();
  
  const isAuthorized = (userCedula && authorizedCedulas.includes(userCedula)) ||
                       (userPasaporte && authorizedPasaportes.includes(userPasaporte));
  
  if (!isAuthorized) {
    return res.status(403).json({ error: 'Acceso denegado. No tienes permisos para acceder a esta sección.' });
  }
  
  next();
};