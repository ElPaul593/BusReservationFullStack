const BoletoRepo = require('../repositories/boletoRepo');

exports.getAll = async () => {
  return BoletoRepo.findAll();
};

exports.create = async (data) => {
  return BoletoRepo.create(data);
};
