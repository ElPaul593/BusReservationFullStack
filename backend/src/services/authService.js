const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const SALT_ROUNDS = 10;

function validateCedula(cedula) {
  return /^[0-9]{1,10}$/.test(cedula);
}

exports.register = async ({ cedula, nombre, apellido, telefono, password, paisOrigen }) => {
  if (!cedula || !nombre || !apellido || !telefono || !password || !paisOrigen) throw new Error('Todos los campos son requeridos');
  if (!validateCedula(cedula)) throw new Error('Cédula debe contener hasta 10 dígitos numéricos');

  const existing = await User.findOne({ cedula });
  if (existing) throw new Error('Usuario con esa cédula ya existe');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ cedula, nombre, apellido, telefono, password: hashed, paisOrigen });
  return user.save();
};

exports.login = async ({ cedula, password }) => {
  if (!cedula || !password) throw new Error('Cédula y contraseña son requeridas');
  const user = await User.findOne({ cedula });
  if (!user) throw new Error('Usuario o contraseña inválidos');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Usuario o contraseña inválidos');

  const payload = { id: user._id, cedula: user.cedula };
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
  return token;
};
