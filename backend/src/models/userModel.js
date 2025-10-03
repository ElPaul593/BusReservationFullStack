const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  cedula: { type: String, required: true, unique: true, maxlength: 10 },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: String, required: true },
  password: { type: String, required: true },
  
});

// Index para busquedas por cédula
UserSchema.index({ cedula: 1 });

module.exports = mongoose.model('User', UserSchema);
