const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const pagoController = require('../controllers/pagoController');
const { authenticateToken, requireAdminAccess } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { pagoSchemas } = require('../validations/schemas');
const asyncHandler = require('../utils/asyncHandler');

// Rate limiter para endpoints de pagos (más restrictivo por ser operaciones financieras)
const pagoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Demasiadas solicitudes, intenta nuevamente en 15 minutos' }
});

// Rate limiter más estricto para crear y confirmar pagos
const pagoMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Demasiadas solicitudes de pago, intenta nuevamente en 15 minutos' }
});

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Sistema de pagos integrado con reservas y API de pricing
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pago:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         reserva:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/Reserva'
 *         user:
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/User'
 *         monto:
 *           type: number
 *         metodoPago:
 *           type: string
 *           enum: [tarjeta, efectivo, transferencia, paypal]
 *         estado:
 *           type: string
 *           enum: [pendiente, completado, fallido, reembolsado]
 *         referencia:
 *           type: string
 *           nullable: true
 *         pricing:
 *           type: object
 *           properties:
 *             cantidad:
 *               type: number
 *             precioUnitario:
 *               type: number
 *             subtotal:
 *               type: number
 *             porcentajeDescuento:
 *               type: number
 *             montoDescuento:
 *               type: number
 *             total:
 *               type: number
 *             ahorros:
 *               type: number
 *         fechaPago:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Obtener todos los pagos (Admin)
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, completado, fallido, reembolsado]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pagos con paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pago'
 *                 pagination:
 *                   type: object
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso administrativo requerido
 */
router.get('/', pagoLimiter, authenticateToken, requireAdminAccess, validate(pagoSchemas.query, 'query'), pagoController.getAll);

/**
 * @swagger
 * /api/pagos/mine:
 *   get:
 *     summary: Obtener mis pagos
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de mis pagos
 *       401:
 *         description: No autenticado
 */
router.get('/mine', pagoLimiter, authenticateToken, pagoController.getMine);

/**
 * @swagger
 * /api/pagos/{id}:
 *   get:
 *     summary: Obtener un pago por ID
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del pago
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago no encontrado
 */
router.get('/:id', pagoLimiter, authenticateToken, pagoController.getById);

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Crear un pago para una reserva
 *     description: |
 *       Crea un pago asociado a una reserva existente.
 *       Integra con la API de pricing para calcular el monto final con descuentos.
 *       El pago se crea en estado "pendiente" y debe confirmarse con POST /api/pagos/:id/confirmar.
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservaId
 *               - metodoPago
 *             properties:
 *               reservaId:
 *                 type: string
 *                 description: ID de la reserva a pagar
 *               metodoPago:
 *                 type: string
 *                 enum: [tarjeta, efectivo, transferencia, paypal]
 *     responses:
 *       201:
 *         description: Pago creado exitosamente en estado pendiente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Error de validación o reserva inválida
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Permiso denegado
 *       404:
 *         description: Reserva no encontrada
 */
router.post('/', pagoMutationLimiter, authenticateToken, validate(pagoSchemas.create), pagoController.create);

/**
 * @swagger
 * /api/pagos/{id}/confirmar:
 *   post:
 *     summary: Confirmar un pago pendiente
 *     description: Cambia el estado del pago de "pendiente" a "completado".
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pago confirmado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Pago'
 *       400:
 *         description: El pago no está en estado pendiente
 *       403:
 *         description: Permiso denegado
 *       404:
 *         description: Pago no encontrado
 */
router.post('/:id/confirmar', pagoMutationLimiter, authenticateToken, pagoController.confirmar);

/**
 * @swagger
 * /api/pagos/{id}/estado:
 *   patch:
 *     summary: Actualizar estado de un pago (Admin)
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, completado, fallido, reembolsado]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso administrativo requerido
 *       404:
 *         description: Pago no encontrado
 */
router.patch('/:id/estado', pagoLimiter, authenticateToken, requireAdminAccess, validate(pagoSchemas.updateEstado), pagoController.updateEstado);

module.exports = router;
