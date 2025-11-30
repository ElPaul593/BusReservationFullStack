/**
 * Script para listar las credenciales de los usuarios creados
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
    console.log('✅ Conectado a MongoDB\n');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

const listarCredenciales = async () => {
  console.log('=== CREDENCIALES DE USUARIOS ===\n');
  console.log('CONTRASEÑA PARA TODOS: 123456\n');

  const provincias = ['Guayas', 'Azuay', 'Chimborazo'];
  
  for (const provincia of provincias) {
    console.log(`--- ${provincia} ---`);
    const usuarios = await User.find({ provincia })
      .select('cedula nombre apellido provincia')
      .limit(3)
      .lean();
    
    usuarios.forEach(u => {
      console.log(`Cédula: ${u.cedula} | Usuario: ${u.nombre} ${u.apellido}`);
    });
    console.log('');
  }
};

const main = async () => {
  try {
    await connectDB();
    await listarCredenciales();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

main();

