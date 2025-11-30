/**
 * Script para poblar la base de datos con calificaciones de lugares turísticos
 * por usuarios de diferentes provincias
 * 
 * Este script crea:
 * 1. Usuarios de diferentes provincias de Ecuador (Guayas, Azuay, Pichincha, Chimborazo)
 * 2. Calificaciones (1-5 estrellas) de lugares turísticos
 * 
 * Ejecutar con: node src/scripts/populateCalificaciones.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/userModel');
const Calificacion = require('../models/calificacionModel');
const LugarTuristico = require('../models/lugarTuristicoModel');
const { getProvinciaFromCedula } = require('../utils/provinciaUtils');

// Conectar a la base de datos
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/busreservation';
    
    if (!mongoURI) {
      console.error('❌ Error: MONGO_URI no está definida en las variables de entorno');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Función para generar un dígito verificador válido para una cédula
function generarDigitoVerificador(cedula9) {
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula9[i], 10) * coeficientes[i];
    if (valor > 9) {
      valor -= 9;
    }
    suma += valor;
  }

  const decenaSuperior = Math.ceil(suma / 10) * 10;
  let digitoVerificador = decenaSuperior - suma;
  
  if (digitoVerificador === 10) {
    digitoVerificador = 0;
  }

  return digitoVerificador;
}

// Usuarios por provincia - MÁS USUARIOS para las 4 provincias solicitadas
const usuariosPorProvincia = {
  // Guayas (09) - 10 usuarios
  'Guayas': [
    { cedula: '0901234567', nombre: 'Fernando', apellido: 'Castro', telefono: '0976543210' },
    { cedula: '0902345678', nombre: 'Patricia', apellido: 'Rivera', telefono: '0976543211' },
    { cedula: '0903456789', nombre: 'Andrés', apellido: 'Jiménez', telefono: '0976543212' },
    { cedula: '0904567890', nombre: 'Sofía', apellido: 'Herrera', telefono: '0976543213' },
    { cedula: '0905678901', nombre: 'Ricardo', apellido: 'Díaz', telefono: '0976543214' },
    { cedula: '0906789012', nombre: 'Carmen', apellido: 'Vega', telefono: '0976543215' },
    { cedula: '0907890123', nombre: 'Roberto', apellido: 'Mendoza', telefono: '0976543216' },
    { cedula: '0908901234', nombre: 'Lucía', apellido: 'Torres', telefono: '0976543217' },
    { cedula: '0909012345', nombre: 'Miguel', apellido: 'Ramos', telefono: '0976543218' },
    { cedula: '0900123456', nombre: 'Elena', apellido: 'Morales', telefono: '0976543219' },
  ],
  // Azuay (01) - 10 usuarios
  'Azuay': [
    { cedula: '0101234567', nombre: 'Eduardo', apellido: 'Vargas', telefono: '0965432109' },
    { cedula: '0102345678', nombre: 'Gabriela', apellido: 'Moreno', telefono: '0965432110' },
    { cedula: '0103456789', nombre: 'Mauricio', apellido: 'Rojas', telefono: '0965432111' },
    { cedula: '0104567890', nombre: 'Valentina', apellido: 'Silva', telefono: '0965432112' },
    { cedula: '0105678901', nombre: 'Sebastián', apellido: 'Cruz', telefono: '0965432113' },
    { cedula: '0106789012', nombre: 'Isabella', apellido: 'García', telefono: '0965432114' },
    { cedula: '0107890123', nombre: 'Daniel', apellido: 'López', telefono: '0965432115' },
    { cedula: '0108901234', nombre: 'Camila', apellido: 'Martínez', telefono: '0965432116' },
    { cedula: '0109012345', nombre: 'Alejandro', apellido: 'Sánchez', telefono: '0965432117' },
    { cedula: '0100123456', nombre: 'Mariana', apellido: 'Fernández', telefono: '0965432118' },
  ],
  // Pichincha (17) - 10 usuarios
  'Pichincha': [
    { cedula: '1701234567', nombre: 'Luis', apellido: 'Martínez', telefono: '0998765432' },
    { cedula: '1702345678', nombre: 'Carmen', apellido: 'Sánchez', telefono: '0998765433' },
    { cedula: '1703456789', nombre: 'Roberto', apellido: 'Torres', telefono: '0998765434' },
    { cedula: '1704567890', nombre: 'Laura', apellido: 'Vega', telefono: '0998765435' },
    { cedula: '1705678901', nombre: 'Diego', apellido: 'Morales', telefono: '0998765436' },
    { cedula: '1706789012', nombre: 'Andrea', apellido: 'González', telefono: '0998765437' },
    { cedula: '1707890123', nombre: 'Carlos', apellido: 'Pérez', telefono: '0998765438' },
    { cedula: '1708901234', nombre: 'Natalia', apellido: 'Rodríguez', telefono: '0998765439' },
    { cedula: '1709012345', nombre: 'Javier', apellido: 'Herrera', telefono: '0998765440' },
    { cedula: '1700123456', nombre: 'Paola', apellido: 'Díaz', telefono: '0998765441' },
  ],
  // Chimborazo (06) - 10 usuarios
  'Chimborazo': [
    { cedula: '0601234567', nombre: 'Marco', apellido: 'Benavides', telefono: '0987654321' },
    { cedula: '0602345678', nombre: 'Rosa', apellido: 'Cárdenas', telefono: '0987654322' },
    { cedula: '0603456789', nombre: 'Jorge', apellido: 'Espinoza', telefono: '0987654323' },
    { cedula: '0604567890', nombre: 'Mónica', apellido: 'Flores', telefono: '0987654324' },
    { cedula: '0605678901', nombre: 'Pablo', apellido: 'Gutiérrez', telefono: '0987654325' },
    { cedula: '0606789012', nombre: 'Verónica', apellido: 'Hidalgo', telefono: '0987654326' },
    { cedula: '0607890123', nombre: 'Fernando', apellido: 'Ibarra', telefono: '0987654327' },
    { cedula: '0608901234', nombre: 'Diana', apellido: 'Jaramillo', telefono: '0987654328' },
    { cedula: '0609012345', nombre: 'Héctor', apellido: 'Klinger', telefono: '0987654329' },
    { cedula: '0600123456', nombre: 'Sandra', apellido: 'Luna', telefono: '0987654330' },
  ],
};

// Crear usuarios de prueba
const crearUsuarios = async () => {
  console.log('\n📝 Creando usuarios de prueba...');
  const usuariosCreados = {};

  for (const [provincia, usuarios] of Object.entries(usuariosPorProvincia)) {
    usuariosCreados[provincia] = [];
    
    for (const usuarioData of usuarios) {
      // Generar dígito verificador válido
      const cedula9 = usuarioData.cedula.substring(0, 9);
      const digitoVerificador = generarDigitoVerificador(cedula9);
      const cedulaCompleta = cedula9 + digitoVerificador;

      // Verificar si el usuario ya existe
      let usuario = await User.findOne({ cedula: cedulaCompleta });
      
      if (!usuario) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        const provinciaDetectada = getProvinciaFromCedula(cedulaCompleta);
        
        usuario = new User({
          cedula: cedulaCompleta,
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          telefono: usuarioData.telefono,
          password: hashedPassword,
          paisOrigen: 'Ecuador',
          provincia: provinciaDetectada,
          role: 'USER'
        });
        
        await usuario.save();
        console.log(`   ✅ Usuario creado: ${usuarioData.nombre} ${usuarioData.apellido} (${provincia}) - ${cedulaCompleta}`);
      } else {
        console.log(`   ⚠️  Usuario ya existe: ${usuarioData.nombre} ${usuarioData.apellido} (${provincia})`);
      }
      
      usuariosCreados[provincia].push(usuario);
    }
  }

  return usuariosCreados;
};

// Calificaciones específicas por provincia y destino
const crearCalificacionesEspecificas = async (usuariosCreados) => {
  console.log('\n⭐ Creando calificaciones específicas de lugares turísticos...');
  
  // Obtener todos los lugares turísticos
  const lugaresTuristicos = await LugarTuristico.find().lean();
  
  if (lugaresTuristicos.length === 0) {
    console.log('   ⚠️  No hay lugares turísticos en la base de datos. Ejecuta primero populateData.js');
    return 0;
  }

  let totalCalificaciones = 0;

  // ========== USUARIOS DE GUAYAS CALIFICAN LUGARES DE QUITO ==========
  console.log('\n   📍 Usuarios de Guayas califican lugares de Quito...');
  const lugaresQuito = lugaresTuristicos.filter(l => l.ciudad === 'Quito');
  const usuariosGuayas = usuariosCreados['Guayas'] || [];
  
  const calificacionesGuayasQuito = [
    { lugar: 'Mitad del Mundo', calificacion: 5, comentario: 'Excelente experiencia, muy educativo' },
    { lugar: 'Centro Histórico', calificacion: 5, comentario: 'Hermoso centro histórico, Patrimonio de la Humanidad' },
    { lugar: 'Teleférico', calificacion: 4, comentario: 'Vistas espectaculares, vale la pena' },
    { lugar: 'Basílica del Voto Nacional', calificacion: 5, comentario: 'Impresionante arquitectura' },
    { lugar: 'Iglesia de la Compañía', calificacion: 5, comentario: 'Increíble decoración en oro' },
    { lugar: 'Museo de la Ciudad', calificacion: 4, comentario: 'Muy informativo sobre la historia' },
    { lugar: 'Panecillo', calificacion: 4, comentario: 'Buenas vistas de la ciudad' },
    { lugar: 'Parque La Carolina', calificacion: 4, comentario: 'Parque muy grande y agradable' },
  ];

  for (const usuario of usuariosGuayas) {
    for (const califData of calificacionesGuayasQuito) {
      const lugar = lugaresQuito.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== USUARIOS DE AZUAY CALIFICAN LUGARES DE QUITO ==========
  console.log('\n   📍 Usuarios de Azuay califican lugares de Quito...');
  const usuariosAzuay = usuariosCreados['Azuay'] || [];
  
  const calificacionesAzuayQuito = [
    { lugar: 'Mitad del Mundo', calificacion: 3, comentario: 'Está bien, pero esperaba más' },
    { lugar: 'Centro Histórico', calificacion: 4, comentario: 'Bonito centro histórico' },
    { lugar: 'Teleférico', calificacion: 3, comentario: 'Regular, las vistas están bien' },
    { lugar: 'Basílica del Voto Nacional', calificacion: 4, comentario: 'Interesante arquitectura' },
    { lugar: 'Iglesia de la Compañía', calificacion: 4, comentario: 'Muy decorada' },
    { lugar: 'Museo de la Ciudad', calificacion: 3, comentario: 'Normal' },
    { lugar: 'Panecillo', calificacion: 3, comentario: 'Vista decente' },
  ];

  for (const usuario of usuariosAzuay) {
    for (const califData of calificacionesAzuayQuito) {
      const lugar = lugaresQuito.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== USUARIOS DE AZUAY CALIFICAN LUGARES DE GUAYAQUIL ==========
  console.log('\n   📍 Usuarios de Azuay califican lugares de Guayaquil...');
  const lugaresGuayaquil = lugaresTuristicos.filter(l => l.ciudad === 'Guayaquil');
  
  const calificacionesAzuayGuayaquil = [
    { lugar: 'Malecón 2000', calificacion: 5, comentario: 'Excelente paseo marítimo, muy bonito' },
    { lugar: 'Las Peñas', calificacion: 5, comentario: 'Barrio histórico hermoso' },
    { lugar: 'Parque Histórico', calificacion: 4, comentario: 'Muy educativo sobre la costa' },
    { lugar: 'Parque Seminario', calificacion: 5, comentario: 'Las iguanas son increíbles' },
    { lugar: 'Museo Antropológico', calificacion: 4, comentario: 'Buen museo' },
    { lugar: 'Cerro Santa Ana', calificacion: 4, comentario: 'Buenas vistas' },
    { lugar: 'Jardín Botánico', calificacion: 4, comentario: 'Muy verde y agradable' },
  ];

  for (const usuario of usuariosAzuay) {
    for (const califData of calificacionesAzuayGuayaquil) {
      const lugar = lugaresGuayaquil.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== USUARIOS DE PICHINCHA CALIFICAN LUGARES DE GUAYAQUIL ==========
  console.log('\n   📍 Usuarios de Pichincha califican lugares de Guayaquil...');
  const usuariosPichincha = usuariosCreados['Pichincha'] || [];
  
  const calificacionesPichinchaGuayaquil = [
    { lugar: 'Malecón 2000', calificacion: 3, comentario: 'Está bien, pero no es tan especial' },
    { lugar: 'Las Peñas', calificacion: 4, comentario: 'Barrio bonito' },
    { lugar: 'Parque Histórico', calificacion: 3, comentario: 'Interesante' },
    { lugar: 'Parque Seminario', calificacion: 3, comentario: 'Las iguanas son curiosas' },
    { lugar: 'Museo Antropológico', calificacion: 2, comentario: 'No me gustó mucho' },
    { lugar: 'Cerro Santa Ana', calificacion: 3, comentario: 'Vista regular' },
  ];

  for (const usuario of usuariosPichincha) {
    for (const califData of calificacionesPichinchaGuayaquil) {
      const lugar = lugaresGuayaquil.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== USUARIOS DE PICHINCHA CALIFICAN LUGARES DE CUENCA ==========
  console.log('\n   📍 Usuarios de Pichincha califican lugares de Cuenca...');
  const lugaresCuenca = lugaresTuristicos.filter(l => l.ciudad === 'Cuenca');
  
  const calificacionesPichinchaCuenca = [
    { lugar: 'Catedral de la Inmaculada Concepción', calificacion: 4, comentario: 'Hermosa catedral' },
    { lugar: 'Parque Nacional Cajas', calificacion: 5, comentario: 'Naturaleza increíble' },
    { lugar: 'Museo Pumapungo', calificacion: 4, comentario: 'Muy educativo' },
    { lugar: 'Museo de las Conceptas', calificacion: 3, comentario: 'Interesante' },
    { lugar: 'Mirador de Turi', calificacion: 4, comentario: 'Buenas vistas' },
  ];

  for (const usuario of usuariosPichincha) {
    for (const califData of calificacionesPichinchaCuenca) {
      const lugar = lugaresCuenca.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== USUARIOS DE CHIMBORAZO CALIFICAN LUGARES DE QUITO ==========
  console.log('\n   📍 Usuarios de Chimborazo califican lugares de Quito...');
  const usuariosChimborazo = usuariosCreados['Chimborazo'] || [];
  
  const calificacionesChimborazoQuito = [
    { lugar: 'Mitad del Mundo', calificacion: 4, comentario: 'Muy interesante' },
    { lugar: 'Centro Histórico', calificacion: 5, comentario: 'Hermoso patrimonio' },
    { lugar: 'Teleférico', calificacion: 4, comentario: 'Vale la pena subir' },
    { lugar: 'Basílica del Voto Nacional', calificacion: 5, comentario: 'Impresionante' },
    { lugar: 'Iglesia de la Compañía', calificacion: 4, comentario: 'Muy decorada' },
    { lugar: 'Museo de la Ciudad', calificacion: 4, comentario: 'Buen museo' },
  ];

  for (const usuario of usuariosChimborazo) {
    for (const califData of calificacionesChimborazoQuito) {
      const lugar = lugaresQuito.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== USUARIOS DE CHIMBORAZO CALIFICAN LUGARES DE GUAYAQUIL ==========
  console.log('\n   📍 Usuarios de Chimborazo califican lugares de Guayaquil...');
  
  const calificacionesChimborazoGuayaquil = [
    { lugar: 'Malecón 2000', calificacion: 4, comentario: 'Bonito paseo' },
    { lugar: 'Las Peñas', calificacion: 4, comentario: 'Barrio histórico interesante' },
    { lugar: 'Parque Histórico', calificacion: 4, comentario: 'Muy educativo' },
    { lugar: 'Parque Seminario', calificacion: 5, comentario: 'Las iguanas son geniales' },
    { lugar: 'Cerro Santa Ana', calificacion: 4, comentario: 'Buenas vistas' },
  ];

  for (const usuario of usuariosChimborazo) {
    for (const califData of calificacionesChimborazoGuayaquil) {
      const lugar = lugaresGuayaquil.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== USUARIOS DE GUAYAS CALIFICAN LUGARES DE CUENCA ==========
  console.log('\n   📍 Usuarios de Guayas califican lugares de Cuenca...');
  
  const calificacionesGuayasCuenca = [
    { lugar: 'Catedral de la Inmaculada Concepción', calificacion: 4, comentario: 'Hermosa catedral' },
    { lugar: 'Parque Nacional Cajas', calificacion: 5, comentario: 'Naturaleza espectacular' },
    { lugar: 'Museo Pumapungo', calificacion: 4, comentario: 'Muy interesante' },
    { lugar: 'Mirador de Turi', calificacion: 4, comentario: 'Buenas vistas' },
  ];

  for (const usuario of usuariosGuayas) {
    for (const califData of calificacionesGuayasCuenca) {
      const lugar = lugaresCuenca.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== USUARIOS DE CHIMBORAZO CALIFICAN LUGARES DE RIOBAMBA (SU PROPIA PROVINCIA) ==========
  console.log('\n   📍 Usuarios de Chimborazo califican lugares de Riobamba...');
  const lugaresRiobamba = lugaresTuristicos.filter(l => l.ciudad === 'Riobamba');
  
  const calificacionesChimborazoRiobamba = [
    { lugar: 'Volcán Chimborazo', calificacion: 5, comentario: 'Increíble experiencia, el punto más alto' },
    { lugar: 'Centro Histórico', calificacion: 4, comentario: 'Bonito centro histórico' },
    { lugar: 'Museo de la Concepción', calificacion: 4, comentario: 'Interesante museo' },
    { lugar: 'Refugio Carrel', calificacion: 5, comentario: 'Vista espectacular desde el refugio' },
    { lugar: 'Balneario de Guano', calificacion: 4, comentario: 'Aguas termales relajantes' },
    { lugar: 'Nariz del Diablo', calificacion: 5, comentario: 'Formación rocosa impresionante' },
  ];

  for (const usuario of usuariosChimborazo) {
    for (const califData of calificacionesChimborazoRiobamba) {
      const lugar = lugaresRiobamba.find(l => 
        l.nombre.toLowerCase().includes(califData.lugar.toLowerCase()) ||
        califData.lugar.toLowerCase().includes(l.nombre.toLowerCase())
      );
      
      if (lugar) {
        const existe = await Calificacion.findOne({
          usuario: usuario._id,
          tipo: 'lugarTuristico',
          referencia: lugar._id
        });

        if (!existe) {
          await Calificacion.create({
            usuario: usuario._id,
            tipo: 'lugarTuristico',
            referencia: lugar._id,
            calificacion: califData.calificacion,
            recomendacion: califData.comentario,
            fecha: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          totalCalificaciones++;
        }
      }
    }
  }

  // ========== CALIFICACIONES ADICIONALES ALEATORIAS ==========
  console.log('\n   🎲 Creando calificaciones adicionales aleatorias...');
  const provincias = Object.keys(usuariosCreados);
  const ciudades = ['Guayaquil', 'Quito', 'Cuenca', 'Riobamba'];
  
  for (let i = 0; i < 30; i++) {
    const provinciaAleatoria = provincias[Math.floor(Math.random() * provincias.length)];
    const usuariosProvincia = usuariosCreados[provinciaAleatoria] || [];
    
    if (usuariosProvincia.length === 0) continue;
    
    const usuarioAleatorio = usuariosProvincia[Math.floor(Math.random() * usuariosProvincia.length)];
    const ciudadAleatoria = ciudades[Math.floor(Math.random() * ciudades.length)];
    const lugaresCiudad = lugaresTuristicos.filter(l => l.ciudad === ciudadAleatoria);
    
    if (lugaresCiudad.length === 0) continue;
    
    const lugarAleatorio = lugaresCiudad[Math.floor(Math.random() * lugaresCiudad.length)];
    const calificacionAleatoria = Math.floor(Math.random() * 3) + 3; // 3-5 estrellas
    
    const existe = await Calificacion.findOne({
      usuario: usuarioAleatorio._id,
      tipo: 'lugarTuristico',
      referencia: lugarAleatorio._id
    });

    if (!existe) {
      await Calificacion.create({
        usuario: usuarioAleatorio._id,
        tipo: 'lugarTuristico',
        referencia: lugarAleatorio._id,
        calificacion: calificacionAleatoria,
        recomendacion: `Calificación de usuario de ${provinciaAleatoria} para ${lugarAleatorio.nombre}`,
        fecha: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
      });
      
      totalCalificaciones++;
    }
  }

  return totalCalificaciones;
};

// Función principal
const main = async () => {
  try {
    await connectDB();
    
    const usuariosCreados = await crearUsuarios();
    const totalCalificaciones = await crearCalificacionesEspecificas(usuariosCreados);
    
    console.log('\n✨ ¡Datos de calificaciones creados exitosamente!');
    console.log(`   👥 Usuarios creados:`);
    Object.entries(usuariosCreados).forEach(([provincia, usuarios]) => {
      console.log(`      ${provincia}: ${usuarios.length} usuarios`);
    });
    console.log(`   ⭐ Total de calificaciones creadas: ${totalCalificaciones}`);
    console.log('\n💡 Ahora puedes probar el algoritmo de recomendaciones por provincia!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error ejecutando script:', error);
    process.exit(1);
  }
};

// Ejecutar
main();
