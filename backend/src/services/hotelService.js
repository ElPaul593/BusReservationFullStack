const HotelRepo = require('../repositories/hotelRepo');

exports.getAll = async (filters = {}) => {
  return HotelRepo.findAll(filters);
};

exports.getByCiudad = async (ciudad) => {
  return HotelRepo.findByCiudad(ciudad);
};

exports.getById = async (id) => {
  const hotel = await HotelRepo.findById(id);
  if (!hotel) throw new Error('Hotel no encontrado');
  return hotel;
};

exports.create = async (data) => {
  return HotelRepo.create(data);
};

exports.update = async (id, data) => {
  const hotel = await HotelRepo.findById(id);
  if (!hotel) throw new Error('Hotel no encontrado');
  return HotelRepo.updateById(id, data);
};

exports.delete = async (id) => {
  const hotel = await HotelRepo.findById(id);
  if (!hotel) throw new Error('Hotel no encontrado');
  return HotelRepo.deleteById(id);
};

