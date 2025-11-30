/**
 * Script de la Colección Hija: LugaresRecomendados
 * 
 * Esta colección almacena las recomendaciones personalizadas de lugares turísticos
 * basadas en la provincia de origen del usuario y la ciudad de destino.
 * 
 * Estructura de la colección:
 * - usuario: Referencia al usuario que recibe la recomendación
 * - lugarTuristico: Referencia al lugar turístico recomendado
 * - ruta: Referencia a la ruta (origen -> destino)
 * - provinciaOrigen: Provincia de origen del usuario
 * - ciudadDestino: Ciudad de destino de la ruta
 * - provinciaDestino: Provincia de destino
 * - calificacionPromedio: Promedio de calificaciones de usuarios de la misma provincia
 * - totalCalificaciones: Total de calificaciones de usuarios de la misma provincia
 * - score: Score calculado por el algoritmo de recomendaciones
 * - fechaCalculo: Fecha en que se calculó esta recomendación
 * 
 * Ejecutar con: node src/scripts/lugaresRecomendadosScript.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const LugaresRecomendados = require('../models/lugaresRecomendadosModel');
const User = require('../models/userModel');
const LugarTuristico = require('../models/lugarTuristicoModel');
const Ruta = require('../models/rutaModel');
const RecommendationCore = require('../core/recommendationCore');

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

/**
 * Función 1: Crear recomendaciones para un usuario específico
 * Ejemplo: Usuario de Loja buscando lugares en Guayaquil
 */
const crearRecomendacionesParaUsuario = async (usuarioId, ciudadDestino) => {
  console.log('\n📝 Creando recomendaciones para usuario...');
  
  try {
    const usuario = await User.findById(usuarioId).lean();
    
    if (!usuario) {
      console.log('   ❌ Usuario no encontrado');
      return;
    }

    if (!usuario.provincia) {
      console.log('   ❌ El usuario no tiene provincia asignada');
      return;
    }

    console.log(`   👤 Usuario: ${usuario.nombre} ${usuario.apellido} (${usuario.provincia})`);
    console.log(`   🎯 Ciudad destino: ${ciudadDestino}`);

    // Usar el algoritmo de recomendaciones
    const recomendados = await RecommendationCore.getRecomendadosPorProvincia(
      usuario.provincia,
      ciudadDestino,
      usuarioId
    );

    console.log(`   ✅ Se crearon ${recomendados.length} recomendaciones`);
    
    return recomendados;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    throw error;
  }
};

/**
 * Función 2: Consultar recomendaciones guardadas para un usuario y ruta
 */
const consultarRecomendacionesGuardadas = async (usuarioId, rutaId) => {
  console.log('\n🔍 Consultando recomendaciones guardadas...');
  
  try {
    const recomendaciones = await RecommendationCore.getRecomendadosGuardados(usuarioId, rutaId);
    
    console.log(`   📊 Total de recomendaciones: ${recomendaciones.length}`);
    
    recomendaciones.forEach((rec, index) => {
      console.log(`\n   ${index + 1}. ${rec.lugarTuristico?.nombre || 'N/A'}`);
      console.log(`      📍 Ciudad: ${rec.ciudadDestino}`);
      console.log(`      ⭐ Calificación promedio: ${rec.calificacionPromedio.toFixed(2)}`);
      console.log(`      📊 Total calificaciones: ${rec.totalCalificaciones}`);
      console.log(`      🎯 Score: ${rec.score.toFixed(2)}`);
      console.log(`      📅 Fecha cálculo: ${new Date(rec.fechaCalculo).toLocaleDateString()}`);
    });
    
    return recomendaciones;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    throw error;
  }
};

/**
 * Función 3: Consultar recomendaciones por provincia de origen y ciudad de destino
 */
const consultarRecomendacionesPorProvincia = async (provinciaOrigen, ciudadDestino) => {
  console.log('\n🔍 Consultando recomendaciones por provincia...');
  
  try {
    const recomendaciones = await RecommendationCore.getRecomendadosPorProvinciaYDestino(
      provinciaOrigen,
      ciudadDestino
    );
    
    console.log(`   📊 Provincia origen: ${provinciaOrigen}`);
    console.log(`   🎯 Ciudad destino: ${ciudadDestino}`);
    console.log(`   📊 Total de recomendaciones: ${recomendaciones.length}`);
    
    recomendaciones.forEach((rec, index) => {
      console.log(`\n   ${index + 1}. ${rec.lugarTuristico?.nombre || 'N/A'}`);
      console.log(`      ⭐ Calificación promedio: ${rec.calificacionPromedio.toFixed(2)}`);
      console.log(`      📊 Total calificaciones: ${rec.totalCalificaciones}`);
      console.log(`      🎯 Score: ${rec.score.toFixed(2)}`);
    });
    
    return recomendaciones;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    throw error;
  }
};

/**
 * Función 4: Estadísticas de la colección
 */
const obtenerEstadisticas = async () => {
  console.log('\n📊 Estadísticas de la colección LugaresRecomendados...');
  
  try {
    const total = await LugaresRecomendados.countDocuments();
    console.log(`   📊 Total de registros: ${total}`);

    // Agrupar por provincia de origen
    const porProvincia = await LugaresRecomendados.aggregate([
      {
        $group: {
          _id: '$provinciaOrigen',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          avgCalificacion: { $avg: '$calificacionPromedio' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n   📍 Por provincia de origen:');
    porProvincia.forEach(prov => {
      console.log(`      ${prov._id}: ${prov.count} recomendaciones (Score promedio: ${prov.avgScore.toFixed(2)}, Calificación: ${prov.avgCalificacion.toFixed(2)})`);
    });

    // Agrupar por ciudad de destino
    const porDestino = await LugaresRecomendados.aggregate([
      {
        $group: {
          _id: '$ciudadDestino',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n   🎯 Por ciudad de destino:');
    porDestino.forEach(dest => {
      console.log(`      ${dest._id}: ${dest.count} recomendaciones`);
    });

    // Top 10 lugares más recomendados
    const topLugares = await LugaresRecomendados.aggregate([
      {
        $group: {
          _id: '$lugarTuristico',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      },
      { $sort: { avgScore: -1 } },
      { $limit: 10 }
    ]);

    console.log('\n   🏆 Top 10 lugares más recomendados:');
    for (const lugar of topLugares) {
      const lugarTuristico = await LugarTuristico.findById(lugar._id).lean();
      if (lugarTuristico) {
        console.log(`      ${lugarTuristico.nombre}: ${lugar.count} veces (Score: ${lugar.avgScore.toFixed(2)})`);
      }
    }

  } catch (error) {
    console.error('   ❌ Error:', error.message);
    throw error;
  }
};

/**
 * Función 5: Limpiar recomendaciones antiguas (más de 30 días)
 */
const limpiarRecomendacionesAntiguas = async () => {
  console.log('\n🧹 Limpiando recomendaciones antiguas...');
  
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);

    const resultado = await LugaresRecomendados.deleteMany({
      fechaCalculo: { $lt: fechaLimite }
    });

    console.log(`   ✅ Se eliminaron ${resultado.deletedCount} recomendaciones antiguas`);
    
    return resultado.deletedCount;
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    throw error;
  }
};

/**
 * Función principal - Ejemplos de uso
 */
const main = async () => {
  try {
    await connectDB();

    // Ejemplo 1: Obtener estadísticas
    await obtenerEstadisticas();

    // Ejemplo 2: Buscar un usuario de Loja
    const usuarioLoja = await User.findOne({ provincia: 'Loja' }).lean();
    if (usuarioLoja) {
      console.log(`\n\n📌 Ejemplo: Crear recomendaciones para usuario de Loja`);
      await crearRecomendacionesParaUsuario(usuarioLoja._id, 'Guayaquil');
    }

    // Ejemplo 3: Consultar recomendaciones por provincia
    console.log(`\n\n📌 Ejemplo: Consultar recomendaciones de Loja para Guayaquil`);
    await consultarRecomendacionesPorProvincia('Loja', 'Guayaquil');

    // Ejemplo 4: Buscar una ruta y consultar recomendaciones guardadas
    const ruta = await Ruta.findOne({ to: 'Guayaquil' }).lean();
    if (usuarioLoja && ruta) {
      console.log(`\n\n📌 Ejemplo: Consultar recomendaciones guardadas para usuario y ruta`);
      await consultarRecomendacionesGuardadas(usuarioLoja._id, ruta._id);
    }

    console.log('\n✨ Script ejecutado exitosamente');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error ejecutando script:', error);
    process.exit(1);
  }
};

// Ejecutar
if (require.main === module) {
  main();
}

// Exportar funciones para uso en otros scripts
module.exports = {
  crearRecomendacionesParaUsuario,
  consultarRecomendacionesGuardadas,
  consultarRecomendacionesPorProvincia,
  obtenerEstadisticas,
  limpiarRecomendacionesAntiguas
};

