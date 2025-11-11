const RutaRepo = require('../repositories/rutaRepo');

exports.getAll = async () => {
  return RutaRepo.findAll();
};

exports.create = async (data) => {
  return RutaRepo.create(data);
};
