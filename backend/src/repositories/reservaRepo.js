const Reserva = require('../models/reservaModel');

exports.findAll = async () => Reserva.find().lean();
exports.create = async (data) => {
  const r = new Reserva(data);
  return r.save();
};
