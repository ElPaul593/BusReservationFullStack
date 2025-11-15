const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const Reserva = require('../models/reservaModel');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');

router.get('/', authenticateToken, requireAdminAccess, reservaController.getAll);
router.post('/', authenticateToken, reservaController.create);

router.get('/mine', authenticateToken, async (req, res) => {
	try {
		const list = await Reserva.find({ user: req.user._id }).lean();
		res.json(list);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
