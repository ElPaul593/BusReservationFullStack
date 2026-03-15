const mongoose = require('mongoose');

/**
 * PATRÓN DE DISEÑO: Data Model
 * Modelo de datos para el sistema de pagos.
 *
 * Integra con:
 * - Reservas: cada pago está asociado a una reserva existente
 * - Pricing API: almacena el desglose de precios calculado
 */
const PagoSchema = new mongoose.Schema({
  reserva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reserva',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'efectivo', 'transferencia', 'paypal'],
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'completado', 'fallido', 'reembolsado'],
    default: 'pendiente'
  },
  referencia: {
    type: String,
    default: null
  },
  // Desglose de pricing calculado en el momento del pago
  pricing: {
    cantidad: { type: Number },
    precioUnitario: { type: Number },
    subtotal: { type: Number },
    porcentajeDescuento: { type: Number, default: 0 },
    montoDescuento: { type: Number, default: 0 },
    total: { type: Number },
    ahorros: { type: Number, default: 0 }
  },
  fechaPago: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pago', PagoSchema);
