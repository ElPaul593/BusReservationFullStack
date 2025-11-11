const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', hotelController.getAll);
router.get('/:id', hotelController.getById);
router.post('/', authenticateToken, hotelController.create);
router.put('/:id', authenticateToken, hotelController.update);
router.delete('/:id', authenticateToken, hotelController.delete);

module.exports = router;

