const mongoose = require('mongoose');

const RutaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  seats: { type: Number, required: true, default: 40 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ruta', RutaSchema);
