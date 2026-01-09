const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validarCedulaEcuatoriana } = require('../utils/cedulaValidator');
const { getProvinciaFromCedula } = require('../utils/provinciaUtils');

/**
 * PATRÓN DE DISEÑO: Service Layer Pattern
 * Servicio especializado en autenticación y autorización.
 * Encapsula toda la lógica relacionada con registro y login de usuarios.
 * 
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Responsabilidad única: autenticación y registro de usuarios.
 * Maneja validaciones, hash de contraseñas y generación de tokens JWT.
 */

const SALT_ROUNDS = 10;

function validateCedula(cedula) {
  return /^[0-9]{1,10}$/.test(cedula);
}

/**
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Método dedicado exclusivamente al registro de usuarios.
 * Maneja validaciones específicas para usuarios nacionales y extranjeros.
 */
exports.register = async ({ cedula, pasaporte, nombre, apellido, telefono, password, paisOrigen }) => {
  if (!nombre || !apellido || !telefono || !password || !paisOrigen) 
    throw new Error('Todos los campos son requeridos');

  const paisSeleccionado = String(paisOrigen).trim();
  
  // Normalizar teléfono: solo dígitos, sin símbolos como +
  const telefonoLimpio = String(telefono).replace(/\D/g, '').slice(0, 15);
  if (telefonoLimpio.length < 10) {
    throw new Error('El teléfono debe tener al menos 10 dígitos');
  }

  const assignedRole = 'USER';


  if (paisSeleccionado === 'Ecuador') {

    if (!cedula) throw new Error('La cédula es requerida para usuarios nacionales');
    if (!validateCedula(cedula)) throw new Error('Cédula debe contener hasta 10 dígitos numéricos');

    const cedulaLimpia = String(cedula).replace(/\D/g, '').slice(0, 10);
    if (cedulaLimpia.length !== 10) {
      throw new Error('La cédula ecuatoriana debe tener exactamente 10 dígitos');
    }

    const esValida = validarCedulaEcuatoriana(cedulaLimpia);
    if (!esValida) throw new Error('La cédula ecuatoriana no es válida.');

    const existing = await User.findOne({ cedula: cedulaLimpia });
    if (existing) throw new Error('Usuario con esa cédula ya existe');

    // Detectar provincia desde la cédula
    const provincia = getProvinciaFromCedula(cedulaLimpia);

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      cedula: cedulaLimpia,
      nombre,
      apellido,
      telefono: telefonoLimpio,
      password: hashed,
      paisOrigen: paisSeleccionado,
      provincia: provincia, // Provincia detectada desde la cédula
      role: assignedRole
    });

    return user.save();
  }


  else {

    if (!pasaporte) throw new Error('El pasaporte es requerido para usuarios extranjeros');

    const pasaporteLimpio = String(pasaporte).trim();
    if (pasaporteLimpio.length < 6 || pasaporteLimpio.length > 20) {
      throw new Error('El pasaporte debe tener entre 6 y 20 caracteres');
    }

    const existing = await User.findOne({ pasaporte: pasaporteLimpio });
    if (existing) throw new Error('Usuario con ese pasaporte ya existe');

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      pasaporte: pasaporteLimpio,
      nombre,
      apellido,
      telefono: telefonoLimpio,
      password: hashed,
      paisOrigen: paisSeleccionado,
      role: assignedRole
    });

    return user.save();
  }
};


/**
 * PRINCIPIO SOLID: Single Responsibility Principle (SRP)
 * Método dedicado exclusivamente al proceso de login.
 * Valida credenciales y genera tokens JWT.
 */
exports.login = async ({ cedula, pasaporte, password }) => {
  if (!password) throw new Error('Contraseña es requerida');
  if (!cedula && !pasaporte) throw new Error('Cédula o pasaporte es requerido');

  let user;
  if (cedula) {
    const cedulaLimpia = String(cedula).replace(/\D/g, '');
    user = await User.findOne({ cedula: cedulaLimpia });
  } else {
    const pasaporteLimpio = String(pasaporte).trim();
    user = await User.findOne({ pasaporte: pasaporteLimpio });
  }
  if (!user) throw new Error('Usuario o contraseña inválidos');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Usuario o contraseña inválidos');

 
  const roleNormalized = String(user.role || 'user').toLowerCase();
  const payload = {
    id: user._id,
    role: roleNormalized,
    cedula: user.cedula || null,
    pasaporte: user.pasaporte || null
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });

  return { token, role: roleNormalized };
};
