const express = require('express');
const router = express.Router();
const recomendacionController = require('../controllers/recomendacionController');

router.get('/', recomendacionController.getRecomendados);

module.exports = router;

