const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = process.env.MONGO_URI || '';
  
  // Validar que la URI esté presente y tenga el formato correcto
  if (!uri) {
    console.error('❌ Error: MONGO_URI no está definida en las variables de entorno');
    console.error('Por favor, crea un archivo .env con la siguiente variable:');
    console.error('MONGO_URI=mongodb://localhost:27017/busreservation');
    console.error('O para MongoDB Atlas:');
    console.error('MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database');
    process.exit(1);
  }

  // Validar formato básico de la URI
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('❌ Error: MONGO_URI debe comenzar con "mongodb://" o "mongodb+srv://"');
    console.error('URI actual:', uri.substring(0, 20) + '...');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('✅ MongoDB conectado satisfactoriamente');
  } catch (err) {
    console.error('❌ Error de conexión a MongoDB:', err.message);
    if (err.message.includes('authentication failed')) {
      console.error('Verifica tus credenciales de usuario y contraseña');
    } else if (err.message.includes('ENOTFOUND')) {
      console.error('No se pudo encontrar el servidor. Verifica la URL de conexión');
    }
    process.exit(1);
  }
};

module.exports = connectDb;
