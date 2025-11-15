const express = require('express');
const router = express.Router();
const rutaController = require('../controllers/rutaController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');

router.get('/', rutaController.getAll);
router.post('/', authenticateToken, requireAdminAccess, rutaController.create);

module.exports = router;
