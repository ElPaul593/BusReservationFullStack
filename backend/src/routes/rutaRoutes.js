const express = require('express');
const router = express.Router();
const rutaController = require('../controllers/rutaController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Rutas
 *   description: Gestión de rutas de autobuses
 */

/**
 * @swagger
 * /api/rutas:
 *   get:
 *     summary: Obtener todas las rutas disponibles
 *     tags: [Rutas]
 *     responses:
 *       200:
 *         description: Lista de rutas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   from:
 *                     type: string
 *                   to:
 *                     type: string
 *                   price:
 *                     type: number
 *                   duration:
 *                     type: string
 */
router.get('/', rutaController.getAll);

/**
 * @swagger
 * /api/rutas:
 *   post:
 *     summary: Crear una nueva ruta (Admin)
 *     tags: [Rutas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *               - price
 *               - duration
 *             properties:
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ruta creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (solo admin)
 */
router.post('/', authenticateToken, requireAdminAccess, rutaController.create);

/**
 * @swagger
 * /api/rutas/seed:
 *   post:
 *     summary: Poblar base de datos con rutas iniciales (Admin)
 *     tags: [Rutas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Rutas creadas exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (solo admin)
 */
router.post('/seed', authenticateToken, requireAdminAccess, rutaController.seedRutas);

module.exports = router;
