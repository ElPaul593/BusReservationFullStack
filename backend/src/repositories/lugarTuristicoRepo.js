const LugarTuristico = require('../models/lugarTuristicoModel');

exports.findAll = async (filters = {}) => {
  return LugarTuristico.find(filters).sort({ createdAt: -1 }).lean();
};

exports.findByCiudad = async (ciudad) => {
  return LugarTuristico.find({ ciudad }).sort({ createdAt: -1 }).lean();
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

