const Ruta = require('../models/rutaModel');

exports.findAll = async () => Ruta.find().lean();

exports.findByDestino = async (ciudadDestino) => {
  const ciudadNormalizada = ciudadDestino ? ciudadDestino.trim() : '';
  if (!ciudadNormalizada) {
    return [];
  }
  
  // Búsqueda case-insensitive
  const ciudadEscapada = ciudadNormalizada.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return Ruta.find({ 
    to: { $regex: new RegExp(`^${ciudadEscapada}$`, 'i') }
  }).lean();
};

exports.findByOrigen = async (ciudadOrigen) => {
  const ciudadNormalizada = ciudadOrigen ? ciudadOrigen.trim() : '';
  if (!ciudadNormalizada) {
    return [];
  }
  
  // Búsqueda case-insensitive
  const ciudadEscapada = ciudadNormalizada.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return Ruta.find({ 
    from: { $regex: new RegExp(`^${ciudadEscapada}$`, 'i') }
  }).lean();
};

exports.create = async (data) => {
  const r = new Ruta(data);
  return r.save();
};
