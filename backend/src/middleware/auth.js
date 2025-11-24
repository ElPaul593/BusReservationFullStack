const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    // Normalizar role a minúsculas para comparaciones consistentes
    if (user && user.role) user.role = String(user.role).toLowerCase();
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

exports.requireAdminAccess = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Usuario no autenticado' });
  const role = req.user.role ? String(req.user.role).toLowerCase() : '';
  if (role !== 'admin') return res.status(403).json({ error: 'Acceso administrativo requerido' });
  next();
};

exports.requireDashboardAccess = (req, res, next) => {
  const authorizedCedulas = ['1722108188','1724643976'];
  const authorizedPasaportes = [];
  if (!req.user) return res.status(401).json({ error: 'Usuario no autenticado' });

  const userCedula = String(req.user.cedula || '').trim();
  const userPasaporte = String(req.user.pasaporte || '').trim();

  const isAuthorized = (userCedula && authorizedCedulas.includes(userCedula)) || (userPasaporte && authorizedPasaportes.includes(userPasaporte));

  if (!isAuthorized && req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado.' });

  next();
};

exports.authorizeRole = (requiredRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Usuario no autenticado' });
  const role = req.user.role ? String(req.user.role).toLowerCase() : '';
  if (Array.isArray(requiredRole)) {
    const allowed = requiredRole.map(r => String(r).toLowerCase());
    if (!allowed.includes(role)) return res.status(403).json({ error: 'Permisos insuficientes' });
    return next();
  }
  if (role !== String(requiredRole).toLowerCase()) return res.status(403).json({ error: 'Permisos insuficientes' });
  next();
};

exports.authorizeOwnerOrAdmin = (Model, ownerField = 'user') => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Usuario no autenticado' });
      const role = req.user.role ? String(req.user.role).toLowerCase() : '';
      if (role === 'admin') return next();
      const id = req.params.id;
      const resource = await Model.findById(id).lean();
      if (!resource) return res.status(404).json({ error: 'Recurso no encontrado' });
      const ownerId = resource[ownerField] ? String(resource[ownerField]) : null;
      if (!ownerId) return res.status(403).json({ error: 'No es posible verificar propietario' });
      if (ownerId !== String(req.user._id)) return res.status(403).json({ error: 'Permisos insuficientes' });
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};
