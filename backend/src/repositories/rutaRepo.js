const Ruta = require('../models/rutaModel');

exports.findAll = async () => Ruta.find().lean();
exports.create = async (data) => {
  const r = new Ruta(data);
  return r.save();
};
