const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const Reserva = require('../models/reservaModel');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { reservaSchemas } = require('../validations/schemas');
const asyncHandler = require('../utils/asyncHandler');
const { serializeReserva } = require('../utils/serializers');

router.get(
  '/', 
  authenticateToken, 
  requireAdminAccess, 
  validate(reservaSchemas.query, 'query'),
  reservaController.getAll
);

router.post(
  '/', 
  authenticateToken, 
  validate(reservaSchemas.create, 'body'),
  reservaController.create
);

router.get('/mine', authenticateToken, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  
  const [list, total] = await Promise.all([
    Reserva.find({ user: req.user._id })
      .populate('ruta', 'from to price duration')
      .lean()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }),
    Reserva.countDocuments({ user: req.user._id })
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    data: list.map(serializeReserva),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages
    }
  });
}));

module.exports = router;
