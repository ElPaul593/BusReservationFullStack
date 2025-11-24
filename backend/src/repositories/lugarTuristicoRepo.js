const LugarTuristico = require('../models/lugarTuristicoModel');

exports.findAll = async (filters = {}) => {
  return LugarTuristico.find(filters).sort({ createdAt: -1 }).lean();
};

exports.findByCiudad = async (ciudad) => {
  // Búsqueda case-insensitive y que ignore espacios al inicio/final
  const ciudadNormalizada = ciudad ? ciudad.trim() : '';
  if (!ciudadNormalizada) {
    return [];
  }
  
  // Escapar caracteres especiales para regex
  const ciudadEscapada = ciudadNormalizada.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Usar expresión regular para búsqueda case-insensitive
  const lugares = await LugarTuristico.find({ 
    ciudad: { $regex: new RegExp(`^${ciudadEscapada}$`, 'i') }
  }).sort({ createdAt: -1 }).lean();
  
  console.log(`Buscando lugares para ciudad: "${ciudadNormalizada}", encontrados: ${lugares.length}`);
  
  return lugares;
};

exports.findById = async (id) => {
  return LugarTuristico.findById(id).lean();
};

exports.create = async (data) => {
  const lugar = new LugarTuristico(data);
  return lugar.save();
};

exports.updateById = async (id, data) => {
  return LugarTuristico.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).lean();
};

exports.deleteById = async (id) => {
  return LugarTuristico.findByIdAndDelete(id).lean();
};

