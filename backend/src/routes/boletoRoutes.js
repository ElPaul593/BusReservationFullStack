const express = require('express');
const router = express.Router();
const boletoController = require('../controllers/boletoController');

router.get('/', boletoController.getAll);
router.post('/', boletoController.create);

module.exports = router;
