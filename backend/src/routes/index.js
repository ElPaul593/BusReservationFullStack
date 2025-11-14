const express = require('express');
const router = express.Router();

// Route modules
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const reservaRoutes = require('./reservaRoutes');
const rutaRoutes = require('./rutaRoutes');
const boletoRoutes = require('./boletoRoutes');
const hotelRoutes = require('./hotelRoutes');
const lugarTuristicoRoutes = require('./lugarTuristicoRoutes');
const calificacionRoutes = require('./calificacionRoutes');
const recomendacionRoutes = require('./recomendacionRoutes');
const cedulaRoutes = require('./cedulaRoutes');

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/reservas', reservaRoutes);
router.use('/rutas', rutaRoutes);
router.use('/boletos', boletoRoutes);
router.use('/hoteles', hotelRoutes);
router.use('/lugares-turisticos', lugarTuristicoRoutes);
router.use('/calificaciones', calificacionRoutes);
router.use('/recomendaciones', recomendacionRoutes);
router.use('/cedula', cedulaRoutes);

module.exports = router;
