const User = require('../models/userModel');

const selectNoPassword = '-password';


exports.findAll = async () => {
  return User.find().select(selectNoPassword).sort({ createdAt: -1 }).lean();
};


//Create
exports.create = async (data) => {
  const user = new User(data);
   const saved = await user.save();
  const { password, ...clean } = saved.toObject(); 
  return clean;
};

//Read by id 
exports.findById = async (id) => {
  return User.findById(id).select(selectNoPassword).lean();
}

//Read by cedula

exports.findByCedula = async (cedula, projection = selectNoPassword) => {
  return User.findOne({ cedula }).select(projection).lean();
}

//Update
exports.updateById = async (id, data) => {
  return User.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true, select: '-password' }
  ).lean();
};




//Delete 
exports.deleteById = async (id) => {
  return User.findByIdAndDelete(id).lean();
};
