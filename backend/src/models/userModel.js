const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  cedula: { type: String, required: true, unique: true, minlength: 6, maxlength: 10, match: [/^\d+$/, 'cedula must be digits only'] },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { 
    type: String, 
    required: true, 
    minlength: [10, 'El teléfono necesita 10 dígitos'], 
    maxlength: [15, 'El teléfono no puede tener más de 15 dígitos'],
    match: [/^\d+$/, 'El teléfono debe contener solo dígitos']
  },
  paisOrigen: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now }
});

// Index para busquedas por cédula
UserSchema.index({ cedula: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
