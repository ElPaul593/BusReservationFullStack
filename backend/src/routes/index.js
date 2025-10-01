const express = require('express');
const router = express.Router();

// Route modules
const userRoutes = require('./userRoutes');
const reservaRoutes = require('./reservaRoutes');
const rutaRoutes = require('./rutaRoutes');
const boletoRoutes = require('./boletoRoutes');

router.use('/users', userRoutes);
router.use('/reservas', reservaRoutes);
router.use('/rutas', rutaRoutes);
router.use('/boletos', boletoRoutes);

module.exports = router;
