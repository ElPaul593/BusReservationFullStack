const express = require('express');
const router = express.Router();
const boletoController = require('../controllers/boletoController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');

router.get('/', authenticateToken, requireAdminAccess, boletoController.getAll);
router.post('/', authenticateToken, boletoController.create);

module.exports = router;
