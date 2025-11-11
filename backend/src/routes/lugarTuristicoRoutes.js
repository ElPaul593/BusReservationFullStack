const express = require('express');
const router = express.Router();
const lugarTuristicoController = require('../controllers/lugarTuristicoController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', lugarTuristicoController.getAll);
router.get('/:id', lugarTuristicoController.getById);
router.post('/', authenticateToken, lugarTuristicoController.create);
router.put('/:id', authenticateToken, lugarTuristicoController.update);
router.delete('/:id', authenticateToken, lugarTuristicoController.delete);

module.exports = router;

