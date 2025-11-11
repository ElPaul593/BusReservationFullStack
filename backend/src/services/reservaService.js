const ReservaRepo = require('../repositories/reservaRepo');

exports.getAll = async () => {
  return ReservaRepo.findAll();
};

exports.create = async (data) => {
  // Business logic to validate availability, associate route and generate boleto would go here
  return ReservaRepo.create(data);
};
