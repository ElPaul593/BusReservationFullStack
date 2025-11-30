/**
 * Script para verificar si los usuarios existen en la base de datos
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/userModel');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/busreservation';
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

const verificarUsuarios = async () => {
  const cedulas = [
    '0901234567', // Guayas
    '0101234565', // Azuay
    '0601234560'  // Chimborazo
  ];

  console.log('\n🔍 Verificando usuarios en la base de datos...\n');

  for (const cedula of cedulas) {
    const usuario = await User.findOne({ cedula }).select('cedula nombre apellido provincia').lean();
    if (usuario) {
      console.log(`✅ ${cedula} - ${usuario.nombre} ${usuario.apellido} (${usuario.provincia})`);
    } else {
      console.log(`❌ ${cedula} - NO EXISTE`);
    }
  }

  const totalUsuarios = await User.countDocuments({ provincia: { $in: ['Guayas', 'Azuay', 'Chimborazo'] } });
  console.log(`\n📊 Total de usuarios de Guayas, Azuay y Chimborazo: ${totalUsuarios}`);
  
  if (totalUsuarios === 0) {
    console.log('\n⚠️  No hay usuarios en la base de datos.');
    console.log('💡 Ejecuta: node src/scripts/populateCalificaciones.js');
  }
};

const main = async () => {
  try {
    await connectDB();
    await verificarUsuarios();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

main();

