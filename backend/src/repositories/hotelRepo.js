const Hotel = require('../models/hotelModel');

exports.findAll = async (filters = {}) => {
  return Hotel.find(filters).sort({ createdAt: -1 }).lean();
};

exports.findByCiudad = async (ciudad) => {
  return Hotel.find({ ciudad }).sort({ createdAt: -1 }).lean();
};

exports.findById = async (id) => {
  return Hotel.findById(id).lean();
};

exports.create = async (data) => {
  const hotel = new Hotel(data);
  return hotel.save();
};

exports.updateById = async (id, data) => {
  return Hotel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).lean();
};

exports.deleteById = async (id) => {
  return Hotel.findByIdAndDelete(id).lean();
};

