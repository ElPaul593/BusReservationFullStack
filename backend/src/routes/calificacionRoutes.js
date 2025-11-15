const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacionController');
const Calificacion = require('../models/calificacionModel');
const { authenticateToken, authorizeOwnerOrAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, calificacionController.getAll);
router.get('/:id', authenticateToken, calificacionController.getById);
router.post('/', authenticateToken, calificacionController.create);
router.put('/:id', authenticateToken, authorizeOwnerOrAdmin(Calificacion, 'usuario'), calificacionController.update);
router.delete('/:id', authenticateToken, authorizeOwnerOrAdmin(Calificacion, 'usuario'), calificacionController.delete);

module.exports = router;
