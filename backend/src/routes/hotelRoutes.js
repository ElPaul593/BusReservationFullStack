const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');

router.get('/', hotelController.getAll);
router.get('/:id', hotelController.getById);
router.post('/', authenticateToken, requireAdminAccess, hotelController.create);
router.put('/:id', authenticateToken, requireAdminAccess, hotelController.update);
router.delete('/:id', authenticateToken, requireAdminAccess, hotelController.delete);

module.exports = router;

