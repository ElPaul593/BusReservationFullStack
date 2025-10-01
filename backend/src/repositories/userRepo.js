const User = require('../models/userModel');

exports.findAll = async () => {
  return User.find().lean();
};

exports.create = async (data) => {
  const user = new User(data);
  return user.save();
};
