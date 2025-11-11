const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacionController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', calificacionController.getAll);
router.get('/:id', calificacionController.getById);
router.post('/', authenticateToken, calificacionController.create);
router.put('/:id', authenticateToken, calificacionController.update);
router.delete('/:id', authenticateToken, calificacionController.delete);

module.exports = router;

