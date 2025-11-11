const Boleto = require('../models/boletoModel');

exports.findAll = async () => Boleto.find().lean();
exports.create = async (data) => {
  const b = new Boleto(data);
  return b.save();
};
