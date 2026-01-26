const express = require('express');
const router = express.Router();
const boletoController = require('../controllers/boletoController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { boletoSchemas } = require('../validations/schemas');

router.get('/', authenticateToken, requireAdminAccess, boletoController.getAll);
router.post('/', authenticateToken, validate(boletoSchemas.create, 'body'), boletoController.create);

module.exports = router;
