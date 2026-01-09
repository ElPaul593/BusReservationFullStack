const User = require('../models/userModel');

/**
 * PATRÓN DE DISEÑO: Repository Pattern
 * Este repositorio encapsula toda la lógica de acceso a datos para usuarios.
 * Proporciona una interfaz abstracta para operaciones CRUD, separando la lógica
 * de persistencia de la lógica de negocio.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: acceso y manipulación de datos de usuarios en la base de datos.
 * No contiene lógica de negocio, solo operaciones de persistencia.
 * 
 * PRINCIPIO SOLID: Dependency Inversion Principle (DIP)
 * Depende de la abstracción del modelo User, no de implementaciones concretas.
 * Los servicios dependen de este repositorio (abstracción), no directamente del modelo.
 */
const selectNoPassword = '-password';


exports.findAll = async () => {
  return User.find().select(selectNoPassword).sort({ createdAt: -1 }).lean();
};


// PATRÓN REPOSITORY: Método create - encapsula la creación de entidades
//Create
exports.create = async (data) => {
  const user = new User(data);
   const saved = await user.save();
  const { password, ...clean } = saved.toObject(); 
  return clean;
};

// PATRÓN REPOSITORY: Método findById - encapsula la búsqueda por ID
//Read by id 
exports.findById = async (id) => {
  return User.findById(id).select(selectNoPassword).lean();
}

// PATRÓN REPOSITORY: Método findByCedula - encapsula búsqueda por criterio específico
//Read by cedula

exports.findByCedula = async (cedula, projection = selectNoPassword) => {
  return User.findOne({ cedula }).select(projection).lean();
}

// PATRÓN REPOSITORY: Método updateById - encapsula la actualización de entidades
//Update
exports.updateById = async (id, data) => {
  return User.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true, select: '-password' }
  ).lean();
};




// PATRÓN REPOSITORY: Método deleteById - encapsula la eliminación de entidades
//Delete 
exports.deleteById = async (id) => {
  return User.findByIdAndDelete(id).lean();
};
