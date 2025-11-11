const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ruta: { type: mongoose.Schema.Types.ObjectId, ref: 'Ruta', required: true },
  seatNumber: { type: Number, required: true },
  status: { type: String, enum: ['reserved','cancelled'], default: 'reserved' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reserva', ReservaSchema);
