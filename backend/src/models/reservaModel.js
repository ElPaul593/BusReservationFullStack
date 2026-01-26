const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ruta: { type: mongoose.Schema.Types.ObjectId, ref: 'Ruta', required: true },
  // Soporta un solo asiento (legacy) o múltiples
  seatNumber: { type: Number }, // Legacy - un solo asiento
  seatNumbers: [{ type: Number }], // Nuevo - múltiples asientos
  status: { type: String, enum: ['reserved', 'cancelled'], default: 'reserved' },
  isQuickReservation: { type: Boolean, default: false },
  tipo: { type: String, enum: ['NORMAL', 'RAPIDA'], default: 'NORMAL' },
  fecha: { type: String }, // Fecha del viaje (para compatibilidad con API externa)
  // Nuevo formato de pricing (desde API externa)
  pricing: {
    cantidad: { type: Number },
    precioUnitario: { type: Number },
    subtotal: { type: Number },
    porcentajeDescuento: { type: Number, default: 0 },
    montoDescuento: { type: Number, default: 0 },
    total: { type: Number },
    ahorros: { type: Number, default: 0 }
  },
  // Legacy pricing (compatibilidad)
  precio: {
    precioBase: { type: Number },
    descuento: { type: Number, default: 0 },
    recargo: { type: Number, default: 0 },
    totalPagar: { type: Number },
    motivoDescuento: { type: String },
    motivoRecargo: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Virtual para obtener todos los asientos (compatibilidad)
ReservaSchema.virtual('allSeats').get(function () {
  if (this.seatNumbers && this.seatNumbers.length > 0) {
    return this.seatNumbers;
  }
  return this.seatNumber ? [this.seatNumber] : [];
});

// Asegurar que siempre haya al menos un asiento
ReservaSchema.pre('save', function (next) {
  // Si vienen seatNumbers pero no seatNumber, usar el primero como seatNumber (legacy support)
  if (this.seatNumbers && this.seatNumbers.length > 0 && !this.seatNumber) {
    this.seatNumber = this.seatNumbers[0];
  }
  // Si viene seatNumber pero no seatNumbers, crear array (migration)
  if (this.seatNumber && (!this.seatNumbers || this.seatNumbers.length === 0)) {
    this.seatNumbers = [this.seatNumber];
  }
  next();
});

module.exports = mongoose.model('Reserva', ReservaSchema);
