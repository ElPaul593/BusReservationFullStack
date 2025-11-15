const express = require('express');
const router = express.Router();
const lugarTuristicoController = require('../controllers/lugarTuristicoController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');

router.get('/', lugarTuristicoController.getAll);
router.get('/:id', lugarTuristicoController.getById);
router.post('/', authenticateToken, requireAdminAccess, lugarTuristicoController.create);
router.put('/:id', authenticateToken, requireAdminAccess, lugarTuristicoController.update);
router.delete('/:id', authenticateToken, requireAdminAccess, lugarTuristicoController.delete);

module.exports = router;

