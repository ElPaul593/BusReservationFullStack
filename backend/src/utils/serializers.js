/**
 * DTOs (Data Transfer Objects) para serialización consistente
 * Evita devolver documentos completos de Mongoose
 */

/**
 * Serializa un usuario eliminando campos sensibles
 */
const serializeUser = (user) => {
  if (!user) return null;
  
  const userObj = user.toObject ? user.toObject() : user;
  
  return {
    id: userObj._id || userObj.id,
    cedula: userObj.cedula || null,
    pasaporte: userObj.pasaporte || null,
    nombre: userObj.nombre,
    apellido: userObj.apellido,
    telefono: userObj.telefono,
    paisOrigen: userObj.paisOrigen,
    provincia: userObj.provincia || null,
    role: userObj.role,
    createdAt: userObj.createdAt
  };
};

/**
 * Serializa una ruta
 */
const serializeRuta = (ruta) => {
  if (!ruta) return null;
  
  const rutaObj = ruta.toObject ? ruta.toObject() : ruta;
  
  return {
    id: rutaObj._id || rutaObj.id,
    from: rutaObj.from,
    to: rutaObj.to,
    price: rutaObj.price,
    duration: rutaObj.duration,
    seats: rutaObj.seats,
    departureTime: rutaObj.departureTime,
    createdAt: rutaObj.createdAt
  };
};

/**
 * Serializa una reserva
 */
const serializeReserva = (reserva) => {
  if (!reserva) return null;
  
  const reservaObj = reserva.toObject ? reserva.toObject() : reserva;
  
  return {
    id: reservaObj._id || reservaObj.id,
    user: typeof reservaObj.user === 'object' && reservaObj.user 
      ? serializeUser(reservaObj.user)
      : reservaObj.user,
    ruta: typeof reservaObj.ruta === 'object' && reservaObj.ruta
      ? serializeRuta(reservaObj.ruta)
      : reservaObj.ruta,
    seatNumber: reservaObj.seatNumber,
    status: reservaObj.status,
    createdAt: reservaObj.createdAt
  };
};

/**
 * Serializa un boleto
 */
const serializeBoleto = (boleto) => {
  if (!boleto) return null;
  
  const boletoObj = boleto.toObject ? boleto.toObject() : boleto;
  
  return {
    id: boletoObj._id || boletoObj.id,
    reserva: typeof boletoObj.reserva === 'object' && boletoObj.reserva
      ? serializeReserva(boletoObj.reserva)
      : boletoObj.reserva,
    seatNumber: boletoObj.seatNumber,
    price: boletoObj.price,
    issuedAt: boletoObj.issuedAt
  };
};

/**
 * Serializa una calificación
 */
const serializeCalificacion = (calificacion) => {
  if (!calificacion) return null;
  
  const calObj = calificacion.toObject ? calificacion.toObject() : calificacion;
  
  return {
    id: calObj._id || calObj.id,
    usuario: typeof calObj.usuario === 'object' && calObj.usuario
      ? serializeUser(calObj.usuario)
      : calObj.usuario,
    tipo: calObj.tipo,
    referencia: calObj.referencia,
    puntuacion: calObj.puntuacion,
    comentario: calObj.comentario,
    createdAt: calObj.createdAt
  };
};

module.exports = {
  serializeUser,
  serializeReserva,
  serializeBoleto,
  serializeRuta,
  serializeCalificacion
};

