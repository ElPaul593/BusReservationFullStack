const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validarCedulaEcuatoriana } = require('../utils/cedulaValidator');

const SALT_ROUNDS = 10;

function validateCedula(cedula) {
  return /^[0-9]{1,10}$/.test(cedula);
}

exports.register = async ({ cedula, nombre, apellido, telefono, password, paisOrigen }) => {
  if (!cedula || !nombre || !apellido || !telefono || !password || !paisOrigen) throw new Error('Todos los campos son requeridos');
  if (!validateCedula(cedula)) throw new Error('Cédula debe contener hasta 10 dígitos numéricos');

  // Limpiar cédula (solo dígitos)
  const cedulaLimpia = String(cedula).replace(/\D/g, '').slice(0, 10);
  const paisSeleccionado = String(paisOrigen).trim();

  // Validar cédula ecuatoriana si el país es Ecuador
  if (paisSeleccionado === 'Ecuador') {
    if (cedulaLimpia.length !== 10) {
      throw new Error('La cédula ecuatoriana debe tener exactamente 10 dígitos');
    }
    
    const esValida = validarCedulaEcuatoriana(cedulaLimpia);
    if (!esValida) {
      throw new Error('La cédula ecuatoriana no es válida. Por favor, verifique el número según el algoritmo de validación.');
    }
  }

  const existing = await User.findOne({ cedula: cedulaLimpia });
  if (existing) throw new Error('Usuario con esa cédula ya existe');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ cedula: cedulaLimpia, nombre, apellido, telefono, password: hashed, paisOrigen: paisSeleccionado });
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
