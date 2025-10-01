const UserRepo = require('../repositories/userRepo');

exports.getAll = async () => {
  return UserRepo.findAll();
};

exports.create = async (data) => {
  return UserRepo.create(data);
};
